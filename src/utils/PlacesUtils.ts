import { GOOGLE_MAPS_KEY } from "./ApiConstants";

let loadPromise: Promise<void> | null = null;

function loadMapsApi(): Promise<void> {
  if (loadPromise) return loadPromise;
  if (!GOOGLE_MAPS_KEY) return Promise.reject(new Error("No API key"));

  loadPromise = new Promise<void>((resolve, reject) => {
    const w = window as Window & typeof globalThis & { google?: { maps?: unknown } };
    if (w.google?.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    // loading=async is the recommended pattern (no callback, no explicit library list)
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&loading=async&language=es`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Maps API"));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  // Held internally so we can call toPlace() on it without re-fetching
  _prediction: google.maps.places.PlacePrediction;
}

// Santander, Spain bounds for restricting results to this city
const SANTANDER_RESTRICTION: google.maps.LatLngBoundsLiteral = {
  north: 43.55,
  south: 43.38,
  east: -3.65,
  west: -4.0,
};

export async function getPlacePredictions(input: string): Promise<PlacePrediction[]> {
  if (!input.trim() || !GOOGLE_MAPS_KEY) return [];

  try {
    await loadMapsApi();
    const { AutocompleteSuggestion, AutocompleteSessionToken } =
      await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

    const sessionToken = new AutocompleteSessionToken();

    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      locationRestriction: SANTANDER_RESTRICTION,
      includedRegionCodes: ["es"],
      language: "es",
      region: "es",
      sessionToken,
    });

    return suggestions
      .filter((s) => s.placePrediction !== null)
      .slice(0, 5)
      .map((s) => {
        const pred = s.placePrediction!;
        return {
          placeId: pred.placeId,
          mainText: pred.mainText.text,
          secondaryText: pred.secondaryText?.text ?? "",
          _prediction: pred,
        };
      });
  } catch {
    return [];
  }
}

export async function getPlaceCoordinates(
  prediction: PlacePrediction
): Promise<{ lat: number; lng: number } | null> {
  try {
    await loadMapsApi();
    await google.maps.importLibrary("places");

    const place = prediction._prediction.toPlace();
    await place.fetchFields({ fields: ["location"] });

    if (!place.location) return null;
    return { lat: place.location.lat(), lng: place.location.lng() };
  } catch {
    return null;
  }
}

export interface RouteDirections {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: any[];
}

export async function getDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  travelMode: "TRANSIT" | "WALK" | "DRIVE" = "TRANSIT"
): Promise<RouteDirections | null> {
  try {
    await loadMapsApi();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { Route } = await google.maps.importLibrary("routes") as any;

    const response = await Route.computeRoutes({
      origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
      destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
      travelMode,
      languageCode: "es",
      regionCode: "ES",
      computeAlternativeRoutes: true,
    });

    return { routes: response.routes ?? [] };
  } catch (e) {
    console.error("Routes API error:", e);
    return null;
  }
}
