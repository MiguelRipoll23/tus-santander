import { GOOGLE_MAPS_KEY } from "./ApiConstants";

let loadPromise: Promise<void> | null = null;

function loadMapsApi(): Promise<void> {
  if (loadPromise) return loadPromise;
  if (!GOOGLE_MAPS_KEY) return Promise.reject(new Error("No API key"));

  loadPromise = new Promise<void>((resolve, reject) => {
    if ((window as Window & typeof globalThis & { google?: { maps?: unknown } }).google?.maps) {
      resolve();
      return;
    }
    const cb = "__mapsReady";
    (window as Record<string, unknown>)[cb] = resolve;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places&callback=${cb}&language=es`;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Maps API"));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

let autocompleteService: google.maps.places.AutocompleteService | null = null;
let placesService: google.maps.places.PlacesService | null = null;
let placesDiv: HTMLDivElement | null = null;

export async function getPlacePredictions(input: string): Promise<PlacePrediction[]> {
  if (!input.trim() || !GOOGLE_MAPS_KEY) return [];

  try {
    await loadMapsApi();
    if (!autocompleteService) {
      autocompleteService = new google.maps.places.AutocompleteService();
    }

    return new Promise((resolve) => {
      autocompleteService!.getPlacePredictions(
        {
          input,
          location: new google.maps.LatLng(43.4628, -3.8099),
          radius: 20000,
          componentRestrictions: { country: "es" },
        },
        (predictions, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            resolve([]);
            return;
          }
          resolve(
            predictions.slice(0, 5).map((p) => ({
              placeId: p.place_id,
              mainText: p.structured_formatting.main_text,
              secondaryText: p.structured_formatting.secondary_text ?? "",
            }))
          );
        }
      );
    });
  } catch {
    return [];
  }
}

export async function getPlaceCoordinates(
  placeId: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    await loadMapsApi();
    if (!placesDiv) placesDiv = document.createElement("div");
    if (!placesService) {
      placesService = new google.maps.places.PlacesService(placesDiv);
    }

    return new Promise((resolve) => {
      placesService!.getDetails({ placeId, fields: ["geometry"] }, (place, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !place?.geometry?.location
        ) {
          resolve(null);
          return;
        }
        resolve({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
      });
    });
  } catch {
    return null;
  }
}
