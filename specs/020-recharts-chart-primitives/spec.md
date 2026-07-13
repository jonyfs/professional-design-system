# Feature Specification: Recharts-Based Chart Primitives

**Feature Branch**: `[020-recharts-chart-primitives]`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "adicione componentes de rechars para a parte de gráficos deste Design System."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Chart Types for Trends, Comparisons & Composition (Priority: P1)

A user assembling a dashboard or reporting page needs to visualize a
dataset — a trend over time, a comparison across categories, or how a
whole breaks into parts. They drop in a Line Chart, Bar Chart, Area
Chart, or Pie/Donut Chart, feed it a data series, and get back a chart
that already matches the design system's colors, typography, and
spacing — no manual color picking, no fighting default styling, and no
separate accessibility work, because the chart automatically re-colors
itself when the active theme changes and already ships with a
non-visual data alternative for screen reader users.

**Why this priority**: Chart/data visualization has been an explicitly
flagged, deliberately deferred catalog gap since this project's
feature-014 research phase and remained deferred through features 015
and 016 — it is this catalog's single most requested and longest-open
gap. These four chart types cover the large majority of real-world
dashboard/reporting needs (trend-over-time, categorical comparison,
volume-over-time, and part-of-whole), so shipping only this story
already delivers a complete, usable MVP.

**Independent Test**: Can be fully tested by dropping each of the four
chart components into a page with a small representative dataset,
switching the active design-system theme, and confirming the chart
re-colors automatically, remains readable at each supported viewport
width, and exposes an accessible non-visual equivalent of its data —
without any other component in this feature existing yet.

**Acceptance Scenarios**:

1. **Given** a Line Chart configured with a multi-point time-series
   dataset, **When** the chart renders, **Then** it draws a readable
   line plot with labeled axes and each data point remains
   distinguishable at the catalog's supported breakpoints.
2. **Given** any chart in this feature rendered under the design
   system's default theme, **When** the user switches to a different
   theme preset, **Then** every chart color updates to match the new
   theme without a page reload or manual reconfiguration.
3. **Given** a Bar Chart or Pie/Donut Chart with more data series than
   the design system's chart color palette has distinct colors for,
   **When** the chart renders, **Then** every series remains visually
   distinguishable (not two series silently sharing one indistinguishable
   color).
4. **Given** any chart in this feature, **When** a screen reader user
   reaches it, **Then** they receive a text-based summary or equivalent
   data table of the same information the chart displays visually.
5. **Given** a chart with an empty dataset, **When** it renders,
   **Then** it shows a clear "no data" state rather than a blank or
   broken chart area.

---

### User Story 2 - Extended Chart Types for Specialized Comparisons (Priority: P2)

A user needs to visualize multi-dimensional comparisons (e.g. comparing
several categories across several attributes at once) or a single
metric against a target/range. They use a Radar Chart or a Radial
("gauge-style") Chart, styled consistently with the P1 chart types.

**Why this priority**: Less universally needed than Story 1's four core
types, but a common secondary requirement in dashboard/analytics
contexts (e.g. skill comparisons, performance-vs-target gauges) that
would otherwise force teams to reach for an ad hoc, uncoordinated
charting solution outside the design system.

**Independent Test**: Can be fully tested independently of Story 1 by
dropping a Radar Chart and a Radial Chart into a page with representative
data and confirming they render correctly, re-theme with the active
preset, and remain accessible — the same bar this feature's core charts
must clear.

**Acceptance Scenarios**:

1. **Given** a Radar Chart configured with a multi-attribute dataset,
   **When** it renders, **Then** each attribute axis is labeled and each
   data series is visually distinguishable.
2. **Given** a Radial Chart configured with a single value and a target
   range, **When** it renders, **Then** the current value's position
   relative to the range is unambiguous without relying on color alone.

---

### User Story 3 - Shared Interactive Chart Chrome (Priority: P3)

A user viewing any chart in this feature wants to inspect exact values
on hover/focus (tooltip) and selectively show or hide individual data
series (legend), with both behaving consistently across every chart
type in this feature rather than each chart reinventing its own
interaction pattern.

