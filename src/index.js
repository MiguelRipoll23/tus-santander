import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import "./index.css";
import App from "./components/App.js";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const container = document.querySelector("#app");
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

const config = {
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated") {
          window.location.reload();
        }
      });

      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  },
};

serviceWorkerRegistration.register(config);
