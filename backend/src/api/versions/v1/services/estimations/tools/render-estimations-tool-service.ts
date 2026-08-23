import { inject, injectable } from "@needle-di/core";
import { McpToolDefinition } from "../../../interfaces/mcp/mcp-tool-interface.ts";
import {
  RenderEstimationsToolOutputSchema,
  RenderEstimationsToolSchema,
} from "../../../schemas/mcp-estimations-schemas.ts";
import { EstimationsResourceService } from "../resources/estimations-resources-service.ts";
import { EstimationsService } from "../estimations-service.ts";
import { StopData } from "../../../types/stops/stop-data-type.ts";
import stops from "../../../data/stops.min.json" with { type: "json" };

@injectable()
export class RenderEstimationsToolService {
  constructor(private estimationsService = inject(EstimationsService)) {}

  public getDefinition(): McpToolDefinition {
    return {
      name: "stops.render_estimations",
      meta: {
        title: "Render transit stop estimations widget",
        description:
          "Use this when you want to render the estimations widget for a stop using a stop name and an optional line filter. Do not use when you only need raw estimation data without rendering the widget.",
        inputSchema: RenderEstimationsToolSchema,
        outputSchema: RenderEstimationsToolOutputSchema,
        annotations: {
          readOnlyHint: true,
          openWorldHint: true,
        },
        _meta: {
          ui: {
            resourceUri: EstimationsResourceService.RESOURCE_URI,
          },
          "openai/outputTemplate": EstimationsResourceService.RESOURCE_URI,
          "openai/toolInvocation/invoking": "Rendering estimations...",
          "openai/toolInvocation/invoked": "Estimations rendered.",
        },
      },
      run: async (input: unknown) => {
        const parsed = RenderEstimationsToolSchema.parse(input);
        const matchingStops = this.searchStops(parsed.stopName);

        if (matchingStops.length === 0) {
          return {
            text: `No stops found matching "${parsed.stopName}".`,
            structuredContent: {
              matched: false,
              requestedStopName: parsed.stopName,
              requestedLineLabel: parsed.lineLabel ?? null,
              stopId: null,
              stopName: null,
              activeLines: [],
            },
            isError: true,
          };
        }

        const [stopId, , , stopName] = matchingStops[0];
        const response = await this.estimationsService.getFull({
          stopId,
          lineLabel: parsed.lineLabel,
          refresh: false,
        });

        return {
          text: `Showing estimations for ${stopName}.`,
          structuredContent: {
            matched: true,
            requestedStopName: parsed.stopName,
            requestedLineLabel: parsed.lineLabel ?? null,
            stopId,
            stopName,
            activeLines: response.activeLines.map((lineEstimation) => ({
              label: lineEstimation.label,
              destination: lineEstimation.destination,
              arrivals: lineEstimation.arrivals,
            })),
          },
        };
      },
    };
  }

  private searchStops(query: string): StopData[] {
    const normalizedQuery = this.normalizeInput(query);

    if (!normalizedQuery) {
      return [];
    }

    return (Object.values(stops) as StopData[]).filter((stop) => {
      const [, , , name] = stop;
      return this.normalizeInput(name).includes(normalizedQuery);
    });
  }

  private normalizeInput(inputString: string): string {
    return inputString
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();
  }
}
