// Feature 030 — reuses theme-switcher.js's persistence mechanism
// verbatim (research.md R5), bound specifically to the light/dim pair
// (spec.md's documented scope decision) rather than the full 48-theme
// set.
import { selectTheme, KNOWN_THEME_IDS } from "./theme-switcher.js";

const DARK_THEME_ID = "dim";
const LIGHT_THEME_ID = "light";

export function initDarkModeToggle() {
  const input = document.getElementById("dark-mode-toggle-input");
  if (!input) return;

  function sync() {
    input.checked = document.documentElement.dataset.theme === DARK_THEME_ID;
  }

  input.addEventListener("change", () => {
    selectTheme(input.checked ? DARK_THEME_ID : LIGHT_THEME_ID, KNOWN_THEME_IDS);
  });

  // If this page also has the full theme <select> (every demo page's
  // header), keep the toggle's derived state in sync with it — no new
  // persistence, just re-reading the same document.documentElement
  // dataset the select itself just wrote (research.md R5).
  const themeSelect = document.getElementById("gallery-theme-select");
  themeSelect?.addEventListener("change", sync);

  sync(); // correct initial state, whichever theme was active on load
}
