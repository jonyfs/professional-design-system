# Implementation Plan: Recharts Additional Chart Types (Batch 2)

**Branch**: `024-recharts-additional-charts` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/024-recharts-additional-charts/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Ship the 5 remaining native Recharts top-level chart components not
covered by feature 020 — ComposedChart, ScatterChart, FunnelChart,
Treemap, and Sankey — completing full coverage of Recharts' 11 chart
types. Every new chart reuses feature 020's existing shared chrome
verbatim: `ChartFrame` (accessible wrapper + data-table toggle),
`ChartLegend`, `ChartTooltip`, `ChartEmptyState`, `ChartDataTable`,
`useChartColors` (the runtime `--color-*` token reader), and
`usePrefersReducedMotion`. Zero new dependencies (Recharts already
ships all 5 components), zero new design tokens, zero new shared
chrome — this is purely 5 new thin wrapper components following the
exact pattern `BarChart.tsx`/`PieChart.tsx` already established.

## Technical Context

**Language/Version**: TypeScript 5.6, matching feature 020's React
package conventions exactly.

**Primary Dependencies**: None new — `ComposedChart`, `ScatterChart`,
`FunnelChart`, `Treemap`, and `Sankey` are already part of the
`recharts` package this catalog adopted in feature 020.

**Storage**: N/A — caller-supplied datasets, same as feature 020.

**Testing**: Playwright, one spec file for this batch
(`tests/react-harness/chart-batch-2.html` + a matching
`tests/e2e/react-chart-batch-2.spec.ts`), mirroring feature 020's own
`chart.html`/`react-chart.spec.ts` pattern — React-only, no static
surface (same documented exception feature 020 established).

**Target Platform**: Web — React package only
(`@professional-design-system/react`), no zero-JavaScript static
version — Recharts has no framework-independent rendering path, the
same already-ratified exception feature 020 established, not a new
one.

**Performance Goals**: Same bar as feature 020 — no virtualization,
datasets sized for typical dashboard use (tens to low hundreds of
data points/nodes), consistent with spec.md's explicit non-goals.

**Constraints**: Zero new npm dependency (Principle VII not
triggered); zero new design tokens (Principle IV) — every new chart
type reuses `useChartColors`' existing `--color-*` token reading
verbatim; every chart must resize responsively and respect
reduced-motion, matching feature 020's FR-011/FR-013 exactly.

**Scale/Scope**: 5 new thin components
(`packages/react/src/Chart/{ComposedChart,ScatterChart,FunnelChart,
Treemap,Sankey}.tsx`), a handful of new type definitions in
`packages/react/src/Chart/types.ts` for the 3 chart types whose data
shape doesn't fit the existing `ChartBaseProps`/`ChartSeries` model
(Treemap's nested nodes, Sankey's nodes+links, Scatter's per-series
point arrays) — no changes to any of feature 020's existing 6 chart
types or shared chrome.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Cognitive Ergonomics & Visual Hierarchy | All 5 new charts reuse the exact visual chrome (frame, legend, tooltip, empty state) feature 020 already researched and ratified — no new visual pattern introduced | PASS |
| II. Absolute Semantic Accessibility (WCAG AAA) | Every new chart reuses `ChartFrame`'s existing accessible-data-table toggle (`ChartDataTable`) verbatim — screen reader users get the same non-visual data equivalent feature 020 already verified empirically; Treemap/Sankey/Funnel's non-standard data shapes still map onto `ChartDataTable`'s existing category/series table format (verify empirically in Phase 3, consistent with this catalog's "verify, don't assume" precedent) | PASS (verify empirically in Phase 3) |
| III. Tailwind-Only Architecture | No new CSS classes needed — `ChartFrame`'s existing wrapper markup and plain Tailwind utilities already cover every chart type's layout needs | PASS |
| IV. Design Token Discipline | Zero new tokens — every new chart type calls the exact same `colorForSlot()` from `useChartColors()` already reading the `--color-*` custom properties (now correctly shipped in `packages/react/src/styles.css` since the design-sync-discovered bug fix) | PASS |
| V. Interactive State Completeness | Tooltip hover/focus and legend toggle states are inherited verbatim from `ChartTooltip`/`ChartLegend` — no new interactive elements introduced by this feature | PASS |
| VI. Project Language Policy | Code/docs in English; chat responses in PT-BR | PASS |
| VII. Autonomous Skill Acquisition Protocol | Not triggered — zero new dependencies; all 5 new chart types come from the already-adopted `recharts` package | PASS (not triggered) |

No violations — Complexity Tracking intentionally omitted.

## Project Structure

### Documentation (this feature)

```text
specs/024-recharts-additional-charts/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md         # Phase 1 output (/speckit-plan command)
├── contracts/            # Phase 1 output (/speckit-plan command)
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/react/src/Chart/
├── ComposedChart.tsx      # bar+line+area in one chart, optional secondary Y-axis
├── ScatterChart.tsx       # (x,y) point plotting, multi-series
├── FunnelChart.tsx        # multi-stage proportional funnel
├── Treemap.tsx            # nested, proportionally-sized rectangles
├── Sankey.tsx             # weighted node/link flow diagram
└── types.ts               # extended: ComposedSeriesConfig, ScatterSeriesConfig,
                            # FunnelStageDatum, TreemapNode, SankeyNode, SankeyLink

packages/react/src/index.ts  # + 5 new component/type exports

tests/react-harness/
├── chart-batch-2.html
└── src/chart-batch-2-main.tsx  # real usage examples for all 5, same dataset
                                  # style as chart-main.tsx (revenueData-like)

tests/e2e/
└── react-chart-batch-2.spec.ts  # React-only, mirrors react-chart.spec.ts's
                                    # existing assertions (re-theme, responsive,
                                    # reduced-motion, accessible data table)
```

**Structure Decision**: Additive-only to feature 020's existing
`packages/react/src/Chart/` directory — no new top-level directory, no
new shared module. The 3 chart types with genuinely different data
shapes (ComposedChart's per-series `type`, ScatterChart's per-series
point arrays, Treemap's nested nodes, Sankey's nodes+links, Funnel's
stage list) get their own narrow prop types in the existing
`types.ts` rather than forcing every chart into `ChartBaseProps`
artificially.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally omitted.
