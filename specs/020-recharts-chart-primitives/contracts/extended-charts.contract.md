# Component Contract: Extended Charts (Radar, Radial) — User Story 2

## Components
`RadarChart` (Recharts `RadarChart`/`Radar`), `RadialChart` (Recharts
`RadialBarChart`/`RadialBar`, research.md R6).

## Props
- `RadarChart`: `data`, `series`, `attributeKey: string` (the shared axis
  dimension, e.g. "Speed", "Skill A"), `ariaLabel` — same shared shape as
  core charts (contracts/core-charts.contract.md).
- `RadialChart`: `value: number`, `min: number`, `max: number`,
  `label: string`, `ariaLabel` — a single-series shape distinct from the
  multi-series core charts, per spec.md US2 AC2 ("single value and a target
  range").

## Markup contract
Same `<figure role="img">` + hidden `ChartDataTable` + `ChartEmptyState`
pattern as contracts/core-charts.contract.md — `RadialChart`'s data table
has one row (the single value) rather than one row per data point.

## Required behavior
- `RadarChart`: every attribute axis MUST be labeled (spec.md US2 AC1); each
  data series uses a distinct `useChartColors()` slot, distinguishable via
  `ChartLegend` even where two series' shapes visually overlap (FR-016).
- `RadialChart`: the current value's position relative to `[min, max]` MUST
  be unambiguous without relying on color alone (spec.md US2 AC2) — satisfied
  by a centered numeric text label (e.g. "72 / 100") rendered inside the
  radial arc, not color-position alone.
- Both reuse `useChartColors()`, `isAnimationActive={!prefersReducedMotion}`,
  and the empty-dataset/zero-value rules from
  contracts/core-charts.contract.md — no divergent behavior for these two
  types.

## Acceptance mapping
- Spec.md US2 AC1–AC2 → this contract.
- FR-005, FR-006, FR-016 → this contract.
