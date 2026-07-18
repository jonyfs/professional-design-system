# Feature Specification: Navigation Micro-Patterns

**Feature Branch**: `031-navigation-micro-patterns`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "implemente as primitivas de Navigation
micro-patterns identificadas no inventário da feature 018 (Team/
Workspace Switcher, Language Switcher, Back-to-Top Button, Scroll
Progress Bar, Onboarding Tour/Coachmark) — uma categoria que reutiliza
fortemente componentes já existentes (Dropdown Menu, Avatar, Progress,
Popover)."

**Source (verified, not assumed)**: `specs/018-component-gap-inventory/
research.md`'s "Navigation micro-patterns (6)" category — 1/6 already
shipped (Avatar Group/Stack, feature 023), 5/6 remaining before this
feature.

**Dependency note, verified directly against real source, not
assumed**: the inventory's own note for Back-to-Top Button says it
"reuses Button + Affix's scroll-threshold logic once built" — Affix
(inventory item 41, a different category, Overlays) has NOT been
built. This mirrors the exact situation feature 030 already handled
for Session Timeout Modal/Countdown Timer: this feature ships only the
minimal scroll-threshold visibility logic Back-to-Top itself needs,
NOT a standalone, separately reusable "Affix" primitive (out of
scope, a different category's future feature).

This feature ships the remaining **5** items: Team/Workspace Switcher,
Language Switcher, Back-to-Top Button, Scroll Progress Bar, Onboarding
Tour/Coachmark.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switching identity context via a dropdown (Priority: P1)

A user working across multiple teams/workspaces, or in a multi-
language product, needs a quick dropdown to switch context — reusing
this catalog's existing Dropdown Menu panel mechanics rather than a
bespoke new interaction.

**Why this priority**: Both items are pure content variants of an
already-shipped mechanism (Dropdown Menu + Avatar) — the lowest-risk,
most broadly applicable items in this batch.

**Independent Test**: Open the Team/Workspace Switcher — confirm it
lists workspaces with avatars and updates the visible "current"
selection. Open the Language Switcher — confirm it lists languages and
updates the visible "current" selection.

**Acceptance Scenarios**:

1. **Given** a user has access to multiple workspaces, **When** they
   open the Team/Workspace Switcher, **Then** a Dropdown-Menu-style
   panel lists each workspace with its Avatar, and selecting one
   updates the visible current-workspace indicator.
2. **Given** a product supports multiple languages, **When** a user
   opens the Language Switcher, **Then** a Dropdown-Menu-style panel
   lists each language, and selecting one updates the visible
   current-language indicator.

---

### User Story 2 - Scroll-position-driven feedback (Priority: P2)

A user reading a long page wants to know how far they've scrolled
(Scroll Progress Bar) and a quick way back to the top (Back-to-Top
Button) — both driven by the same scroll position, reusing this
catalog's existing Progress fill mechanism and Button respectively.

**Why this priority**: Genuinely useful on any long page, moderate
implementation novelty (this catalog's first scroll-position-driven
visual feedback), lower priority than US1 since it's page-furniture
rather than a core navigation action.

**Independent Test**: Scroll down a long demo page — confirm the
progress bar's fill grows proportionally and the Back-to-Top button
appears past a scroll threshold, disappearing near the top again.

**Acceptance Scenarios**:

1. **Given** a user scrolls down a page, **When** their scroll
   position changes, **Then** the Scroll Progress Bar's fill (Progress's
   existing `.progress-fill` mechanism) updates to reflect the
   percentage scrolled.
2. **Given** a user has scrolled past a threshold, **When** they view
   the page, **Then** the Back-to-Top Button becomes visible, and
   activating it smoothly returns to the top and the button
   disappears again.

---

### User Story 3 - Sequential guided walkthrough (Priority: P3)

A new user needs a guided tour highlighting key page elements in
sequence, using this catalog's existing Popover positioning mechanism
with an added step-sequencing layer (next/previous/skip).

