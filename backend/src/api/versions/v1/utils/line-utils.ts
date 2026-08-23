import routeLines from "../data/routes-lines.min.json" with { type: "json" };
import routeStops from "../data/routes-stops.min.json" with { type: "json" };
import { StopRoute } from "../types/routes/stop-route-type.ts";

export class LineUtils {
  private static routeLines = routeLines;
  private static routeStops = routeStops;

  public static getRouteId(stopId: number, lineLabel: string): string | null {
    const stopIdKey = stopId.toString() as keyof typeof LineUtils.routeLines;

    if (!(stopIdKey in LineUtils.routeLines)) return null;

    const stopRoutes = LineUtils.routeLines[stopIdKey];

    if (!(lineLabel in stopRoutes)) return null;

    return stopRoutes[lineLabel as keyof typeof stopRoutes];
  }

  public static getStopsByRouteId(lineLabel: string, routeId: string | null): StopRoute[] {
    if (!routeId) return [];

    const lineLabelKey = lineLabel as keyof typeof LineUtils.routeStops;

    if (!(lineLabelKey in LineUtils.routeStops)) return [];

    const routesLine = LineUtils.routeStops[lineLabelKey];

    if (!(routeId in routesLine)) return [];

    return routesLine[routeId as keyof typeof routesLine];
  }

  public static getNextStops(stopId: number, lineLabel: string): string[] {
    const stopNames: string[] = [];
    const routeId = LineUtils.getRouteId(stopId, lineLabel);
    const routeStopsList = LineUtils.getStopsByRouteId(lineLabel, routeId);

    let found = false;

    for (const [routeStopId, routeStopName] of routeStopsList) {
      if (found) {
        stopNames.push(routeStopName);
        if (stopNames.length === 5) break;
      } else if (routeStopId === stopId) {
        found = true;
      }
    }

    return stopNames;
  }
}
