# Feature Specification: Navigation & Disclosure Primitives

**Feature Branch**: `005-navigation-disclosure-primitives`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Implement the design system's fourth slice of primitives — Tabs, Accordion/Disclosure, Breadcrumbs, and Dropdown Menu — in HTML using Tailwind CSS, built exclusively on the semantic design tokens already ratified in the project constitution. These begin the Navigation & Disclosure section of the Component Catalog, expanding coverage toward Tailwind UI's full component set. Following the established pattern from features 001-003, this feature builds the static HTML + Tailwind reference implementation only — a React port is an explicit non-goal and will be a separate future feature. Accordion/Disclosure should default to the native `<details>`/`<summary>` element wherever it satisfies the interaction requirements. Breadcrumbs should be achievable with zero JavaScript. Tabs requires the WAI-ARIA Tabs pattern (roving tabindex, arrow-key navigation, aria-selected/aria-controls wiring). Dropdown Menu requires toggleable open/closed state with keyboard support and light-dismiss — evaluate during planning whether the native Popover API can provide this the way `<dialog>`/`showModal()` did for Modal/Slide-over in feature 003. All four components must pass WCAG 2.2 AAA contrast and zero raw Tailwind palette classes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Breadcrumbs (Priority: P1)

A user viewing any nested page in an application built on this design system sees a breadcrumb trail showing their location in the site hierarchy, and can click any ancestor level to navigate directly there.

**Why this priority**: Simplest of the four (pure semantic markup, zero JavaScript, no state) — matches this project's established practice of shipping the lowest-risk component first within a slice (e.g. Badge before Modal in earlier features) and gives an immediate, independently-testable win.

**Independent Test**: Can be fully tested by rendering the Breadcrumbs component with a 3+ level path and verifying every ancestor link is present, correctly ordered, keyboard-focusable, and that the current page is marked non-interactive and announced as the current location to assistive technology.

**Acceptance Scenarios**:

1. **Given** a breadcrumb trail with Home / Category / Current Page, **When** the page renders, **Then** all ancestor levels are rendered as links in hierarchical order and the current page is rendered as plain (non-link) text.
2. **Given** the breadcrumb trail is visible, **When** a screen reader user navigates to it, **Then** it is announced as a navigation landmark distinct from the page's primary navigation.
3. **Given** a user is focused on an ancestor link, **When** they activate it via keyboard (Enter), **Then** navigation proceeds exactly as a standard link would.

---

### User Story 2 - Accordion / Disclosure (Priority: P2)

A user viewing a page with several collapsible content sections (e.g. an FAQ) can expand one or more sections to read their content and collapse them again, with the expand/collapse control clearly indicating its current state.

**Why this priority**: Second-simplest — achievable with the native `<details>`/`<summary>` element (continuing this project's established preference for native HTML behavior over custom JavaScript, as used for Modal/Slide-over's `<dialog>` in feature 003), but still requires deliberate Tailwind styling of native browser chrome (the disclosure triangle) and a visible open/closed state indicator, which native defaults do not provide in an on-brand way.

**Independent Test**: Can be fully tested by rendering multiple independent Accordion instances, toggling each open and closed via both mouse and keyboard, and confirming state is independent per instance (opening one does not close another) unless a single-open-at-a-time variant is explicitly used.

**Acceptance Scenarios**:

1. **Given** a collapsed Accordion item, **When** the user clicks or activates its summary/trigger via keyboard, **Then** its content becomes visible and the trigger's visual state (e.g. icon rotation) reflects the open state.
2. **Given** an open Accordion item, **When** the user activates its trigger again, **Then** the content collapses and the trigger returns to its closed visual state.
3. **Given** multiple independent Accordion items on the same page, **When** one is opened, **Then** the others' states are unaffected.
4. **Given** an Accordion item, **When** a screen reader user navigates to its trigger, **Then** its expanded/collapsed state is announced.

---

### User Story 3 - Tabs (Priority: P3)

A user viewing a page with several related content panels (e.g. product details / reviews / shipping info) can switch between them using a row of tab controls, with only one panel visible at a time, and can navigate between tabs using the keyboard without leaving the tab row.

**Why this priority**: Requires the most interaction logic of the first three components — the WAI-ARIA Tabs pattern's roving tabindex and arrow-key navigation cannot be achieved with pure CSS or native HTML elements, making this the first component in this slice requiring custom JavaScript (matching this project's established threshold: JavaScript is added only when a component's required interaction genuinely cannot be achieved without it, as first established for Modal/Slide-over/Toast in feature 003).

