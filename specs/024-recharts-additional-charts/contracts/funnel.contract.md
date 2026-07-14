# Component Contract: Funnel Chart (User Story 2)

- Props: `data: FunnelStageDatum[]` (`{name, value}[]`), `ariaLabel:
  string`, `showTooltip?`, `showLegend?` — the exact same prop shape
  as `PieChart` (research.md R1: Funnel has no multi-series concept,
  same as Pie).
- Markup: `<ChartFrame>` → `<ResponsiveContainer>` →
  `<RechartsFunnelChart>` → `<Funnel data={data} dataKey="value"
  nameKey="name" isAnimationActive={!prefersReducedMotion}>`, one
  `<Cell fill={colorForSlot(i)}>` per stage (mirroring PieChart's
  per-slice `Cell` pattern exactly), plus Recharts' `<LabelList
  dataKey="name">` so each stage shows its own name/value directly on
  the funnel, not only in the legend.
- `ChartLegend`/`ChartDataTable` reuse: one synthesized series entry
  per stage (`{key: name, label: name}`), same pattern `PieChart`
  already uses for its own per-slice legend.
- A stage with `value: 0` renders as a zero-height segment, not an
  error (spec.md US2 AC2) — the same "zero-value slice" handling
  PieChart's donut/pie already exhibits, since Recharts computes both
  from the same underlying proportional-sizing logic.
- Non-monotonic stage data (spec.md Edge Cases) renders each stage at
  its actual proportional size — no reordering, no validation, no
  error.
- Empty `data` → `ChartEmptyState`.

## Acceptance mapping

- Spec.md US2 AC1–AC2 → this contract.
- FR-003, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012 →
  this contract.
