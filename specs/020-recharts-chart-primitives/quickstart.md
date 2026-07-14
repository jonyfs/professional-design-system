# Quickstart: Recharts-Based Chart Primitives

## Prerequisites
- `packages/react` builds cleanly on `main` (`npm run build` inside
  `packages/react`).
- `recharts` added to `packages/react/package.json` dependencies (Constitution
  Check G-VII — verify version/license before install).

## Setup
```bash
cd packages/react
npm install
npm run build
```

## Validate: chart renders on-theme with zero manual color config (SC-001)
1. Open `tests/react-harness/react-chart.html` in a browser (or run the
   Playwright suite headless, see below).
2. Confirm a `LineChart`, `BarChart`, `AreaChart`, and `PieChart` each render
   with colors matching the current `data-theme` — no color prop passed by
   the demo page itself.

## Validate: theme-preset switch re-colors every chart (SC-002)
1. On the same demo page, trigger the existing theme-switcher control
   (feature 017) to change `data-theme`.
2. Confirm every visible chart's colors update within the same interaction —
   no page reload, no chart-specific re-configuration step.

## Validate: accessibility (SC-003, SC-004)
```bash
npx playwright test tests/e2e/react-chart.spec.ts
```
Expected: the suite's axe-core pass reports 0 violations; a screen-reader
snapshot (or the Playwright accessibility tree assertion) confirms each
chart's hidden `ChartDataTable` exposes the same values as the visual chart.

## Validate: responsive resize (SC-006)
1. Resize the browser window or toggle a layout panel on the demo page.
2. Confirm every visible chart adapts to its new container size within the
   same render pass — no distorted or overflowing chart content at 320,
   768, 1024, or 1440px widths (per this project's web testing rules).

## Validate: reduced motion (FR-013)
1. Enable "reduce motion" in the OS/browser (or emulate via Playwright's
   `page.emulateMedia({ reducedMotion: 'reduce' })`).
2. Confirm chart entrance animation is disabled or substantially reduced.

## Validate: empty dataset (FR-012) and null/zero edge cases
Run the edge-case section of `tests/e2e/react-chart.spec.ts`, covering: an
empty dataset (expect `ChartEmptyState`, not a blank/broken area), a
mid-series `null` value (expect a visual gap, not interpolation), and a
zero-value Pie/Donut slice (expect zero-width, not an error).

## Full success-criteria trace
See `spec.md`'s Success Criteria (SC-001–SC-006) and `data-model.md`'s
Cross-cutting invariants for the complete list this quickstart validates
against.
