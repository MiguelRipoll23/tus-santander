import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./components/App.jsx";
import { initServiceWorkerMigration } from "./utils/ServiceWorkerMigration.jsx";

// Initialize service worker migration in production
if (import.meta.env.PROD) {
  initServiceWorkerMigration();
}

const container = document.querySelector("#app");
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
