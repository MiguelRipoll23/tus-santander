import { API_HOST, API_PATH_JSON_TELEMETRY } from "./ApiConstants.jsx";
import { getFavorites } from "./FavoriteUtils.jsx";

// Constants
const TELEMETRY_URL =
  "https://tusestimaciones-telemetry.miguelripoll23.deno.net/collect";
const USER_IDENTIFIER_KEY = "user_identifier";
const SESSION_START_KEY = "session_start";
const BATCH_SIZE = 5;
const BATCH_TIMEOUT = 10000; // 10 seconds

// Event queue for batching
let eventQueue = [];
let batchTimeout = null;

// Session management
const getSessionId = () => {
  const sessionStart = sessionStorage.getItem(SESSION_START_KEY);
  if (!sessionStart) {
    const timestamp = Date.now();
    sessionStorage.setItem(SESSION_START_KEY, timestamp.toString());
    return timestamp;
  }
  return parseInt(sessionStart, 10);
};

const getUserId = () => {
  let identifier = localStorage.getItem(USER_IDENTIFIER_KEY);
  if (!identifier) {
    identifier = crypto.randomUUID();
    localStorage.setItem(USER_IDENTIFIER_KEY, identifier);
  }
  return identifier;
};

// Device fingerprinting (minimal data)
const getDeviceInformation = () => {
  const userAgent = navigator.userAgent;

  return {
    // Shortened keys to reduce payload size
    timeStamp: Date.now(), // timestamp
    userAgent,
    browserLanguage: navigator.language.split("-")[0], // Just language, not region
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

// Batch event processing
const processBatch = () => {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue = [];

  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }

  const payload = {
    userId: getUserId(),
    sessionId: getSessionId(),
    deviceInformation: getDeviceInformation(),
    events,
  };

  sendToServer(payload).catch((error) => {
    // If sending fails, add the events back to the front of the queue
    // to be retried with the next batch.
    eventQueue.unshift(...events);
    // Silently fail - don't impact user experience
    console.debug("Telemetry send failed:", error.message);
  });
};

const addEventToBatch = (event) => {
  eventQueue.push({
    ...event,
    timeStamp: Date.now(),
  });

  // Process batch if it's full or start timeout
  if (eventQueue.length >= BATCH_SIZE) {
    processBatch();
  } else if (!batchTimeout) {
    batchTimeout = setTimeout(processBatch, BATCH_TIMEOUT);
  }
};

// Main telemetry functions
export const sendTelemetry = () => {
  // Only track on iPhone devices
  if (
    typeof navigator === "undefined" ||
    !navigator.userAgent.includes("iPhone")
  ) {
    return;
  }

  const favorites = getFavorites();

  addEventToBatch({
    type: "app_start",
    data: {
      favorite_stops: favorites.map((f) => f.stop_name), // Stop names for better analytics
    },
  });
};

export const sendTelemetryEvent = (eventType, eventData = {}) => {
  // Only track on iPhone devices
  if (
    typeof navigator === "undefined" ||
    !navigator.userAgent.includes("iPhone")
  ) {
    return;
  }

  addEventToBatch({
    type: eventType,
    data: eventData,
  });
};

// Specific event helpers
export const trackStopEstimations = (stopId, stopName) => {
  sendTelemetryEvent("stop_view", {
    stop_name: stopName?.substring(0, 50) || "unknown", // Limit length
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
    refresh: isAutoRefresh,
  });
};

export const trackFavoriteToggle = (stopId, added) => {
  sendTelemetryEvent("favorite", {
    action: added ? "add" : "remove",
  });
};

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (eventQueue.length > 0) {
      processBatch();
    }
  });

  // Process remaining events when page becomes hidden
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && eventQueue.length > 0) {
      processBatch();
    }
  });
}
