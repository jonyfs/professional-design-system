# Feature Specification: Application Shell Primitives

**Feature Branch**: `007-application-shell-primitives`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Implement the design system's sixth slice of primitives — Navbar, Sidebar, and Pagination — in HTML using Tailwind CSS, built exclusively on the semantic design tokens already ratified in the project constitution. These complete the Application Shell expansion of the Component Catalog (the constitution already has ratified-but-never-implemented Navbar/Header and Sidebar patterns in its Application & Navigation section). Following the established pattern from every prior static-HTML feature, this feature builds the static HTML + Tailwind reference implementation only — a React port is an explicit non-goal. Navbar and Sidebar are expected to need zero or near-zero JavaScript (a responsive mobile menu toggle may need a small amount); Pagination is expected to need zero JavaScript (plain links with aria-current, same pattern as Breadcrumbs' current-page marker). All three components must pass WCAG 2.2 AAA contrast and zero raw Tailwind palette classes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pagination (Priority: P1)

A user viewing a paginated list of results (search results, a table, a list of records) sees a row of page-number controls and can navigate to the next, previous, or a specific page, with the current page clearly marked.

**Why this priority**: Simplest of the three (no responsive/collapsing behavior, no dark-mode-adjacent color choices) and, like Breadcrumbs before it, achievable with zero JavaScript via plain links and `aria-current` — giving an immediate, independently-testable win before the more layout-heavy Navbar/Sidebar.

**Independent Test**: Can be fully tested by rendering a Pagination control with 5+ pages and verifying the current page is visually and semantically distinct, Previous/Next controls are present and correctly disabled/enabled at the boundaries, and every page link is keyboard-focusable.

**Acceptance Scenarios**:

1. **Given** a Pagination control on page 3 of 5, **When** it renders, **Then** page 3 is visually distinct and marked `aria-current="page"`, while pages 1-2 and 4-5 are plain links.
2. **Given** the Pagination control is on the first page, **When** it renders, **Then** the Previous control is disabled (not just visually dimmed — genuinely non-interactive).
3. **Given** the Pagination control is on the last page, **When** it renders, **Then** the Next control is disabled.
4. **Given** a Pagination control with many pages, **When** it renders, **Then** it can show a truncated set of page numbers (e.g. first, last, current ± 1, with an ellipsis) rather than every page number unconditionally.

---

### User Story 2 - Sidebar (Priority: P2)

A user in an authenticated application sees a vertical navigation panel listing the application's main sections, with the current section clearly highlighted and the others reachable with a single click.

**Why this priority**: Completes the constitution's existing ratified-but-never-implemented Sidebar pattern (`Application & Navigation`), following the same "implement and empirically verify a speculative pattern" process that corrected Breadcrumbs (feature 005) and would apply here too if a gap exists.

**Independent Test**: Can be fully tested by rendering a Sidebar with 4+ navigation items, one marked active, and verifying the active item is visually and semantically distinct, every item is keyboard-focusable, and both the light and dark treatments (both already named in the ratified pattern) render correctly.

**Acceptance Scenarios**:

1. **Given** a Sidebar with several navigation items, **When** it renders, **Then** exactly one item is marked as the active/current section, visually distinct from the rest.
2. **Given** a Sidebar item, **When** a pointer hovers over an inactive item, **Then** it shows a hover state distinct from both its resting and active states.
3. **Given** the Sidebar's dark treatment variant, **When** it renders, **Then** all text and interactive states remain AAA-compliant against the dark background, not just the light variant.

---

### User Story 3 - Navbar / Header (Priority: P3)

A user on any page of the application sees a persistent header at the top of the viewport containing primary navigation and/or branding, which remains visible while scrolling, and collapses to a compact menu control on narrow viewports.

