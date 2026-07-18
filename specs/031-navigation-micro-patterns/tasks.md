---

description: "Task list for feature implementation"
---

# Tasks: Navigation Micro-Patterns

**Input**: Design documents from `/specs/031-navigation-micro-patterns/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright visual regression + axe-core across
all 6 browser/viewport projects, matching every prior feature's
convention, plus the full pre-existing catalog suite as the
zero-regression backstop.

**Organization**: Tasks are grouped by user story (spec.md US1-US3).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Confirm the pre-existing baseline is clean before starting: `npm run audit:tokens` and `npm run audit:contrast` (expect 0 findings)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: None beyond T001 — all 3 user stories are independent of each other.

**Checkpoint**: Baseline confirmed clean.

---

## Phase 3: User Story 1 - Switching identity context via a dropdown (Priority: P1) 🎯 MVP

**Goal**: Ship Team/Workspace Switcher, Language Switcher (spec.md US1).

**Independent Test**: Open each switcher — confirm it lists options and updates the visible "current" selection on click.

### Tests for User Story 1

- [X] T002 [P] [US1] Playwright scaffold in `tests/e2e/navigation-micro-patterns.spec.ts` covering both switchers: panel opens/lists options, selecting updates the trigger, arrow-key nav and Escape/outside-click close (Dropdown Menu's existing behavior) — per contracts/context-switchers.contract.md

### Implementation for User Story 1

- [X] T003 [US1] Create `src/scripts/context-switcher.js` (display-update layer atop `dropdown-menu.js`'s existing wiring, research.md R1)
- [X] T004 [P] [US1] Create `src/components/team-switcher/team-switcher.html`, `src/components/language-switcher/language-switcher.html`, reusing Dropdown Menu's exact markup verbatim
- [X] T005 [P] [US1] Create `packages/react/src/ContextSwitcher/ContextSwitcher.tsx`, reusing `useDropdownMenu` directly (not the base `DropdownMenu` component, which has no per-item avatar slot) per contracts/context-switchers.contract.md
- [X] T006 [US1] Add to `packages/react/src/index.ts`, `vite.config.ts`/`tests/react-harness/vite.config.ts` multi-page entries; create `tests/react-harness/navigation-micro-patterns.html` + `src/navigation-micro-patterns-main.tsx`
- [X] T007 [US1] Add both cards to `index.html`'s appropriate category section

**Checkpoint**: User Story 1 is independently verifiable and shippable as the MVP.

---

## Phase 4: User Story 2 - Scroll-position-driven feedback (Priority: P2)

**Goal**: Ship Back-to-Top Button, Scroll Progress Bar (spec.md US2).

**Independent Test**: Scroll a long page — confirm the progress bar fill grows and Back-to-Top appears/disappears at the threshold.

### Tests for User Story 2

- [X] T008 [P] [US2] Extend `tests/e2e/navigation-micro-patterns.spec.ts` with: progress fill tracks real scroll position, Back-to-Top visibility toggles at threshold, clicking it scrolls to top — per contracts/scroll-feedback.contract.md

### Implementation for User Story 2

- [X] T009 [US2] Create `src/scripts/scroll-feedback.js` (one shared rAF-throttled scroll listener, research.md R2/R3) — NOT a standalone "Affix" primitive
- [X] T010 [US2] Create `src/components/scroll-feedback/scroll-feedback.html` (a long demo page), reusing `.progress-track`/`.progress-fill` verbatim
- [X] T011 [P] [US2] Create `packages/react/src/ScrollProgressBar/ScrollProgressBar.tsx`, `packages/react/src/BackToTop/BackToTop.tsx`
- [X] T012 [US2] Add to `packages/react/src/index.ts`, vite.config.ts entries, `index.html` card(s)

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Sequential guided walkthrough (Priority: P3)

**Goal**: Ship Onboarding Tour/Coachmark (spec.md US3).

**Independent Test**: Start the tour — confirm each step highlights its target, Next/Previous/Skip/Finish all work correctly at both ends of the sequence.

### Tests for User Story 3

- [X] T013 [P] [US3] Extend `tests/e2e/navigation-micro-patterns.spec.ts` with: each step anchors correctly, Next/Previous advance/retreat, step indicator updates, Skip/Finish both end the tour, full keyboard operability (FR-007) — per contracts/onboarding-tour.contract.md

### Implementation for User Story 3

- [X] T014 [US3] Create `src/scripts/onboarding-tour.js` (step-sequencing controller reusing Popover's positioning mechanism, research.md R4)
- [X] T015 [US3] Create `src/components/onboarding-tour/onboarding-tour.html` (3-4 steps against its own demo elements)
- [X] T016 [US3] Create `packages/react/src/OnboardingTour/OnboardingTour.tsx` per contracts/onboarding-tour.contract.md's simplified single-panel-swap approach
- [X] T017 [US3] Add to `packages/react/src/index.ts`, vite.config.ts entries, `index.html` card

**Checkpoint**: All 3 user stories independently functional — 5/5 remaining primitives shipped, closing feature 018's Navigation micro-patterns category to 6/6.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T018 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes
- [X] T019 [P] Run `npm run audit:contrast` — confirm zero new findings
- [X] T020 Run the full `navigation-micro-patterns.spec.ts` suite across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures
- [X] T021 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions (spec.md SC-004). Before trusting the result: verify ports 5173/5174 are clean, reconcile the pass+fail+skip tally against `npx playwright test --list`'s CURRENT true total (re-run --list fresh, don't reuse a stale number), and check whether `gallery-showcase.spec.ts`'s component count needs updating now that 5 more components exist (96 → 101)
- [X] T022 Draft the constitution amendment documenting the 5 new primitives and closing feature 018's Navigation micro-patterns category to 6/6

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phases 3-5 (fully independent of each other) → Phase 6 (Polish, depends on all 3 stories).
- T003 (script) before T004 (HTML using it); same for T009→T010, T014→T015.
- T009/T010 (scroll feedback) is entirely independent of Dropdown Menu/Popover reuse in the other 2 stories.

## Implementation Strategy

**MVP = User Story 1** (Team/Workspace Switcher, Language Switcher) —
the lowest-risk, most broadly reusable items. US2/US3 each ship
independently.