**Why this priority**: A quality-of-life layer on top of Stories 1-2 —
valuable for real dashboard usage but not required for a chart to be
useful on first render, so it is sequenced after the core visual types
exist.

**Independent Test**: Can be fully tested independently by adding the
shared tooltip and legend to an already-rendered chart from Story 1 or
2 and confirming hover/focus reveals exact values and legend toggles
correctly hide/show the corresponding series, with both behaviors
identical regardless of which chart type they're attached to.

**Acceptance Scenarios**:

1. **Given** a chart with the shared tooltip enabled, **When** a user
   hovers or keyboard-focuses a data point, **Then** a tooltip shows
   that point's exact value and label.
2. **Given** a chart with the shared legend enabled, **When** a user
   clicks/activates one legend entry, **Then** that entry's data series
   is hidden from the chart and the legend entry visually reflects its
   now-hidden state; activating it again restores the series.

---

### Edge Cases

- What happens when a chart is given a dataset with a single data
  point? It MUST still render meaningfully (e.g. a single bar/point),
  not error or render blank.
- What happens when a chart's container is resized (e.g. a responsive
  layout, a sidebar toggling open/closed)? The chart MUST resize to
  fill its new container dimensions without becoming distorted or
  overflowing.
- How does the system handle a dataset containing a null/missing value
  partway through a series (e.g. one missing month in a 12-month trend)?
  The gap MUST be visually represented (e.g. a break in the line) rather
  than silently interpolated or causing a rendering error.
- How does a Pie/Donut Chart handle a series value of zero? The
  corresponding slice MUST simply not appear (zero-width), not produce a
  rendering error.
- How does the system handle reduced-motion user preferences during any
  chart entrance/transition animation? Animation MUST be disabled or
  substantially reduced when the user has requested reduced motion.
- What happens when two data series in the same chart happen to share
  a very similar value at a given point (e.g. two lines nearly
  overlapping)? Both MUST remain individually identifiable via the
  shared tooltip/legend, even where the visual marks themselves nearly
  coincide.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Line Chart component for
  visualizing one or more series of values across an ordered axis (most
  commonly time).
- **FR-002**: System MUST provide a Bar Chart component for comparing
  discrete values across categories, supporting more than one data
  series per category.
- **FR-003**: System MUST provide an Area Chart component for
  visualizing volume or magnitude trends across an ordered axis,
  including a stacked variant for showing how multiple series
  contribute to a total over that axis.
- **FR-004**: System MUST provide a Pie/Donut Chart component for
  visualizing how a whole breaks down into parts.
- **FR-005**: System MUST provide a Radar Chart component for comparing
  multiple data series across several shared attributes/axes at once.
- **FR-006**: System MUST provide a Radial ("gauge-style") Chart
  component for visualizing a single value's position within a defined
  range or against a target.
- **FR-007**: Every chart component in this feature MUST derive its
  colors from the design system's existing theme tokens, so that
  switching the active theme preset re-colors every chart automatically
  without per-chart reconfiguration.
- **FR-008**: System MUST provide a defined chart color palette with
  enough visually distinguishable colors that a chart with a typical
  number of data series (up to at least 6) never assigns the same
  color to two different series; if a chart exceeds the palette's
  distinct-color count, colors MUST cycle in a way that remains
  distinguishable via the shared tooltip/legend even if two series
  visually share a color.
- **FR-009**: Every chart component in this feature MUST provide a
  non-visual, text-based equivalent of its underlying data (e.g. an
  accessible summary or a linked data table), so a screen reader user
  can access the same information a sighted user gets from the chart.
- **FR-010**: Every chart component in this feature MUST meet the
  design system's existing WCAG AAA text-contrast and 3:1 non-text
  contrast standards for all labels, axis text, and chart marks.
- **FR-011**: Every chart component in this feature MUST resize to fill
  its container's available width/height responsively, remaining
  readable at the design system's supported breakpoints.
- **FR-012**: Every chart component in this feature MUST render a
  clear "no data" state when given an empty dataset, rather than a
  blank or broken chart area.
