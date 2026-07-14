# Phase 1 Data Model: Recharts Additional Chart Types (Batch 2)

## Composed Chart

- **data**: `ChartDatum[]` (existing type, unchanged) — one row per
  x-axis category.
- **series**: `ComposedSeriesConfig[]` — `{key, label, type: "bar" |
  "line" | "area", yAxisId?: "left" | "right"}`. `type` determines
  which Recharts sub-element renders that series; `yAxisId` opts a
  series onto the secondary axis (research.md R3).
- **xAxisKey**: which `data` column is the shared category axis.

## Scatter Chart

- **series**: `ScatterSeriesConfig[]` — `{key, label, data: {x:
  number, y: number}[]}`. Each series owns its own point array
  (research.md R1) — unlike every other chart type in this catalog,
  there is no shared `data` prop.
- **xAxisLabel**, **yAxisLabel**: axis labels (Scatter has no
  categorical x-axis key the way Bar/Line/Area do).

## Funnel Chart

- **data**: `FunnelStageDatum[]` — `{name: string, value: number}`,
  one entry per stage, ordered by the caller (spec.md Edge Cases: the
  component does not enforce monotonic decrease).

## Treemap

- **data**: `TreemapNode[]` — recursive: `{name: string, value?:
  number, children?: TreemapNode[]}`. A node is either a leaf (has
  `value`, no `children`) or a parent (has `children`, whose own
  values determine its aggregate size).

## Sankey Diagram

- **nodes**: `SankeyNode[]` — `{name: string}`, index-addressed.
- **links**: `SankeyLink[]` — `{source: number, target: number, value:
  number}`, where `source`/`target` are indices into `nodes`.
  Referencing an undefined index is a caller data error (spec.md Edge
  Cases) — not validated by this feature beyond what Recharts itself
  does.

## Cross-cutting (all 5)

- **ariaLabel**: required, same convention as every existing chart
  type.
- **showTooltip**, **showLegend**: optional, default `true` where
  applicable (Treemap/Sankey have no `showLegend` — research.md R2).
- All 5 read colors from the existing `useChartColors().colorForSlot()`
  and gate animation via the existing `usePrefersReducedMotion()` —
  no new entity for either; both are feature 020's existing hooks,
  unchanged.
