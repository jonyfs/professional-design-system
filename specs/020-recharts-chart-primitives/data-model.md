# Phase 1 Data Model: Recharts-Based Chart Primitives

## ChartComponent (abstract shape shared by all 6 chart types)

- **data**: `Array<Record<string, string | number | null>>` — one entry per
  category/time-point; a `null` value for a given series key at a given entry
  represents a missing data point (research.md R1 edge case: rendered as a
  visual gap, e.g. a broken line segment, never interpolated).
- **series**: `Array<{ key: string; label: string }>` — maps each dataset
  field to a display label and, in order, to one `ChartColorPalette` slot.
- **xAxisKey** / **categoryKey**: the dataset field used as the ordered axis
  (Line/Bar/Area) or category dimension (Pie/Donut).
- **width/height**: resolved at render time by Recharts'
  `ResponsiveContainer` from the component's actual DOM container — never a
  fixed prop consumers must set (FR-011).
- **ariaLabel**: required string summarizing the chart's purpose for the
  `role="img"` SVG wrapper and screen-reader users (FR-009).
- Relationship: every `ChartComponent` instance owns exactly one dataset,
  renders exactly one `ChartDataTable` (its non-visual equivalent), and
  optionally composes one `ChartTooltip` and one `ChartLegend`.

## DataSeries

- **key**: the dataset field name this series reads its values from.
- **label**: human-readable name shown in the Legend/Tooltip/data table.
- **colorSlot**: an index into `ChartColorPalette`, assigned in the order
  `series` is declared, cycling if `series.length` exceeds the palette length
  (FR-008).
- **visible**: boolean, toggled by `ChartLegend` (US3 AC2) — hidden series
  are filtered from the rendered chart but remain listed (dimmed) in the
  Legend and absent from the live data table's active columns.

## ChartColorPalette

- An ordered array of 8 color values, each sourced live from one of this
  catalog's existing ratified tokens via `useChartColors()`
  (research.md R2/R3): `brand`, `success`, `warning`, `error`, `info`,
  `brand-dark`, `success-strong`, `info-strong`.
- Re-evaluated whenever `document.documentElement`'s `data-theme` attribute
  changes (feature 017's theme-switching mechanism) — never cached across a
  theme change (FR-007/SC-002).
- Relationship: every `ChartComponent` reads the same singleton palette
  ordering from `useChartColors()`; no chart instance computes its own.

## ChartLegend

- **entries**: derived 1:1 from the owning chart's `series`, each showing its
  `colorSlot`'s swatch, `label`, and current `visible` state.
- Toggling one entry (a real `<button>`, Constitution Principle V) flips
  that `DataSeries.visible` and re-renders the chart with that series
  filtered (US3 AC2) — never removes the entry itself from the legend list.

## ChartTooltip

- Rendered on hover/keyboard-focus of a data point (FR-014); shows every
  currently-`visible` series' exact value and label for that data point,
  sourced directly from `data`/`series` — no separate tooltip-specific data
  copy.

## ChartDataTable (non-visual equivalent, FR-009)

- A visually-hidden (`sr-only`) `<table>` reusing this catalog's existing
  `.data-table`/`.data-table-header-cell`/`.data-table-cell` classes
  (feature 012), with one header column per `DataSeries.label` (plus the
  axis/category column) and one row per `data` entry.
- Linked to the chart's SVG via `aria-describedby` on the `role="img"`
  wrapper (research.md R4).

## ChartEmptyState

- Rendered instead of the SVG/table pair whenever `data.length === 0`
  (FR-012) — a clear, static "no data" message reusing this catalog's
  existing empty-state pattern (Known Catalog Gaps entry ratified in
  v1.11.0), never a blank container.

## Cross-cutting invariants

- No chart component ever passes a hardcoded color literal to a Recharts
  prop — every color originates from `useChartColors()` (Constitution
  Principle IV).
- Every chart's entrance/transition animation is gated by
  `isAnimationActive={!prefersReducedMotion}` (FR-013, research.md R5) — no
  chart type is exempt.
- Every chart renders exactly one of: (a) the SVG + hidden `ChartDataTable`
  pair, or (b) `ChartEmptyState` — never both, never neither.