- **FR-013**: Every chart component in this feature MUST disable or
  substantially reduce entrance/transition animation when the user has
  a reduced-motion preference set.
- **FR-014**: System MUST provide a shared tooltip that, on hover or
  keyboard focus of a data point, displays that point's exact value and
  label, usable consistently across every chart type in this feature.
- **FR-015**: System MUST provide a shared legend that lets a user
  toggle the visibility of an individual data series on the chart, with
  the legend entry visually reflecting whether its series is currently
  shown or hidden.
- **FR-016**: System MUST NOT rely on color alone to distinguish data
  series or convey a chart's meaning — every chart MUST remain
  interpretable via labels, the shared tooltip, and/or the shared legend
  even for a user who cannot perceive color differences.

### Key Entities

- **Chart Component**: One instance of a chart type in this feature
  (Line, Bar, Area, Pie/Donut, Radar, or Radial), holding its dataset,
  axis configuration, and rendered dimensions.
- **Data Series**: One named sequence of values within a chart's
  dataset, mapped to one color slot from the chart color palette.
- **Chart Color Palette**: The ordered set of theme-token-derived colors
  every chart draws from when assigning a color to each data series,
  re-evaluated whenever the active theme preset changes.
- **Chart Legend**: The shared, chart-type-independent control that
  lists each data series and lets a user toggle its visibility.
- **Chart Tooltip**: The shared, chart-type-independent control that
  surfaces a data point's exact value and label on hover/focus.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add any of this feature's six chart types to a
  page and see a correctly rendered, on-theme chart with zero manual
  color configuration.
- **SC-002**: Every chart in this feature automatically reflects a
  theme-preset change within the same interaction that changes the
  theme elsewhere on the page — no separate chart-specific step
  required.
- **SC-003**: 100% of this feature's chart components meet the design
  system's existing WCAG AAA text-contrast and 3:1 non-text contrast
  bar, with zero regressions to any previously shipped component.
- **SC-004**: A screen reader user can access the complete underlying
  data of any chart in this feature without relying on the visual
  rendering.
- **SC-005**: This feature closes the "Chart" catalog gap explicitly
  flagged as deferred since this project's feature-014 research phase,
  shipping at least 6 distinct chart types plus 2 shared interactive
  primitives (tooltip, legend).
- **SC-006**: A user resizing their browser window or toggling a
  layout panel sees every visible chart adapt to its new container size
  within the same render pass, with no distorted or overflowing chart
  content at any of the design system's supported breakpoints.

## Assumptions

- **Charting library**: Recharts is the selected underlying charting
  library, per the explicit request in this feature's input. Recharts
  is a React-rendering library with no framework-independent output, so
  this is a deliberate, documented exception to this catalog's
  established convention of shipping every component as both a
  zero-JavaScript static HTML page and a React port — **this feature's
  six chart types and two shared primitives ship in the React package
  only**, with the static HTML gallery instead cross-referencing the
  React documentation/demo for these entries rather than providing an
  equivalent standalone static page.
- **Chart type scope**: the six chart types in this feature (Line, Bar,
  Area, Pie/Donut, Radar, Radial) were selected as the most broadly
  useful, industry-standard chart primitives for a general-purpose
  design system — the same core set found across comparable design
  systems' own chart offerings. More specialized chart types (e.g.
  Scatter, Treemap, Sankey, Candlestick) are out of scope for this
  feature and remain open for a future extension if a concrete need
  arises.
- **Color-token integration**: this feature assumes the design system's
  theme-token architecture (introduced by the in-progress Curated Theme
  Presets work) is available to derive a chart-specific color palette
  from, rather than this feature needing to invent its own separate
  theming mechanism.
- **No live/streaming data handling**: this feature covers rendering a
  chart from a dataset already available to the consuming page; live
  data polling, websocket updates, or streaming-data performance
  characteristics are out of scope.
- **Existing accessibility conventions extend to charts**: this feature
  reuses the catalog's established WCAG AAA and reduced-motion
  conventions rather than introducing new ones, adapted specifically to
  data-visualization content (non-visual data equivalents, color-blind-
  safe series distinction).
