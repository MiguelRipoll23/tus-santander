import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./components/App.jsx";

const container = document.querySelector("#app");
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
