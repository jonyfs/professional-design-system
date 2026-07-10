# Feature Specification: React Port — Navigation & Disclosure Primitives

**Feature Branch**: `009-react-port-nav-disclosure`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Port feature 005's four static HTML + Tailwind
components (Breadcrumbs, Accordion, Tabs, Dropdown Menu) to the React +
TypeScript package at packages/react/, following the exact same porting
methodology feature 004 already established for the first 10 components.
This is a packaging/API migration, not a redesign — no new visual or
interaction capability beyond feature 005's own ratified behavior."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Breadcrumbs Port (Priority: P1) 🎯 MVP

A frontend developer building a React app needs a `Breadcrumbs` component
with the same accessible hierarchy-trail behavior already shipped in the
static HTML reference, typed and importable from the package.

**Why this priority**: Breadcrumbs is pure markup with zero JavaScript in
its static reference — the simplest possible port, proving nothing new
about React state/hooks before the more involved components.

**Independent Test**: Import `Breadcrumbs` in a scratch React app, render
a trail of ancestor links plus a current page, and confirm it is visually
identical to `src/components/breadcrumbs/breadcrumbs.html` with full
TypeScript prop-completion.

**Acceptance Scenarios**:

1. **Given** a `Breadcrumbs` with an array of ancestor links plus a
   current-page label, **When** rendered, **Then** ancestors render as
   real, keyboard-focusable links in hierarchical order and the current
   page renders as non-interactive text with `aria-current="page"`,
   pixel-identical to the static reference.

---

### User Story 2 - Accordion Port (Priority: P2)

A developer needs an `Accordion` component supporting both independent
(any number open) and exclusive (single-open) modes, matching the static
reference's behavior exactly.

**Why this priority**: Ordered after Breadcrumbs because it requires a
real technical decision (native `<details>` vs. React-state-driven) that
must be resolved before implementation, unlike Breadcrumbs' direct
markup translation.

**Independent Test**: Render an `Accordion` with `exclusive` mode and
three items; opening one collapses any other open item; render without
`exclusive` and confirm multiple items can stay open simultaneously.

**Acceptance Scenarios**:

1. **Given** an `Accordion` in exclusive mode with one item already open,
   **When** the user opens a second item, **Then** the first closes
   automatically.
2. **Given** an `Accordion` without exclusive mode, **When** the user
   opens multiple items, **Then** all remain open simultaneously.
3. **Given** any `Accordion` item, **When** toggled via mouse or keyboard
   (Enter/Space on its trigger), **Then** its content's visibility and
   the trigger's chevron rotation match the static reference exactly.

---

### User Story 3 - Tabs Port (Priority: P3)

A developer needs a `Tabs` component implementing the WAI-ARIA Tabs
roving-tabindex keyboard pattern (Left/Right/Home/End) as idiomatic React
state, not a wrapped copy of the existing vanilla `tabs.js`.

**Why this priority**: Ordered after Accordion since it's this feature's
first component requiring a full keyboard-interaction model reimplemented
as React state rather than a markup/CSS-only translation.

**Independent Test**: Render `Tabs` with four tabs (one disabled); click
an unselected tab and confirm its panel becomes visible; use arrow keys
to move selection, confirming roving tabindex (only the selected tab is
in the natural Tab order) and that the disabled tab is skipped.

**Acceptance Scenarios**:

1. **Given** a `Tabs` component on mount, **When** rendered, **Then**
   exactly one tab is selected and its panel visible, matching the
   static reference's default state.
2. **Given** a selected tab, **When** the user presses Right/Left,
   **Then** selection moves to the next/previous enabled tab, wrapping at
   the ends, skipping any disabled tab.
3. **Given** any tab, **When** the user presses Home/End, **Then**
   selection jumps to the first/last enabled tab.
4. **Given** a `Tabs` component, **When** inspected for Tab-key order,
   **Then** only the currently-selected tab has a natural tab stop
   (roving tabindex), identical to the static reference's FR-005.

---

### User Story 4 - Dropdown Menu Port (Priority: P4)

A developer needs a `DropdownMenu` component with the same trigger/panel/
arrow-key-roving-focus/Tab-closes-menu behavior as the static reference,
reimplemented with React state driving focus rather than the vanilla
`dropdown-menu.js` module's direct DOM manipulation.

**Why this priority**: Ordered last — it has the most involved
interaction model of the four (Popover-API-equivalent open/close,
disabled-item skipping, explicit focus-return), benefiting from the
patterns already proven by Breadcrumbs/Accordion/Tabs earlier in this
same feature.

**Independent Test**: Render `DropdownMenu` with a trigger and four
items (one disabled); click the trigger, confirm the panel opens with
focus on the first item; use arrow keys to move among items skipping the
disabled one; press Escape or Tab and confirm the panel closes with
focus returned to the trigger.

**Acceptance Scenarios**:

