# Feature Specification: Sitewide Theme Selector & Persistence

**Feature Branch**: `025-sitewide-theme-persistence`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "faça que todas as páginas do Design
System tenham a seleção de tema conforme @index.html e compartilhem
dados para quando navegar continuar no mesmo tema ao exibir outros
componentes."

(Translation: make every page of the Design System have the theme
selector like index.html, and share data so that navigating keeps the
same theme when viewing other components.)

**Current state (verified, not assumed)**: this catalog's theme system
(feature 017) persists the active theme to `localStorage` under the
`pds-theme` key, and `src/scripts/theme-switcher.js`'s auto-bootstrap
applies the persisted theme before first paint — but only on pages that
actually load that script. As of this writing, that is true for exactly
2 of this catalog's 79 static gallery pages: the root `index.html`
(feature 021's Gallery Theme Selector) and `theme-gallery.html` (feature
017's own theme showcase). The other 77 individual component demo
pages (`button.html`, `text-input.html`, etc.) load neither
`theme-switcher.js` nor the theme `<select>` control — they always
render in the default theme regardless of what the user last selected,
and navigating from the gallery to any component demo silently resets
the visual theme. This feature closes that gap: every static gallery
page gets both the persisted-theme application and the visible selector
control, so the "shared data across navigation" behavior the user asked
for actually holds everywhere, not just on the two pages where it
happens to work today.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Theme persists when navigating to any component page (Priority: P1)

A user browsing the component gallery selects a theme (e.g. a dark
mood-family preset), then clicks "View full demo" on any individual
component card. The component's own demo page renders in the SAME
theme they just selected — not the default — with no visible flash of
the wrong theme first.

**Why this priority**: This is the core, explicitly-requested behavior
("continuar no mesmo tema ao exibir outros componentes") — without it,
the theme selector is only a gallery-page curiosity, not a real,
sitewide feature. Every other part of this feature builds on this
holding true.

**Independent Test**: From the root gallery, select any non-default
theme, click through to any individual component's demo page (e.g.
Button, Modal, Data Table), and confirm that page renders in the
selected theme with no flash of the default theme before it applies.

**Acceptance Scenarios**:

1. **Given** a user has selected a non-default theme on the root
   gallery, **When** they navigate to any individual component's demo
   page, **Then** that page renders in the same theme, applied before
   first paint (no flash of the default theme).
2. **Given** a user is on an individual component's demo page with a
   theme already applied, **When** they navigate to a different
   component's demo page (or back to the gallery), **Then** the same
   theme continues to apply there too.
3. **Given** a user has never selected a theme (a first visit, nothing
   in storage yet), **When** they load any page directly (not
   necessarily the gallery first), **Then** the default theme applies
   consistently — the same fallback behavior feature 017 already
   established for the gallery page.

---

### User Story 2 - Change the theme from any page, not just the gallery (Priority: P1)

A user lands directly on an individual component's demo page (e.g. from
a bookmark, a shared link, or a search result) rather than starting from
the root gallery. They can still find and use a theme selector on that
page, exactly like the one on `index.html`, without needing to first
navigate back to the gallery to change it.

**Why this priority**: Equal priority to Story 1 — the user's request
explicitly asked for every page to have "a seleção de tema conforme
index.html" (the theme selection like index.html), not just for
persistence to work one-way from the gallery outward.

**Independent Test**: Load any individual component's demo page
directly (not via gallery navigation), confirm a theme `<select>`
control is present and pre-populated with every available theme, select
a different one, and confirm the page re-themes immediately.

**Acceptance Scenarios**:

1. **Given** any individual component's demo page loaded directly,
   **When** the page finishes loading, **Then** a theme selector control
   is visible, listing every available theme grouped the same way
   `index.html`'s selector already groups them.
2. **Given** a user changes the theme via that control on a component
   demo page, **When** the change is made, **Then** the page re-themes
   immediately (no reload required) and the new selection persists to
   any other page navigated to afterward (Story 1).

---

### Edge Cases

- What happens on a page where `localStorage` is unavailable (blocked
  storage, sandboxed context, some private-browsing configurations)?
  The existing feature-017 fallback already handles this (in-memory-only
  for that session, default theme on next load) — this feature MUST NOT
  introduce a second, divergent handling path; every page reuses the
  exact same fallback.
