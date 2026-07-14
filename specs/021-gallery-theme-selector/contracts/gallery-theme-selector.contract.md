# Contract: Gallery Theme Selector

## `index.html` (MODIFIED — `<header>` addition)

```html
<header class="border-b border-neutral-200 px-6 py-8">
  <h1 class="text-2xl font-bold text-neutral-900">Professional Design System</h1>
  <p class="mt-2 max-w-2xl text-sm text-neutral-600">…</p>

  <div class="mt-4 max-w-xs">
    <label for="gallery-theme-select" class="text-sm font-medium text-neutral-900">
      Preview theme
    </label>
    <select id="gallery-theme-select" data-testid="gallery-theme-select" class="form-select">
      <!-- <optgroup>/<option>s populated by gallery-theme-selector.js -->
    </select>
  </div>
</header>
```

- `<script type="module" src="/src/scripts/gallery-theme-selector.js"></script>`
  is added after the existing `theme-switcher.js` `<script>` tag in
  `<head>` (or before `</body>`, since — unlike `theme-switcher.js` —
  this script does not need to run before first paint; it only needs
  `document.documentElement` to exist, which is already true once the
  `<select>` markup above has parsed).

## `src/scripts/gallery-theme-selector.js` (NEW)

```js
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
  select.value = document.documentElement.dataset.theme ?? "light";
  select.addEventListener("change", () => {
    selectTheme(select.value, KNOWN_THEME_IDS);
  });
}

initGalleryThemeSelector();
```

## Required attributes

- `<select>` MUST have an associated `<label for="...">` (FR-009) — never
  a placeholder-only or `aria-label`-only control, matching this
  catalog's existing `Select`/`.form-select` convention.
- `<option>` values MUST be theme `id`s (matching `data-theme`'s own
  values) — never `displayName` strings — so `selectTheme()` receives a
  value `KNOWN_THEME_IDS` can validate directly.

## Required behavior

- Selecting an option MUST call `selectTheme(value, KNOWN_THEME_IDS)` —
  never call `applyTheme()` directly, so persistence (FR-005) is never
  accidentally skipped.
- The control's initial value MUST be set from
  `document.documentElement.dataset.theme` (research.md R3) — never
  re-derived independently from `localStorage`.
- No page reload, no `preventDefault()`/form submission involved — a
  plain `change` event handler is sufficient (FR-002/FR-007).

## Acceptance mapping

- Spec.md US1 AC1–AC3 → `<select>` population + `change` handler above.
- Spec.md US2 AC1–AC2, US3 AC1 → `selectTheme()`'s existing persistence
  (feature 017, unmodified) + this control's initial-value read.
- FR-001–FR-010 → this contract.
