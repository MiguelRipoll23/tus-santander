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
  onRegistered(registration) {
    console.log("Service Worker registered:", registration);

    registration.addEventListener("updatefound", () => {
      const waitingServiceWorker = registration.waiting;

      if (waitingServiceWorker) {
        waitingServiceWorker.addEventListener("statechange", () => {
          if (waitingServiceWorker.state === "activated") {
            console.log("New service worker activated. Reloading...");
            window.location.reload();
          }
        });
      }
    });
  },
  onError(error) {
    console.error("Service Worker registration failed:", error);
  },
});
