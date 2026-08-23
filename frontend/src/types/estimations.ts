export type EstimationTuple = readonly [
  label: string,
  destination: string,
  time1: number,
  time2: number,
];

export type RouteItemTuple = readonly [
  stopId: number,
  stopName: string,
  stopLines: readonly string[],
];
