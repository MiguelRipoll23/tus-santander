import { inject, injectable } from "@needle-di/core";
import { StaticAssetService } from "../../../../../../core/services/static-asset-service.ts";
import { McpResourceDefinition } from "../../../interfaces/mcp/mcp-resource-interface.ts";
import { MCP_RESOURCE_CACHE_HINT } from "../../../constants/mcp-constants.ts";

@injectable()
export class EstimationsResourceService {
  private static readonly RESOURCE_VERSION = "0.0.2-alpha";
  private static readonly RESOURCE_NAME = "estimations-widget";
  private static readonly RESOURCE_PATH =
    "/widgets/estimations/main.html";

  public static readonly RESOURCE_URI = `ui://widget/estimations-widget-v${EstimationsResourceService.RESOURCE_VERSION}.html`;

  constructor(
    private staticAssetService = inject(StaticAssetService)
  ) {}

  public getDefinition(): McpResourceDefinition {
    return {
      name: EstimationsResourceService.RESOURCE_NAME,
      uri: EstimationsResourceService.RESOURCE_URI,
      meta: {
        description:
          "Interactive widget for displaying transit stop arrival estimations",
        cacheHint: MCP_RESOURCE_CACHE_HINT,
      },
      run: async () => {
        const text = await this.staticAssetService.getText(
          EstimationsResourceService.RESOURCE_PATH
        );

        return {
          contents: [
            {
              uri: EstimationsResourceService.RESOURCE_URI,
              mimeType: "text/html;profile=mcp-app",
              text,
              _meta: {
                ui: {
                  prefersBorder: true,
                  domain: "https://tus.miguelripoll23.workers.dev",
                  csp: {
                    connectDomains: [],
                    resourceDomains: [],
                  },
                },
                "openai/widgetDescription":
                  "A compact transit arrivals widget that shows the selected stop, up to five active lines, and a refresh action.",
              },
            },
          ],
        };
      },
    };
  }
}
