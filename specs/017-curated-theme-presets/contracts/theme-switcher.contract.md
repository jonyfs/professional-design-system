# Contract: Theme Switcher (persistence + activation)

## `src/scripts/theme-switcher.js` (NEW)

```js
// Persistence key is namespaced (pds-theme) — this is the first feature
// in this project to use localStorage at all (research.md R5).
const STORAGE_KEY = "pds-theme";
const DEFAULT_THEME = "light";

// The known-theme allowlist MUST be the real, complete list of shipped
// theme ids — a corrupted or unrecognized stored value (spec.md Edge
// Cases, FR-006) MUST fall back to the default, never silently apply an
// unknown data-theme value that resolves to nothing.
export function resolveInitialTheme(knownThemeIds) {
  let stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage can throw (blocked storage, sandboxed iframe, some
    // private-browsing configurations) — fall back to the default theme.
  }
  return knownThemeIds.includes(stored) ? stored : DEFAULT_THEME;
}

export function applyTheme(themeId) {
  document.documentElement.dataset.theme = themeId;
}

export function selectTheme(themeId, knownThemeIds) {
  if (!knownThemeIds.includes(themeId)) return; // never persist an unknown id
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    // Persistence failure must not block the theme from applying —
    // degrade to in-memory-only for this session.
  }
  applyTheme(themeId);
}
```

**Error handling (Phase 8 T074 code-review finding)**: `localStorage`
access MUST be wrapped in `try/catch` in both directions — a real, non-
exotic environment (storage blocked by browser policy/extension,
sandboxed third-party iframe embedding, some private-browsing
configurations) throws on `getItem`/`setItem` rather than failing
silently. An uncaught exception here would block `applyTheme()` from
ever running, which is a functional regression (theme never switches),
not just a persistence nice-to-have degrading gracefully.

**Required activation point**: `resolveInitialTheme()` + `applyTheme()`
MUST run as early as possible in `<head>` (a real, CSP-compliant
`<script type="module" src="/src/scripts/theme-switcher.js">`, not an
inline `<script>` block with logic — this project's CSP is `script-src
'self'`, which permits external module files but this project's
established convention, matching every prior feature, is to keep even
same-origin inline `<script>` blocks to simple 2-3 line
import-and-invoke snippets, never business logic) to avoid a flash of
the wrong theme on load.

## Required attributes

- `document.documentElement` (`<html>`) carries the single source-of-
  truth `data-theme` attribute — not a class, not a per-section
  attribute, matching research.md R1's proof-of-concept exactly.

## Acceptance mapping

- FR-005, FR-006, SC-006 → `tests/e2e/theme-persistence.spec.ts` (real
  `localStorage` set, page reload, and corrupted/unrecognized-value
  fallback all asserted via real browser state, not assumed)