1. **Given** a closed `DropdownMenu`, **When** the trigger is clicked or
   activated via keyboard, **Then** the panel opens with focus on its
   first item, `aria-expanded` synced to `true`.
2. **Given** an open panel, **When** the user presses ArrowDown/ArrowUp,
   **Then** focus moves among items, skipping any disabled item, wrapping
   at both ends.
3. **Given** an open panel, **When** the user presses Escape or Tab,
   **Then** the panel closes and focus returns explicitly to the trigger,
   `aria-expanded` synced to `false`.

---

### Edge Cases

- What happens when an `Accordion`'s `exclusive` mode is combined with
  more than one item marked `defaultOpen`? The first `defaultOpen` item
  (in DOM/array order) wins on initial render — mirrors the static
  reference's single native `open` attribute per exclusive group.
- What happens when a `Tabs`/`DropdownMenu` consumer supplies zero
  enabled (non-disabled) items? Out of scope, same as feature 005 — this
  is a degenerate consumer-authored state neither the static reference
  nor this port is required to guard against beyond not crashing.
- What happens when `Breadcrumbs` receives a single-entry trail (just
  the current page, no ancestors)? Still renders the `<nav>` landmark
  wrapper, matching the static reference's Edge Case handling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `Breadcrumbs` MUST accept an array of ancestor
  `{ label, href }` entries plus a current-page label, rendering
  ancestors as real anchors and the current page as non-interactive text
  with `aria-current="page"`.
- **FR-002**: `Accordion` MUST support an `exclusive` boolean prop
  controlling whether opening one item closes other open items in the
  same group.
- **FR-003**: `Accordion`'s per-item open/closed state MUST be internally
  managed (uncontrolled) with an optional `defaultOpen` per item,
  matching the static reference's lack of any external state-lifting
  requirement.
- **FR-004**: `Tabs` MUST implement the WAI-ARIA Tabs pattern: roving
  tabindex (only the selected tab is a natural Tab stop), Left/Right/
  Home/End keyboard navigation, and disabled-tab skipping during
  keyboard navigation.
- **FR-005**: `DropdownMenu` MUST implement open/close via trigger
  interaction, arrow-key roving focus among items (skipping disabled
  items), Escape-to-close, Tab-closes-the-menu, and explicit focus-return
  to the trigger on every closing path.
- **FR-006**: All four ported components MUST be visually identical
  (same computed Tailwind classes) to their static HTML references at
  every documented state.
- **FR-007**: All four ported components MUST pass a WCAG 2.2 AAA
  automated contrast scan with zero violations, reusing already-ratified
  tokens only.
- **FR-008**: This feature MUST NOT introduce any new visual variant,
  color token, or interaction behavior beyond what feature 005 already
  ratified — a pure platform port.
- **FR-009**: All four components MUST be exported from
  `packages/react/src/index.ts` with their prop types, matching every
  prior ported component's export pattern.

### Key Entities

- **Breadcrumbs**: an ordered list of ancestor `{ label, href }` entries
  plus a current-page label; no internal state.
- **Accordion**: a group of items, each with a trigger label and content;
  `exclusive` mode is a group-level prop; open/closed state is per-item,
  internally managed.
- **Tabs**: a list of `{ label, content, disabled? }` tab entries; one
  is selected at a time; selection state is internally managed with
  roving tabindex.
- **DropdownMenu**: a trigger element plus a list of `{ label, onSelect,
  disabled? }` items; open/closed state and active-item focus are
  internally managed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four ported components render pixel-identical output
  to their static HTML references across the same 320/768/1024/1440px
  breakpoints already tested for the static versions.
- **SC-002**: 100% of interactive elements in all four components pass
  an automated axe-core accessibility scan with zero violations.
- **SC-003**: A developer can compose a working `Tabs` or `DropdownMenu`
  instance using only its exported TypeScript prop types (no additional
  documentation lookup) and get correct keyboard behavior on first try.
- **SC-004**: Keyboard interaction parity is 100% verified: every
  keyboard acceptance scenario passing in feature 005's static Playwright
  suite has a matching passing assertion in this feature's React
  Playwright suite.

## Assumptions

- The React ports reuse the existing `packages/react/` build tooling
  (tsup, compiled Tailwind stylesheet, `tests/react-harness/`) entirely —
  no new tooling setup, matching feature 004's established scaffold.
- `Accordion`'s exclusive-group behavior, expressible natively via HTML's
  shared-`name`-attribute mechanism in the static reference, requires
  genuine React state management to reproduce in a JSX/SSR-safe way —
  confirmed during planning rather than assumed a native `<details>`
  passthrough would suffice unmodified.
- `Tabs` and `DropdownMenu`'s existing vanilla JS modules (`tabs.js`,
  `dropdown-menu.js`) serve only as a behavioral reference for what to
  reimplement — the React versions are idiomatic hooks/state, not thin
  wrappers around the DOM-manipulating vanilla code.
- No new design tokens are needed — all four components reuse tokens
  already ratified for their static references.
