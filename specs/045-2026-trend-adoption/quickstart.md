# Quickstart: Validating 2026 External Design-Trend Adoption

## 1. Confirm the font actually loads (User Story 1 / SC-001, SC-002)

1. `npm run dev`, open the site, open browser dev tools → Network tab, filter by "font".
2. **Expected**: an Inter variable font file request appears and succeeds (200); Elements → Computed styles on a heading/body element shows `font-family` resolving to Inter, not a system font.
3. Run `npm run build` and check Lighthouse/CWV metrics stay within `rules/web/performance.md`'s LCP/FCP targets.
4. Run `npm run test:e2e` — confirm no unexpected visual-regression failures; any real, font-caused pixel shift gets its snapshot deliberately regenerated (research.md R2), not blanket-ignored.

## 2. Confirm OS dark-mode preference seeding (User Story 2 / SC-003)

1. Clear the site's localStorage theme key, set the OS/browser to prefer dark color scheme, load the site fresh.
2. **Expected**: the site renders in a dark curated theme on first paint, no flash of the light theme first.
3. Manually switch to a different theme via the existing selector, reload.
4. **Expected**: the manually-chosen theme persists and is NOT overridden by the OS preference on subsequent loads.

## 3. Confirm dark-grey-not-pure-black audit (FR-005)

1. `grep -n "neutral-50: 0 0 0" src/styles/themes.css` across all dark-family theme blocks.
2. **Expected**: no match — confirms no dark theme uses pure black as its primary surface color (already true per research.md R4; this re-confirms after any theme edits).

## 4. Confirm new style-direction documentation (User Story 3 / SC-004, SC-005)

1. Open the constitution's Component Catalog section and locate the two new entries ("Organic/Fluid", "3D/Immersive").
2. **Expected**: each has a description, applicability guidance, and performance/accessibility constraint, matching the existing entries' structure.
3. `git diff --stat` across `src/components/` and `packages/react/src/` for this feature's commits.
4. **Expected**: zero files changed in either directory — confirms no existing component was retrofitted (FR-007/SC-005).
