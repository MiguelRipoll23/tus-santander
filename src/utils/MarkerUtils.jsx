import Stops from "../json/stops.min.json";

// Precompute markers from static Stops data
const markers = Object.keys(Stops).map((key) => {
  const [id, latitude, longitude, name] = Stops[key];
  return {
    id,
    text: name,
    position: { lat: latitude, lng: longitude },
  };
});

export default markers;
