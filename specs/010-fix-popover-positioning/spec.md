# Feature Specification: Fix Popover Panel Positioning (Dropdown Menu, Combobox)

**Feature Branch**: `010-fix-popover-positioning`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Fix a real, previously-undiscovered
positioning bug affecting two already-shipped components: Dropdown
Menu's panel (feature 005) and Combobox's listbox (feature 008), plus
Dropdown Menu's React port (feature 009). Both use `position: absolute`
CSS intended to anchor them under their trigger/input, but this silently
fails once the Popover API promotes the element to the browser's top
layer — its containing block resets to the viewport's initial
containing block instead of the nearest positioned ancestor. Confirmed
via direct Playwright bounding-box measurement on the shipped static
pages. Undetected until now because visual-regression screenshots crop
tightly to the popover element itself. This is a correctness bug fix,
not a new capability."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dropdown Menu panel anchors to its trigger (Priority: P1) 🎯 MVP

A user opens the Dropdown Menu's "More actions" trigger and expects the
menu panel to appear directly below/near the button they clicked, not
somewhere else on the page.

**Why this priority**: Dropdown Menu is used in both the static gallery
and the React package (feature 009) — fixing it first covers the widest
surface and validates the fix strategy before applying it to Combobox.

**Independent Test**: Open the static Dropdown Menu page, click the
trigger, and measure the panel's bounding box against the trigger's —
the panel must be positioned immediately adjacent to (below/beside) the
trigger, not near the top of the viewport regardless of scroll position
or trigger location on the page.

**Acceptance Scenarios**:

1. **Given** the Dropdown Menu trigger anywhere on the page, **When** the
   user opens the menu, **Then** the panel's bounding box is positioned
   directly adjacent to the trigger's bounding box (not offset toward
   the viewport's top-left/center).
2. **Given** the page has been scrolled, **When** the user opens the
   menu, **Then** the panel still appears next to the trigger's current
   on-screen position, not the trigger's original unscrolled position.
3. **Given** the React-ported `DropdownMenu` component, **When** rendered
   and opened, **Then** it exhibits the identical, correctly-anchored
   positioning as the static reference.

---

### User Story 2 - Combobox listbox anchors to its input (Priority: P2)

A user types into the Combobox input and expects the filtered options
listbox to appear directly below the input field, not elsewhere on the
page.

**Why this priority**: Same root cause and fix strategy as Dropdown
Menu; ordered second since it has no React port yet (feature 008 is
static-only), a narrower surface than User Story 1.

**Independent Test**: Open the static Combobox page, type a query, and
measure the listbox's bounding box against the input's — the listbox
must appear directly below the input, not elsewhere on the page.

**Acceptance Scenarios**:

1. **Given** the Combobox input anywhere on the page, **When** the user
   types a query that opens the listbox, **Then** the listbox's bounding
   box is positioned directly below the input's bounding box.
2. **Given** the page has been scrolled, **When** the listbox opens,
   **Then** it still appears below the input's current on-screen
   position.

---

### Edge Cases

- What happens when the trigger/input is near the bottom of the
  viewport, such that a below-anchored panel would overflow off-screen?
  Out of scope for this fix — the existing static reference never
  handled this (no flip/collision-avoidance logic existed even before
  this bug was found), and adding it would be new capability beyond a
  correctness fix. Documented as a known follow-up, not silently
  ignored.
- What happens on a browser that lacks CSS Anchor Positioning support?
  Out of scope in practice — confirmed empirically (not assumed) that
  all three of this project's target evergreen engines (the exact
  Chromium/Firefox/WebKit builds Playwright uses for this project's own
  test suite) support the CSS Anchor Positioning API natively, so no
  fallback path is required.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Dropdown Menu panel MUST render positioned adjacent to
  (below/beside) its trigger button on-screen, at every documented
  viewport breakpoint, in both the static HTML reference and the React
  port.
- **FR-002**: The Combobox listbox MUST render positioned directly below
  its input field on-screen, at every documented viewport breakpoint.
- **FR-003**: The fix MUST use the CSS Anchor Positioning API
  (`anchor-name`/`position-anchor`/`anchor()`), confirmed via direct
  empirical testing against this project's actual Playwright browser
  engines to be universally supported, rather than a JS-computed
  positioning fallback that was evaluated and found unnecessary.
- **FR-004**: Both fixed components MUST gain a new automated test
  assertion comparing the panel/listbox's bounding box position against
  its trigger/input's bounding box, so this exact class of bug cannot
  silently regress — the previous absence of such an assertion was the
  root cause it went undetected since each feature originally shipped.
- **FR-005**: The fix MUST NOT change any other visual or interactive
  behavior already ratified for either component (open/close triggers,
  keyboard navigation, focus management, ARIA semantics) — a positioning
  correction only.
- **FR-006**: The fix MUST NOT introduce any new design token — anchor
  positioning is a CSS mechanism change, not a visual redesign.

### Key Entities

- N/A — this is a CSS/layout correctness fix with no new data entities.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Dropdown Menu and Combobox visual states (across
  every existing viewport breakpoint already tested) show the panel/
  listbox positioned adjacent to its trigger/input, verified by
  automated bounding-box comparison.
- **SC-002**: Zero regressions in either component's existing keyboard-
  navigation, focus-management, or ARIA-state test coverage.
- **SC-003**: The new positioning assertion fails if the bug is
  reintroduced (verified by temporarily reverting the CSS fix during
  development and confirming the new test catches it before finalizing).

## Assumptions

- CSS Anchor Positioning requires no JavaScript changes to either
  component's existing interaction logic (`dropdown-menu.js`,
  `combobox.js`, `useDropdownMenu.ts`) — it is a pure CSS mechanism
  (`anchor-name` on the trigger/input, `position-anchor` + `anchor()` on
  the panel/listbox), so this fix touches only `src/styles/
  tailwind.css`, `packages/react/src/styles.css`, and the minimal markup
  changes needed to declare the anchor relationship (if any attribute is
  required beyond CSS alone).
- No new design tokens are needed — the fix changes positioning
  mechanics only, not colors, spacing scale, or typography.
- The Combobox's React port is explicitly out of scope (feature 008 has
  no React port yet, per feature 009's own stated scope boundary).