**Independent Test**: Can be fully tested by rendering a Tabs instance with 3+ tabs, verifying only the selected tab's panel is visible, that clicking an unselected tab switches the visible panel and updates `aria-selected`, and that arrow keys move focus between tabs without requiring Tab-key presses between each one.

**Acceptance Scenarios**:

1. **Given** a Tabs component with 3 tabs, **When** it first renders, **Then** exactly one tab is marked selected and only its associated panel is visible.
2. **Given** the Tabs component, **When** the user clicks an unselected tab, **Then** that tab becomes selected, its panel becomes visible, and the previously selected tab's panel becomes hidden.
3. **Given** keyboard focus is on a tab, **When** the user presses the Right or Left arrow key, **Then** focus moves to the next or previous tab respectively (wrapping at the ends) and that tab becomes selected.
4. **Given** keyboard focus is on a tab, **When** the user presses Home or End, **Then** focus moves to the first or last tab respectively.

---

### User Story 4 - Dropdown Menu (Priority: P4)

A user viewing a page with a dropdown-triggering control (e.g. a "More actions" button) can open a menu of discrete actions, select one via mouse or keyboard, and the menu closes automatically after a selection or when the user clicks elsewhere or presses Escape.

**Why this priority**: Requires the most complete interaction contract of the four — toggleable state, keyboard navigation between items, Escape-to-close, and light-dismiss (click-outside-to-close) — making it the natural capstone of this slice, evaluated last so the simpler components' patterns (native-element-first, JS-only-when-required) can inform its design, matching how Toast built on Modal/Slide-over's native `<dialog>` foundation in feature 003.

**Independent Test**: Can be fully tested by opening the Dropdown Menu via mouse and via keyboard, verifying menu items are keyboard-navigable, that selecting an item both fires the expected action and closes the menu, and that the menu closes without a selection when Escape is pressed or when a click occurs outside the menu.

**Acceptance Scenarios**:

1. **Given** a closed Dropdown Menu, **When** the user clicks or activates its trigger via keyboard, **Then** the menu opens and keyboard focus moves to the first menu item.
2. **Given** an open Dropdown Menu, **When** the user presses the Down or Up arrow key, **Then** focus moves to the next or previous menu item respectively (wrapping at the ends).
3. **Given** an open Dropdown Menu, **When** the user activates a menu item, **Then** that item's action fires and the menu closes, returning focus to the trigger.
4. **Given** an open Dropdown Menu, **When** the user presses Escape, **Then** the menu closes without firing any item's action and focus returns to the trigger.
5. **Given** an open Dropdown Menu, **When** the user clicks anywhere outside the menu, **Then** the menu closes without firing any item's action.

---

### Edge Cases

