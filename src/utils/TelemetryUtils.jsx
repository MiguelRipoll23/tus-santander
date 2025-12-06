import { TELEMETRY_HOST, TELEMETRY_API_SAVE_PATH } from "./ApiConstants.jsx";
import { getFavorites } from "./FavoriteUtils.jsx";

// Constants
const TELEMETRY_ENABLED =
  typeof TELEMETRY_HOST === "string" && TELEMETRY_HOST.length > 0;
const TELEMETRY_URL = TELEMETRY_ENABLED
  ? TELEMETRY_HOST + TELEMETRY_API_SAVE_PATH
  : null;

const USER_IDENTIFIER_KEY = "user_identifier";
const SESSION_ID_KEY = "session_id";
const BATCH_SIZE = 5;
const BATCH_TIMEOUT = 10000; // 10 seconds

// Event queue for batching
let eventQueue = [];
let batchTimeout = null;

// Helper to generate UUID with fallback
const generateUUID = () => {
  // Fallback to a non-persistent ID if crypto.randomUUID is unavailable
  return window.crypto && window.crypto.randomUUID
    ? window.crypto.randomUUID()
    : `session-${Date.now()}-${Math.random()}`;
};

// Session management
const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

const getUserId = () => {
  let identifier = localStorage.getItem(USER_IDENTIFIER_KEY);
  if (!identifier) {
    identifier = generateUUID();
    localStorage.setItem(USER_IDENTIFIER_KEY, identifier);
  }
  return identifier;
};

// Device fingerprinting (minimal data)
const getDeviceInformation = () => {
  const userAgent = navigator.userAgent;

  return {
    timeStamp: Date.now(),
    userAgent,
    browserLanguage: navigator.language.split("-")[0],
    screenWidth: screen.width,
    screenHeight: screen.height,
  };
};

// Send data to server
const sendToServer = async (payload) => {
  await fetch(TELEMETRY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Version": "1.0",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  });
};

// Helper to clear batch timeout
const clearBatchTimeout = () => {
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }
};

// Batch event processing
const processBatch = () => {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue = [];

  clearBatchTimeout();

  const payload = {
    userId: getUserId(),
    sessionId: getSessionId(),
    deviceInformation: getDeviceInformation(),
    events,
  };

  sendToServer(payload).catch((error) => {
    eventQueue.unshift(...events);
    console.debug("Telemetry send failed:", error.message);
  });
};

const addEventToBatch = (event) => {
  eventQueue.push({
    ...event,
    timeStamp: Date.now(),
  });

  if (eventQueue.length >= BATCH_SIZE) {
    processBatch();
  } else if (!batchTimeout) {
    batchTimeout = setTimeout(processBatch, BATCH_TIMEOUT);
  }
};

// Should track?
const shouldTrackTelemetry = () => {
  if (!TELEMETRY_ENABLED) {
    console.log("Telemetry skipped: TELEMETRY_HOST not configured");
    return false;
  }

  if (typeof navigator === "undefined") {
    console.log("Telemetry skipped: navigator undefined");
    return false;
  }

  if (!/iphone/i.test(navigator.userAgent)) {
    console.log("Telemetry skipped: not iPhone device");
    return false;
  }

  return true;
};

// Send remaining events via sendBeacon
const sendRemainingEvents = () => {
  if (!TELEMETRY_ENABLED || eventQueue.length === 0) {
    return;
  }

  clearBatchTimeout();

  const payload = {
    userId: getUserId(),
    sessionId: getSessionId(),
    deviceInformation: getDeviceInformation(),
    events: [...eventQueue],
  };

  navigator.sendBeacon(TELEMETRY_URL, JSON.stringify(payload));
  eventQueue = [];
};

// Main telemetry functions
export const sendTelemetry = () => {
  if (!shouldTrackTelemetry()) return;

  const favorites = getFavorites();

  addEventToBatch({
    type: "app_start",
    data: {
      favorite_stops: favorites.map((f) => f.stop_name),
    },
  });
};

export const sendTelemetryEvent = (eventType, eventData = {}) => {
  if (!shouldTrackTelemetry()) return;

  addEventToBatch({
    type: eventType,
    data: eventData,
  });
};

// Specific event helpers
export const trackStopEstimations = (_stopId, stopName) => {
  sendTelemetryEvent("stop_view", {
    stop_name: stopName?.substring(0, 50) || "unknown",
  });
};

export const trackLineEstimations = (lineLabel, lineDestination) => {
  sendTelemetryEvent("line_view", {
    line: lineLabel,
    destination: lineDestination?.substring(0, 30) || "unknown",
  });
};

export const trackRouteView = (lineLabel, lineDestination) => {
  sendTelemetryEvent("route_view", {
    line: lineLabel,
    destination: lineDestination?.substring(0, 30) || "unknown",
  });
};

export const trackMapView = () => {
  sendTelemetryEvent("map_view", {});
};

export const trackRefresh = (viewType, isAutoRefresh = false) => {
  sendTelemetryEvent("refresh", {
    view: viewType,
    automatic: isAutoRefresh,
  });
};

export const trackFavoriteToggle = (_stopId, added) => {
  sendTelemetryEvent("favorite", {
    action: added ? "add" : "remove",
  });
};

// Cleanup
if (typeof window !== "undefined") {
  globalThis.addEventListener("beforeunload", sendRemainingEvents);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      sendRemainingEvents();
    }
  });
}
