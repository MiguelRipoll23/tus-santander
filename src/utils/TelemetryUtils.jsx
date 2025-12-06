import { TELEMETRY_HOST, TELEMETRY_API_SAVE_PATH } from "./ApiConstants.jsx";
import { getFavorites } from "./FavoriteUtils.jsx";

// ----- Constants -----
const TELEMETRY_ENABLED = Boolean(TELEMETRY_HOST?.length);
const TELEMETRY_URL = TELEMETRY_ENABLED
  ? TELEMETRY_HOST + TELEMETRY_API_SAVE_PATH
  : null;

const USER_IDENTIFIER_KEY = "user_identifier";
const SESSION_ID_KEY = "session_id";
const BATCH_SIZE = 5;
const BATCH_TIMEOUT = 10000; // 10s

// ----- Event batching -----
let eventQueue = [];
let batchTimeout = null;

// ----- UUID Helper -----
const generateUUID = () => {
  if (crypto) {
    if (crypto.randomUUID) return crypto.randomUUID();

    if (crypto.getRandomValues) {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;

      return [...bytes]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
    }
  }

  return `session-${Date.now()}-${Math.random()}`;
};

// ----- Session & User -----
const getSession = () => {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  let sessionStart = sessionStorage.getItem(`${SESSION_ID_KEY}_start`);

  if (!sessionId) {
    sessionId = generateUUID();
    sessionStart = Date.now().toString();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    sessionStorage.setItem(`${SESSION_ID_KEY}_start`, sessionStart);
  }

  return { id: sessionId, start: Number(sessionStart) };
};

const getUserId = () => {
  let id = localStorage.getItem(USER_IDENTIFIER_KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(USER_IDENTIFIER_KEY, id);
  }
  return id;
};

// ----- Device info -----
const getDeviceInformation = () => ({
  timeStamp: Date.now(),
  userAgent: navigator.userAgent,
  browserLanguage: navigator.language.split("-")[0],
  screenWidth: screen.width,
  screenHeight: screen.height,
});

// ----- Server communication -----
const sendToServer = async (payload) => {
  await fetch(TELEMETRY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Client-Version": "1.0" },
    body: JSON.stringify(payload),
    keepalive: true,
  });
};

const clearBatchTimeout = () => {
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }
};

const processBatch = () => {
  if (!eventQueue.length) return;

  const events = [...eventQueue];
  eventQueue = [];
  clearBatchTimeout();

  const { id: sessionId, start: sessionStart } = getSession();
  const payload = {
    userId: getUserId(),
    sessionId,
    sessionStart,
    deviceInformation: getDeviceInformation(),
    events,
  };

  sendToServer(payload).catch((err) => {
    eventQueue.unshift(...events);
    console.debug("Telemetry send failed:", err.message);
  });
};

const addEventToBatch = (event) => {
  eventQueue.push({ ...event, timeStamp: Date.now() });

  if (eventQueue.length >= BATCH_SIZE) processBatch();
  else if (!batchTimeout)
    batchTimeout = setTimeout(processBatch, BATCH_TIMEOUT);
};

// ----- Telemetry logic -----
const shouldTrackTelemetry = () => {
  if (!TELEMETRY_ENABLED) return false;
  if (typeof navigator === "undefined") return false;
  if (!/iphone/i.test(navigator.userAgent)) return false;
  return true;
};

const sendRemainingEvents = () => {
  if (!TELEMETRY_ENABLED || !eventQueue.length) return;

  clearBatchTimeout();

  const { id: sessionId, start: sessionStart } = getSession();
  const payload = {
    userId: getUserId(),
    sessionId,
    sessionStart,
    deviceInformation: getDeviceInformation(),
    events: [...eventQueue],
  };

  navigator.sendBeacon(TELEMETRY_URL, JSON.stringify(payload));
  eventQueue = [];
};

// ----- Main telemetry functions -----
export const sendTelemetry = () => {
  if (!shouldTrackTelemetry()) return;

  const favorites = getFavorites();
  addEventToBatch({
    type: "app_start",
    data: { favorite_stops: favorites.map((f) => f.stop_name) },
  });
};

export const sendTelemetryEvent = (type, data = {}) => {
  if (!shouldTrackTelemetry()) return;
  addEventToBatch({ type, data });
};

// ----- Specific event helpers -----
export const trackStopEstimations = (_, stopName) =>
  sendTelemetryEvent("stop_view", {
    stop_name: stopName?.substring(0, 50) || "unknown",
  });

export const trackLineEstimations = (lineLabel, lineDestination) =>
  sendTelemetryEvent("line_view", {
    line: lineLabel,
    destination: lineDestination?.substring(0, 30) || "unknown",
  });

export const trackRouteView = (lineLabel, lineDestination) =>
  sendTelemetryEvent("route_view", {
    line: lineLabel,
    destination: lineDestination?.substring(0, 30) || "unknown",
  });

export const trackMapView = () => sendTelemetryEvent("map_view");

export const trackRefresh = (viewType, isAutoRefresh = false) =>
  sendTelemetryEvent("refresh", { view: viewType, automatic: isAutoRefresh });

export const trackFavoriteToggle = (stopId, added) =>
  sendTelemetryEvent("favorite", {
    action: added ? "add" : "remove",
    stop_id: stopId,
  });

// ----- Cleanup -----
if (typeof window !== "undefined") {
  globalThis.addEventListener("beforeunload", sendRemainingEvents);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") sendRemainingEvents();
  });
}
