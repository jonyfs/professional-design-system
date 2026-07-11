# Feature Specification: React Port — Batch 2 (Remaining Static Components)

**Feature Branch**: `013-react-port-batch-2`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Port the remaining static HTML + Tailwind components to the React + TypeScript package at packages/react/: Pagination, Sidebar, Navbar, Avatar, Card, Alert/Banner, Combobox, Command Palette, Lists, and Table. Following the exact same porting methodology feature 009 already established for Breadcrumbs/Accordion/Tabs/Dropdown Menu. This is a packaging/API migration, not a redesign — no new visual or interaction capability beyond each static reference's own ratified behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Zero-JavaScript components port (Priority: P1) 🎯 MVP

A frontend developer building a React app needs `Pagination`, `Sidebar`,
`Navbar`, `Avatar`, `Card`, `Lists`, and `Table` — all components whose
static references have zero client-side JavaScript — available as typed,
importable React components with identical visual output and
accessibility semantics to their static HTML references.

**Why this priority**: These seven components are pure prop-driven
markup translations, proving the lowest-risk, highest-volume slice of
this feature before the two components (Combobox, Command Palette) that
require real hook logic. Ordering them first also means the majority of
the React package's remaining catalog gap is closed even if the feature
were to stop here.

**Independent Test**: Import each component in the React test harness,
render it with representative props, and confirm pixel-identical visual
parity with its static HTML reference (`src/components/<name>/<name>.html`)
via Playwright screenshot comparison, plus zero axe-core violations.

**Acceptance Scenarios**:

1. **Given** each of the seven components rendered with props
   equivalent to its static demo's content, **When** compared via
   Playwright screenshot, **Then** the React render is visually
   identical to the static reference.
2. **Given** each component, **When** an axe-core scan runs, **Then**
   there are zero violations, matching the static reference's own
   zero-violation baseline.
3. **Given** Pagination specifically, **When** rendered with `disabled`
   Previous/Next at page boundaries, **Then** those controls render as
   real `<button disabled>` elements (not merely visually dimmed `<a>`
   tags), matching the static reference's genuinely-disabled-boundary
   behavior.

---

### User Story 2 - Alert/Banner port with dismiss behavior (Priority: P2)

A developer needs an `Alert` component supporting the static reference's
optional dismiss-and-remove-from-DOM interaction, as real React state
rather than direct DOM manipulation.

**Why this priority**: The first component in this batch requiring any
client-side interaction (a dismiss button), but simple enough (a single
boolean visibility toggle) to be ordered before the two complex hook
ports.

**Independent Test**: Render a dismissible `Alert`, click its dismiss
control, and confirm the alert is removed from the rendered tree (not
merely hidden via CSS).

**Acceptance Scenarios**:

1. **Given** a dismissible Alert, **When** the user clicks its dismiss
   button, **Then** the Alert unmounts entirely, matching the static
   reference's `alert.remove()` behavior (`src/scripts/alert.js`).
2. **Given** a non-dismissible Alert (no `onDismiss` prop provided),
   **When** rendered, **Then** no dismiss control appears at all.

---

### User Story 3 - Combobox port (Priority: P3)

A developer needs a `Combobox` component with the same from-scratch
WAI-ARIA 1.2 combobox behavior (filter-as-you-type, arrow-key navigation,
Popover-API-anchored listbox) already shipped in the static reference
(`src/scripts/combobox.js`, feature 008), reimplemented as a React hook.

**Why this priority**: The most complex port in this batch — genuine
interaction logic (filtering, `aria-activedescendant` management,
keyboard navigation) that must be faithfully reproduced, not just
markup translated. Ordered after the simpler ports so the porting
methodology (hook-based state management, CSS Anchor Positioning via
`useId()`) is well-proven by the time this is tackled.

**Independent Test**: Render `Combobox` with a list of options, type a
filter query, confirm the listbox narrows to matching options with the
matched substring highlighted, and confirm arrow-key navigation plus
Enter-to-commit works identically to the static reference.

**Acceptance Scenarios**:

1. **Given** a Combobox with an option list, **When** the user types a
   filter query, **Then** the listbox narrows to matching options with
   the matched substring visually highlighted.
2. **Given** a filtered listbox, **When** the user presses ArrowDown/
   ArrowUp, **Then** `aria-activedescendant` moves among the filtered
   options, wrapping at the ends and skipping disabled options.
3. **Given** an active option, **When** the user presses Enter, **Then**
   the option's value commits to the input and the listbox closes.
4. **Given** an open listbox, **When** the user presses Escape, **Then**
   the listbox closes without changing the input's current value.

---

### User Story 4 - Command Palette port (Priority: P4)

A developer needs a `CommandPalette` component with the same global
Cmd/Ctrl+K shortcut and `<dialog>`/`showModal()` chrome already shipped
in the static reference (`src/scripts/command-palette.js`, feature 008),
reimplemented as a React hook, reusing the same `overlay`-derived
dialog-close wiring the static reference depends on.

**Why this priority**: Ordered last — depends on this feature's own
Modal port precedent (already shipped, feature 004) for the `<dialog>`
chrome pattern, and requires a global `document`-level keydown listener
that must be verified not to conflict with any other React-ported
component's own keyboard handling.

