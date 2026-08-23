# TUS Santander

Real-time bus arrival and route data server for Santander's urban transit (TUS),
built with Deno, Hono, and the Model Context Protocol (MCP). It exposes live
stop arrival estimations and route information through both a REST API and a
stateless MCP endpoint for AI agents.

## Tech stack

- [Deno](https://deno.com) runtime
- [Hono](https://hono.dev) web framework with `@hono/zod-openapi` (OpenAPI 3.1 docs)
- [MCP TypeScript SDK v2](https://github.com/modelcontextprotocol/typescript-sdk)
  (`@modelcontextprotocol/server`) for the stateless MCP endpoint
- [Zod](https://zod.dev) schemas and validation
- [`@needle-di/core`](https://jsr.io/@needle-di/core) dependency injection

## Getting started

```bash
cp .env.example .env   # set TUS_API_BASE_URL and TUS_API_PASSWORD
deno task dev          # start the dev server (watch mode)
deno task check        # typecheck
```

The server listens on `http://localhost:8000`.

### Environment variables

| Variable            | Description                            |
| ------------------- | -------------------------------------- |
| `TUS_API_BASE_URL`  | Base URL of the TUS REST API           |
| `TUS_API_PASSWORD`  | Basic auth password for the TUS API    |

## API overview

| Endpoint                          | Description                                  |
| --------------------------------- | -------------------------------------------- |
| `GET /`                           | Scalar OpenAPI UI                            |
| `GET /.well-known/openapi`        | OpenAPI 3.1 JSON document                    |
| `GET /health`                     | Health check (204)                           |
| `POST /api/v1/mcp`                | Model Context Protocol endpoint (see below)  |
| `POST /api/v1/estimations/get`    | Full estimations for a stop                  |
| `POST /api/v1/estimations/get-compact` | Compact estimations for a stop           |
| `POST /api/v1/routes/get`         | Full route info for a stop and line          |
| `POST /api/v1/routes/get-compact` | Compact route info for a stop and line       |

All REST endpoints accept JSON bodies and are documented in the OpenAPI UI at
`/`.

## MCP endpoint

`POST /api/v1/mcp` is a **stateless** MCP server implementing the
2026-07-28 protocol revision. It serves both eras from a single endpoint:

- **2026-07-28 (stateless)** — no `initialize` handshake, no `Mcp-Session-Id`;
  every request carries its own protocol version and client metadata.
- **2025-era Streamable HTTP (legacy)** — 2025 clients keep working through the
  SDK's stateless compatibility lane.

### Required headers

Modern (2026-07-28) requests must include the SEP-2243 standard headers:

| Header                | Required for                                |
| --------------------- | ------------------------------------------- |
| `MCP-Protocol-Version`| Every request (`2026-07-28`)                |
| `Mcp-Method`          | Every request (e.g. `tools/call`)           |
| `Mcp-Name`            | `tools/call`, `prompts/get`, `resources/read` (mirrors `name`/`uri`) |

### Capabilities

| Kind     | Name                                                |
| -------- | --------------------------------------------------- |
| Tool     | `stops.get_estimations` — real-time arrivals for a stop |
| Tool     | `stops.render_estimations` — renders the estimations widget |
| Tool     | `lines.get_route` — route info for a line at a stop |
| Prompt   | `get_estimations_summary` — summarize estimations   |
| Prompt   | `get_route_summary` — summarize route info          |
| Resource | `estimations-widget` (`ui://widget/estimations-widget-v0.0.2-alpha.html`) — widget HTML |

All tools are read-only (`readOnlyHint: true`). `server/discover` is served
automatically for clients that want to inspect capabilities before calling.

### Cache hints

List and read results advertise `ttlMs`/`cacheScope` so clients can cache
catalogs instead of re-fetching:

| Operation              | Hint                                   |
| ---------------------- | -------------------------------------- |
| `tools/list`           | `ttlMs: 300000`, `cacheScope: public`  |
| `prompts/list`         | `ttlMs: 300000`, `cacheScope: public`  |
| `resources/list`       | `ttlMs: 300000`, `cacheScope: public`  |
| `resources/read`       | `ttlMs: 300000`, `cacheScope: public`  |
| `server/discover`      | `ttlMs: 60000`, `cacheScope: public`   |

### Example

```bash
curl -X POST http://localhost:8000/api/v1/mcp \
  -H "Content-Type: application/json" \
  -H "MCP-Protocol-Version: 2026-07-28" \
  -H "Mcp-Method: tools/call" \
  -H "Mcp-Name: stops.get_estimations" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "stops.get_estimations",
      "arguments": { "stopName": "Ayuntamiento" },
      "_meta": {
        "io.modelcontextprotocol/protocolVersion": "2026-07-28",
        "io.modelcontextprotocol/clientInfo": { "name": "my-app", "version": "1.0.0" },
        "io.modelcontextprotocol/clientCapabilities": {}
      }
    }
  }'
```

### Error semantics

When a tool finds no matching stop it returns a proper MCP error result
(`isError: true`) with structured content, so clients can detect the case
programmatically instead of parsing text:

```json
{
  "content": [{ "type": "text", "text": "No stops found matching \"zzzzzz\"." }],
  "structuredContent": {
    "matched": false,
    "requestedStopName": "zzzzzz",
    "requestedLineLabel": null,
    "stopId": null,
    "stopName": null,
    "activeLines": []
  },
  "isError": true
}
```

Successful calls set `matched: true` and populate the remaining fields.
