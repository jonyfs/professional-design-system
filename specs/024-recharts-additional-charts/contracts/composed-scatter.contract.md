# Component Contract: Composed Chart & Scatter Chart (User Story 1)

## Composed Chart

- Props: `data: ChartDatum[]`, `series: ComposedSeriesConfig[]`,
  `xAxisKey: string`, `ariaLabel: string`, `showTooltip?`,
  `showLegend?` (data-model.md).
- Markup: `<ChartFrame ariaLabel={ariaLabel} tableId={tableId}>` wraps
  a `<ResponsiveContainer>` → `<RechartsComposedChart data={data}>`
  with `<CartesianGrid>`, `<XAxis dataKey={xAxisKey}>`, a left
  `<YAxis yAxisId="left">`, and a right `<YAxis yAxisId="right"
  orientation="right">` rendered ONLY when at least one series sets
  `yAxisId: "right"` (research.md R3) — never render an unused second
  axis.
- Per series: `type === "bar"` → `<Bar>`; `type === "line"` →
  `<Line>`; `type === "area"` → `<Area>`; each tagged with its own
  `yAxisId` (defaulting to `"left"`), `fill`/`stroke` from
  `colorForSlot(i)`, and `isAnimationActive={!prefersReducedMotion}`.
- Reuses `ChartLegend`/`ChartDataTable` verbatim, fed the `series`
  list directly (already `ChartSeries`-shaped via the `key`/`label`
  fields `ComposedSeriesConfig` extends).
- Empty dataset → `ChartEmptyState` (same as every existing chart
  type).

## Scatter Chart

- Props: `series: ScatterSeriesConfig[]`, `xAxisLabel: string`,
  `yAxisLabel: string`, `ariaLabel: string`, `showTooltip?`,
  `showLegend?`.
- Markup: `<ChartFrame>` → `<ResponsiveContainer>` →
  `<RechartsScatterChart>` with `<CartesianGrid>`, `<XAxis
  type="number" dataKey="x" name={xAxisLabel}>`, `<YAxis type="number"
  dataKey="y" name={yAxisLabel}>`. One `<Scatter data={s.data}
  fill={colorForSlot(i)}>` per series in `series`.
- `ChartLegend` fed a `{key, label}` list derived from `series`
  (mapping out each series' own `data` array, which `ChartLegend`
  itself never needs).
- `ChartDataTable` fed a flattened `{seriesLabel, x, y}` row per point
  across all series.
- Empty state: all series' `data` arrays empty → `ChartEmptyState`.

## Acceptance mapping

- Spec.md US1 AC1–AC3 → this contract.
- FR-001, FR-002, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011,
  FR-012 → this contract.
