# Component Contract: Core Charts (Line, Bar, Area, Pie/Donut) — User Story 1

## Components
`LineChart`, `BarChart`, `AreaChart` (with a `stacked` boolean prop for the
stacked-area variant, FR-003), `PieChart` (with a `donut` boolean prop
controlling `innerRadius`).

## Props (shared shape, see data-model.md ChartComponent)
- `data: Array<Record<string, string | number | null>>` (required)
- `series: Array<{ key: string; label: string }>` (required)
- `xAxisKey: string` (required for Line/Bar/Area) / `categoryKey: string`
  (required for Pie/Donut)
- `ariaLabel: string` (required)
- `showTooltip?: boolean` (default `true`) — composes `ChartTooltip`
- `showLegend?: boolean` (default `true`) — composes `ChartLegend`

## Markup contract
- Root: `<figure role="img" aria-label={ariaLabel} aria-describedby={tableId}>`
  wrapping a Recharts `<ResponsiveContainer>`.
- A visually-hidden `ChartDataTable` with `id={tableId}` immediately follows
  the SVG inside the same `<figure>`.
- `data.length === 0` renders `ChartEmptyState` in place of the
  `ResponsiveContainer`/`ChartDataTable` pair (FR-012).

## Required behavior (Principle II / FR mapping)
- Colors: every `<Line>`/`<Bar>`/`<Area>`/`<Cell>` `stroke`/`fill` prop reads
  from `useChartColors()`, indexed by each series' `colorSlot` — FR-007/FR-008.
- Animation: `isAnimationActive={!prefersReducedMotion}` on every animated
  Recharts child — FR-013.
- Null handling: Line/Area MUST render a visual gap (Recharts'
  `connectNulls={false}`, the library default) for a `null` value mid-series
  — never silently interpolated — per spec.md Edge Cases.
- Pie/Donut zero-value slice: a series value of `0` MUST produce a
  zero-width slice, not a rendering error — per spec.md Edge Cases (Recharts'
  default behavior for a `0` value; verify empirically in Phase 3, no known
  workaround needed).
- Responsive resize: `ResponsiveContainer` fills 100% of its parent; no
  fixed pixel width/height is ever hardcoded by the consumer — FR-011/SC-006.

## Acceptance mapping
- Spec.md US1 AC1–AC5 → this contract's markup + null/zero/empty-state rules
  above.
- FR-001–FR-004, FR-007, FR-008, FR-011, FR-012, FR-013, FR-016 → this
  contract.
