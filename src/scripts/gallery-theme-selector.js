// Gallery theme selector (contracts/gallery-theme-selector.contract.md,
// feature 021). Reuses feature 017's theming infrastructure verbatim —
// no new persistence, no new theme data, no new resolution logic
// (research.md R2). Unlike theme-switcher.js, this script does not need
// to run before first paint: it only needs the <select> markup and
// document.documentElement.dataset.theme (already resolved/applied by
// theme-switcher.js's own <head>-level activation) to exist.
import { THEMES, MOOD_FAMILIES } from "../../shared/design-tokens.ts";
import { selectTheme, KNOWN_THEME_IDS } from "./theme-switcher.js";

function populateSelect(select) {
  for (const moodFamily of MOOD_FAMILIES) {
    const group = document.createElement("optgroup");
    group.label = moodFamily;
    for (const theme of THEMES.filter((t) => t.moodFamily === moodFamily)) {
      const option = document.createElement("option");
      option.value = theme.id;
      option.textContent = theme.displayName;
      group.appendChild(option);
    }
    select.appendChild(group);
  }
}

function initGalleryThemeSelector() {
  const select = document.getElementById("gallery-theme-select");
  if (!select) return;
  populateSelect(select);
  // Read the already-applied theme rather than re-deriving it from
  // localStorage a second time (research.md R3) — theme-switcher.js's
  // <head>-level activation has already run by the time this script
  // executes, so the control can never disagree with what's applied.
  select.value = document.documentElement.dataset.theme ?? "light";
  select.addEventListener("change", () => {
    selectTheme(select.value, KNOWN_THEME_IDS);
  });
}

initGalleryThemeSelector();
