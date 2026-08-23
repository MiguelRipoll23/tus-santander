import { inject, injectable } from "@needle-di/core";
import { McpToolDefinition } from "../../interfaces/mcp/mcp-tool-interface.ts";
import { McpPromptDefinition } from "../../interfaces/mcp/mcp-prompt-interface.ts";
import { McpResourceDefinition } from "../../interfaces/mcp/mcp-resource-interface.ts";

import { EstimationsToolService } from "./tools/estimations-tool-service.ts";
import { RenderEstimationsToolService } from "./tools/render-estimations-tool-service.ts";
import { EstimationsResourceService } from "./resources/estimations-resources-service.ts";
import { EstimationsPromptService } from "./prompts/estimations-prompt-service.ts";

@injectable()
export class EstimationsMCPService {
  constructor(
    private estimationsToolService = inject(EstimationsToolService),
    private renderEstimationsToolService = inject(RenderEstimationsToolService),
    private estimationsPromptService = inject(EstimationsPromptService),
    private estimationsResourceService = inject(EstimationsResourceService)
  ) {}

  public getTools(): McpToolDefinition[] {
    return [
      this.estimationsToolService.getDefinition(),
      this.renderEstimationsToolService.getDefinition(),
    ];
  }

  public getPrompts(): McpPromptDefinition[] {
    return [this.estimationsPromptService.getDefinition()];
  }

  public getResources(): McpResourceDefinition[] {
    return [this.estimationsResourceService.getDefinition()];
  }
}
