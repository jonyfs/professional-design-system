---

description: "Task list for feature implementation"
---

# Tasks: Data Display Patterns

**Input**: Design documents from `/specs/034-data-display-patterns/`

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

## Phase 3: User Story 1 - Compact display of an overflowing item list (Priority: P1) 🎯 MVP

**Goal**: Ship OverflowList (spec.md US1).

**Independent Test**: Render in a narrow container — confirm accurate item/overflow split, updating on resize.

### Tests for User Story 1

- [X] T002 [P] [US1] Playwright scaffold in `tests/e2e/data-display-patterns.spec.ts` covering OverflowList: correct visible/overflow split at a fixed width, updates on resize, degenerate too-narrow case — per contracts/overflow-list.contract.md

### Implementation for User Story 1

- [X] T003 [US1] Add `.overflow-list*` to `src/styles/tailwind.css` per contracts/overflow-list.contract.md
- [X] T004 [US1] Create `src/scripts/overflow-list.js` (this catalog's first ResizeObserver, research.md R1)
- [X] T005 [P] [US1] Create `src/components/overflow-list/overflow-list.html`
- [X] T006 [P] [US1] Create `packages/react/src/OverflowList/OverflowList.tsx`
- [X] T007 [US1] Add to `packages/react/src/index.ts`, `vite.config.ts`/`tests/react-harness/vite.config.ts` multi-page entries; create `tests/react-harness/data-display-patterns.html` + `src/data-display-patterns-main.tsx`
- [X] T008 [US1] Add card to `index.html`'s appropriate category section

**Checkpoint**: User Story 1 is independently verifiable and shippable as the MVP.

---

## Phase 4: User Story 2 - Animated numeric counters and pairwise data movement (Priority: P2)

**Goal**: Ship RollingNumber, PickList/Transfer (spec.md US2).

**Independent Test**: Trigger a RollingNumber value change — confirm animated transition. Move PickList items both directions.

### Tests for User Story 2

- [X] T009 [P] [US2] Extend `tests/e2e/data-display-patterns.spec.ts` with RollingNumber (animates to target, rapid changes don't stack) and PickList (move right/left/all, keyboard operability, empty states) — per contracts/rolling-number.contract.md and contracts/pick-list.contract.md

### Implementation for User Story 2

- [X] T010 [US2] Create `src/scripts/rolling-number.js` (rAF value tween, research.md R2); create `src/components/rolling-number/rolling-number.html`
- [X] T011 [US2] Add `.pick-list-panel`/`.pick-list-controls` to `src/styles/tailwind.css`; create `src/scripts/pick-list.js`
- [X] T012 [US2] Create `src/components/pick-list/pick-list.html`, reusing List's exact `.list`/`.list-row` markup and Checkbox's real inline utility composition (not a nonexistent `.checkbox` class — verify against `checkbox.html` directly)
- [X] T013 [P] [US2] Create `packages/react/src/RollingNumber/RollingNumber.tsx`, `packages/react/src/PickList/PickList.tsx`
- [X] T014 [US2] Add to `packages/react/src/index.ts`, vite.config.ts entries, 2 `index.html` cards

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Full-screen image viewing and comparison (Priority: P3)

**Goal**: Ship Gallery, Compare (spec.md US3).

**Independent Test**: Open Gallery from a thumbnail, cycle images. Drag Compare's divider (mouse and keyboard).

### Tests for User Story 3

- [X] T015 [P] [US3] Extend `tests/e2e/data-display-patterns.spec.ts` with Gallery (opens focus-trapped, Next/Previous cycle and disable at ends, Escape/close dismiss) and Compare (divider position drives clip-path, keyboard-operable via native range input, clamps 0-100) — per contracts/gallery.contract.md and contracts/compare.contract.md

### Implementation for User Story 3

- [X] T016 [US3] Add `.gallery-*` to `src/styles/tailwind.css`; create `src/scripts/gallery.js` (reuses `overlay.js` verbatim, research.md R4)
- [X] T017 [US3] Create `src/components/gallery/gallery.html` — uses the `img-src 'self' data:;` CSP variant, data: URI placeholder images (matching Avatar/feature 033's own precedent)
- [X] T018 [US3] Add `.compare-*` to `src/styles/tailwind.css`; create `src/scripts/compare.js` (native range input drives clip-path, research.md R5)
- [X] T019 [US3] Create `src/components/compare/compare.html` — uses the `img-src 'self' data:;` CSP variant
- [X] T020 [P] [US3] Create `packages/react/src/Gallery/Gallery.tsx`, `packages/react/src/Compare/Compare.tsx`
- [X] T021 [US3] Add to `packages/react/src/index.ts`, vite.config.ts entries, 2 `index.html` cards

**Checkpoint**: All 3 user stories independently functional — 5/5 primitives shipped, bringing feature 018's Data Display category to 13/16.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T022 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes
- [X] T023 [P] Run `npm run audit:contrast` — confirm zero new findings
- [X] T024 Run the full `data-display-patterns.spec.ts` suite across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures
- [X] T025 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions (spec.md SC-004). Before trusting the result: verify ports 5173/5174 are clean, reconcile the pass+fail+skip tally against `npx playwright test --list`'s CURRENT true total (re-run --list fresh, don't reuse a stale number), and check whether `gallery-showcase.spec.ts`'s component count needs updating now that 5 more components exist (108 → 113)
- [X] T026 Draft the constitution amendment documenting the 5 new primitives and bringing feature 018's Data Display category to 13/16

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phases 3-5 (fully independent of each other) → Phase 6 (Polish, depends on all 3 stories).
- T004 before T005; T010's script before its HTML; T011 before T012; T016 before T017; T018 before T019.
- T016-T019 (Gallery/Compare) depend on `overlay.js`/`.slider` already existing (features 003/002) — no dependency on US1/US2.

## Implementation Strategy

**MVP = User Story 1** (OverflowList) — the most broadly applicable
item. US2/US3 each ship independently.
