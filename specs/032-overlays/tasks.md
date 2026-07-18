---

description: "Task list for feature implementation"
---

# Tasks: Overlays

**Input**: Design documents from `/specs/032-overlays/`

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

## Phase 3: User Story 1 - Pinning content after a scroll threshold (Priority: P1) 🎯 MVP

**Goal**: Ship Affix (spec.md US1).

**Independent Test**: Scroll past an element's natural position — confirm it pins and un-pins correctly with no layout jump.

### Tests for User Story 1

- [X] T002 [P] [US1] Playwright scaffold in `tests/e2e/overlays.spec.ts` covering Affix: pins past threshold, un-pins above it, no layout jump (placeholder sizing) — per contracts/affix.contract.md

### Implementation for User Story 1

- [X] T003 [US1] Add `.affix-pinned` to `src/styles/tailwind.css` per contracts/affix.contract.md
- [X] T004 [US1] Create `src/scripts/affix.js` (rAF-throttled scroll listener + placeholder sizing, research.md R2)
- [X] T005 [P] [US1] Create `src/components/affix/affix.html`
- [X] T006 [P] [US1] Create `packages/react/src/Affix/Affix.tsx` per contracts/affix.contract.md
- [X] T007 [US1] Add to `packages/react/src/index.ts`, `vite.config.ts`/`tests/react-harness/vite.config.ts` multi-page entries; create `tests/react-harness/overlays.html` + `src/overlays-main.tsx`
- [X] T008 [US1] Add card to `index.html`'s appropriate category section

**Checkpoint**: User Story 1 is independently verifiable and shippable as the MVP.

---

## Phase 4: User Story 2 - Blocking a region during async work (Priority: P2)

**Goal**: Ship LoadingOverlay (spec.md US2).

**Independent Test**: Toggle a container's loading state — confirm the overlay blocks that container specifically and `aria-busy` reflects it.

### Tests for User Story 2

- [X] T009 [P] [US2] Extend `tests/e2e/overlays.spec.ts` with LoadingOverlay: overlay shows/hides, `aria-busy` toggles, underlying content is not clickable while active — per contracts/loading-overlay.contract.md

### Implementation for User Story 2

- [X] T010 [US2] Add `.loading-overlay-container`/`.loading-overlay` to `src/styles/tailwind.css` per contracts/loading-overlay.contract.md
- [X] T011 [US2] Create `src/scripts/loading-overlay.js`
- [X] T012 [US2] Create `src/components/loading-overlay/loading-overlay.html`, reusing Spinner's exact markup verbatim
- [X] T013 [P] [US2] Create `packages/react/src/LoadingOverlay/LoadingOverlay.tsx`
- [X] T014 [US2] Add to `packages/react/src/index.ts`, vite.config.ts entries, `index.html` card

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Mobile-pattern bottom-anchored panel (Priority: P3)

**Goal**: Ship Bottom Sheet (spec.md US3).

**Independent Test**: Open Bottom Sheet — confirm it anchors to the bottom edge and is focus-trapped/dismissible identically to Slide-over.

### Tests for User Story 3

- [X] T015 [P] [US3] Extend `tests/e2e/overlays.spec.ts` with Bottom Sheet: opens anchored to the bottom, Escape/backdrop/close-button dismissal, focus returns to trigger, internal scroll for overflowing content — per contracts/bottom-sheet.contract.md

### Implementation for User Story 3

- [X] T016 [US3] Add `.bottom-sheet-dialog`/`.bottom-sheet-panel` to `src/styles/tailwind.css` per contracts/bottom-sheet.contract.md — NO new script (reuses `overlay.js` verbatim)
- [X] T017 [US3] Create `src/components/bottom-sheet/bottom-sheet.html`, reusing Slide-over's exact `data-dialog-trigger` markup verbatim
- [X] T018 [US3] Create `packages/react/src/BottomSheet/BottomSheet.tsx`, reusing `useDialogTrigger` directly (no new hook) per contracts/bottom-sheet.contract.md
- [X] T019 [US3] Add to `packages/react/src/index.ts`, vite.config.ts entries, `index.html` card

**Checkpoint**: All 3 user stories independently functional — 3/3 remaining primitives shipped, closing feature 018's Overlays category to 3/6 (3 excluded items documented, not silently dropped).

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T020 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes
- [X] T021 [P] Run `npm run audit:contrast` — confirm zero new findings
- [X] T022 Run the full `overlays.spec.ts` suite across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures
- [X] T023 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions (spec.md SC-004). Before trusting the result: verify ports 5173/5174 are clean, reconcile the pass+fail+skip tally against `npx playwright test --list`'s CURRENT true total (re-run --list fresh, don't reuse a stale number), and check whether `gallery-showcase.spec.ts`'s component count needs updating now that 3 more components exist (101 → 104)
- [X] T024 Draft the constitution amendment documenting the 3 new primitives, the 3 excluded items, and closing feature 018's Overlays category to 3/6

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phases 3-5 (fully independent of each other) → Phase 6 (Polish, depends on all 3 stories).
- T003/T004 before T005 (HTML using them); T010/T011 before T012; T016 before T017.
- T016-T019 (Bottom Sheet) depend on `overlay.js`/`useDialogTrigger` already existing (feature 003) — no dependency on US1/US2.

## Implementation Strategy

**MVP = User Story 1** (Affix) — the most broadly reusable
infrastructure item. US2/US3 each ship independently.
