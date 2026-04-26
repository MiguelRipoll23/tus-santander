import type {
  TelemetryEventInput,
  TelemetryEvent,
  TelemetryPayload,
  DeviceInformation,
  SessionInfo,
} from "../interfaces/telemetry";
import type { TelemetryEventType } from "../types/telemetry";
import { TELEMETRY_HOST, TELEMETRY_API_SAVE_PATH } from "./ApiConstants";
import { getFavorites } from "./FavoriteUtils";
import {
  EVENT_TYPE_APP_START,
  EVENT_TYPE_STOP_VIEW,
  EVENT_TYPE_LINE_VIEW,
  EVENT_TYPE_ROUTE_VIEW,
  EVENT_TYPE_MAP_VIEW,
  EVENT_TYPE_REFRESH,
  EVENT_TYPE_FAVORITE,
  EVENT_TYPE_DONATION_CLICK,
  EVENT_TYPE_DONATION_CLOSE,
  EVENT_TYPE_TRIP_SEARCH,
  EVENT_TYPE_TRIP_SELECT,
} from "../constants/TelemetryConstants";

const TELEMETRY_URL: string | null =
  TELEMETRY_HOST != null && TELEMETRY_HOST.length > 0
    ? TELEMETRY_HOST + TELEMETRY_API_SAVE_PATH
    : null;

const TELEMETRY_ENABLED: boolean = TELEMETRY_URL !== null;

const USER_IDENTIFIER_KEY = "user_identifier";
const SESSION_ID_KEY = "session_id";
const BATCH_SIZE = 5;
const BATCH_TIMEOUT = 10000;

let eventQueue: TelemetryEvent[] = [];
let batchTimeout: ReturnType<typeof setTimeout> | null = null;

function generateUUID(): string {
  if (window.crypto) {
    if (window.crypto.randomUUID) return window.crypto.randomUUID();

    if (window.crypto.getRandomValues) {
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;

      return [...bytes]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
    }
  }

  return `session-${Date.now()}-${Math.random()}`;
}

function getSession(): SessionInfo {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  let sessionStart = sessionStorage.getItem(`${SESSION_ID_KEY}_start`);

  if (!sessionId) {
    sessionId = generateUUID();
    sessionStart = Date.now().toString();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    sessionStorage.setItem(`${SESSION_ID_KEY}_start`, sessionStart);
  } else if (!sessionStart) {
    sessionStart = Date.now().toString();
    sessionStorage.setItem(`${SESSION_ID_KEY}_start`, sessionStart);
  }

  return { id: sessionId, start: Number(sessionStart) };
}

function getUserId(): string {
  let id = localStorage.getItem(USER_IDENTIFIER_KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(USER_IDENTIFIER_KEY, id);
  }
  return id;
}

function getDeviceInformation(): DeviceInformation {
  return {
    timeStamp: Date.now(),
    userAgent: navigator.userAgent,
    browserLanguage: navigator.language.split("-")[0] ?? "en",
    screenWidth: screen.width,
    screenHeight: screen.height,
  };
}

async function sendToServer(payload: TelemetryPayload): Promise<void> {
  const url = TELEMETRY_URL;
  if (!url) return;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Client-Version": "1.0" },
    body: JSON.stringify(payload),
    keepalive: true,
  });
}

function clearBatchTimeout(): void {
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }
}

function processBatch(): void {
  if (!eventQueue.length) return;

  const events = [...eventQueue];
  eventQueue = [];
  clearBatchTimeout();

  const { id: sessionId, start: sessionStart } = getSession();
  const payload: TelemetryPayload = {
    userId: getUserId(),
    sessionId,
    sessionStart,
    deviceInformation: getDeviceInformation(),
    events,
  };

  sendToServer(payload).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : "Unknown error";
    eventQueue.unshift(...events);
    console.debug("Telemetry send failed:", message);
  });
}

function addEventToBatch(event: TelemetryEventInput): void {
  eventQueue.push({ ...event, timeStamp: Date.now() });

  if (eventQueue.length >= BATCH_SIZE) {
    processBatch();
  } else if (!batchTimeout) {
    batchTimeout = setTimeout(processBatch, BATCH_TIMEOUT);
  }
}

function shouldTrackTelemetry(): boolean {
  if (!TELEMETRY_ENABLED) return false;
  if (typeof navigator === "undefined") return false;
  if (!/iphone/i.test(navigator.userAgent)) return false;
  return true;
}

function sendRemainingEvents(): void {
  const url = TELEMETRY_URL;
  if (!TELEMETRY_ENABLED || !url || !eventQueue.length) return;

  clearBatchTimeout();

  const { id: sessionId, start: sessionStart } = getSession();
  const payload: TelemetryPayload = {
    userId: getUserId(),
    sessionId,
    sessionStart,
    deviceInformation: getDeviceInformation(),
    events: [...eventQueue],
  };

  navigator.sendBeacon(url, JSON.stringify(payload));
  eventQueue = [];
}

export function sendTelemetry(): void {
  if (!shouldTrackTelemetry()) return;

  const favorites = getFavorites();
  addEventToBatch({
    type: EVENT_TYPE_APP_START,
    data: { favorite_stops: favorites.map((f) => f.stop_name) },
  });
}

export function sendTelemetryEvent(
  type: TelemetryEventType,
  data: Record<string, unknown> = {}
): void {
  if (!shouldTrackTelemetry()) return;
  addEventToBatch({ type, data });
}

export function trackStopEstimations(
  _stopId: number,
  stopName: string
): void {
  sendTelemetryEvent(EVENT_TYPE_STOP_VIEW, {
    stop_name: stopName.substring(0, 50),
  });
}

export function trackLineEstimations(
  lineLabel: string,
  lineDestination: string
): void {
  sendTelemetryEvent(EVENT_TYPE_LINE_VIEW, {
    line: lineLabel,
    destination: lineDestination.substring(0, 30),
  });
}

export function trackRouteView(
  lineLabel: string,
  lineDestination: string
): void {
  sendTelemetryEvent(EVENT_TYPE_ROUTE_VIEW, {
    line: lineLabel,
    destination: lineDestination.substring(0, 30),
  });
}

export function trackMapView(): void {
  sendTelemetryEvent(EVENT_TYPE_MAP_VIEW);
}

export function trackRefresh(viewType: string, isAutoRefresh = false): void {
  sendTelemetryEvent(EVENT_TYPE_REFRESH, {
    view: viewType,
    automatic: isAutoRefresh,
  });
}

export function trackFavoriteToggle(stopId: number, added: boolean): void {
  sendTelemetryEvent(EVENT_TYPE_FAVORITE, {
    action: added ? "add" : "remove",
    stop_id: stopId,
  });
}

export function trackDonationTipButton(): void {
  sendTelemetryEvent(EVENT_TYPE_DONATION_CLICK);
}

export function trackDonationCloseButton(): void {
  sendTelemetryEvent(EVENT_TYPE_DONATION_CLOSE);
}

export function trackTripSearch(from: string, to: string): void {
  sendTelemetryEvent(EVENT_TYPE_TRIP_SEARCH, {
    from: from.substring(0, 50),
    to: to.substring(0, 50),
  });
}

export function trackTripSelect(lines: string[], totalMinutes: number): void {
  sendTelemetryEvent(EVENT_TYPE_TRIP_SELECT, {
    lines,
    duration_minutes: totalMinutes,
  });
}

if (typeof window !== "undefined") {
  globalThis.addEventListener("beforeunload", sendRemainingEvents);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") sendRemainingEvents();
  });
}
