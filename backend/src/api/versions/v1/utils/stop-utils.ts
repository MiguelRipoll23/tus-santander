import lines from "../data/lines.min.json" with { type: "json" };
import routeLines from "../data/routes-lines.min.json" with { type: "json" };

export class StopUtils {
  private static lines = lines;
  private static routeLines = routeLines;

  public static getLinesByStopId(stopId: number) {
    if (stopId === 0) {
      return StopUtils.lines;
    }

    const stopIdAsString = stopId.toString() as keyof typeof StopUtils.routeLines;

    if (!(stopIdAsString in StopUtils.routeLines)) {
      return [];
    }

    return Object.keys(StopUtils.routeLines[stopIdAsString]);
  }
}
