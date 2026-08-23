export type StopTuple = readonly [
  id: number,
  lat: number,
  lng: number,
  name: string,
];

export type StopsData = Readonly<Record<string, StopTuple>>;
