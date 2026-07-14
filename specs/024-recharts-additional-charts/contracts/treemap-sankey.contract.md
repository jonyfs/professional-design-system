# Component Contract: Treemap & Sankey Diagram (User Story 3)

## Treemap

- Props: `data: TreemapNode[]`, `ariaLabel: string`, `showTooltip?` —
  no `showLegend` (research.md R2: no meaningful legend for a
  hierarchy).
- Markup: `<ChartFrame>` → `<ResponsiveContainer>` →
  `<RechartsTreemap data={data} dataKey="value" nameKey="name"
  isAnimationActive={!prefersReducedMotion}>`, each node's fill from
  `colorForSlot()` keyed by its position among its siblings (top-level
  nodes get distinct colors; nested children shade from their
  parent's color — Recharts' own `content` render-prop customization
  point, not a new color mechanism).
- `ChartDataTable` fed a flattened `{name, value}` row per node
  (parents included, showing their aggregate value; nesting depth not
  represented in the flat table — this is an accepted simplification,
  documented here rather than silently omitted).
- A single top-level node (spec.md Edge Cases) still renders,
  filling the available area — no error, no special-case code needed
  since Recharts' own layout algorithm already handles a length-1
  array correctly.
- Empty `data` → `ChartEmptyState`.

## Sankey Diagram

- Props: `nodes: SankeyNode[]`, `links: SankeyLink[]`, `ariaLabel:
  string`, `showTooltip?` — no `showLegend` (same reasoning as
  Treemap).
- Markup: `<ChartFrame>` → `<ResponsiveContainer>` →
  `<RechartsSankey data={{nodes, links}}
  isAnimationActive={!prefersReducedMotion}>`. Node rectangles and
  link ribbons both derive their fill from `colorForSlot()`, keyed by
  node index.
- Every node is labeled (Recharts' default Sankey node label,
  positioned per its own layout algorithm) — spec.md US3 AC2's
  "legibly labeled" requirement.
- `ChartDataTable` fed one `{name: "<source> → <target>", value}` row
  per link (research.md R2) — a caller-facing, screen-reader-legible
  summary of the flow, not a literal node/link graph representation
  (which has no meaningful flat-table equivalent).
- A `link` referencing an out-of-range `source`/`target` index is
  passed through to Recharts as-is — a caller data error, not
  something this component validates or catches (spec.md Edge Cases).
- Empty `nodes`/`links` → `ChartEmptyState`.

## Acceptance mapping

- Spec.md US3 AC1–AC2 → this contract.
- FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011,
  FR-012 → this contract.
