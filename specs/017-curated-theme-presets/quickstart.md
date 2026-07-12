# Quickstart: Curated Theme Presets

## Prerequisites

- Existing scaffold only — no new dependencies to install.

## Run the dev gallery

```bash
npm run dev
```

Open `http://localhost:5173/src/components/theme-gallery/theme-gallery.html`.

## Validate the architecture (P1 MVP)

1. Confirm the page loads with the "light" theme active by default
   (`document.documentElement.dataset.theme === "light"`) and every
   existing component visually matches its pre-feature-017 baseline
   exactly (a pure refactor — zero visual change for the default theme).
2. Select a different theme card in the gallery — confirm the
   representative preview region (Button, Badge, Card, Alert, TextInput)
   restyles immediately, with no page reload.
3. Reload the page — confirm the previously-selected theme is still
   active (persistence).
4. In DevTools, manually set `localStorage.pds-theme` to an invalid
   string (e.g. `"not-a-real-theme"`) and reload — confirm the page falls
   back to the default "light" theme, not a broken/unstyled state.
5. Open any EXISTING component's own demo page (e.g. `button.html`)
   directly while a non-default theme is selected — confirm it also
   reflects the selected theme (FR-004: consistent across the whole
   catalog, not just the gallery's own preview region).

## Automated validation

```bash
node scripts/check-contrast.mjs   # now runs once per theme (42x), not once
npm run audit:tokens               # confirm zero raw palette classes introduced
npx playwright test theme-         # gallery, persistence, and restyle specs
```

## Expected outcomes

- Zero visual difference in the default "light" theme compared to this
  catalog's pre-feature-017 baselines (a pure refactor, proven by
  existing visual regression baselines staying byte-identical).
- Every shipped theme (however many are implemented by a given point —
  see plan.md's Scale/Scope batching decision) independently clears the
  same WCAG AAA/AA bar as the default theme via the parametrized
  contrast audit — zero exceptions.
- Selecting a theme in the gallery restyles the representative component
  sample live, with no reload.
- The selection persists across a reload and falls back cleanly to the
  default theme for a missing or corrupted stored value.
- No component's markup contains an inline `style="..."` attribute
  anywhere in this feature (the gallery's swatch colors are set via
  CSSOM, matching Progress/Tooltip's established pattern).
