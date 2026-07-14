# Feature Specification: Recharts Additional Chart Types (Batch 2)

**Feature Branch**: `024-recharts-additional-charts`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "implemente todos os tipos de gráficos
possiveis do recharts."

(Translation: implement all possible chart types from Recharts.)

**Relationship to feature 020**: feature 020 ("Recharts-Based Chart
Primitives") shipped 6 chart types — Line, Bar, Area, Pie/Donut, Radar,
Radial — plus a shared Tooltip/Legend/Empty-State/accessible-data-table
chrome, and explicitly recorded the remaining Recharts chart types as
"out of scope for this feature and remain open for a future extension
if a concrete need arises" (020/spec.md Assumptions). This feature is
that extension: it ships every remaining native Recharts top-level
chart component, closing full Recharts chart-type coverage. One
correction to 020's own Assumptions: it listed "Candlestick" among the
deferred types, but Recharts has no native Candlestick chart component
— a candlestick visualization would require composing custom shapes on
top of `ComposedChart`/`BarChart`, which is a distinct, much larger
scope decision than "ship the remaining native chart type" and is
explicitly NOT part of this feature (see Assumptions).

**Scope note**: per Recharts' own documented top-level chart
components, the full set is: AreaChart, BarChart, LineChart,
ComposedChart, PieChart, RadarChart, RadialBarChart, ScatterChart,
Treemap, Sankey, and FunnelChart — 11 total. Feature 020 shipped 6; this
feature ships the remaining 5: **ComposedChart, ScatterChart,
FunnelChart, Treemap, and Sankey**.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Combined and Correlation Charts (Priority: P1)

A user building a dashboard needs to either (a) combine more than one
visual encoding in a single chart (e.g. a bar series for volume plus a
line series for a trend, sharing one axis), or (b) visualize the
correlation or distribution between two numeric variables as individual
plotted points. They use a Composed Chart or a Scatter Chart, styled
and themed identically to every chart from feature 020.

**Why this priority**: Both are broadly applicable, general-purpose
chart types (a composed bar+line chart is one of the single
most-requested dashboard patterns; scatter plots are a standard
statistical/correlation visualization) — the same "broadly useful"
bar feature 020's own P1 story used.

**Independent Test**: Can be fully tested by dropping a Composed Chart
(combining at least two series types) and a Scatter Chart into a page
with representative datasets, switching the active theme, and
confirming both re-color automatically and remain readable at every
supported breakpoint — independent of Stories 2-3.

**Acceptance Scenarios**:

1. **Given** a Composed Chart configured with one bar series and one
   line series sharing the same category axis, **When** it renders,
   **Then** both series are visually distinguishable and correctly
   aligned to the same axis.
2. **Given** a Scatter Chart configured with a set of (x, y) data
   points, **When** it renders, **Then** each point is plotted at its
   correct coordinate and remains individually distinguishable from
   nearby points.
3. **Given** either chart rendered under the design system's default
   theme, **When** the user switches to a different theme preset,
   **Then** its colors update automatically, matching feature 020's
   existing re-theming behavior exactly.

---

### User Story 2 - Funnel/Conversion Visualization (Priority: P2)

A user analyzing a multi-step process (e.g. a signup or checkout
conversion funnel) needs to visualize how a starting volume narrows at
each subsequent stage. They use a Funnel Chart.

**Why this priority**: A common, well-defined analytics/SaaS-dashboard
need, but narrower in applicability than Story 1's general-purpose
types.

**Independent Test**: Can be fully tested independently of Stories 1
and 3 by dropping a Funnel Chart into a page with a representative
multi-stage dataset and confirming each stage renders proportionally
and remains individually labeled and distinguishable.

**Acceptance Scenarios**:

1. **Given** a Funnel Chart configured with a decreasing multi-stage
   dataset (e.g. Visitors → Signups → Purchases), **When** it renders,
   **Then** each stage is sized proportionally to its value and labeled
   with both its name and value.
2. **Given** a Funnel Chart stage with a value of zero, **When** it
   renders, **Then** that stage does not produce a rendering error
   (matching feature 020's existing "zero-value slice" precedent for
   Pie/Donut Chart).

---

### User Story 3 - Hierarchical and Flow Visualization (Priority: P3)

A user needs to visualize either (a) a hierarchical, part-of-whole
dataset with nested categories (e.g. disk usage by folder, budget
allocation by department and sub-team), or (b) a flow of quantities
between named stages/nodes (e.g. traffic moving between referral
sources and conversion outcomes). They use a Treemap or a Sankey
diagram.

**Why this priority**: The most specialized pair of the remaining
Recharts chart types — genuinely useful for the specific hierarchical/
flow-visualization need, but narrower in general applicability than
Stories 1-2, matching feature 020's own P2-vs-P1 reasoning for its more
specialized Radar/Radial pair.

**Independent Test**: Can be fully tested independently of Stories 1-2
by dropping a Treemap with a nested dataset and a Sankey diagram with a
node/link dataset into a page and confirming both render correctly,
re-theme, and remain accessible.

**Acceptance Scenarios**:

1. **Given** a Treemap configured with a nested (parent/child) dataset,
   **When** it renders, **Then** each node's rectangle area is
   proportional to its value and nested categories are visually
   distinguishable from their parent.
2. **Given** a Sankey diagram configured with a set of named nodes and
   weighted links between them, **When** it renders, **Then** each
   link's width is proportional to its value and every node is legibly
   labeled.

---

### Edge Cases

- What happens when a Composed Chart's two series have very different
  value ranges (e.g. one series in the single digits, another in the
  thousands)? It MUST support a secondary/independent axis so neither
  series is rendered illegibly flat.
- What happens when a Scatter Chart's dataset contains overlapping or
  near-identical points? They MUST remain distinguishable via the
  shared tooltip (feature 020's existing chrome), even where the visual
  marks themselves nearly coincide — the same requirement feature 020
  already established for its own overlapping-series edge case.
- What happens when a Funnel Chart's stages are NOT monotonically
  decreasing (e.g. a data error produces a later stage larger than an
  earlier one)? The chart MUST still render each stage at its actual
  proportional size rather than erroring — a funnel shape is a
  visualization convention, not a data validation step this component
  performs.
- What happens when a Treemap's dataset has only one top-level node?
  It MUST still render meaningfully (filling the available area), not
  error or render blank — the same "single data point" bar feature 020
  set for its own core chart types.
- What happens when a Sankey diagram's link data references a node
  that isn't defined? This MUST be treated as a caller data error
  (documented, not silently handled) — this feature does not add data
  validation beyond what Recharts itself provides.
- How does the system handle reduced-motion preferences for these 5
  chart types? Same as feature 020's existing 6 — animation MUST be
  disabled or substantially reduced.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Composed Chart component supporting
  at least two different series-rendering types (e.g. bar + line, or
  area + line) sharing one or more axes, including an optional
  secondary Y-axis for series with disparate value ranges.
- **FR-002**: System MUST provide a Scatter Chart component for
  visualizing individual (x, y) data points, supporting more than one
  named series plotted on the same axes.
- **FR-003**: System MUST provide a Funnel Chart component for
  visualizing a multi-stage, narrowing (or arbitrary) sequence of
  proportional values, with each stage labeled by name and value.
- **FR-004**: System MUST provide a Treemap component for visualizing a
  hierarchical, nested dataset as proportionally-sized, nested
  rectangles.
- **FR-005**: System MUST provide a Sankey diagram component for
  visualizing weighted flow between named nodes.
- **FR-006**: All 5 chart components in this feature MUST derive their
  colors from the same design-system theme-token palette feature 020's
  6 chart types already use (`chartColorPalette.ts`), so switching the
  active theme preset re-colors these charts automatically too — no
  second, parallel color mechanism.
- **FR-007**: All 5 chart components MUST reuse feature 020's existing
  shared Tooltip, Legend, Empty State, and accessible-data-table chrome
  rather than each reimplementing its own — the same "consistent
  regardless of chart type" requirement feature 020 established
  (020/spec.md FR-014/FR-015), now extended to these 5 additional types.
- **FR-008**: All 5 chart components MUST meet the design system's
  existing WCAG AAA text-contrast and 3:1 non-text contrast standards.
- **FR-009**: All 5 chart components MUST resize to fill their
  container's available width/height responsively, remaining readable
  at the design system's supported breakpoints.
- **FR-010**: All 5 chart components MUST render a clear "no data"
  state when given an empty dataset (reusing feature 020's existing
  Empty State component), rather than a blank or broken chart area.
- **FR-011**: All 5 chart components MUST disable or substantially
  reduce entrance/transition animation when the user has a
  reduced-motion preference set (reusing feature 020's existing
  reduced-motion handling).
- **FR-012**: All 5 chart components MUST NOT rely on color alone to
  distinguish data series/nodes/stages — each MUST remain interpretable
  via labels, the shared tooltip, and/or the shared legend.

### Key Entities

- **Composed Chart / Scatter Chart / Funnel Chart / Treemap / Sankey
  Diagram**: five additional Chart Component instances (per feature
  020's existing Key Entities definition), extending that same entity
  rather than introducing a parallel one.
- **Sankey Node / Sankey Link**: Sankey-specific data shapes — a named
  node and a weighted, directed connection between two nodes.
- **Treemap Node**: a hierarchical data shape — a named value with
  optional nested child Treemap Nodes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add any of this feature's 5 chart types to a
  page and see a correctly rendered, on-theme chart with zero manual
  color configuration, identical to feature 020's existing behavior.
- **SC-002**: Every chart in this feature automatically reflects a
  theme-preset change within the same interaction that changes the
  theme elsewhere on the page.
- **SC-003**: 100% of this feature's 5 chart components meet the design
  system's existing WCAG AAA text-contrast and 3:1 non-text contrast
  bar, with zero regressions to feature 020's existing 6 chart types.
- **SC-004**: A screen reader user can access the complete underlying
  data of any of this feature's 5 charts, via the same accessible
  data-table mechanism feature 020 already ships.
- **SC-005**: This feature completes full coverage of Recharts' 11
  native top-level chart components — combined with feature 020's 6,
  all 11 are shipped, with zero remaining deferred Recharts chart type.
- **SC-006**: A user resizing their browser window sees every visible
  chart from this feature adapt to its new container size within the
  same render pass, matching feature 020's existing responsive
  behavior.

## Assumptions

- **Same React-only exception as feature 020**: Recharts has no
  framework-independent rendering path, so these 5 chart types ship in
  the React package only, with the static HTML gallery cross-referencing
  the React demo (feature 020's already-established, documented
  exception — not a new one).
- **Candlestick is explicitly NOT in scope**: unlike the other 5 types,
  a candlestick chart has no native Recharts component — it would
  require composing custom SVG shapes on top of `ComposedChart`/
  `BarChart` with high/low/open/close semantics, a materially larger,
  separate scope decision. Feature 020's Assumptions section
  incorrectly implied it was a deferred native type; this feature
  corrects that record rather than propagating the error.
- **No new npm dependency**: all 5 chart types are already part of the
  `recharts` package this catalog adopted in feature 020 — this feature
  adds zero new dependencies (Principle VII not triggered).
- **Sankey/Treemap data shape**: caller-supplied, matching Recharts' own
  documented `data`/`nodes`/`links` shapes for these two components —
  this feature does not add a data-transformation or validation layer
  beyond what Recharts itself provides (see Edge Cases).
- **This completes the "Chart" catalog gap's full scope**: with all 11
  native Recharts chart types shipped across features 020 and 024, no
  further Recharts chart-type extension is anticipated; any future
  charting request beyond this (e.g. Candlestick, live/streaming data)
  would be a new, separately-scoped feature.
