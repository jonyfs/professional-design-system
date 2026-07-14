# Quickstart: Recharts Additional Chart Types (Batch 2)

## Prerequisites
- `npm install` (no new dependency added by this feature).

## Setup
```bash
npm run build --workspace packages/react
npm run dev --workspace tests/react-harness
```

## Validate: Composed & Scatter Charts (US1, SC-001/SC-002)
1. Open the React harness's `chart-batch-2.html` demo.
2. Composed Chart: confirm a bar series and a line series render on
   the same category axis, correctly aligned and colored distinctly.
3. Switch the active theme preset — confirm both new chart types
   re-color automatically, matching feature 020's existing behavior.
4. Scatter Chart: confirm each plotted point sits at its correct
   (x, y) coordinate and remains distinguishable from nearby points
   via the shared tooltip.

## Validate: Funnel Chart (US2, SC-001)
1. Render a Funnel Chart with a decreasing multi-stage dataset —
   confirm each stage is proportionally sized and labeled with name
   and value.
2. Include a stage with value `0` — confirm it renders as a
   zero-width segment, not an error.

## Validate: Treemap & Sankey (US3, SC-001)
1. Render a Treemap with a nested dataset — confirm each node's area
   is proportional to its value and nested categories are visually
   distinguishable.
2. Render a Sankey diagram with weighted node/link data — confirm
   link widths are proportional and every node is labeled.

## Validate: accessibility, responsiveness, and completeness (SC-002–SC-006)
```bash
npx playwright test tests/e2e/react-chart-batch-2.spec.ts --project=chromium-320 --project=chromium-768 --project=chromium-1024 --project=chromium-1440 --project=firefox-1440 --project=webkit-1440
npm run audit:contrast
npm run audit:tokens
npm run typecheck
```
Expected: 0 axe-core violations, 0 new contrast/token findings, clean
typecheck, all 5 new chart types resize correctly at every supported
breakpoint, and all 11 native Recharts chart types (6 from feature 020
+ 5 from this feature) are now shipped with zero remaining deferred
Recharts chart type.

## Full success-criteria trace
See `spec.md`'s Success Criteria (SC-001–SC-006) for the complete list
this quickstart validates against.
