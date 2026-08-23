import { inject, injectable } from "@needle-di/core";
import { APIAdapter } from "../../../../../core/adapters/api-adapter.ts";
import { LineEstimations } from "../../../../../core/interfaces/adapters/line-estimations-interface.ts";
import {
  GetCompactEstimationsRequest,
  GetCompactEstimationsResponse,
  GetEstimationsRequest,
  GetEstimationsResponse,
} from "../../schemas/estimations-schemas.ts";
import { LineUtils } from "../../utils/line-utils.ts";
import { StopUtils } from "../../utils/stop-utils.ts";

@injectable()
export class EstimationsService {
  constructor(private apiAdapter = inject(APIAdapter)) {}

  public async getFull(
    request: GetEstimationsRequest
  ): Promise<GetEstimationsResponse> {
    console.log("Input", JSON.stringify(request, null, 2));
    const { stopId, lineLabel, refresh } = request;
    const estimations = await this.fetchEstimations(stopId, lineLabel ?? null);
    return this.formatFullResponse(stopId, estimations, refresh);
  }

  public async getCompact(
    request: GetCompactEstimationsRequest
  ): Promise<GetCompactEstimationsResponse> {
    console.log("Input", JSON.stringify(request, null, 2));
    const { stopId, lineLabel, refresh } = request;
    const estimations = await this.fetchEstimations(stopId, lineLabel ?? null);
    return this.formatCompactResponse(stopId, estimations, refresh, lineLabel);
  }

  private fetchEstimations(
    stopId: number,
    lineLabel: string | null
  ): Promise<LineEstimations[]> {
    return this.apiAdapter.getEstimationsData(stopId, lineLabel);
  }

  private mapLineEstimation(
    estimation: LineEstimations,
    stopId: number
  ): {
    label: string;
    destination: string;
    arrivals: { next: number | null; following: number | null };
    upcomingStops?: string[];
  } {
    const { label, destination, firstArrivalMinutes, secondArrivalMinutes } =
      estimation;

    // Type-safe object with optional upcomingStops
    const mapped: {
      label: string;
      destination: string;
      arrivals: { next: number | null; following: number | null };
      upcomingStops?: string[];
    } = {
      label,
      destination,
      arrivals: {
        next: firstArrivalMinutes,
        following: secondArrivalMinutes,
      },
    };

    const nextStops = LineUtils.getNextStops(stopId, label);
    if (nextStops?.length) {
      mapped.upcomingStops = nextStops;
    }

    return mapped;
  }

  private mapLineEstimationToArray(
    estimation: LineEstimations
  ): [string, string, number, number] {
    const { label, destination, firstArrivalMinutes, secondArrivalMinutes } =
      estimation;
    return [
      String(label),
      String(destination),
      firstArrivalMinutes ?? -1,
      secondArrivalMinutes ?? -1,
    ];
  }

  private formatFullResponse(
    stopId: number,
    linesEstimations: LineEstimations[],
    refresh = false
  ): GetEstimationsResponse {
    const estimations = linesEstimations.map((line) => {
      const mapped = this.mapLineEstimation(line, stopId);

      if (refresh) {
        delete mapped.upcomingStops;
      }

      return mapped;
    });

    const response: GetEstimationsResponse = { activeLines: estimations };

    if (!refresh) {
      response.allLineLabels = StopUtils.getLinesByStopId(stopId);
    }

    return response;
  }

  private formatCompactResponse(
    stopId: number,
    linesEstimations: LineEstimations[],
    refresh = false,
    lineLabel?: string
  ): GetCompactEstimationsResponse {
    const mapped = linesEstimations.map(this.mapLineEstimationToArray);

    let extraData: string[] | null = null;

    if (!refresh) {
      if (lineLabel) {
        // When filtering by line, return upcoming stops for that line
        extraData = LineUtils.getNextStops(stopId, lineLabel) || null;
      } else {
        // When not filtering, return all line labels used by the stop
        extraData = StopUtils.getLinesByStopId(stopId);
      }
    }

    return [mapped, extraData];
  }
}
