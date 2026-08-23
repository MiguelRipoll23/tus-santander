import { inject, injectable } from "@needle-di/core";
import { McpToolDefinition } from "../../../interfaces/mcp/mcp-tool-interface.ts";
import { RoutesService } from "../routes-service.ts";
import { GetRouteToolOutputSchema, GetRouteToolSchema } from "../../../schemas/mcp-routes-schemas.ts";
import stops from "../../../data/stops.min.json" with { type: "json" };
import { StopUtils } from "../../../utils/stop-utils.ts";

type StopData = [number, number, number, string];

@injectable()
export class RouteToolService {
  constructor(private routesService = inject(RoutesService)) {}

  public getDefinition(): McpToolDefinition {
    return {
      name: "lines.get_route",
      meta: {
        title: "Get route information for transit line",
        description:
          "Use this when you need to find stops by name and retrieve the route information for a specific line.",
        inputSchema: GetRouteToolSchema,
        outputSchema: GetRouteToolOutputSchema,
        annotations: {
          readOnlyHint: true,
          openWorldHint: false,
          idempotentHint: true,
        },
      },
      run: (input: unknown) => {
        const parsed = GetRouteToolSchema.parse(input);

        // Search for matching stops
        const matchingStops = this.searchStops(parsed.stopName, parsed.lineLabel);

        if (matchingStops.length === 0) {
          return {
            text: `No stops found matching "${parsed.stopName}" with line "${parsed.lineLabel}".`,
            structuredContent: {
              matched: false,
              stopId: null,
              stopName: null,
              lineLabel: parsed.lineLabel,
              totalStops: 0,
              routeStops: [],
            },
            isError: true,
          };
        }

        const [stopId,,, stopName] = matchingStops[0];
        const response = this.routesService.getFull({ stopId, lineLabel: parsed.lineLabel });

        const routeStops = response.map((stop, stopIndex) => ({
          stopId: stop.stopId,
          stopName: stop.stopName,
          order: stopIndex + 1,
        }));

        return {
          text:
            response.length > 0
              ? `Route for line "${parsed.lineLabel}" at stop "${stopName}" (ID: ${stopId}):\n\nTotal stops: ${response.length}\nStops in order: ${response
                  .map((s, idx) => `${idx + 1}. ${s.stopName}`)
                  .join("\n")}`
              : `No route information available for line "${parsed.lineLabel}" at stop "${stopName}" (ID: ${stopId}).`,
          structuredContent: {
            matched: true,
            stopId,
            stopName,
            lineLabel: parsed.lineLabel,
            totalStops: routeStops.length,
            routeStops,
          },
        };
      },
    };
  }

  private searchStops(searchTerm: string, lineLabel: string): StopData[] {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const normalizedLineLabel = lineLabel.toLowerCase().trim();
    const matchingStops: StopData[] = [];

    for (const stopData of Object.values(stops)) {
      const [stopId, latitude, longitude, stopName] = stopData as StopData;

      if (stopName.toLowerCase().includes(normalizedSearch)) {
        const stopLines = StopUtils.getLinesByStopId(stopId);
        const hasLine = stopLines.some((label) => label.toLowerCase() === normalizedLineLabel);

        if (hasLine) {
          matchingStops.push([stopId, latitude, longitude, stopName]);
        }
      }
    }

    return matchingStops;
  }
}
