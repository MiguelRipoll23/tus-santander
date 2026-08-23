import { inject, injectable } from "@needle-di/core";
import { McpServer, ServerContext } from "@modelcontextprotocol/server";
import { EstimationsMCPService } from "./estimations/mcp-estimations-service.ts";
import { RoutesMCPService } from "./routes/mcp-routes-service.ts";
import { McpToolDefinition } from "../interfaces/mcp/mcp-tool-interface.ts";
import { McpPromptDefinition } from "../interfaces/mcp/mcp-prompt-interface.ts";
import { McpResourceDefinition } from "../interfaces/mcp/mcp-resource-interface.ts";
import { McpProvider } from "../types/mcp/mcp-provider-type.ts";
import { MCP_SERVER_CACHE_HINTS } from "../constants/mcp-constants.ts";

@injectable()
export class MCPService {
  constructor(
    private estimationsMCPService = inject(EstimationsMCPService),
    private routesMCPService = inject(RoutesMCPService)
  ) {}

  public createUnifiedServer(): McpServer {
    return this.createServer("transit-mcp", [
      this.estimationsMCPService,
      this.routesMCPService,
    ]);
  }

  private createServer(name: string, providers: McpProvider[]): McpServer {
    const server = new McpServer(
      { name, version: "1.0.0" },
      { cacheHints: MCP_SERVER_CACHE_HINTS }
    );

    for (const provider of providers) {
      const tools = provider.getTools();
      const prompts = provider.getPrompts();
      const resources = provider.getResources ? provider.getResources() : [];

      this.registerTools(server, tools);
      this.registerPrompts(server, prompts);
      this.registerResources(server, resources);
    }

    return server;
  }

  private registerTools(server: McpServer, tools: McpToolDefinition[]): void {
    for (const tool of tools) {
      server.registerTool(tool.name, tool.meta, async (input: unknown, _ctx: ServerContext) => {
        console.log(
          `Tool ${tool.name} called with input:\n${JSON.stringify(
            input,
            null,
            2
          )}`
        );

        const startTime = Date.now();
        try {
          const result = await tool.run(input);
          const executionTime = Date.now() - startTime;

          let output = result.text;

          if (result.structuredContent) {
            const structuredJson = JSON.stringify(result.structuredContent, null, 2);
            output += `\nStructured:\n${structuredJson}`;
          }

          console.log(
            `Tool ${tool.name} executed (${executionTime}ms) with output:\n${output}`
          );

          const structuredContent =
            result.structuredContent && typeof result.structuredContent === "object"
              ? Array.isArray(result.structuredContent)
                ? { items: result.structuredContent }
                : (result.structuredContent as Record<string, unknown>)
              : undefined;

          return {
            content: [{ type: "text" as const, text: result.text }],
            ...(structuredContent ? { structuredContent } : {}),
            ...(result.isError ? { isError: true } : {}),
            ...(result._meta ? { _meta: result._meta } : {}),
          };
        } catch (error) {
          const executionTime = Date.now() - startTime;
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";

          console.error(
            `Tool ${tool.name} error (${executionTime}ms):\n${errorMessage}`
          );

          // Return error as text content for MCP client
          return {
            content: [
              { type: "text" as const, text: `Error: ${errorMessage}` },
            ],
            isError: true,
          };
        }
      });
    }
  }

  private registerPrompts(
    server: McpServer,
    prompts: McpPromptDefinition[]
  ): void {
    for (const prompt of prompts) {
      server.registerPrompt(prompt.name, prompt.meta, async (input: unknown, _ctx: ServerContext) => {
        try {
          const result = await prompt.run(input);
          return { messages: result.messages };
        } catch (error) {
          // Return error as user message for MCP client
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          return {
            messages: [
              {
                role: "user" as const,
                content: {
                  type: "text" as const,
                  text: `Error executing prompt: ${errorMessage}`,
                },
              },
            ],
          };
        }
      });
    }
  }

  private registerResources(
    server: McpServer,
    resources: McpResourceDefinition[]
  ): void {
    for (const resource of resources) {
      server.registerResource(
        resource.name,
        resource.uri,
        resource.meta,
        async () => {
          try {
            const result = await resource.run();
            return result;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error occurred";
            console.error(`Resource ${resource.name} error: ${errorMessage}`);
            throw error;
          }
        }
      );
    }
  }
}
