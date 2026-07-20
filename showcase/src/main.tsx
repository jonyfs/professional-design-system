import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@jonyfs/react/styles.css";
import "./showcase.css";
// FR-004: reuse the site's real theme activation (not a showcase-local
// reimplementation) — its own top-level side effect applies the
// persisted theme before React ever renders, avoiding a flash of the
// wrong theme (contracts/theme-switcher.contract.md), same as every
// other page in this catalog.
import "../../src/scripts/theme-switcher.js";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
