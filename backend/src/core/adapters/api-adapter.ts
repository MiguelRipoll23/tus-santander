import { injectable } from "@needle-di/core";
import {
  ENV_TUS_API_BASE_URL,
  ENV_TUS_API_PASSWORD,
} from "../constants/tus-api-constants.ts";
import { LineEstimations } from "../interfaces/adapters/line-estimations-interface.ts";
import { TusApiResponse } from "../interfaces/adapters/tus-api-response.ts";

@injectable()
export class APIAdapter {
  private baseURL: string;
  private password: string;

  constructor() {
    this.baseURL = Deno.env.get(ENV_TUS_API_BASE_URL) ?? "";
    this.password = Deno.env.get(ENV_TUS_API_PASSWORD) ?? "";

    this.validateConfiguration();
  }

  public async getEstimationsData(
    stopId: number,
    lineLabel: string | null
  ): Promise<LineEstimations[]> {
    const url = `${this.baseURL}/tus/api/v1/stops/${stopId}/estimations`;
    const headers = {
      Authorization: `Basic ${btoa(`${this.password}:`)}`,
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch estimations: ${response.status}`);
    }

    // If the response is empty (204 No Content), return an empty array
    if (response.status === 204) {
      return [];
    }

    const data = await response.json();
    const estimations = this.parseEstimations(data);

    return lineLabel
      ? estimations.filter((estimation) => estimation.label === lineLabel)
      : estimations;
  }

  private validateConfiguration(): void {
    if (!this.baseURL) {
      throw new Error(
        `Missing configuration variable: ${ENV_TUS_API_BASE_URL}`
      );
    }
    if (!this.password) {
      throw new Error(
        `Missing configuration variable: ${ENV_TUS_API_PASSWORD}`
      );
    }
  }

  private parseEstimations(data: TusApiResponse): LineEstimations[] {
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    const estimations: LineEstimations[] = [];

    for (const item of data) {
      if (!Array.isArray(item.estimations) || item.estimations.length === 0) {
        continue;
      }

      const label = this.fixLineLabel(item.line);
      const destination = item.estimations[0].destination;
      const minutes1 = Math.floor(
        (item.estimations[0]?.remainingTime ?? 0) / 60
      );
      let minutes2 = Math.floor((item.estimations[1]?.remainingTime ?? 0) / 60);

      if (minutes2 === 0) {
        minutes2 = -1;
      }

      const estimation: LineEstimations = {
        label,
        destination,
        firstArrivalMinutes: minutes1 > 0 ? minutes1 : null,
        secondArrivalMinutes: minutes2 > 0 ? minutes2 : null,
      };

      estimations.push(estimation);
    }

    return estimations.sort(
      (a, b) =>
        (a.firstArrivalMinutes ?? Infinity) -
        (b.firstArrivalMinutes ?? Infinity)
    );
  }

  private fixLineLabel(line: number): string {
    const map: Record<string, string> = {
      "51": "5C1",
      "52": "5C2",
      "61": "6C1",
      "62": "6C2",
      "71": "7C1",
      "72": "7C2",
      "241": "24C1",
      "242": "24C2",
      "100": "LC",
      "101": "N1",
      "102": "N2",
      "103": "N3",
    };

    const key = line.toString();
    return map[key] ?? key;
  }
}
