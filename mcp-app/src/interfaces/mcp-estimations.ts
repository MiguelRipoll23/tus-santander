export interface StopEstimationsInput {
  stopName: string;
  lineLabel: string | null;
}

export interface StopEstimationsOutput {
  requestedStopName: string;
  requestedLineLabel: string | null;
  stopId: number;
  stopName: string;
  activeLines: ActiveLine[];
}

export interface ActiveLine {
  label: string;
  destination: string;
  arrivals: Arrivals;
}

export interface Arrivals {
  next: number | null;
  following: number | null;
}
