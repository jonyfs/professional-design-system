// Theme persistence + activation (contracts/theme-switcher.contract.md).
// The first feature in this project to use localStorage at all
// (research.md R5) — the key is namespaced (pds-theme) accordingly.
import { THEMES } from "../../shared/design-tokens.ts";

const STORAGE_KEY = "pds-theme";
const DEFAULT_THEME = "light";

const KNOWN_THEME_IDS = THEMES.map((theme) => theme.id);

// The known-theme allowlist MUST be the real, complete list of shipped
// theme ids — a corrupted or unrecognized stored value (spec.md Edge
// Cases, FR-006) MUST fall back to the default, never silently apply an
// unknown data-theme value that resolves to nothing.
export function resolveInitialTheme(knownThemeIds) {
  const stored = localStorage.getItem(STORAGE_KEY);
  return knownThemeIds.includes(stored) ? stored : DEFAULT_THEME;
}

export function applyTheme(themeId) {
  document.documentElement.dataset.theme = themeId;
}

export function selectTheme(themeId, knownThemeIds) {
  if (!knownThemeIds.includes(themeId)) return; // never persist an unknown id
  localStorage.setItem(STORAGE_KEY, themeId);
  applyTheme(themeId);
}

// Auto-bootstrap on import: every page loads this module as a bare
// `<script type="module" src="/src/scripts/theme-switcher.js">` with zero
// inline logic (this project's established convention of keeping even
// inline <script> blocks to simple import-and-invoke snippets, never
// business logic — see index.html/theme-gallery.html's <head>), so the
// "run as early as possible" requirement is satisfied by the module's own
// top-level side effect, not by anything a consuming page has to write.
applyTheme(resolveInitialTheme(KNOWN_THEME_IDS));

export { KNOWN_THEME_IDS };
