# Feature Specification: Data Display Primitives

**Feature Branch**: `006-data-display-primitives`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Implement the design system's fifth slice of primitives — Card, Avatar, and Alert/Banner — in HTML using Tailwind CSS, built exclusively on the semantic design tokens already ratified in the project constitution. These begin the Data Display expansion of the Component Catalog. Following the established pattern from features 001-003 and 005, this feature builds the static HTML + Tailwind reference implementation only — a React port is an explicit non-goal. All three components are expected to need zero or near-zero JavaScript. All three components must pass WCAG 2.2 AAA contrast and zero raw Tailwind palette classes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Avatar (Priority: P1)

A user viewing a list of people (comments, team members, assignees) sees each person represented by a small circular image, or — when no image is available — their initials on a colored background, so every person remains visually identifiable even without a photo.

**Why this priority**: Simplest of the three (pure display, no layout complexity, no dismissal state) and the most reused primitive across other components (Lists already references avatars in the ratified catalog) — establishing it first gives Card and Alert/Banner something concrete to compose with in their own demos.

**Independent Test**: Can be fully tested by rendering an Avatar with a valid image source and confirming it displays as a circle; rendering one with a broken/missing image source and confirming it falls back to displaying initials; and confirming both are legible against their background.

**Acceptance Scenarios**:

1. **Given** an Avatar with a valid image URL, **When** it renders, **Then** the image displays clipped to a circle with appropriate alt text.
2. **Given** an Avatar with no image (or a broken image URL), **When** it renders, **Then** initials (1-2 letters) display on a solid background instead, remaining legible (AAA contrast).
3. **Given** multiple Avatars at different sizes, **When** rendered together, **Then** each maintains a perfect circle and legible initials at its own size.

---

### User Story 2 - Card (Priority: P2)

A user browsing a page with several related pieces of content (products, articles, dashboard summaries) sees each one grouped into a distinct, elevated container with clear visual separation from the page background and from adjacent cards.

**Why this priority**: Second-simplest — a pure layout/container pattern with no interaction state beyond an optional hover elevation, but it composes Avatar and other existing primitives (Badge, Button) in its content area, so it benefits from Avatar already existing.

**Independent Test**: Can be fully tested by rendering 2+ Card instances side by side and confirming each has a visually distinct boundary/elevation from the page background and from each other, with no dependency on any other component to demonstrate the pattern itself.

**Acceptance Scenarios**:

1. **Given** a Card containing a heading, body text, and an action, **When** it renders, **Then** it displays as a single visually-grouped container with clear separation from the surrounding page (border and/or shadow).
2. **Given** a Card that supports hover elevation, **When** a pointer hovers over it, **Then** its shadow/elevation increases to signal interactivity, without any layout shift.
3. **Given** a Card composing an Avatar and a Badge in its content, **When** it renders, **Then** all three components render correctly together with no visual conflicts.

---

### User Story 3 - Alert / Banner (Priority: P3)

A user viewing a page with an important static or page-level notice (a maintenance warning, a success confirmation after a page-level action, an informational callout) sees it clearly set apart from surrounding content with a semantic icon and color indicating its severity, and can dismiss it if it supports dismissal.

**Why this priority**: Ordered last because it is the only one of the three with any interaction surface (an optional dismiss control) and reuses the established `close-icon-btn` pattern and severity-color conventions already proven by Badge (feature 001) and Toast (feature 003), making it the natural capstone that builds on both.

**Independent Test**: Can be fully tested by rendering an Alert/Banner instance of each severity variant and confirming each uses the correct semantic color/icon; for the dismissible variant, confirming the dismiss control removes it from the page and that a screen reader user can perceive its content on page load without needing to interact with it first.

**Acceptance Scenarios**:

1. **Given** an Alert/Banner of a given severity (success, error, warning, info), **When** it renders, **Then** it displays the correct semantic color and icon for that severity, with AAA-safe text contrast.
2. **Given** a dismissible Alert/Banner, **When** the user activates its dismiss control, **Then** it is removed from the page (and the accessibility tree), not just visually hidden.
3. **Given** a non-dismissible Alert/Banner (the default), **When** it renders, **Then** no dismiss control is present at all.
4. **Given** an Alert/Banner is present on page load, **When** a screen reader user navigates the page, **Then** its content and severity are perceivable without requiring any interaction to reveal it (unlike Toast, this is static page content, not a `role="status"`/`aria-live` announcement — FR-011).

---

### Edge Cases

