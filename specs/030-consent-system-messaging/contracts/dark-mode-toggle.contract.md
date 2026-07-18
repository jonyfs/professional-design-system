# Contract: Dark Mode Toggle

Reuses Toggle (`.toggle-track`/`.toggle-dot`) and `theme-switcher.js`'s
`selectTheme()`/`KNOWN_THEME_IDS` verbatim (research.md R5). Bound
specifically to the `light`/`dim` pair, not the full 48-theme set.

## `src/scripts/dark-mode-toggle.js`

```js
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
```

## Static HTML usage

```html
<label for="dark-mode-toggle-input" class="inline-flex items-center gap-2 cursor-pointer">
  <span class="relative inline-flex h-6 w-11 items-center">
    <input id="dark-mode-toggle-input" data-testid="dark-mode-toggle" type="checkbox" class="peer sr-only" />
    <span class="toggle-track"></span>
    <span class="toggle-dot"></span>
  </span>
  <span class="text-sm text-neutral-900">Dark mode</span>
</label>
```

## React wrapper shape

**Correction, found by checking precedent before writing this, not
assumed**: `packages/react/src` has NO existing theme-persistence
port — grepping the whole package for `localStorage`/`documentElement`
turns up exactly one precedent, `useChartColors.ts`, and it only ever
*reads* `document.documentElement`'s live state via a `MutationObserver`
— it never writes `localStorage` itself. Importing a nonexistent
`selectTheme`/`KNOWN_THEME_IDS` from a `../lib/theme` module (an
earlier draft of this contract did) would not compile. The React
DarkModeToggle instead ports the same minimal, literal-key logic
`theme-switcher.js` uses (research.md R5's `dim`/`light` pair only —
the React package does not need the full 48-theme `THEMES` array
import at all), matching `useChartColors`'s read side exactly and
adding only the small write side this component genuinely needs:

```tsx
import { useEffect, useState } from "react";

const DARK_THEME_ID = "dim";
const LIGHT_THEME_ID = "light";
const STORAGE_KEY = "pds-theme"; // same key as theme-switcher.js — one persistence source of truth

function applyTheme(themeId: string) {
  document.documentElement.dataset.theme = themeId;
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    // Persistence failure (quota, blocked storage) must not block the
    // theme from applying — same defensive pattern as theme-switcher.js.
  }
}

export interface DarkModeToggleProps {
  "data-testid"?: string;
}
export function DarkModeToggle({ "data-testid": testId }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.dataset.theme === DARK_THEME_ID,
  );
  useEffect(() => {
    // Read-only sync, identical in shape to useChartColors.ts's own
    // MutationObserver — catches a theme change from ANY source (this
    // toggle, a future theme <select> port, or any other consumer),
    // not just this component's own writes.
    const sync = () => setIsDark(document.documentElement.dataset.theme === DARK_THEME_ID);
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <span className="relative inline-flex h-6 w-11 items-center">
        <input
          data-testid={testId}
          type="checkbox"
          checked={isDark}
          onChange={(e) => applyTheme(e.target.checked ? DARK_THEME_ID : LIGHT_THEME_ID)}
          className="peer sr-only"
        />
        <span className="toggle-track"></span>
        <span className="toggle-dot"></span>
      </span>
      <span className="text-sm text-neutral-900">Dark mode</span>
    </label>
  );
}
```

## Acceptance mapping

- FR-004, spec.md US3 Acceptance Scenarios 1-2 → the markup/scripts above
- spec.md Edge Case (non-light/non-dim theme active) → `sync()`/the MutationObserver both read the LITERAL current theme, so any 3rd theme correctly renders "off"
