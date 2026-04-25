import type { StopTuple, StopsData } from "../types/stops";

const WALKING_SPEED_MPS = 1.39; // 5 km/h

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface NearestStop {
  stop: StopTuple;
  distanceMeters: number;
  walkingMinutes: number;
}

export function findNearestStop(lat: number, lng: number, stops: StopsData): NearestStop {
  let nearest: StopTuple | null = null;
  let minDist = Infinity;

  for (const key in stops) {
    const stop = stops[key];
    const dist = haversineMeters(lat, lng, stop[1], stop[2]);
    if (dist < minDist) {
      minDist = dist;
      nearest = stop;
    }
  }

  const stop = nearest ?? (Object.values(stops)[0] as StopTuple);
  return {
    stop,
    distanceMeters: minDist,
    walkingMinutes: Math.max(1, Math.ceil(minDist / (WALKING_SPEED_MPS * 60))),
  };
}

export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  return haversineMeters(lat1, lng1, lat2, lng2);
}