- What happens when an Avatar's `alt` text is missing for an image-based avatar — does the component enforce a required accessible name, or silently allow an unlabeled image?
- How does Avatar's initials fallback behave for a single-word name (one initial) versus a name with 3+ words (does it cap at 2 initials)?
- What happens when a Card's content (heading, body text) is long enough to make cards in the same row visually uneven — is a minimum/consistent height expected, or is variable height acceptable?
- What happens when an Alert/Banner's message text is long enough to wrap onto multiple lines — does the dismiss control (if present) stay aligned to the top of the message, not vertically centered against the full wrapped block?
- How does a dismissible Alert/Banner's dismiss control behave for a keyboard-only user (focus outline, keyboard activation)?
- What happens when several Alert/Banners of different severities appear on the same page — do they maintain independent dismissal state (dismissing one does not affect another)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Avatar component MUST display a circular image when a valid image source is provided, with a required accessible name (`alt` text).
- **FR-002**: The Avatar component MUST fall back to displaying legible initials (derived from a name) on a solid background when no image source is provided or the image fails to load.
- **FR-003**: The Avatar component MUST support at least two sizes (e.g., a small size for dense lists, a larger size for profile-style contexts) while remaining a perfect circle at every size.
- **FR-004**: The Card component MUST render as a single, visually-distinct container (border and/or shadow) separating its content from the surrounding page and from adjacent cards.
- **FR-005**: The Card component MUST support an optional hover-elevation state that increases shadow/depth without causing layout shift.
- **FR-006**: The Alert/Banner component MUST support at least four severity variants (success, error, warning, info), each using the corresponding already-ratified status token and semantic icon.
- **FR-007**: The Alert/Banner component MUST support an optional dismissible variant; activating its dismiss control MUST remove it from the DOM (and therefore the accessibility tree), not merely hide it visually.
- **FR-008**: The Alert/Banner component's non-dismissible (default) variant MUST render no dismiss control at all.
- **FR-009**: All three components MUST be built exclusively on the semantic design tokens ratified in the project constitution — zero raw Tailwind palette (color) classes.
- **FR-010**: All three components MUST pass WCAG 2.2 AAA contrast requirements for all text and meaningful non-text UI they introduce, verified empirically (not assumed from an existing token's use elsewhere) per feature 005's established discipline.
- **FR-011**: The Alert/Banner component MUST be perceivable as static page content on load (no `role="status"`/`aria-live` announcement semantics required, unlike Toast) since it is not a transient, dynamically-appearing notification.
- **FR-012**: Any interactive element introduced (the Alert/Banner dismiss control) MUST declare the full Principle V interactive state set (hover, active, focus-visible, disabled where applicable) using the literal `disabled:opacity-50 disabled:cursor-not-allowed` pattern if a disabled state applies — never a custom color-only substitute.
- **FR-013**: This feature MUST NOT include a React port of any of the three components — that is explicitly out of scope and reserved for a separate future feature.
- **FR-014**: Each of the three components MUST be independently viewable on its own standalone gallery page, and each new page MUST be registered as a build entry point (not just linked from the gallery), consistent with every prior feature's "Independent Test" requirement and feature 005's corrected Vite build-input gap.

### Key Entities

- **Avatar**: A circular visual representation of a person or entity — either an image or an initials-on-background fallback.
- **Card**: A visually-grouped container for related content, optionally supporting a hover-elevated interactive state.
- **Alert / Banner**: A static or dismissible page-level notice with a severity (success/error/warning/info), semantic icon, and message.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can visually distinguish every Alert/Banner severity variant from every other variant without reading its text, using color and icon alone.
- **SC-002**: All text and meaningful non-text UI introduced by the three components passes automated WCAG 2.2 AAA contrast checks with zero exceptions.
- **SC-003**: Zero raw (non-semantic-token) Tailwind color classes appear in any of the three components' shipped markup, verified by this project's existing automated token-discipline audit.
- **SC-004**: A dismissible Alert/Banner, once dismissed, produces zero accessibility-tree traces of its former presence (confirmed by an automated accessibility scan finding no reference to it post-dismissal).
- **SC-005**: A developer unfamiliar with this design system can correctly compose a Card containing an Avatar and a Badge, using only each component's own standalone gallery page as reference, in under 5 minutes.

## Assumptions

- This feature targets the same browser support baseline as every prior feature (current evergreen browsers: Chrome, Firefox, Safari).
- Avatar's initials-fallback logic (deriving 1-2 letters from a name) is presentational markup composed by the consumer (the static HTML contract documents the expected initials markup), not a JavaScript name-parsing utility — consistent with this project's "JavaScript only when a native element/CSS genuinely cannot do it" threshold (features 003/005's precedent), since deriving initials from a name string is a trivial formatting concern for whoever renders the markup, not an interaction requirement.
- Card's optional hover-elevation is a CSS-only `hover:shadow-*` transition — no JavaScript.
- Alert/Banner's optional dismiss control (FR-007) requires the minimum JavaScript needed for DOM removal — evaluated during planning whether this can reuse or closely mirror an existing pattern (e.g., a simplified variant of Toast's dismiss wiring) rather than introducing a wholly new mechanism.
- "Card" in this feature ships as a generic content container; specialized card variants (product cards, stat cards, pricing cards) are out of scope and may be addressed in a future slice if needed.
