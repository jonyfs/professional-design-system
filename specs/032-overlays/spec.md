# Feature Specification: Overlays

**Feature Branch**: `032-overlays`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "implemente as primitivas de Overlays
identificadas no inventário da feature 018 (Affix, LoadingOverlay,
Bottom Sheet) — uma categoria 0% implementada que reutiliza fortemente
componentes já existentes (Spinner, Slide-over)."

**Source (verified, not assumed)**: `specs/018-component-gap-inventory/
research.md`'s "Overlays (6)" category — 0/6 shipped before this
feature. Each candidate cross-referenced against a real source library
with a buildability signal.

**De-duplication findings, verified directly against real source, not
assumed**:

- **Drawer** (item 42) is excluded. Reading `src/styles/tailwind.css`'s
  real `.slide-over-dialog` class (`fixed inset-y-0 right-0 h-full
  w-full max-w-md`) confirms this catalog's existing Slide-over IS a
  right-anchored drawer already — a generic, unqualified "Drawer" with
  no further specification is the identical component under a
  different name, exactly as the inventory's own note anticipated.
- **Dialog Manager / imperative modal queue** (item 45) is excluded —
  a JS-API layer on top of the existing Modal component (an
  add/remove/queue API), not a new visual component this feature
  would render.
- **Popover Combobox variant** (item 46) is excluded — confirmed to be
  Mantine's own internal implementation detail for its Combobox, not
  a standalone pattern this catalog needs separately (this catalog's
  own Combobox already ships, feature 002).

This feature ships the remaining **3** items: Affix, LoadingOverlay,
Bottom Sheet. Bottom Sheet is retained (not excluded alongside Drawer)
because it's a genuinely different geometry — bottom-anchored,
auto-height — not merely Slide-over renamed.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pinning content after a scroll threshold (Priority: P1)

A developer needs to pin an element (e.g. a summary bar, a filter
toolbar) once the user scrolls past its natural position, using a
reusable primitive rather than hand-rolling scroll-threshold logic in
every component that needs it — closing the exact gap this catalog's
own Back-to-Top Button (feature 031) deliberately left open rather
than absorbing into its own scope.

**Why this priority**: The most broadly reusable item — a general
scroll-threshold utility other future features can build on, matching
the inventory's own framing of Affix as infrastructure other
candidates (Back-to-Top) explicitly deferred to.

**Independent Test**: Scroll past an element's natural position —
confirm Affix pins it (e.g. `position: fixed` or `sticky`-equivalent
behavior) and un-pins when scrolled back above the threshold.

**Acceptance Scenarios**:

1. **Given** a page with an Affix-wrapped element, **When** the user
   scrolls past that element's natural position, **Then** it becomes
   pinned (fixed) at a specified viewport position.
2. **Given** the element is pinned, **When** the user scrolls back
   above the threshold, **Then** it returns to its natural document
   position.

---

### User Story 2 - Blocking a region during async work (Priority: P2)

A user waits for a scoped operation (e.g. a table refresh, a form
submission) where only a specific container — not the whole page —
should show a blocking loading state, reusing this catalog's existing
Spinner.

**Why this priority**: A common, immediately useful pattern reusing an
already-shipped visual (Spinner), moderate priority since it's a
narrower use case than a general scroll utility.

**Independent Test**: Toggle a container's loading state — confirm an
overlay with a centered Spinner blocks interaction with that
container's content specifically, not the whole page.

**Acceptance Scenarios**:

1. **Given** a container enters a loading state, **When**
   LoadingOverlay activates, **Then** a semi-opaque overlay with a
   centered Spinner covers exactly that container, and its content
   becomes non-interactive.
2. **Given** the operation completes, **When** loading ends, **Then**
   the overlay disappears and the container's content is interactive
   again.

---

### User Story 3 - Mobile-pattern bottom-anchored panel (Priority: P3)

A user on a narrower viewport needs a panel that slides up from the
bottom edge (the common mobile "bottom sheet" pattern) rather than
Slide-over's side-anchored panel, reusing the identical native
`<dialog>` mechanism with different anchoring/geometry.

**Why this priority**: A genuine geometric variant of an existing
primitive — narrowest scope, most specific use case (mobile-oriented
layouts) of the three.

