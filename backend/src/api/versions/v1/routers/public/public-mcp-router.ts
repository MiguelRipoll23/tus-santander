import { inject, injectable } from "@needle-di/core";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { createMcpHandler } from "@modelcontextprotocol/server";
import type { Context } from "hono";
import { MCPService } from "../../services/mcp-server.ts";
import { ServerResponse } from "../../models/server-response.ts";
import type { McpHttpMethod } from "../../types/mcp/mcp-http-method-type.ts";

@injectable()
export class PublicMCPRouter {
  private app: OpenAPIHono;

  private readonly mcpHandler = createMcpHandler(
    () => this.mcpService.createUnifiedServer(),
    {
      onerror: (error: Error) => {
        console.error(`MCP handler error: ${error.message}`);
      },
    }
  );

  constructor(private mcpService = inject(MCPService)) {
    this.app = new OpenAPIHono();
    this.setRoutes();
  }

  public getRouter(): OpenAPIHono {
    return this.app;
  }

  private setRoutes(): void {
    this.registerMcpRoutes(
      "/",
      "Connect client",
      "Establishes a unified streaming Model Context Protocol session. Serves both the stateless 2026-07-28 protocol and 2025-era Streamable HTTP clients from a single endpoint."
    );
  }

  private registerMcpRoutes(
    path: string,
    summary: string,
    description: string
  ): void {
    const methods: McpHttpMethod[] = ["get", "post"];

    for (const method of methods) {
      this.app.openapi(
        createRoute({
          method,
          path,
          summary,
          description,
          tags: ["MCP"],
          responses: {
            ...ServerResponse.OK,
            ...ServerResponse.BadRequest,
            ...ServerResponse.MethodNotAllowed,
            ...ServerResponse.UnsupportedMediaType,
          },
        }),
        async (context: Context) => {
          return this.mcpHandler.fetch(context.req.raw);
        }
      );
    }
  }
}
