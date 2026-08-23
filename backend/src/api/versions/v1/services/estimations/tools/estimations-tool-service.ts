import { inject, injectable } from "@needle-di/core";
import { McpToolDefinition } from "../../../interfaces/mcp/mcp-tool-interface.ts";
import { EstimationsService } from "../estimations-service.ts";
import {
  GetEstimationsToolOutputSchema,
  GetEstimationsToolSchema,
} from "../../../schemas/mcp-estimations-schemas.ts";
import { StopData } from "../../../types/stops/stop-data-type.ts";
import stops from "../../../data/stops.min.json" with { type: "json" };

@injectable()
export class EstimationsToolService {
  constructor(private estimationsService = inject(EstimationsService)) {}

  public getDefinition(): McpToolDefinition {
    return {
      name: "stops.get_estimations",
      meta: {
        title: "Get real-time arrival estimations for stops",
        description:
          "Use this when you need fresh real-time arrival estimations for a stop before reasoning or rendering UI. Do not use for rendering the widget when estimation data is already available.",
        inputSchema: GetEstimationsToolSchema,
        outputSchema: GetEstimationsToolOutputSchema,
        annotations: {
          readOnlyHint: true,
          openWorldHint: true,
        },
        _meta: {
          "openai/toolInvocation/invoking": "Getting estimations...",
          "openai/toolInvocation/invoked": "Estimations ready.",
        },
      },
      run: async (input: unknown) => {
        const parsed = GetEstimationsToolSchema.parse(input);
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

        const text =
          response.activeLines.length > 0
            ? response.activeLines
                .map(
                  (line) =>
                    `  - Line ${line.label} to ${line.destination}: next in ${line.arrivals.next ?? "N/A"} min, following in ${line.arrivals.following ?? "N/A"} min`,
                )
                .join("\n")
            : "  No active lines currently";

        const toolActiveLines = response.activeLines.map((lineEstimation) => ({
          label: lineEstimation.label,
          destination: lineEstimation.destination,
          arrivals: lineEstimation.arrivals,
        }));

        return {
          text: `• ${stopName} (ID: ${stopId})\n${text}`,
          structuredContent: {
            matched: true,
            requestedStopName: parsed.stopName,
            requestedLineLabel: parsed.lineLabel ?? null,
            stopId,
            stopName,
            activeLines: toolActiveLines,
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
