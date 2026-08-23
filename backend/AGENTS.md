# AGENTS.md

## Project rules

- Always follow naming conventions in this file
- Never use abbreviations either for arguments or variables
- Use the subdirectories constants, enums, interfaces, schemas, types, utils of
  this project structure unless other rule says otherwise

### API rules

- All API endpoints must use OpenAPI and be documented

### MCP rules

- Each domain's MCP tools, prompts, and resources live under a domain service
  (e.g., `services/estimations/tools/`, `services/routes/prompts/`)
- Each domain exposes an `McpProvider` class (e.g., `EstimationsMCPService`,
  `RoutesMCPService`) that collects all tools, prompts, and resources into the
  unified `MCPServer`
- MCP tools must follow naming convention: `domain.action` (e.g.,
  `stops.get_estimations`, `stops.render_estimations`, `lines.get_route`)
- Read-only MCP tools must be annotated with `readOnlyHint: true` so ChatGPT can
  streamline confirmation dialogs

### DI rules

- All services use `@needle-di/core` with `@injectable()` decorator and
  `inject()` for constructor injection
- Services are resolved through a top-level `Container` instantiated in
  `main.ts`

## Naming conventions

- Use snake_case for file names (estimations-tool-service.ts)
- Use PascalCase for service classes (EstimationsToolService)
- Use camelCase for JSON input for API (lineLabel)
- Use snake_case for database table and columns names
- Use kebab-case (hyphens) for API paths

## Project hierarchy

### Root structure

- `src/main.ts` — Entry point; creates DI container and starts the HTTP service

### Core services (src/core/)

- `adapters/` — External API integrations
  - `api-adapter.ts` — REST client for the TUS API (Basic auth)
- `constants/` — Core application constants (TUS URLs, env var names)
- `interfaces/adapters/` — Adapter response type definitions
- `routers/` — Root application router (health check at `/health`)
- `services/` — Core services
  - `error-handling-service.ts` — Centralised error handling
  - `http-service.ts` — HTTP server bootstrap (Deno.serve + route mounting)
  - `openapi-service.ts` — OpenAPI 3.1 docs + Scalar UI

### API structure (src/api/)

- `routers/api-router.ts` — Main API router (mounts v1 routes, configures CORS)

### Versioned API (src/api/versions/v1/)

````text
.
├─ data/                     # Static minified JSON datasets
│  ├─ lines.min.json
│  ├─ routes-lines.min.json
│  ├─ routes-stops.min.json
│  └─ stops.min.json
├─ enums/                    # Sort fields + sort order enums
├─ interfaces/
│  └─ mcp/                   # MCP type definitions
│     ├─ mcp-prompt-interface.ts
│     ├─ mcp-resource-interface.ts
│     └─ mcp-tool-interface.ts
├─ models/                   # Server error + response models
├─ routers/                  # API route handlers
│  ├─ public/                # Unauthenticated endpoints
│  │  ├─ public-estimations-router.ts
│  │  ├─ public-mcp-router.ts     # MCP streaming endpoint
│  │  └─ public-routes-router.ts
│  ├─ public-router.ts       # Aggregates all public routes
│  └─ v1-rooter.ts           # V1 root router
├─ schemas/                  # Zod validation schemas for API endpoints
│  ├─ error-response-schema.ts
│  ├─ estimations-schemas.ts
│  ├─ mcp-estimations-schemas.ts
│  ├─ mcp-routes-schemas.ts
│  └─ routes-schemas.ts
├─ services/                 # Business logic
│  ├─ mcp-server.ts          # Unified MCP server orchestrator
│  ├─ estimations/
│  │  ├─ prompts/            # AI prompts for estimations
│  │  ├─ resources/          # MCP resources (widget HTML)
│  │  ├─ tools/              # MCP tools for stop estimations
│  │  ├─ estimations-service.ts
│  │  └─ mcp-estimations-service.ts  # Estimations McpProvider
│  └─ routes/
│     ├─ prompts/            # AI prompts for route info
│     ├─ tools/              # MCP tools for route operations
│     ├─ routes-service.ts
│     └─ mcp-routes-service.ts       # Routes McpProvider
├─ types/                    # Shared TypeScript type definitions
│  ├─ mcp/                   # MCP-specific types
│  └─ routes/                # Route-specific types
│  └─ stops/                 # Stop-specific types
└─ utils/                    # Reusable utility functions
   ├─ line-utils.ts
   └─ stop-utils.ts
```

### Static assets (static/)

- `widgets/estimations/main.html` — Estimations widget HTML

### Tests (tests/)

- Directory exists but is empty (no tests written yet)

## Route resolution

```
Deno.serve()
  └─ HTTPService
       ├─ GET  "/"                         -> Scalar OpenAPI UI
       ├─ GET  "/.well-known/openapi"      -> OpenAPI 3.1 JSON
       ├─ GET  "/health"                   -> RootRouter (204)
       └─ "/api"
            └─ APIRouter
                 └─ "/v1"
                      └─ V1Router
                           └─ "/"
                                └─ PublicRouter
                                     ├─ "/mcp"          -> MCP streaming
                                     ├─ "/estimations"  -> Estimations REST
                                     └─ "/routes"       -> Routes REST
```

## MCP architecture

- Estimations domain tools: `stops.get_estimations`, `stops.render_estimations`
- Routes domain tools: `lines.get_route`
- Estimations domain prompts: `get_estimations_summary`
- Routes domain prompts: `get_route_summary`
- Estimations domain resources: `estimations-widget` (HTML widget via
  `ui://widget/` URI)
- Providers (`EstimationsMCPService`, `RoutesMCPService`) implement
  `getTools()`, `getPrompts()`, `getResources()` and are registered in
  `MCPService.createUnifiedServer()`

## External integrations

- **TUS REST API** — Modern REST API for stop estimations with Basic auth
  (env: `TUS_API_BASE_URL`, `TUS_API_PASSWORD`)


