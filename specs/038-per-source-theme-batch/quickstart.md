# Quickstart: Per-Source Theme Batch

## Validation steps

1. `npm run audit:tokens` — expect 0 violations (no new raw classes).
2. `npm run audit:contrast` — expect all 70 new themes' pairings to
   clear AAA, or any genuine gap added to `KNOWN_THEME_CONTRAST_GAPS`
   with its real measured ratio.
3. `npm run dev`, open the Theme Gallery, confirm:
   - Each of the 70 new theme cards renders with correct swatches,
     grouped under its assigned mood family.
   - Selecting any new theme re-colors every component correctly.
   - Reloading the page keeps the selection (`localStorage`
     persistence).
   - The gallery's displayed total is 119 themes.
4. `npx playwright test` (full suite, all 6 browser/viewport projects)
   — expect zero regressions to the other 49 themes.
5. `npm run build` (both the static site and `packages/react`) —
   expect a clean production build.
