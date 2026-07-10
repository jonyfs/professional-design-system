# Feature Specification: Lists Primitive

**Feature Branch**: `011-lists-primitive`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Implement Lists as a real, standalone static HTML + Tailwind component, closing the known catalog gap flagged during feature 006 (Card): the constitution's existing Lists pattern was documented but never actually built as its own component, and its metadata token (text-neutral-500) actually fails AAA at 4.83:1 — this feature MUST correct that at the source to text-neutral-600."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read-only list of records (Priority: P1)

A product team building a directory or activity feed needs to display a
vertical list of records — each with an avatar, a title, and secondary
metadata (e.g. a timestamp or subtitle) — that visually matches the rest
of the design system without hand-rolling spacing, avatar sizing, or text
color choices.

**Why this priority**: This is the MVP — the simplest, most common use of
a list (e.g. a member directory, a notification feed) and the one every
other variant builds on.

**Independent Test**: Can be fully tested by rendering the static/read-only
list variant and verifying each row correctly shows an avatar, title, and
metadata with AAA-compliant text contrast, with no interactive affordance.

**Acceptance Scenarios**:

1. **Given** a list of 4+ records, **When** the page renders, **Then** each
   row shows an avatar (image or initials fallback), a title in
   `text-neutral-900`, and metadata text that passes WCAG AAA contrast
   (7:1) against its background.
2. **Given** a record with no avatar image available, **When** the row
   renders, **Then** it falls back to the initials-avatar variant
   (reusing the ratified Avatar component verbatim, not a new
   implementation).

---

### User Story 2 - Interactive, navigable list (Priority: P2)

A product team building a settings menu or a clickable directory needs
each row to be a single focusable, clickable target (e.g. navigating to
a detail page) with visible hover and keyboard-focus states, without
nested interactive elements that would break keyboard navigation or
screen-reader semantics.

**Why this priority**: Builds directly on User Story 1's markup; equally
common in real product usage (e.g. "Team members" settings pages) but
depends on the read-only row structure already being correct.

**Independent Test**: Can be fully tested by tabbing through an
interactive list and confirming each row is reachable via keyboard, shows
a visible focus ring, responds to hover, and activates on Enter/Space
without triggering any nested-interactive-element accessibility
violation.

**Acceptance Scenarios**:

1. **Given** an interactive list, **When** a user tabs through the page,
   **Then** each row receives visible keyboard focus in document order.
2. **Given** an interactive row is focused, **When** the user presses
   Enter, **Then** the row's action fires (e.g. navigation), matching
   native `<a>`/`<button>` semantics.
3. **Given** an interactive row, **When** a user hovers over it with a
   mouse, **Then** the row shows a `hover:bg-neutral-50` background
   change, per the already-ratified pattern.

---

### User Story 3 - List row with a trailing action (Priority: P3)

A product team needs a row that pairs the standard avatar/title/metadata
layout with a trailing element — a status badge, a secondary button, or
a "view" chevron — without breaking the row's alignment or, for the
interactive variant, without nesting a second interactive element inside
the row's own clickable target.

**Why this priority**: A common real-world enhancement (e.g. showing a
status Badge next to each list entry) but not required for the MVP; it
composes with either User Story 1 or 2's row.

**Independent Test**: Can be fully tested by rendering a row with a
trailing Badge and a separate row with a trailing chevron-only
affordance, confirming both align correctly and, in the interactive
case, do not introduce a nested-button accessibility violation.

**Acceptance Scenarios**:

1. **Given** a read-only row with a trailing Badge, **When** the page
   renders, **Then** the Badge sits right-aligned and vertically
   centered against the title/metadata block.
2. **Given** an interactive row with a trailing action, **When** axe-core
   scans the page, **Then** there are zero violations for
   nested-interactive-controls.

---

### Edge Cases

- What happens when metadata text is empty? The title-only layout must
  not collapse or misalign the avatar's vertical centering.
- What happens when the title text is long enough to wrap or truncate?
  Long titles truncate with an ellipsis rather than breaking the row's
  fixed height, using the same `truncate` text-overflow token the
  constitution's Tables catalog entry documents (that entry describes a
  ratified pattern, not a shipped component — Table itself has not been
  implemented yet, a separate pre-existing gap out of scope here).
