export interface MarkerPosition {
  lat: number;
  lng: number;
}

export interface Marker {
  id: number;
  text: string;
  position: MarkerPosition;
}
