import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./components/App.jsx";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration.jsx";

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
