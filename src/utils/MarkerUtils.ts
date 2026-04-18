import type { Marker } from "../interfaces/marker";
import type { StopsData } from "../types/stops";
import stopsJson from "../json/stops.min.json";

// Type assertion justified: JSON structure matches StopsData (arrays of [id, lat, lng, name])
const Stops = stopsJson as unknown as StopsData;

const markers: Marker[] = Object.keys(Stops).map((key) => {
  const [id, latitude, longitude, name] = Stops[key];
  return {
    id,
    text: name,
    position: { lat: latitude, lng: longitude },
  };
});

export default markers;
