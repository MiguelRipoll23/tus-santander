import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import "./index.css";
import App from "./components/App.jsx";

const container = document.querySelector("#app");
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

registerSW({
  immediate: true,
  onRegisteredSW(swScriptUrl, registration) {
    console.log("Service Worker registered:", registration);
    const installingServiceWorker = registration?.installing;

    if (installingServiceWorker?.state === "activated") {
      console.log("New service worker activated. Reloading...");
      window.location.reload();
    }
  },
});
