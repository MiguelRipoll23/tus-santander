import { inject, injectable } from "@needle-di/core";
import { McpToolDefinition } from "../../interfaces/mcp/mcp-tool-interface.ts";
import { McpPromptDefinition } from "../../interfaces/mcp/mcp-prompt-interface.ts";
import { McpResourceDefinition } from "../../interfaces/mcp/mcp-resource-interface.ts";
import { RouteToolService } from "./tools/route-tool-service.ts";
import { RoutePromptService } from "./prompts/route-prompt-service.ts";

@injectable()
export class RoutesMCPService {
  constructor(
    private routeToolService = inject(RouteToolService),
    private routePromptService = inject(RoutePromptService)
  ) {}

  public getTools(): McpToolDefinition[] {
    return [this.routeToolService.getDefinition()];
  }

  public getPrompts(): McpPromptDefinition[] {
    return [this.routePromptService.getDefinition()];
  }

  public getResources(): McpResourceDefinition[] {
    return [];
  }
}