- How does the interactive variant handle a row with a trailing Badge
  that itself looks clickable? The Badge remains non-interactive
  (decorative) inside an interactive row to avoid nested-control
  violations — this is documented as a constraint, not left ambiguous.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a `.list` container and `.list-item`
  row primitive expressed purely via Tailwind `@apply` blocks (no raw
  utility soup in the component markup, no hardcoded hex/rgb colors).
- **FR-002**: Each list item MUST support an avatar slot that reuses the
  already-ratified Avatar component (`.avatar-img`/`.avatar-fallback`,
  feature 006) verbatim — this feature does not reimplement or fork
  avatar styling.
- **FR-003**: Each list item MUST render a title in `text-sm
  font-semibold text-neutral-900` and metadata in a text color that
  passes WCAG AAA (7:1) against `bg-white` — correcting the previously
  ratified but never-verified `text-neutral-500` (4.83:1, fails AAA) to
  `text-neutral-600` (already verified AAA-safe elsewhere in this
  codebase, e.g. feature 006's own Card demo workaround).
- **FR-004**: System MUST provide a read-only list-item variant with no
  interactive affordance (User Story 1).
- **FR-005**: System MUST provide an interactive list-item variant where
  the entire row is a single focusable, clickable target (`<a>` or
  `<button>` wrapping the row's content), showing `hover:bg-neutral-50`
  on mouse hover and a visible `focus-visible` ring, per the existing
  ratified pattern (User Story 2).
- **FR-006**: System MUST support an optional trailing-action slot (e.g.
  a Badge or a chevron icon) that aligns to the row's right edge without
  breaking title/metadata alignment (User Story 3).
- **FR-007**: System MUST NOT nest a second interactive element (e.g. a
  clickable button) inside an interactive list-item's own clickable
  target — the trailing-action slot in the interactive variant is
  restricted to non-interactive content (Badge, icon, text) to avoid
  WCAG nested-control violations.
- **FR-008**: System MUST expose both variants (read-only and
  interactive) and at least one trailing-action composition in the
  component gallery (`index.html`) and as a standalone route registered
  in `vite.config.ts`'s `rollupOptions.input`, per this project's
  established per-component demo convention.
- **FR-009**: System MUST pass zero axe-core accessibility violations in
  both the read-only and interactive states.
- **FR-010**: System MUST correct the Component Catalog's ratified
  "Lists" entry in the constitution to reflect the corrected metadata
  token (`text-neutral-600`) once this feature ships, closing the gap
  flagged during feature 006.

### Key Entities

- **List**: An ordered vertical collection of List Items; visually a
  `divide-y` bordered container matching Table's existing row-divider
  treatment (feature 006), for visual consistency across "listing"
  components.
- **List Item**: A single row containing an avatar, a title, secondary
  metadata text, and an optional trailing action. Exists in a read-only
  variant and an interactive (whole-row-clickable) variant.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All list-item text (title and metadata) passes WCAG AAA
  contrast (7:1) against its background, verified via the WCAG
  relative-luminance formula in this project's existing contrast audit
  script — closing the specific gap found in feature 006.
- **SC-002**: Both the read-only and interactive list variants render
  with zero axe-core accessibility violations.
- **SC-003**: A keyboard-only user can reach and activate every row of
  an interactive list using only Tab and Enter/Space, with a visible
  focus indicator at every step.
- **SC-004**: The component's visual appearance matches its Playwright
  baseline across 320/768/1024/1440px viewports with zero unintended
  drift to any other existing component's baseline.

## Assumptions

- The avatar, title, metadata, and trailing-action layout is a
  horizontal flex row (avatar left, text block center, trailing action
  right) — the single most common list-row layout in this project's
  reference patterns (Tailwind UI-style "Stacked Lists").
- "Metadata" is a single line of secondary text (e.g. an email address, a
  role, or a relative timestamp) — multi-line metadata is out of scope
  for this feature and can be added later without breaking this
  contract.
- The interactive variant's whole-row click target is implemented as a
  single `<a href>` (navigation) in the demo, matching this project's
  precedent of using the simplest semantic element that satisfies the
  interaction (native elements over ARIA roles, established since
  feature 001).
- No React port is included in this feature — deferred to the next
  feature per the user's explicit scoping instruction.