**Why this priority**: Ordered last because it has the most responsive-layout complexity of the three (the mobile hamburger menu is this feature's only real candidate for needing JavaScript, if the collapsed menu must toggle open/closed rather than simply linking to a full navigation page) — building on the simpler, established patterns first.

**Independent Test**: Can be fully tested by rendering the Navbar at a wide viewport (full nav visible, no hamburger) and at a narrow viewport (hamburger visible, full nav hidden or collapsed), and confirming the header remains pinned to the top of the viewport while the page scrolls.

**Acceptance Scenarios**:

1. **Given** a wide viewport, **When** the Navbar renders, **Then** the full navigation links are visible and the hamburger control is hidden.
2. **Given** a narrow viewport, **When** the Navbar renders, **Then** the hamburger control is visible or the equivalent compact treatment is used, and it has an accessible name and adequate touch target size.
3. **Given** the Navbar is rendered, **When** the page is scrolled, **Then** the Navbar remains pinned to the top of the viewport with a background that keeps content underneath legible (per the ratified `backdrop-blur-md bg-white/80` treatment).

---

### Edge Cases

- What happens when a Pagination control has only one page total — is the entire control hidden, or does it render with both Previous/Next disabled and only page 1 shown?
- How does Pagination's page-number truncation behave when the current page is near the very start or very end of the range (does the ellipsis appear on only one side)?
- What happens when a Sidebar item's label is too long to fit on one line — does it wrap, truncate with an ellipsis, or overflow?
- What happens when the Navbar's mobile menu (if it opens/closes via JavaScript) is opened and the viewport is then resized to a wide breakpoint — does the now-irrelevant open state get reset?
- How does the Navbar's `backdrop-blur-md bg-white/80` treatment behave in a browser that doesn't support `backdrop-filter` — is there a solid-background fallback so underlying content is never illegible?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Pagination component MUST mark the current page with `aria-current="page"` and render it as visually distinct from other page links.
- **FR-002**: The Pagination component MUST render Previous/Next controls that are genuinely disabled (not merely styled) at the first/last page respectively.
- **FR-003**: The Pagination component MUST support a truncated page-number display (ellipsis) for ranges too large to show every page number, showing at minimum the first page, the last page, and pages adjacent to the current one.
- **FR-004**: The Pagination component MUST require zero JavaScript.
- **FR-005**: The Sidebar component MUST mark exactly one navigation item as active/current, visually distinct from inactive items, and MUST support both the light and dark treatments already named in the ratified constitution pattern.
- **FR-006**: The Navbar component MUST remain pinned to the top of the viewport during scroll, with a background treatment that keeps underlying content from showing through illegibly, including a fallback for browsers without `backdrop-filter` support.
- **FR-007**: The Navbar component MUST show a compact/hamburger control at narrow viewports (below the existing ratified `lg:hidden` breakpoint) with an accessible name and a touch target of at least 44×44px (per Principle I's Fitts's Law mandate), and MUST show full navigation at wide viewports.
- **FR-008**: All three components MUST be built exclusively on the semantic design tokens ratified in the project constitution — zero raw Tailwind palette (color) classes.
- **FR-009**: All three components MUST pass WCAG 2.2 AAA contrast requirements for all text and meaningful non-text UI they introduce, verified empirically via axe-core, not assumed from an existing ratified pattern (per features 005/006's established discipline — a ratified pattern is a starting hypothesis, not a guarantee, until a real component actually implements and tests it).
- **FR-010**: Any interactive element introduced MUST declare the full Principle V interactive state set (hover, active, focus-visible, disabled where applicable) using the literal `disabled:opacity-50 disabled:cursor-not-allowed` pattern where a disabled state applies — never a custom color-only substitute.
- **FR-011**: This feature MUST NOT include a React port of any of the three components — that is explicitly out of scope and reserved for a separate future feature.
- **FR-012**: Each of the three components MUST be independently viewable on its own standalone gallery page, and each new page MUST be registered as a Vite build entry point, consistent with feature 005/006's corrected build-input discipline.

### Key Entities

- **Pagination**: An ordered sequence of page links with a current page and Previous/Next controls.
- **Sidebar**: A vertical list of navigation items with exactly one marked active/current.
- **Navbar / Header**: A persistent, viewport-pinned header containing navigation and/or branding, with a responsive collapse behavior at narrow viewports.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A keyboard-only user can operate all three components' full interaction surface (Pagination's page/Previous/Next links, Sidebar's navigation items, Navbar's links and mobile menu control) without a mouse.
- **SC-002**: All text and meaningful non-text UI introduced by the three components passes automated WCAG 2.2 AAA contrast checks with zero exceptions, including the Sidebar's dark treatment.
- **SC-003**: Zero raw (non-semantic-token) Tailwind color classes appear in any of the three components' shipped markup, verified by this project's existing automated token-discipline audit.
- **SC-004**: A screen reader user can determine, from Pagination alone, which page they are currently viewing without any additional visual context.
- **SC-005**: A developer unfamiliar with this design system can correctly compose a Sidebar with an active item highlighted, using only its own standalone gallery page as reference, in under 5 minutes.

## Assumptions

- This feature targets the same browser support baseline as every prior feature (current evergreen browsers: Chrome, Firefox, Safari).
- Pagination's page-number truncation logic is static, consumer-composed markup for this reference implementation (like Avatar's initials, feature 006) — a real application would compute the truncated range server-side or via its own routing logic; this feature demonstrates the resulting markup pattern, not a JavaScript pagination-math utility.
- Sidebar's "active item" state is static per-page markup (the server/router marks which link is active when rendering the page), not a client-side JavaScript highlighting mechanism — consistent with how every other "current state" primitive in this project (Breadcrumbs' current page, Tabs' selected tab prior to interaction) is initially rendered.
- Navbar's mobile menu, if it requires open/closed toggling rather than linking to a separate navigation view, uses the minimum JavaScript needed (evaluated during planning whether the native `<details>`/`<summary>` pattern already proven for Accordion, or the Popover API already proven for Dropdown Menu, can provide this without a new custom mechanism).
- "Sidebar" in this feature ships as a single-level (non-nested) navigation list; multi-level/expandable sidebar sections are out of scope and may be addressed in a future slice if needed.
