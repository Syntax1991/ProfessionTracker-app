import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/integration.css";
import "./styles/battlenet-characters.css";
import "./styles/character-detail-summary.css";
import "./styles/character-detail-coverage.css";
import "./styles/profession-overview.css";
import "./styles/profession-character-details.css";
import "./styles/profession-detail-coverage.css";
import "./styles/profession-coverage-matrix.css";
import "./styles/specializations.css";
import "./styles/forms.css";
import "./styles/tables.css";

const rootElement =
  document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element was not found."
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);