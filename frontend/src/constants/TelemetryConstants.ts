import type { TelemetryEventType } from "../types/telemetry";

export const EVENT_TYPE_APP_START: TelemetryEventType = "app_start";
export const EVENT_TYPE_STOP_VIEW: TelemetryEventType = "stop_view";
export const EVENT_TYPE_LINE_VIEW: TelemetryEventType = "line_view";
export const EVENT_TYPE_ROUTE_VIEW: TelemetryEventType = "route_view";
export const EVENT_TYPE_MAP_VIEW: TelemetryEventType = "map_view";
export const EVENT_TYPE_REFRESH: TelemetryEventType = "refresh";
export const EVENT_TYPE_FAVORITE: TelemetryEventType = "favorite";
export const EVENT_TYPE_FAVORITE_REORDER: TelemetryEventType =
  "favorite_reorder";
export const EVENT_TYPE_FAVORITE_SELECT: TelemetryEventType =
  "favorite_select";
export const EVENT_TYPE_SEARCH_SELECT: TelemetryEventType = "search_select";
export const EVENT_TYPE_DONATION_CLICK: TelemetryEventType = "donation_click";
export const EVENT_TYPE_DONATION_CLOSE: TelemetryEventType = "donation_close";