**Independent Test**: Render `CommandPalette` mounted anywhere in a test
page, press Cmd/Ctrl+K from an arbitrary starting focus state, confirm
the palette opens and focuses its input, type a query, and confirm
filtered actions are keyboard-navigable and Enter-activatable.

**Acceptance Scenarios**:

1. **Given** a mounted CommandPalette with focus anywhere else on the
   page, **When** the user presses Cmd/Ctrl+K, **Then** the palette
   opens via native `showModal()` and focus moves to its input.
2. **Given** an open palette, **When** the user presses Escape, **Then**
   the palette closes and focus returns to wherever it was before
   opening (matching the static reference's WebKit-specific
   focus-return fix, feature 008).

---

### Edge Cases

- What happens if two `Combobox` or two `DropdownMenu`-family components
  render on the same page? Each hook instance MUST generate its own
  unique `anchor-name` (the `useId()`-based pattern already established
  in feature 009/010), never colliding.
- What happens if `CommandPalette`'s global keydown listener is mounted
  while a `Combobox` or `DropdownMenu` is also focused/open elsewhere on
  the page? The listener must not fire on plain typing inside other
  components' inputs — verified by confirming Cmd/Ctrl+K specifically
  (not bare "k") is what triggers it, matching the static reference's
  own modifier-key check.
- What happens to `Pagination`'s ellipsis truncation for very small page
  counts (e.g. 3 total pages)? No ellipsis renders at all — every page
  number shows — matching the static reference's existing truncation
  logic (a pure prop-driven render decision, not new logic to invent).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide `Pagination`, `Sidebar`, `Navbar`,
  `Avatar`, `Card`, `List`, and `Table` React components with props
  covering each static reference's demonstrated variants, typed and
  exported from `packages/react/src/index.ts`.
- **FR-002**: System MUST provide an `Alert` component supporting an
  optional `onDismiss` callback prop; when provided, a dismiss control
  renders and clicking it removes the Alert from the rendered tree.
- **FR-003**: System MUST provide a `Combobox` component reimplementing
  `src/scripts/combobox.js`'s filter-as-you-type, `aria-activedescendant`
  keyboard navigation, and Popover-API-anchored listbox as a
  `useCombobox` hook, mirroring `useDropdownMenu`'s established
  hook-authoring pattern (feature 009/010).
- **FR-004**: System MUST provide a `CommandPalette` component
  reimplementing `src/scripts/command-palette.js`'s global Cmd/Ctrl+K
  shortcut and `<dialog>`/`showModal()` chrome as a `useCommandPalette`
  hook.
- **FR-005**: Every ported component MUST be visually pixel-identical to
  its static HTML reference at 320/768/1024/1440px, verified via
  Playwright screenshot comparison.
- **FR-006**: Every ported component MUST pass zero axe-core
  accessibility violations, matching its static reference's own
  zero-violation baseline.
- **FR-007**: Every ported component with per-instance state (Combobox's
  `anchor-name`, any ID-based ARIA relationship) MUST use a
  `useId()`-derived unique identifier, never a hardcoded or module-level
  counter value that could collide across multiple instances on one
  page (mirroring the established `useDropdownMenu`/`useAccordion`
  pattern).
- **FR-008**: This feature MUST NOT introduce any new visual variant,
  interaction, or prop capability beyond what each static reference
  already demonstrates — a pure packaging/API migration.

### Key Entities

- **React Component**: A typed function component in
  `packages/react/src/<Name>/<Name>.tsx`, exported from
  `packages/react/src/index.ts` alongside its prop type(s).
- **Hook**: For components with real interaction logic (Combobox,
  Command Palette, and Alert's simpler dismiss state), a
  `packages/react/src/hooks/use<Name>.ts` module encapsulating state
  and DOM-imperative wiring, consumed by a thin presentational component
  — mirroring `useDropdownMenu`'s established split.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All ten components render with zero axe-core
  accessibility violations.
- **SC-002**: All ten components' React renders are visually identical
  (Playwright screenshot comparison) to their static HTML references
  across 320/768/1024/1440px.
- **SC-003**: Combobox's filter/keyboard-navigation and Command
  Palette's global-shortcut/dialog-chrome behaviors are functionally
  identical to their static references, verified by Playwright
  interaction tests (not just visual comparison).
- **SC-004**: Zero regressions to any existing static or React-ported
  component's test suite.

## Assumptions

- Each component's React prop API covers the same set of variants its
  static HTML demo page already shows — not a superset invented for
  this feature (FR-008).
- Navbar's "zero JavaScript" native mobile-menu behavior (an HTML
  `<details>`-based disclosure) ports directly since React can render
  the same native elements; no JS state is needed for this specific
  behavior, mirroring Accordion's own "native element over React
  state" precedent (feature 009). Sidebar has no comparable
  mobile-disclosure pattern in its own static reference — its port is
  a direct, unconditional item-list render (research.md R1).
- Command Palette's dependency on `overlay.js`'s `wireDialogClose`
  export (established in feature 008's own static implementation) has
  a React equivalent already available via the existing `Modal`
  component's port (feature 004) — this feature reuses that pattern
  rather than re-deriving dialog-close wiring from scratch.