- What happens if a page's stored theme value is no longer a
  recognized theme id (e.g. a theme was renamed/removed since it was
  selected)? Falls back to the default theme — reusing feature 017's
  existing `resolveInitialTheme` allowlist-check behavior verbatim, not
  a new check.
- What happens to a page that is not part of the public component
  gallery (e.g. the React package's internal test harness pages under
  `tests/react-harness/`)? Out of scope for this feature — see
  Assumptions.
- What happens when a new component page is added to the catalog after
  this feature ships (e.g. by a future feature)? It MUST follow this
  feature's now-established convention (both scripts + the selector
  markup) from the start, the same way every other cross-cutting,
  every-page convention in this catalog (the CSP meta tag, the
  `page-shell` body class, the back-link) is already expected on every
  new static page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every static gallery page (the root gallery plus every
  individual component demo page) MUST load the existing theme-
  activation script early enough to apply the persisted theme before
  first paint, exactly matching `index.html`'s existing
  `<head>`-level script placement — no page-specific variation.
- **FR-002**: Every static gallery page MUST include a visible theme
  selector control, populated with the same grouped theme list
  `index.html`'s selector already uses, reusing the existing wiring
  script rather than a per-page reimplementation.
- **FR-003**: Selecting a theme on any page MUST persist that choice
  using the existing shared storage mechanism (feature 017's
  `localStorage` key), with no new or parallel persistence mechanism
  introduced.
- **FR-004**: Navigating from any gallery page to any other gallery page
  MUST preserve the previously-selected theme, applied before first
  paint on the destination page.
- **FR-005**: A page loaded with no prior theme selection in storage
  MUST fall back to the same default theme feature 017 already
  established, consistently across every page.
- **FR-006**: The theme selector's visual placement and behavior on
  every individual component demo page MUST be consistent with
  `index.html`'s existing selector (same grouping, same label, same
  control type) — not a bespoke variant per page.
- **FR-007**: This feature MUST NOT modify feature 017's theme data,
  feature 021's selector-population logic, or the `localStorage` key/
  fallback behavior — it is purely a rollout of the already-existing
  mechanism to every page that currently lacks it.

### Key Entities

- **Gallery Page**: any static HTML page in this catalog's public
  component gallery (the root index, the individual component demo
  pages, and purpose-built pages like the Theme Gallery) — the scope
  this feature rolls the existing theme mechanism out to.
- **Active Theme** (existing, feature 017): the currently-selected theme
  id, persisted in `localStorage` and shared identically across every
  Gallery Page after this feature ships.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of this catalog's static gallery pages apply the
  persisted theme before first paint (zero flash-of-wrong-theme),
  verified across a representative sample spanning every component
  category.
- **SC-002**: 100% of this catalog's static gallery pages expose a
  working theme selector control, not just the root gallery.
- **SC-003**: A user selecting a theme on any one page and then
  navigating to any other page sees the same theme applied with zero
  additional action, on 100% of tested page-to-page navigation paths.
- **SC-004**: Zero regressions to any previously-shipped page's
  accessibility, layout, or existing functionality as a result of
  adding the theme scripts/control.

## Assumptions

- **Scope is the public static gallery only**: this feature covers
  every page under `src/components/**/*.html` plus the root
  `index.html` and `theme-gallery.html` — it explicitly does NOT cover
  the React package's internal Playwright test harness pages
  (`tests/react-harness/*.html`), which are testing infrastructure, not
  part of the design system's user-facing documentation/gallery.
- **No new theming mechanism**: this is a rollout of feature 017's
  already-shipped `localStorage`-backed persistence and feature 021's
  already-shipped selector-population script to every page — this
  feature adds zero new theme data, zero new storage keys, and zero new
  UI patterns beyond copying the existing `<head>` script tag and
  `<select>` markup/wiring to pages that don't yet have them.
- **Applies to every page present at implementation time**: including
  any component pages shipped by features still in flight when this
  feature is implemented (e.g. feature 023's new component pages) — the
  convention is "every static gallery page," not a fixed, frozen list.
- **Future pages must follow this convention going forward**: like this
  catalog's other every-page conventions (CSP meta tag, `page-shell`
  body class, back-link), this becomes a documented expectation for any
  new static gallery page, recorded in the constitution alongside this
  feature's own catalog entry.
