# Quickstart: Demo Gallery Visual Showcase

## Prerequisites
- `npm install` (no new dependency added by this feature).

## Setup
```bash
npm run dev
```

## Validate: opening section communicates scale (US1, SC-001)
1. Open `index.html`, view only the first screen (no scrolling).
2. Confirm at least 2-3 differentiating claims are visible (component
   count, dual-surface guarantee, WCAG AAA, theme count).

## Validate: categorized, navigable gallery (US2, SC-002/SC-003)
1. Scroll through the full gallery — confirm components are grouped
   under labeled category headings, not one flat list.
2. Use the quick-jump nav to reach any category in one click/tap.
3. Confirm the flagship components (Data Table, Chart, Command
   Palette, curated theming) are visually distinguished from routine
   primitives.

## Validate: individual demo pages feel polished (US3)
1. Open several individual component demo pages directly (not via the
   gallery).
2. Confirm each presents its component within clearer visual framing
   than a bare heading + paragraph + component.
3. Confirm the page's markup is still directly viewable/copyable and
   any zero-JavaScript component remains zero-JavaScript.

## Validate: zero regressions (SC-004, FR-007/FR-008)
```bash
npx playwright test tests/e2e/gallery-showcase.spec.ts --project=chromium-320 --project=chromium-768 --project=chromium-1024 --project=chromium-1440 --project=firefox-1440 --project=webkit-1440
npm run audit:tokens
npm run audit:contrast
```
Then run the full pre-existing catalog suite to confirm zero
regressions to any shipped component's markup/behavior/accessibility.

## Full success-criteria trace
See `spec.md`'s Success Criteria (SC-001–SC-006) for the complete list
this quickstart validates against.