**Independent Test**: Open Bottom Sheet — confirm it slides up from
the bottom edge, is focus-trapped and dismissible identically to
Slide-over (Escape, backdrop click, explicit close).

**Acceptance Scenarios**:

1. **Given** a trigger is activated, **When** Bottom Sheet opens,
   **Then** it slides up anchored to the bottom edge (not the side),
   sized to its content up to a maximum height.
2. **Given** Bottom Sheet is open, **When** the user presses Escape,
   clicks the backdrop, or activates an explicit close control,
   **Then** it closes and focus returns to the trigger — identical to
   Slide-over's existing dismissal behavior.

---

### Edge Cases

- What happens if an Affix-wrapped element's container is shorter than
  the viewport (scrolling never reaches the threshold)? It MUST simply
  never pin, not error.
- What happens if LoadingOverlay's container has no explicit
  `position` context? It MUST establish one itself (e.g. `relative`)
  rather than silently overlaying the wrong ancestor.
- What happens if Bottom Sheet's content exceeds its max height? It
  MUST become internally scrollable, never overflow the viewport or
  get clipped without a way to reach the rest of the content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an Affix primitive that pins a
  wrapped element after a scroll threshold and un-pins it when
  scrolled back above that threshold.
- **FR-002**: System MUST provide a LoadingOverlay that overlays a
  specific container (not the whole page) with a centered Spinner
  (reusing the existing Spinner component verbatim) and makes that
  container's content non-interactive while active.
- **FR-003**: System MUST provide a Bottom Sheet reusing Slide-over's
  exact native `<dialog>` focus-trap/dismissal mechanism, anchored to
  the bottom edge with auto-height up to a maximum.
- **FR-004**: System MUST NOT ship a standalone "Drawer" component
  (documented duplicate of Slide-over) or a "Dialog Manager" API layer
  (out of this feature's visual-component scope).
- **FR-005**: Every new primitive MUST ship on both this catalog's
  existing surfaces (static HTML and React), per the dual-surface
  convention.
- **FR-006**: None of the 3 primitives MUST introduce a new design
  token — reuse this catalog's existing brand/semantic/neutral set.
- **FR-007**: Every new primitive MUST meet this catalog's existing
  WCAG AAA contrast bar; LoadingOverlay's non-interactive state MUST
  be exposed to assistive technology (not merely a visual overlay).

### Key Entities

- **Affix State**: a pinned/unpinned boolean, derived live from scroll
  position relative to the wrapped element's natural offset — no
  persistence.
- **LoadingOverlay State**: an active/inactive boolean, caller-
  controlled (not internally timed) — the overlay's container-scoping
  is a rendering/positioning concern, not stored state.
- **Bottom Sheet**: identical to Slide-over's existing entity shape
  (open/closed, focus-trap boundary) with a different anchor edge.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 3 primitives ship, closing feature 018's inventory's
  Overlays category from 0% to 3/6 — the remaining 3 items (Drawer,
  Dialog Manager, Popover Combobox variant) explicitly excluded as
  documented duplicates/out-of-scope, not silently dropped.
- **SC-002**: Zero new design tokens introduced — 100% verified via
  this catalog's existing token audit.
- **SC-003**: Affix and LoadingOverlay both reflect real scroll
  position / caller state with zero drift, verified by Playwright
  driving the underlying condition directly.
- **SC-004**: Bottom Sheet's focus-trap and dismissal behavior is
  verified independently, not assumed identical to Slide-over merely
  because the underlying mechanism is shared.

## Assumptions

- **Affix's threshold is caller-specified**: the primitive exposes a
  configurable trigger point (e.g. the wrapped element's own natural
  document position), not a single hardcoded value — the demo
  illustrates one representative configuration.
- **LoadingOverlay's loading state is caller-controlled**: no internal
  timer or simulated async operation is part of the primitive itself;
  the demo triggers it via a button for illustration.
- **React port for every primitive**: all 3 ship a React component
  wrapper too, per this catalog's existing dual-surface convention.
- **This feature does not retrofit Back-to-Top (feature 031) to use
  Affix internally**: Back-to-Top's own minimal inline scroll-
  threshold logic remains unchanged — introducing Affix now doesn't
  obligate refactoring an already-shipped, already-tested component
  that has no functional gap of its own.
