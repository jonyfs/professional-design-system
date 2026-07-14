# Feature Specification: Gallery Theme Selector

**Feature Branch**: `[021-gallery-theme-selector]`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "ajuste a página index.html para que funcione com a selecao de temas para que seja possível ver como vai ficar o Professional Design System com temas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preview the Whole Catalog Under Any Theme (Priority: P1)

A user browsing the main component gallery (`index.html` — the page
listing every shipped component with a link to its own demo) wants to see
what the entire catalog looks like under a specific theme without leaving
that page or jumping between dozens of individual component demos. They
select a theme from a control on the gallery page itself, and every
component card, heading, and link on that same page instantly restyles to
match.

**Why this priority**: The gallery page is this catalog's single highest-
value surface for judging a theme's real-world feel — it already shows
~50 component cards in one place. Without this, judging a theme requires
either the separate Theme Gallery page's small fixed preview sample, or
manually opening dozens of individual component pages one at a time.

**Independent Test**: Open the gallery page, select a non-default theme
from the new control, and confirm every visible component card's colors
update to match that theme — fully testable without any other feature
existing.

**Acceptance Scenarios**:

1. **Given** the gallery page loaded with the default theme, **When** the
   user selects a different theme from the control, **Then** every
   component card's border, background, and text colors update to match
   the newly selected theme within the same interaction, with no page
   reload.
2. **Given** the gallery page with a theme already selected, **When** the
   user scrolls through the page, **Then** every card — not just the ones
   visible at selection time — reflects the selected theme.
3. **Given** the theme control, **When** the user opens it, **Then** every
   theme in the catalog's curated collection is available to choose from,
   organized so that finding a specific theme among the full set is not a
   flat, unlabeled list.

---

### User Story 2 - Theme Choice Persists Across Visits (Priority: P2)