- What happens when an Accordion item's content is long enough to require scrolling within the viewport — does expanding it push subsequent page content down predictably, with no layout jump on the triggering element itself?
- How does the Breadcrumbs component render when there is only one level (just the current page, no ancestors) — is the trail still rendered, or omitted entirely?
- How does the Breadcrumbs component handle a very long trail (5+ levels) or a very long individual label on narrow viewports — does it wrap, truncate, or scroll horizontally?
- What happens when a Tabs component's tab labels are long enough that the tab row would overflow its container on a narrow viewport?
- What happens when a Dropdown Menu is triggered near the bottom or right edge of the viewport — does the menu reposition to stay fully visible, or is off-screen rendering out of scope for this slice?
- What happens when a Dropdown Menu item is disabled — is it skipped during arrow-key navigation, same as the established disabled-state skip behavior for other interactive components in this system?
- How does a Dropdown Menu behave if opened, and then the trigger it belongs to is itself inside a Tabs panel that becomes hidden (tab switched away) while the menu is still open?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Breadcrumbs component MUST render an ordered list of ancestor levels as links, with the current page rendered as non-interactive text, inside a `<nav>` landmark distinct from the page's primary navigation.
- **FR-002**: The Breadcrumbs component MUST require zero custom JavaScript.
- **FR-003**: The Accordion/Disclosure component MUST use the native `<details>`/`<summary>` element as its interaction foundation, styled with Tailwind to replace default browser chrome with on-brand visual treatment (including an open/closed state indicator).
- **FR-004**: Each Accordion/Disclosure instance's open/closed state MUST be independent of every other instance on the same page unless a component variant explicitly documents single-open-at-a-time (accordion-exclusive) behavior.
- **FR-005**: The Tabs component MUST implement the WAI-ARIA Tabs authoring pattern: a `tablist` containing `tab` elements with `aria-selected` state, each associated via `aria-controls`/`aria-labelledby` with a `tabpanel`, and roving tabindex so only the selected tab is in the page's normal Tab order.
- **FR-006**: The Tabs component MUST support Left/Right arrow-key navigation between tabs (wrapping at the first/last tab) and Home/End to jump to the first/last tab, without requiring the browser's default Tab key to move between individual tabs.
- **FR-007**: The Tabs component MUST show exactly one tab panel at a time, matching the currently selected tab.
- **FR-008**: The Dropdown Menu component MUST support opening via both mouse click and keyboard activation of its trigger, with focus moving into the menu's item list on open.
- **FR-009**: The Dropdown Menu component MUST support Up/Down arrow-key navigation between menu items (wrapping at the first/last item).
- **FR-010**: The Dropdown Menu component MUST close on Escape, on item selection, and on an outside click, returning keyboard focus to the trigger element in every case.
- **FR-011**: All four components MUST be built exclusively on the semantic design tokens ratified in the project constitution — zero raw Tailwind palette (color) classes.
- **FR-012**: All four components MUST pass WCAG 2.2 AAA contrast requirements for all text and meaningful non-text UI (borders, focus indicators) they introduce.
- **FR-013**: Every interactive `<button>` or `<a>` introduced by these four components MUST declare the full interactive state set (default, hover, active, focus-visible, disabled) unconditionally, per the project constitution's Principle V (Interactive State Completeness, NON-NEGOTIABLE) — "applicable" is not an escape hatch for a literal `<button>`/`<a>` element. Native elements outside Principle V's literal `<button>`/`<a>` scope (e.g. Accordion's `<summary>`) are addressed by the corresponding component contract on a case-by-case basis, not exempted by this requirement.
- **FR-014**: This feature MUST NOT include a React port of any of the four components — that is explicitly out of scope and reserved for a separate future feature, matching the sequencing already used for features 001-003's eventual React port in feature 004.
- **FR-015**: Each of the four components MUST be independently viewable on its own standalone gallery page, consistent with every prior feature's "Independent Test" requirement.

### Key Entities

- **Breadcrumb Trail**: An ordered sequence of navigable levels (label + link) ending in the current, non-interactive page.
- **Accordion Item**: A single disclosure unit with a trigger (summary) and associated content, with an open/closed state.
- **Tab Set**: A collection of mutually exclusive tabs, each associated with exactly one content panel; exactly one tab is selected at a time.
- **Dropdown Menu**: A trigger element and an associated list of discrete, selectable action items, with an open/closed state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A keyboard-only user can operate all four components' full interaction surface (Breadcrumbs navigation, Accordion expand/collapse, Tabs switching, Dropdown Menu open/navigate/select/dismiss) without ever requiring a mouse.
- **SC-002**: All text and meaningful non-text UI introduced by the four components passes automated WCAG 2.2 AAA contrast checks with zero exceptions.
- **SC-003**: Zero raw (non-semantic-token) Tailwind color classes appear in any of the four components' shipped markup, verified by this project's existing automated token-discipline audit.
- **SC-004**: A developer unfamiliar with this design system can correctly compose a working Tabs instance with 3 panels, using only the component's own standalone gallery page as reference, in under 5 minutes.
- **SC-005**: The Dropdown Menu and Tabs components' keyboard interaction matches the WAI-ARIA Authoring Practices Guide reference pattern closely enough that an automated accessibility audit (axe-core or equivalent) reports zero violations.

## Assumptions

- This feature targets the same browser support baseline as features 001-004 (current evergreen browsers: Chrome, Firefox, Safari) — no legacy browser fallbacks are in scope.
- The native Popover API (`popover` attribute / `togglePopover()`) is a planning-phase implementation decision, not a scope decision; if research during `/speckit-plan` finds it insufficient for Dropdown Menu's light-dismiss and positioning needs, the spec's functional requirements (FR-008 through FR-010) remain satisfied by a custom-JavaScript implementation instead.
- "Single-open-at-a-time" Accordion behavior (FR-004's documented exception) is treated as an optional component variant, not a separate component — both behaviors are demonstrated on the Accordion's own gallery page.
- Dropdown Menu items in this slice are simple action triggers (buttons/links) — nested submenus, checkbox items, and radio-group items within the menu are out of scope for this feature and may be addressed in a future slice.
- Viewport-edge repositioning for the Dropdown Menu (keeping the menu on-screen near viewport edges) is in scope only to the extent the chosen implementation approach (native Popover API or custom JS) provides it without significant additional complexity; a minimal, always-downward-opening menu is an acceptable v1 fallback, to be confirmed during planning.
