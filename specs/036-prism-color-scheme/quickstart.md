# Quickstart: Prism Color Scheme

## Validation steps

1. `npm run audit:tokens` — expect 0 violations (no new raw classes).
2. `npm run audit:contrast` — expect Prism's pairings to clear AAA, or
   any genuine gap added to `KNOWN_THEME_CONTRAST_GAPS` with its real
   measured ratio.
3. `npm run dev`, open the Theme Gallery, confirm:
   - Prism's card renders with correct swatches under "Light
     Professional."
   - Selecting Prism re-colors every component correctly.
   - Reloading the page keeps Prism selected (`localStorage`
     persistence).
   - The gallery's displayed total is 49 themes.
4. `npx playwright test` (full suite, all 6 browser/viewport projects)
   — expect zero regressions to the other 48 themes.
5. `npm run build` (both the static site and `packages/react`) —
   expect a clean production build.
