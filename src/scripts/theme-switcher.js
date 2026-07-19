// Theme persistence + activation (contracts/theme-switcher.contract.md).
// The first feature in this project to use localStorage at all
// (research.md R5) — the key is namespaced (pds-theme) accordingly.
import { THEMES } from "../../shared/design-tokens.ts";

const STORAGE_KEY = "pds-theme";
const DEFAULT_THEME = "light";

const KNOWN_THEME_IDS = THEMES.map((theme) => theme.id);

// Feature 045 — the same "dim" id DarkModeToggle.tsx already treats as
// light's binary dark counterpart (packages/react/src/DarkModeToggle),
// reused here rather than inventing a separate default.
const OS_DARK_PREFERENCE_THEME = "dim";

function prefersDark() {
  try {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  } catch {
    return false; // matchMedia can throw in some restrictive environments
  }
}

// The known-theme allowlist MUST be the real, complete list of shipped
// theme ids — a corrupted or unrecognized stored value (spec.md Edge
// Cases, FR-006) MUST fall back to the default, never silently apply an
// unknown data-theme value that resolves to nothing.
//
// Feature 045 — when NO choice is stored yet (first visit), seed from
// the OS's prefers-color-scheme instead of unconditionally defaulting to
// light — a previously stored, recognized choice always wins regardless
// of the current OS preference (spec.md FR-004).
export function resolveInitialTheme(knownThemeIds) {
  let stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage can throw (blocked storage, sandboxed iframe, some
    // private-browsing configurations) — fall back to the default theme
    // rather than letting an uncaught exception block theme activation.
  }
  if (knownThemeIds.includes(stored)) return stored;
  if (prefersDark() && knownThemeIds.includes(OS_DARK_PREFERENCE_THEME)) {
    return OS_DARK_PREFERENCE_THEME;
  }
  return DEFAULT_THEME;
}

export function applyTheme(themeId) {
  document.documentElement.dataset.theme = themeId;
}

export function selectTheme(themeId, knownThemeIds) {
  if (!knownThemeIds.includes(themeId)) return; // never persist an unknown id
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    // Persistence failure (quota, blocked storage) must not prevent the
    // theme from applying — degrade to in-memory-only for this session.
  }
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
