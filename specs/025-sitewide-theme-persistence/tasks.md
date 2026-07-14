---

description: "Task list for feature implementation"
---

# Tasks: Sitewide Theme Selector & Persistence

**Input**: Design documents from `/specs/025-sitewide-theme-persistence/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — a scripted completeness check across all 77
files (not a browser test, per research.md R3) plus a Playwright
behavioral spec against a representative sample.

**Organization**: Both user stories (spec.md US1: persistence, US2:
selector-on-every-page) are satisfied by the SAME mechanical edit —
the 3-snippet rollout (research.md R1) makes a page both persist and
display the selector in one change. Tasks are still grouped by story
for traceability, but Phase 3 (US1) does the actual rollout work;
Phase 4 (US2) is purely additional test coverage for the same change.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Confirm the exact current gap: `grep -L "theme-switcher.js" src/components/*/*.html | wc -l` (expected 77) and record the file list for the rollout script

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The rollout script itself, since both user stories depend on it.

- [X] T002 Write `scripts/apply-theme-rollout.mjs` — for each `src/components/**/*.html` file missing `theme-switcher.js`: (a) insert the `<script type="module" src="/src/scripts/theme-switcher.js"></script>` line immediately after the stylesheet `<link>` in `<head>`; (b) insert the selector `<div>` block (research.md R1, verbatim from `index.html`) immediately after the page's `<h1>` (and intro `<p>` if present); (c) insert the `<script type="module" src="/src/scripts/gallery-theme-selector.js"></script>` line immediately before `</body>`. Idempotent — skip any file that already has `theme-switcher.js` (contracts/rollout.contract.md)

**Checkpoint**: Rollout script exists and is dry-run-tested on 1-2 sample files before the full run.

---

## Phase 3: User Story 1 - Theme Persists When Navigating (Priority: P1) 🎯 MVP

**Goal**: Every static page applies the persisted theme before first paint (spec.md US1).

**Independent Test**: Select a theme on the gallery, navigate to any individual component page, confirm it's applied with no flash — per spec.md US1's own Independent Test.

### Implementation for User Story 1

- [X] T003 [US1] Run `scripts/apply-theme-rollout.mjs` against all 77 files identified in T001
- [X] T004 [US1] Spot-check a representative sample (one page per Component Catalog category — Application & Navigation, Forms & Inputs, Data Display & Listings, Overlays & Feedback, Advanced Forms & Interaction) by hand to confirm correct insertion placement and no broken markup
- [X] T005 [US1] Write `tests/e2e/sitewide-theme-persistence.spec.ts` covering: select a theme, navigate through 3+ pages in sequence, confirm the theme applies before first paint on each (no flash), confirm default-theme fallback on a page loaded with empty storage

**Checkpoint**: User Story 1 is fully functional — theme persists across navigation on every rolled-out page.

---

## Phase 4: User Story 2 - Selector Available on Every Page (Priority: P1)

**Goal**: Every page (not just the gallery) has a working theme selector (spec.md US2).

**Independent Test**: Load any individual component page directly, confirm the selector is present, populated, and functional — per spec.md US2's own Independent Test.

### Implementation for User Story 2

- [X] T006 [US2] Extend `tests/e2e/sitewide-theme-persistence.spec.ts` covering: the selector is present and populated (same grouping as `index.html`'s) on a representative page-category sample, changing it re-themes immediately with no reload
- [X] T007 [US2] Write a completeness check (`scripts/check-theme-rollout.mjs` or extend an existing audit script) confirming ALL 77 files (not just the sample) contain all 3 required snippets — the mechanical-completeness gate research.md R3 calls for

**Checkpoint**: User Story 2 is fully functional — selector works identically on every rolled-out page.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T008 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes across all 77 edited files
- [X] T009 [P] Run `npm run audit:contrast` — confirm zero new contrast findings
- [X] T010 Run `node scripts/check-theme-rollout.mjs` (T007) — confirm 77/77 files pass
- [X] T011 Run the full Playwright suite for this feature across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures
- [X] T012 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions
- [X] T013 Draft the constitution amendment documenting this rollout as a new every-page convention (alongside the CSP meta tag, `page-shell` body class, and back-link this catalog already expects on every new static page)

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phase 2 (T002, the rollout script) → Phase 3 (T003-T005, the actual rollout + its own tests) → Phase 4 (T006-T007, additional coverage for the same rollout) → Phase 5 (Polish).
- T003 must complete before T004-T007 (they verify its output).
- T008/T009 are independent of each other and can run in parallel once T003 completes.

## Implementation Strategy

**MVP = User Story 1** — since both stories are satisfied by the same
single rollout script run (T003), there is no meaningful way to ship
US1 without US2 or vice versa; they complete together. The phase split
exists for traceability against spec.md, not for staged delivery.
