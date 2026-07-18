# Feature Specification: Data Display Patterns

**Feature Branch**: `034-data-display-patterns`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "implemente as primitivas de Data Display
identificadas no inventário da feature 018 que exigem lógica de
interação genuinamente nova (OverflowList, RollingNumber, PickList/
Transfer, Gallery, Compare) — o lote que a feature 033 deliberadamente
deferiu por serem padrões novos, não composições triviais."

**Source (verified, not assumed)**: `specs/018-component-gap-inventory/
research.md`'s "Data Display (16)" category — 8/16 shipped before this
feature (4 in feature 023, 4 in feature 033). This feature ships the 5
remaining buildable candidates, each carrying the inventory's own "new
pattern" buildability signal: OverflowList (ResizeObserver-driven
collapse), RollingNumber/NumberFormatter (requestAnimationFrame-driven
digit transition), PickList/Transfer (dual-list transfer widget),
Gallery (focus-trapped fullscreen image viewer), Compare (draggable
before/after image slider). TreeTable and QRCode remain explicitly
deferred per the inventory's own notes (unchanged from feature 033).

This feature ships **5** of the category's remaining items, bringing
Data Display to 13/16 — the highest completion this category will
reach without either building a full interactive Data Table variant
(TreeTable's real dependency) or adopting a new client-side dependency
(QRCode).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compact display of an overflowing item list (Priority: P1)

A developer has a row of items (tags, avatars, chips) that may not all
fit in the available width — OverflowList automatically collapses the
items that don't fit into a "+N more" indicator, reusing this
catalog's existing chip/tag visual language.

**Why this priority**: The most broadly applicable item — any UI
listing a variable number of small items (tags on a card, assignees on
a task) benefits from this pattern.

**Independent Test**: Render OverflowList in a container narrower than
its content — confirm it shows as many items as fit plus an accurate
"+N more" indicator; widening the container reveals more items.

**Acceptance Scenarios**:

1. **Given** a list of items wider than its container, **When**
   OverflowList renders, **Then** it shows the items that fit and a
   "+N more" indicator with an accurate count for the rest.
2. **Given** the container is resized wider, **When** more items now
   fit, **Then** OverflowList reveals them and updates the "+N more"
   count accordingly.

---

### User Story 2 - Animated numeric counters and pairwise data movement (Priority: P2)

A developer needs a number that visually counts up/down to a new value
(RollingNumber, e.g. a dashboard stat) or a dual-list widget for moving
items between two collections (PickList/Transfer, e.g. assigning users
to a group).

**Why this priority**: Both are common dashboard/admin-UI needs,
moderate priority since each is a narrower use case than OverflowList.

**Independent Test**: Trigger a RollingNumber value change — confirm
it animates through intermediate values to the new one. Move an item
between PickList's two panels — confirm it appears in the destination
and disappears from the source, both directions.

**Acceptance Scenarios**:

1. **Given** a RollingNumber's value changes, **When** it re-renders,
   **Then** the displayed digits animate through intermediate values
   rather than jumping instantly, settling on the exact final value.
2. **Given** an item in PickList's left panel, **When** the user moves
   it to the right panel (and vice versa), **Then** it appears in the
   destination list and is removed from the source, with the same
   behavior available via keyboard, not mouse-only.

---

### User Story 3 - Full-screen image viewing and comparison (Priority: P3)

A user wants to view an image in a focus-trapped full-screen viewer
with next/previous navigation (Gallery) or compare two images via a
draggable before/after divider (Compare).

**Why this priority**: The most visually specific, narrowest-use-case
items in this batch.

**Independent Test**: Open Gallery from a thumbnail — confirm it opens
full-screen, focus-trapped, with working next/previous/close. Drag
Compare's divider — confirm the before/after images reveal
proportionally to the divider's position.

**Acceptance Scenarios**:

1. **Given** a thumbnail is activated, **When** Gallery opens,
   **Then** it shows the full-size image full-screen, focus-trapped,
   with Escape/close dismissing it and Next/Previous cycling images.
2. **Given** Compare's divider is dragged (mouse or keyboard), **When**
   its position changes, **Then** the proportion of the before/after
   images shown updates to match, never revealing beyond 0%/100%.

---

### Edge Cases

- What happens when OverflowList's container is too narrow for even
  one item? It MUST show at minimum the "+N more" indicator (for the
  full count), never render nothing.
- What happens if RollingNumber receives a value change faster than
  its animation duration? A new change MUST interrupt cleanly and
  animate to the newest target, never stack/queue overlapping
  animations or visibly glitch.
- What happens if PickList's panels are both empty, or one becomes
  empty after a move? Each panel MUST show a distinct empty state, not
  a blank area.
- What happens if Gallery is opened with only one image? Next/Previous
  MUST be disabled or hidden (nothing to cycle to), not silently no-op
  on an enabled-looking control.
- What happens if Compare's divider is dragged past either edge? It
  MUST clamp to 0%/100%, never show negative overflow or exceed the
  container.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide OverflowList using ResizeObserver to
  show only the items that fit its container width, collapsing the
  rest into an accurate "+N more" indicator that updates on resize.
- **FR-002**: System MUST provide RollingNumber animating digit
  transitions via `requestAnimationFrame` between value changes,
  cleanly interrupting an in-flight animation if the value changes
  again before it completes.
- **FR-003**: System MUST provide PickList/Transfer with two list
  panels and move-item controls between them, operable via keyboard
  (not mouse-only).
- **FR-004**: System MUST provide Gallery as a focus-trapped,
  full-screen image viewer with Next/Previous/Close controls, reusing
  this catalog's existing focus-trap mechanism (native `<dialog>`).
- **FR-005**: System MUST provide Compare as a draggable before/after
  image comparison slider, operable via mouse and keyboard, clamped to
  the 0-100% range.
- **FR-006**: Every new primitive MUST ship on both this catalog's
  existing surfaces (static HTML and React), per the dual-surface
  convention.
- **FR-007**: None of the 5 primitives MUST introduce a new design
  token — reuse this catalog's existing brand/semantic/neutral set.
- **FR-008**: Every new primitive MUST meet this catalog's existing
  WCAG AAA contrast bar and remain fully keyboard-operable where
  interaction is involved (RollingNumber is display-only and exempt).

### Key Entities

- **OverflowList Item**: arbitrary chip/tag content; a computed
  visible/overflow split, re-derived on container resize.
- **RollingNumber Value**: a target numeric value and the currently-
  displayed (possibly mid-animation) value.
- **PickList Item**: an id, a label, and which panel (source/
  destination) currently holds it.
- **Gallery Image**: a full-size image source, a thumbnail, and its
  position in the sequence.
- **Compare State**: a divider position (0-100%), a "before" and
  "after" image pair.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 5 primitives ship, bringing feature 018's inventory's
  Data Display category from 8/16 to 13/16 — the remaining 3 items
  (TreeTable, QRCode, and PrimeReact's lighter `OrderList` variant
  noted alongside PickList/Transfer) stay explicitly deferred per
  existing notes, not silently dropped.
- **SC-002**: Zero new design tokens introduced — 100% verified via
  this catalog's existing token audit.
- **SC-003**: OverflowList's visible/overflow split and RollingNumber's
  displayed value both reflect real container width / real target
  value with zero drift, verified by Playwright driving the underlying
  condition directly (real resize, real value change).
- **SC-004**: PickList, Gallery, and Compare are each verified fully
  keyboard-operable end to end, not assumed from using native
  interactive elements alone.

## Assumptions

- **RollingNumber's animation duration is fixed** (a single,
  consistent duration across all instances), not caller-configurable
  in this initial version — keeping scope bounded to the core pattern.
- **Gallery's image set is a fixed, caller-supplied array** — no
  dynamic loading/pagination of images within the viewer itself.
- **Compare's images are pre-sized to match dimensions** — the
  primitive does not itself handle mismatched aspect ratios beyond
  basic `object-fit` cropping.
- **React port for every primitive**: all 5 ship a React component
  wrapper too, per this catalog's existing dual-surface convention.
- **No de-duplication conflict**: none of the 5 items appear in
  feature 018's own "Flagged for de-duplication review" list.
