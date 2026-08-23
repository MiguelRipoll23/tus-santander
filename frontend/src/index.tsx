import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./components/App";
import { initServiceWorkerMigration } from "./utils/ServiceWorkerMigration";

if (import.meta.env.PROD) {
  initServiceWorkerMigration();
}

const container = document.querySelector("#app");

if (!container) {
  throw new Error("Root element #app not found");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