A user who selected a theme on the gallery page navigates away (e.g. to a
component's own demo page) and later returns to the gallery, or reloads
the page. Their previously selected theme is still applied — they don't
have to re-select it.

**Why this priority**: Re-selecting the same theme on every visit is
exactly the friction this catalog's existing theme-persistence mechanism
(feature 017) was built to remove; this story simply extends that
established behavior to the gallery page's new control.

**Independent Test**: Select a theme on the gallery page, reload the page
directly, and confirm the same theme is still applied and still reflected
as the selected option in the control — testable independently of User
Story 1's live-restyle behavior.

**Acceptance Scenarios**:

1. **Given** a theme selected on the gallery page, **When** the page is
   reloaded, **Then** the same theme is applied before the page's first
   paint (no flash of the previous/default theme) and the control shows
   it as selected.
2. **Given** a theme selected on the gallery page, **When** the user
   navigates to any individual component's own demo page and back,
   **Then** the gallery page still reflects the previously selected
   theme.

---

### User Story 3 - Control Stays Usable Alongside the Dedicated Theme Gallery (Priority: P3)

A user who wants the full curated browsing/comparison experience (mood-
family grouping, per-theme cards, live preview sample) still has the
existing dedicated Theme Gallery page for that; the new gallery-page
control is a lightweight complement, not a replacement, and a choice made
in either place is reflected in the other.

**Why this priority**: Avoids fragmenting theme selection into two
disconnected mechanisms — lower priority since both P1 and P2 already
deliver the core value independently of this consistency guarantee.

**Independent Test**: Select a theme via the dedicated Theme Gallery
page, navigate to the main gallery page, and confirm its new control
already shows that same theme selected — testable independently by
reversing which page the selection happens on first.

**Acceptance Scenarios**:

1. **Given** a theme selected via the dedicated Theme Gallery page,
   **When** the user opens the main gallery page, **Then** the new
   control reflects that same theme as selected and every card is
   already restyled accordingly.

---

### Edge Cases

- What happens when the browser blocks or throws on `localStorage` access
  (blocked storage, sandboxed iframe, some private-browsing
  configurations)? The theme MUST still apply for the current page view;
  only the cross-visit persistence is lost, matching this catalog's
  existing theme-persistence degradation behavior.
- What happens when a previously stored theme selection no longer exists
  in the current curated collection (e.g. a theme was removed in a future
  update)? The gallery MUST fall back to the default theme rather than
  applying nothing or erroring, matching existing behavior.
- What happens at narrow viewport widths (320px)? The theme control MUST
  remain fully usable and MUST NOT cause horizontal overflow or overlap
  with the page title.
- What happens when the control is operated via keyboard only? Every
  theme MUST be selectable and the current selection MUST be announced,
  with no mouse-only interaction path.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The main gallery page MUST expose a theme-selection control
  usable directly on that page, without navigating to any other page.
- **FR-002**: Selecting a theme in this control MUST restyle every
  component card and other themed element on the same page instantly,
  using this catalog's existing runtime theme-switching mechanism — no
  page reload.
- **FR-003**: The control MUST list every theme in the catalog's current
  curated collection, sourced from the same single source of truth every
  other themed surface in this catalog already uses — never a separately
  maintained/hardcoded list that could drift out of sync.
- **FR-004**: The control MUST reflect the currently active theme
  (whichever theme is already applied via this catalog's existing
  persistence/resolution behavior) as its selected value when the page
  loads.
- **FR-005**: Selecting a theme in this control MUST persist that choice
  using this catalog's existing cross-page theme persistence mechanism,
  so the choice is remembered on a later visit to this or any other page.
- **FR-006**: The control MUST organize the full theme collection so that
  locating a specific theme among the complete set does not require
  scanning an unlabeled flat list — themes MUST be grouped in a way that
  reflects this catalog's existing thematic groupings.
- **FR-007**: Switching themes via this control MUST NOT reload the page
  and MUST NOT reset the user's current scroll position.
- **FR-008**: This feature MUST NOT change the behavior, markup
  ownership, or theming mechanism of any individual component's own demo
  page — those pages already independently support the existing
  theme-switching mechanism from prior work.
- **FR-009**: The control MUST be fully operable via keyboard alone and
  MUST expose an accessible label identifying its purpose.
- **FR-010**: The gallery page MUST continue to link to the dedicated
  Theme Gallery page — this feature is an additional, lightweight way to
  preview a theme, not a replacement for the dedicated browsing/
  comparison experience.

### Key Entities

- **Gallery Theme Selection**: The theme currently applied to the main
  gallery page's view — resolved from and persisted through this
  catalog's existing cross-page theme state, not a separate, page-local
  state.
- **Theme Collection**: The full existing set of curated themes (already
  defined elsewhere in this catalog) this control reads from to populate
  its options — this feature introduces no new theme entries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can preview the entire visible component catalog
  under any theme in the curated collection without leaving the main
  gallery page or triggering a page reload.
- **SC-002**: A theme selected on the gallery page is still applied,
  with zero flash of an incorrect theme, on 100% of subsequent reloads or
  revisits.
- **SC-003**: All themes in the current curated collection are reachable
  from the gallery page's control — zero themes require navigating
  elsewhere to preview against the full catalog.
- **SC-004**: The control introduces zero new accessibility violations
  (keyboard operability and screen-reader labeling verified) and zero
  layout overflow at any of this catalog's supported viewport widths,
  including 320px.
- **SC-005**: A theme selected via the dedicated Theme Gallery page and a
  theme selected via this new control always agree — switching in either
  location is reflected in the other on next view, 100% of the time.

## Assumptions

- **Reuses existing infrastructure exclusively**: this feature adds no
  new theme tokens, no new persistence mechanism, and no new theme-
  resolution logic — it wires the gallery page into this catalog's
  already-shipped runtime theme-switching system (feature 017) and its
  existing single source of truth for the theme collection.
- **Control type**: a single grouped selection control (options organized
  by this catalog's existing thematic groupings) is assumed sufficient
  for choosing among the full curated collection from one compact
  control — matching this catalog's general preference for native,
  minimal-JavaScript form controls over bespoke widgets wherever a native
  control meets the need.
- **Complements, does not replace, the dedicated Theme Gallery page**:
  that page's richer per-theme card browsing/comparison experience remains
  the primary "explore and compare themes" surface; this feature's
  control is a fast "preview against everything on this page" shortcut
  reachable without navigating away.
- **No new component markup changes**: every individual component's own
  demo page is unaffected by this feature — they already independently
  respond to the same underlying theme-switching mechanism.
