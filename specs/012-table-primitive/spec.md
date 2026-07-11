# Feature Specification: Table Primitive

**Feature Branch**: `012-table-primitive`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Build Table as a real, standalone static HTML + Tailwind component, closing the catalog gap discovered during feature 011's planning: the constitution documents a Tables pattern (header bg-neutral-50 text-xs font-semibold text-neutral-600 uppercase tracking-wider, zebra striping even:bg-neutral-50, divide-y divide-neutral-200, cells px-6 py-4) but it was never actually built as a component — the identical 'documented but never built' defect Lists had before feature 011."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scannable tabular data (Priority: P1)

A product team building an admin dashboard or data-heavy page needs to
display rows of structured records (e.g. a user list, an order
history) in column-aligned form with a clearly distinguished header,
matching the rest of the design system without hand-rolling spacing,
borders, or header styling.

**Why this priority**: This is the MVP — the baseline tabular
presentation every other variant builds on.

**Independent Test**: Can be fully tested by rendering a table with a
header row and 4+ data rows and verifying the header is visually and
semantically distinguished (`<th>`, `scope="col"`), text passes AAA
contrast, and cell padding/borders match the ratified pattern.

**Acceptance Scenarios**:

1. **Given** a table with a header row and multiple data rows, **When**
   the page renders, **Then** the header shows `bg-neutral-50`
   uppercase small-caps-style text and each `<th>` has `scope="col"`.
2. **Given** the table's semantic markup, **When** an axe-core scan
   runs, **Then** there are zero violations (proper `<table>`/`<thead>`/
   `<tbody>`/`<th>`/`<td>` structure, not `<div>` soup).

---

### User Story 2 - Zebra-striped rows for scannability (Priority: P2)

A product team with a long table (10+ rows) needs alternating row
backgrounds so users can visually track a row across many columns
without losing their place.

**Why this priority**: A common, valuable enhancement over the P1
baseline, but the table is fully functional and shippable without it.

**Independent Test**: Can be fully tested by rendering a table with the
zebra-striping variant and verifying every other row has a
distinguishable background color via computed style.

**Acceptance Scenarios**:

1. **Given** a zebra-striped table, **When** the page renders, **Then**
   every even-indexed data row has a `bg-neutral-50` background distinct
   from the odd rows' `bg-white`.

---

### User Story 3 - Row with a trailing action (Priority: P3)

A product team needs each row to end with an action (e.g. an "Edit"
link, a status Badge) without breaking column alignment or introducing
a nested-interactive-control accessibility issue.

**Why this priority**: A common real-world composition (matching
Lists' own User Story 3, feature 011) but not required for the MVP.

**Independent Test**: Can be fully tested by rendering a table with a
trailing action cell (Badge and a text link) and confirming correct
alignment and zero accessibility violations.

**Acceptance Scenarios**:

1. **Given** a row with a trailing status Badge, **When** the page
   renders, **Then** the Badge reuses the already-ratified Badge
   classes verbatim (no new Badge CSS).
2. **Given** a row with a trailing text link ("Edit"), **When** an
   axe-core scan runs, **Then** the link has a non-empty accessible
   name and there is no nested-interactive-control violation (the link
   is the only interactive element in its cell, not nested inside
   another one).

---

### Edge Cases

- What happens when a cell's content is empty? The cell renders with
  its normal padding, not collapsed, so the row's height/alignment
  stays consistent with populated rows.
- What happens when a cell's content is long enough to overflow its
  column? Content truncates with an ellipsis (matching Lists' own
  `truncate` precedent, feature 011) rather than breaking the table's
  layout or wrapping unpredictably.
- How does the table behave on narrow (320px) viewports? Native
  `<table>` overflow is handled via a horizontally-scrollable wrapper
  (`overflow-x-auto`) rather than attempting a responsive
  column-collapse redesign, which is out of scope for this feature.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a real `<table>`/`<thead>`/`<tbody>`/
  `<th>`/`<td>` semantic structure — not `<div>`-based tabular styling —
  expressed via Tailwind `@apply` blocks (no raw utility soup, no
  hardcoded colors).
- **FR-002**: Header cells MUST use `scope="col"` and the ratified
  header style (`bg-neutral-50 text-left text-xs font-semibold
  text-neutral-600 uppercase tracking-wider`), verified to pass WCAG AAA
  (7:1) against its background via the WCAG relative-luminance formula.
- **FR-003**: Rows MUST use `divide-y divide-neutral-200` for
  separators; cells MUST use `px-6 py-4` padding, per the ratified
  pattern.
- **FR-004**: System MUST provide an optional zebra-striping variant
  (`even:bg-neutral-50` on data rows) as a separate, composable option
  from the baseline table (User Story 2).
- **FR-005**: System MUST support an optional trailing-action cell
  (Badge or text link) that does not introduce a nested-interactive-
  control violation (User Story 3).
- **FR-006**: System MUST expose the baseline, zebra-striped, and
  trailing-action variants in the component gallery (`index.html`) and
  as a standalone route registered in `vite.config.ts`'s
  `rollupOptions.input`, per this project's established per-component
  demo convention.
- **FR-007**: System MUST pass zero axe-core accessibility violations
  in all variants.
- **FR-008**: On narrow viewports, the table MUST remain usable via
  horizontal scroll (`overflow-x-auto` wrapper) rather than clipping or
  breaking layout.
- **FR-009**: System MUST update the Component Catalog's Tables entry
  in the constitution to reflect the actually-shipped class names and
  remove the "documented but never built" gap note, once this feature
  ships.

### Key Entities

- **Table**: A semantic `<table>` container wrapped in an
  `overflow-x-auto` div for narrow-viewport scrolling.
- **Table Row**: A `<tr>` inside `<tbody>`; optionally zebra-striped
  (even rows) or plain.
- **Table Cell**: A `<td>` (data) or `<th scope="col">` (header); may
  contain an optional trailing action (Badge or link) in its last
  column.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Header and cell text pass WCAG AAA contrast (7:1),
  verified via the WCAG relative-luminance formula in this project's
  existing contrast audit script.
- **SC-002**: All three variants (baseline, zebra-striped, trailing-
  action) render with zero axe-core accessibility violations.
- **SC-003**: The component's visual appearance matches its Playwright
  baseline across 320/768/1024/1440px viewports with zero unintended
  drift to any other existing component's baseline.
- **SC-004**: A screen-reader user can navigate the table by row/column
  using native table semantics (no ARIA table-role reimplementation
  needed, since real `<table>` markup is used).

## Assumptions

- No sorting, filtering, or pagination interaction is in scope — this
  is a purely presentational primitive, matching the "primitive, not
  a data-grid" framing used for every other component in this catalog
  (e.g. Pagination is a separate, already-shipped component that could
  be composed alongside Table, not merged into it).
- No React port is included in this feature — deferred to the
  subsequent React-port batch feature per the user's explicit scoping.
- Column count/content is left to the consuming page; this feature
  ships a representative demo (e.g. Name/Email/Role/Status columns)
  rather than a fixed schema.
