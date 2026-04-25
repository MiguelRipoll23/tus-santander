export const GOOGLE_MAPS_KEY: string | undefined =
  import.meta.env.VITE_APP_GOOGLE_MAPS_KEY;

export const API_HOST: string =
  import.meta.env.VITE_APP_API_HOST || "http://localhost:8000";
export const API_ESTIMATIONS_GET_COMPACT_PATH =
  "/api/v1/estimations/get-compact";
export const API_ROUTES_GET_COMPACT_PATH = "/api/v1/routes/get-compact";

export const TELEMETRY_HOST: string | undefined =
  import.meta.env.VITE_APP_TELEMETRY_HOST;
export const TELEMETRY_API_SAVE_PATH = "/save";
