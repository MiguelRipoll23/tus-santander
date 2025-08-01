import { API_HOST, API_PATH_JSON_TELEMETRY } from "./ApiConstants.jsx";
import { getFavorites } from "./FavoriteUtils.jsx";

export const USER_IDENTIFIER_KEY = "user_identifier";

export const getUserIdentifier = () => {
  let identifier = localStorage.getItem(USER_IDENTIFIER_KEY);
  if (!identifier) {
    identifier = crypto.randomUUID();
    localStorage.setItem(USER_IDENTIFIER_KEY, identifier);
  }
  return identifier;
};

export const sendTelemetry = () => {
  if (typeof navigator === "undefined" || !/iPhone/i.test(navigator.userAgent)) {
    return;
  }

  const favorites = getFavorites().map((f) => f.stop_name);

  const data = {
    userIdentifier: getUserIdentifier(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenWidth: screen.width,
    screenHeight: screen.height,
    favorites,
  };

  fetch(API_HOST + API_PATH_JSON_TELEMETRY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    keepalive: true,
  }).catch(() => {});
};