**Why this priority**: The most novel item in this batch (this
catalog's first multi-step sequencing UI) and the narrowest individual
use case (onboarding-specific, not a persistent navigation aid).

**Independent Test**: Start the tour — confirm each step highlights a
different page element via a positioned panel, Next/Previous move
between steps correctly at both ends, and Skip/complete both end the
tour cleanly.

**Acceptance Scenarios**:

1. **Given** a tour is started, **When** each step activates, **Then**
   a Popover-style panel appears anchored to that step's target
   element, with the target visually highlighted.
2. **Given** a user is mid-tour, **When** they select Next or
   Previous, **Then** the tour advances or retreats one step, with the
   step indicator (e.g. "2 of 4") updated.
3. **Given** a user is on the tour's last step, **When** they select
   the final action, **Then** the tour ends and no panel remains open.

---

### Edge Cases

- What happens if Back-to-Top's scroll threshold logic runs on a page
  shorter than the viewport (no meaningful scroll possible)? The
  button MUST simply never appear (threshold never crossed), not error.
- What happens if the Scroll Progress Bar's page has zero scrollable
  height? It MUST render at 0% (or be omitted), never divide by zero
  or show `NaN`/negative width.
- What happens if a user navigates away mid-Onboarding-Tour? The tour
  MUST NOT persist step state across a reload — starting it again
  always begins at step 1 (a presentation-layer demo, not a
  once-per-user "seen this tour" persistence feature).
- What happens to the Team/Workspace Switcher and Language Switcher's
  "current selection" state on reload? No persistence is introduced by
  this feature (spec.md Assumptions) — the demo resets to its initial
  selection on reload, consistent with how this catalog's other
  Dropdown-Menu-based demos (e.g. existing Dropdown Menu itself) work.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Team/Workspace Switcher and a
  Language Switcher, both composing this catalog's existing Dropdown
  Menu panel mechanics (native Popover API, `popovertarget`/
  `popover="auto"`) verbatim; the Team switcher additionally composes
  Avatar.
- **FR-002**: System MUST provide a Back-to-Top Button that appears
  only past a scroll threshold and smoothly scrolls to the top when
  activated, and a Scroll Progress Bar reusing Progress's existing
  `.progress-track`/`.progress-fill` mechanism driven by scroll
  position instead of a fixed value.
- **FR-003**: System MUST NOT ship a standalone, separately reusable
  "Affix" primitive — Back-to-Top's scroll-threshold logic is scoped
  to what it itself needs (documented dependency note above).
- **FR-004**: System MUST provide an Onboarding Tour/Coachmark with at
  least 3 sequential steps, each anchoring a positioned panel to a
  distinct target element, with Next/Previous/Skip controls and a
  visible step indicator.
- **FR-005**: Every new primitive MUST ship on both this catalog's
  existing surfaces (static HTML and React), per the dual-surface
  convention.
- **FR-006**: None of the 5 primitives MUST introduce a new design
  token — reuse this catalog's existing brand/semantic/neutral set.
- **FR-007**: Every new primitive MUST meet this catalog's existing
  WCAG AAA contrast bar; the Onboarding Tour's step sequence and
  Back-to-Top's appearance/disappearance MUST be operable via
  keyboard, not mouse-only.

### Key Entities

- **Switcher Option** (Team/Workspace, Language): an id, a display
  label, and (Team switcher only) an Avatar reference; one option is
  the "current" selection at any time.
- **Scroll Position State**: a derived percentage (0-100) and a
  boolean past-threshold flag — both computed live from
  `window.scrollY`/document height, no persistence.
- **Tour Step**: a target element reference, a title/description, and
  its position in the sequence (1-indexed) — demo-defined, static, not
  dynamically generated from arbitrary page content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 5 remaining primitives ship, closing feature 018's
  inventory's Navigation micro-patterns category from 1/6 (Avatar
  Group already shipped) to 6/6 — the third category (after Layout &
  Structure and Consent & System Messaging) to reach 100%.
- **SC-002**: Zero new design tokens introduced — 100% verified via
  this catalog's existing token audit.
- **SC-003**: Scroll Progress Bar and Back-to-Top Button both reflect
  real scroll position with zero drift from a manual scroll, verified
  by Playwright scrolling the page directly, not simulating the
  underlying event.
- **SC-004**: The Onboarding Tour is fully keyboard-operable
  (Next/Previous/Skip all reachable and activatable without a mouse),
  verified directly, not assumed from using native buttons alone.

## Assumptions

- **No persistence for any of the 5 primitives**: Switcher selections,
  scroll-derived state, and tour progress all reset on reload — no new
  storage mechanism is introduced by this feature.
- **Onboarding Tour targets are demo-page elements**: the tour is a
  pattern demonstration (a fixed 3-4 step sequence against elements on
  its own demo page), not a generic "attach a tour to any app" runtime
  authoring tool.
- **React port for every primitive**: all 5 ship a React component
  wrapper too, per this catalog's existing dual-surface convention.
- **No de-duplication conflict**: none of the 5 items appear in
  feature 018's own "Flagged for de-duplication review" list.
