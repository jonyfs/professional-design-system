---

description: "Task list for feature implementation"
---

# Tasks: Demo Gallery Visual Showcase

**Input**: Design documents from `/specs/026-demo-gallery-showcase/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright for the redesigned gallery's
navigation/responsive behavior, plus the full pre-existing catalog
suite as the zero-regression backstop (spec.md FR-007/FR-008).

**Organization**: Tasks are grouped by user story (spec.md US1-US3).
US1 (opening section) and US2 (categorized grid) both live inside the
same `index.html` edit — split for traceability, not staged delivery.
US3 (demo-page polish) is a separate, scripted rollout independent of
the other two.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Read every one of the 78 current `index.html` component card entries and map each to its constitution-sourced category (research.md R1) — produce the ordered category → component-list mapping used by T003-T004

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: None beyond T001 — US1/US2 (the `index.html` redesign) and US3 (the demo-page polish script) have no dependency on each other.

**Checkpoint**: Category mapping exists — both remaining phases can proceed independently.

---

## Phase 3: User Story 1 - First Impression Communicates Scope & Quality (Priority: P1) 🎯 MVP

**Goal**: An opening section above the grid communicating scale and differentiators (spec.md US1).

**Independent Test**: Load `index.html` cold, view only the first screen, confirm 2-3 differentiating strengths are identifiable — per spec.md US1's own Independent Test.

### Implementation for User Story 1

- [X] T002 [US1] Draft the opening section content — 3-4 concrete stat/claims (component count, dual-surface guarantee, WCAG AAA commitment, curated theme count), per contracts/gallery-redesign.contract.md and research.md R3
- [X] T003 [US1] Add the opening section to `index.html`, positioned below the existing `<header>` and above the categorized grid

**Checkpoint**: User Story 1 is independently verifiable — the opening section alone communicates scale.

---

## Phase 4: User Story 2 - Categorized, Navigable Browsing with Flagship Distinction (Priority: P1)

**Goal**: The 78-card flat grid reorganized into labeled categories with quick-jump nav and flagship treatment (spec.md US2, FR-002/FR-003/FR-004).

**Independent Test**: Locate any specific category and confirm all its components are grouped together, reachable in 1 interaction from a quick-jump nav — per spec.md US2's own Independent Test.

### Tests for User Story 2

- [X] T004 [P] [US2] Playwright scaffold `tests/e2e/gallery-showcase.spec.ts` covering: every quick-jump link navigates to its category section, all 78 components remain present and findable (SC-002), flagship cards are visually distinct (span 2 columns at `sm:`+) and collapse correctly at 320px, no horizontal overflow at any supported breakpoint

### Implementation for User Story 2

- [X] T005 [US2] Reorganize `index.html`'s 78 component cards into 8 category `<section>`s (the constitution's existing 6 + Composed Examples + Theming, per T001's mapping and research.md R1), each with an `<h2 id="...">` heading
- [X] T006 [US2] Add the quick-jump `<nav>` (native anchor links, research.md R4) between the opening section and the first category
- [X] T007 [US2] Apply flagship treatment (2-column span + "why this matters" line + first-in-category placement) to Data Table, Chart, Command Palette, and Theme Gallery's cards (research.md R2, contracts/gallery-redesign.contract.md)
- [X] T008 [US2] Verify zero components were dropped or duplicated during reorganization (78 cards in, 78 cards out) and every existing "View full demo →" href still resolves correctly

**Checkpoint**: User Story 2 is independently verifiable — categorized browsing and flagship distinction both work.

---

## Phase 5: User Story 3 - Individual Demo Pages Feel Considered (Priority: P2)

**Goal**: A uniform structural polish applied to all 77 component demo pages (spec.md US3, research.md R5).

**Independent Test**: Open any individual demo page directly, confirm clearer visual framing than a bare heading+paragraph+component — per spec.md US3's own Independent Test.

### Tests for User Story 3

- [X] T009 [P] [US3] Extend `tests/e2e/gallery-showcase.spec.ts` (or a new file) covering: a representative sample of demo pages show the new header/framing treatment, zero change to any `data-testid`-addressed element's presence/behavior

### Implementation for User Story 3

- [X] T010 [US3] Write `scripts/apply-demo-page-polish.mjs` — for each `src/components/**/*.html` file, wrap the existing `<h1>` + intro `<p>` + theme-selector block (feature 025) in the new header treatment (contracts/demo-page-polish.contract.md); idempotent, dry-run-tested on 2-3 sample files first
- [X] T011 [US3] Run `scripts/apply-demo-page-polish.mjs` against all 77 files
- [X] T012 [US3] Spot-check a representative sample (one page per category) confirming correct application and no broken markup
- [X] T013 [US3] Write a completeness check confirming all 77 files carry the new header treatment (mirroring feature 025's `check-theme-rollout.mjs` pattern)

**Checkpoint**: User Story 3 is independently verifiable — every demo page shows the polish treatment.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T014 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes
- [X] T015 [P] Run `npm run audit:contrast` — confirm zero new contrast findings
- [X] T016 Run the full Playwright suite for this feature across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures
- [X] T017 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions to any component's markup/behavior (spec.md FR-007/FR-008, the critical gate for this feature given its catalog-wide scope). Final clean run: 5150 passed, 4 failed (all the same pre-existing, confirmed-flaky menubar rapid-arrow race test, unrelated to this feature — see NOTES below), 30 skipped = 5184 total, reconciled. One real bug found and fixed along the way: `scripts/apply-demo-page-polish.mjs`'s header-anchoring regex swallowed navbar.html's live sticky-navbar demo into the wrapper div (that page uniquely renders its demo before its own `<h1>`), breaking `position: sticky`; fixed directly in `src/components/navbar/navbar.html`. Also fixed three pre-existing test-staleness issues surfaced by this gate: `file-input.spec.ts`/`color-input.spec.ts` assumed no tab stop between the back-link and target input (broken by feature 025's theme-selector), and `gallery-theme-selector.spec.ts` assumed cards were direct children of `<main>` (broken by this feature's category-section restructuring).
- [X] T018 Draft the constitution amendment documenting the gallery redesign and the demo-page polish convention

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phases 3, 4, 5 (fully independent — US1/US2 both live in `index.html` but T002-T003 don't block T004-T008; US3 is a wholly separate rollout) → Phase 6 (Polish, depends on all of 3-5).
- T005 depends on T001's mapping.
- T011 depends on T010 (script must exist and be dry-run-verified first).

## Implementation Strategy

**MVP = User Story 1** (opening section) — the smallest, highest-
leverage change, independently shippable. User Story 2 (categorization)
naturally follows in the same file. User Story 3 (demo-page polish) is
lower priority (P2) and can ship in the same pass or a later one
without blocking 1-2.
