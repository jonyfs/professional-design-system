# Research: Recharts Additional Chart Types (Batch 2)

## R1: Data shape per chart type

**Decision**: 3 of the 5 new chart types fit feature 020's existing
`ChartBaseProps`/`ChartSeries` model with small extensions; 2 need
their own narrow shape.

- **ComposedChart**: fits `ChartBaseProps` + `xAxisKey` (same as
  BarChart/LineChart/AreaChart), but each series needs a render-type
  tag. New type: `ComposedSeriesConfig extends ChartSeries { type:
  "bar" | "line" | "area"; yAxisId?: "left" | "right" }` — the
  `yAxisId` is what satisfies spec.md FR-001's secondary-axis
  requirement (Recharts' own mechanism: a second `<YAxis
  yAxisId="right" orientation="right">`, referenced per-series).
- **ScatterChart**: does NOT fit `ChartBaseProps` — Recharts renders
  each series as its own `<Scatter data={...}>` with its own array of
  `{x, y}` points, not one shared `data` array keyed by column. New
  type: `ScatterSeriesConfig { key: string; label: string; data: {x:
  number; y: number}[] }`. Props: `series: ScatterSeriesConfig[];
  xAxisLabel: string; yAxisLabel: string; ariaLabel: string;
  showTooltip?; showLegend?`.
- **FunnelChart**: fits the Pie/Donut model (one row per stage, no
  multi-series concept) — reuses `PieChart`'s exact pattern: `data:
  {name: string; value: number}[]`, `ariaLabel`, `showTooltip?`,
  `showLegend?`. No new type needed beyond a `FunnelStageDatum` alias
  for clarity.
- **Treemap**: needs a genuinely new, recursive type: `TreemapNode {
  name: string; value?: number; children?: TreemapNode[] }` (a leaf
  has `value`, a parent has `children` instead). Props: `data:
  TreemapNode[]; ariaLabel; showTooltip?`.
- **Sankey**: needs `SankeyNode { name: string }` and `SankeyLink {
  source: number; target: number; value: number }` (index-based,
  matching Recharts' own documented Sankey data shape). Props: `nodes:
  SankeyNode[]; links: SankeyLink[]; ariaLabel; showTooltip?`.

**Rationale**: Matching each chart's actual Recharts data contract
directly (verified against Recharts' own component props, not
invented) avoids forcing an artificial, leaky abstraction across 5
structurally different visualizations — the same "don't force a
uniform shape where the domain doesn't have one" judgment this
catalog already applied when PieChart didn't reuse BarChart's
`xAxisKey` prop in feature 020.

**Alternatives considered**: Forcing every chart into
`ChartBaseProps`. Rejected for ScatterChart/Treemap/Sankey — none of
the three have a "one row = one x-axis category, N series columns"
shape Recharts itself expects, so faking it would require a
translation layer with no real benefit.

## R2: ChartLegend/ChartDataTable compatibility with non-standard shapes

**Decision**: ComposedChart, ScatterChart, and FunnelChart all
synthesize a `ChartSeries[]`-shaped list for `ChartLegend`/
`ChartDataTable` reuse (ComposedChart uses its own series list
directly; ScatterChart maps `series` to `{key, label}` pairs;
FunnelChart synthesizes one entry per stage row, exactly like
PieChart already does for its own legend in feature 020). Treemap and
Sankey do NOT get a legend (no meaningful "toggle a series" concept
for a hierarchy or a flow graph) — they still get `ChartFrame`'s
accessible data-table toggle, with `ChartDataTable` fed a flattened
representation (Treemap: `{name, value}` per node, ignoring nesting
for the table view; Sankey: `{name: "source → target", value}` per
link).

**Rationale**: The legend's job (toggle a series' visibility) doesn't
map onto a hierarchy or a flow graph's actual interaction model — a
"legend" for either would be inventing a UI ChartLegend was never
designed for, per Constitution Principle I (visual hierarchy that
matches domain meaning, not decoration for its own sake).

**Alternatives considered**: Giving Treemap/Sankey a legend showing
every node. Rejected — with dozens of nodes this becomes noise, not a
navigation aid, unlike a 3-8-series chart's legend.

## R3: Secondary Y-axis (ComposedChart, FR-001's edge case)

**Decision**: `ComposedSeriesConfig.yAxisId` is optional, defaulting
to a single shared axis when omitted — only charts that actually need
two disparate value ranges (spec.md's stated edge case) opt in by
setting `yAxisId: "right"` on the series that needs it. `ComposedChart`
renders a second `<YAxis yAxisId="right" orientation="right"
stroke="rgb(var(--color-neutral-600))">` only when at least one series
requests it, keeping the single-axis case identical to BarChart's
existing simplicity.

**Rationale**: Matches Recharts' own idiomatic mechanism (`yAxisId`)
rather than inventing a scaling/normalization layer this catalog would
then have to maintain.

## R4: Reduced-motion and color-token reuse (unchanged from feature 020)

**Decision**: All 5 new components call `usePrefersReducedMotion()`
and pass `isAnimationActive={!prefersReducedMotion}` to every
Recharts sub-element that accepts it (`Bar`, `Line`, `Area`, `Scatter`,
`Funnel`, `Treemap`'s built-in animation, Sankey's link animation),
exactly matching feature 020's existing 6 chart types. Colors come
from the same `useChartColors().colorForSlot()` — now correctly
resolving real RGB values thanks to the design-sync-discovered
`packages/react/src/styles.css` fix (see
`.design-sync/NOTES.md`'s 2026-07-13 entry) rather than the
`rgb()`-with-empty-string bug that silently rendered every prior chart
type in solid black until that fix landed.

**Rationale**: No new decision needed here — this is a direct
continuation of feature 020's already-ratified pattern, now on a
correctly-functioning color foundation.

**Alternatives considered**: None — this is established precedent,
not a new choice.

## Summary

- 5 new chart types, each mapped to its actual Recharts data contract
  rather than a forced uniform shape.
- Legend/data-table reuse extended where the domain supports it
  (Composed, Scatter, Funnel); deliberately omitted where it wouldn't
  (Treemap, Sankey — flattened data table only, no legend).
- Secondary Y-axis via Recharts' own `yAxisId` mechanism, opt-in per
  series.
- Zero new dependencies, zero new tokens, zero new shared chrome.
