# Tasks: Material Catalog Layout

**Input**: Design documents from `/specs/040-material-catalog-layout/`
**Prerequisites**: plan.md

## Phase 1: Setup

- [ ] T001 Add sidebar/hero/uniform-grid Tailwind component classes to
  `src/styles/tailwind.css` (alongside the existing `.showcase-card` rules
  at L46-81): `.catalog-sidebar`, `.catalog-sidebar-item`,
  `.catalog-sidebar-item-active`, `.catalog-hero`, reusing existing
  `neutral-*`/`brand-*` token classes only (no new hex/rgb values).
- [ ] T002 [P] Update `.showcase-grid` in `src/styles/tailwind.css`
  (L79-81) to a fixed 3-column-max grid (`grid-cols-1 sm:grid-cols-2
  lg:grid-cols-3`), and delete `.showcase-card-wide` /
  `.showcase-card-large` (L62-67) now that every card uses
  `.showcase-card-standard` only.

## Phase 2: User Story 1 — Browse every category from a persistent sidebar (P1)

**Goal**: A fixed, always-visible sidebar lists all 10 categories;
clicking one scrolls to that section; the sidebar marks the currently
in-view category as active; fully keyboard-reachable.

**Independent Test**: Load the homepage, scroll partway down, click a
sidebar category link, confirm the page jumps to that section while the
sidebar stays fixed and marks it active; Tab through the sidebar and
confirm every link is reachable with a visible focus indicator.

- [ ] T003 [P] [US1] Write failing tests in new
  `tests/e2e/material-catalog-layout.spec.ts` for: sidebar visible at any
  scroll position (FR-001/FR-002), clicking a category scrolls without
  full reload (FR-003), active-state updates on manual scroll (FR-003),
  full keyboard reachability with visible focus (FR-004), and instant
  (non-animated) jump under `prefers-reduced-motion` (FR-011) — following
  `tests/e2e/*.spec.ts`'s existing structure.
- [ ] T004 [US1] Replace `index.html`'s `<nav aria-label="Jump to
  category">` (L100) with a persistent left `<aside>` sidebar listing all
  10 categories (Application & Navigation, Forms/Validation & Inputs,
  Data Display & Listings, Overlays/Modals & Feedback, Navigation &
  Disclosure, Advanced Forms & Interaction, Composed Examples, Theming,
  Layout & Structure, Consent & System Messaging), each item linking to
  its existing `<section id="...">` anchor (L117-1451), using the
  `.catalog-sidebar`/`.catalog-sidebar-item` classes from T001.
- [ ] T005 [US1] Create `src/scripts/catalog-sidebar.js` (following this
  directory's existing one-module-per-behavior convention, e.g.
  `affix.js`) implementing an `IntersectionObserver` that toggles
  `.catalog-sidebar-item-active` on the sidebar item matching whichever
  `<section id="...">` is currently in view; wire the script into
  `index.html`.
- [ ] T006 [US1] In `catalog-sidebar.js`, branch the click-to-scroll
  behavior on `window.matchMedia('(prefers-reduced-motion: reduce)')` —
  instant jump (`scrollIntoView({ behavior: 'auto' })`) when set, smooth
  scroll otherwise — until T003's reduced-motion test passes.
- [ ] T007 [US1] Below a defined breakpoint (matching this catalog's
  existing responsive breakpoints), collapse the sidebar into the
  existing `slide-over` drawer pattern (`src/components/slide-over/`) —
  a toggle control opens/closes it, every category link remains reachable
  — until T003's keyboard/reachability tests pass at narrow viewports.

**Checkpoint**: Story 1 independently testable — sidebar navigation fully
functional before Stories 2/3 begin.

## Phase 3: User Story 2 — Understand the catalog's scale from the hero (P2)

**Goal**: A hero region above the first category section states the
catalog's real, verifiable numbers (component count, surface count,
contrast level, theme count), legible at 320/768/1440px, AAA-contrast
compliant in every theme.

**Independent Test**: Load the homepage, confirm the hero renders above
the first category section with headline + subtitle legible at
320/768/1440px.

- [ ] T008 [P] [US2] Write failing tests in
  `tests/e2e/material-catalog-layout.spec.ts` for: hero renders above the
  first category section with a headline + subtitle (FR-005), and
  legibility/no-overflow at 320/768/1440px (SC-004).
- [ ] T009 [US2] Add a hero region to `index.html` above
  `<section id="app-nav">` (L117), replacing/absorbing the existing
  showcase intro block (L33+), using the `.catalog-hero` class from T001
  and this catalog's real current numbers (123 components, dual-surface
  guarantee, AAA contrast, 119 themes) — no invented marketing copy.

**Checkpoint**: Story 2 independently testable — hero ships without
depending on Story 1's sidebar or Story 3's grid changes.

## Phase 4: User Story 3 — Scan components in a uniform, predictable grid (P3)

**Goal**: Every card in every category renders at the same size (preview,
name, description) in a grid that's 3 columns on desktop and reflows
responsively, with zero components dropped.

**Independent Test**: Open any category, confirm every card shares the
same width/height ratio, and the grid reflows 3→2→1 columns with no
overflow as the viewport narrows.

- [ ] T010 [P] [US3] Write failing tests in
  `tests/e2e/material-catalog-layout.spec.ts` for: uniform card
  width/height within a category (FR-006), grid reflow with no overflow
  at 320/768/1024/1440px (SC-004), all 123 components still present and
  clickable to their own demo page (FR-009/SC-002), and live preview
  content remains fully visible in the uniform card size (FR-007).
- [ ] T011 [US3] In `index.html`, replace every `showcase-card-wide` and
  `showcase-card-large` class occurrence (e.g. L150, L162, and every
  other flagged occurrence across all 10 `<section>` blocks, L117-1451)
  with `showcase-card-standard`, until T010's uniform-size and
  zero-dropped-component tests pass.

**Checkpoint**: Story 3 independently testable — grid uniformity ships
without depending on Stories 1/2.

## Phase 5: Polish & Cross-Cutting

- [ ] T012 Run `npm run audit:contrast` across all 119 themes against the
  new sidebar/hero/grid surfaces; fix any AAA contrast finding (FR-012,
  SC-003) before merge.
- [ ] T013 Run the full pre-existing Playwright suite (`npm run
  test:e2e`) and confirm zero regressions to any other page or component
  (SC-005).
- [ ] T014 [P] Verify edge cases from spec.md: a category with 1-2
  components leaves empty grid space rather than inventing filler cards;
  a short viewport height scrolls the sidebar independently without
  overlapping content.

## Dependencies

- Phase 1 (Setup) blocks all user story phases — the CSS classes T001/T002
  add are referenced by every story's markup tasks.
- User Stories 1, 2, and 3 (Phases 2-4) have no dependency on each other
  and can be implemented and merged independently once Setup is done —
  each has its own checkpoint above.
- Within each story, the failing-test task ([P]-marked, e.g. T003/T008/T010)
  precedes its implementation tasks, which are not `[P]` since they all
  edit the same `index.html`/`catalog-sidebar.js` files sequentially.
- Phase 5 (Polish) requires all three user stories complete — it audits
  and verifies their combined output.
