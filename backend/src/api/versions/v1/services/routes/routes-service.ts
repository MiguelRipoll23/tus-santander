// routes-service.ts

import { injectable } from "@needle-di/core";
import {
  GetRouteRequest,
  GetRouteResponse,
  GetCompactRouteRequest,
  GetCompactRouteResponse,
} from "../../schemas/routes-schemas.ts";
import { LineRoute } from "../../types/routes/line-route-type.ts";
import { LineUtils } from "../../utils/line-utils.ts";
import { StopUtils } from "../../utils/stop-utils.ts";

@injectable()
export class RoutesService {
  public getFull(request: GetRouteRequest): GetRouteResponse {
    console.log("Input", JSON.stringify(request, null, 2));
    const { stopId, lineLabel } = request;
    const routeData = this.getRouteForLine(stopId, lineLabel);
    const response = this.formatFullResponse(routeData);
    return response;
  }

  public getCompact(request: GetCompactRouteRequest): GetCompactRouteResponse {
    console.log("Input", JSON.stringify(request, null, 2));
    const { stopId, lineLabel } = request;
    const routeData = this.getRouteForLine(stopId, lineLabel);
    const response = this.formatCompactResponse(routeData);

    return response;
  }

  private formatFullResponse(routeData: LineRoute[]): GetRouteResponse {
      return routeData.map(([stopId, stopName, stopLines]) => ({
        stopId,
        stopName,
        stopLines,
      }));
  }

  private formatCompactResponse(
    routeData: LineRoute[]
  ): GetCompactRouteResponse {
      return routeData.map(([stopId, stopName, stopLines]) => [stopId, stopName, stopLines]);
  }

  private getRouteForLine(stopId: number, lineLabel: string): LineRoute[] {
    const response: LineRoute[] = [];
    const routeId = LineUtils.getRouteId(stopId, lineLabel);
    const routeStops = LineUtils.getStopsByRouteId(lineLabel, routeId);

    for (const routeStop of routeStops) {
      const routeStopId = routeStop[0];
      const routeStopName = routeStop[1];
      const stopLines = StopUtils.getLinesByStopId(routeStopId);
      response.push([routeStopId, routeStopName, stopLines]);
    }

    return response;
  }
}
