import { API_HOST, API_PATH_JSON_TELEMETRY } from "./ApiConstants.jsx";
import { getFavorites } from "./FavoriteUtils.jsx";

export const getUserIdentifier = () => {
  let identifier = localStorage.getItem("user_identifier");
  if (!identifier) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    identifier = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    localStorage.setItem("user_identifier", identifier);
  }
  return identifier;
};

export const sendTelemetry = async () => {
  if (typeof navigator === "undefined" || /iPhone/i.test(navigator.userAgent) === false) {
    return;
  }

  const favorites = getFavorites().map((f) => f.stop_name);

  const data = {
    userIdentifier: getUserIdentifier(),
    userAgent: navigator.userAgent,
    screenWidth: screen.width,
    screenHeight: screen.height,
    favorites,
  };

  try {
    await fetch(API_HOST + API_PATH_JSON_TELEMETRY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    });
  } catch (_) {}
};
