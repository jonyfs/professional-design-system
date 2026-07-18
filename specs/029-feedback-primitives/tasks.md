---

description: "Task list for feature implementation"
---

# Tasks: Feedback Primitives

**Input**: Design documents from `/specs/029-feedback-primitives/`

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

## Phase 3: User Story 1 - At-a-glance circular progress (Priority: P1) 🎯 MVP

**Goal**: Ship RingProgress, SemiCircleProgress (spec.md US1).

**Independent Test**: Render both at several progress values — confirm the filled arc proportion matches and the accessible value is exposed.

### Tests for User Story 1

- [X] T002 [P] [US1] Playwright scaffold in `tests/e2e/feedback-primitives.spec.ts` covering RingProgress/SemiCircleProgress: arc proportion at 0/50/100%, accessible value exposed, clamping outside 0-100 — per contracts/circular-progress.contract.md

### Implementation for User Story 1

- [X] T003 [US1] Add `.ring-progress`/`.ring-progress-track`/`.ring-progress-fill`, `.semi-circle-progress` to `src/styles/tailwind.css` per contracts/circular-progress.contract.md
- [X] T004 [US1] Create `src/scripts/ring-progress.js` (CSSOM strokeDashoffset assignment, research.md R2) — verify it clamps 0-100
- [X] T005 [P] [US1] Create `src/components/ring-progress/ring-progress.html`, `src/components/semi-circle-progress/semi-circle-progress.html`
- [X] T006 [P] [US1] Create `packages/react/src/RingProgress/RingProgress.tsx`, `packages/react/src/SemiCircleProgress/SemiCircleProgress.tsx` per contracts/circular-progress.contract.md's wrapper shape
- [X] T007 [US1] Add both to `packages/react/src/index.ts`, `vite.config.ts`/`tests/react-harness/vite.config.ts` multi-page entries; create `tests/react-harness/feedback-primitives.html` + `src/feedback-primitives-main.tsx`
- [X] T008 [US1] Add both cards to `index.html`'s appropriate category section

**Checkpoint**: User Story 1 is independently verifiable and shippable as the MVP.

---

## Phase 4: User Story 2 - Persistent notification history (Priority: P2)

**Goal**: Ship Notification Center (spec.md US2).

**Independent Test**: Open the bell with a nonzero unread count — confirm the panel lists past notifications and the badge count is accurate.

### Tests for User Story 2

- [X] T009 [P] [US2] Extend `tests/e2e/feedback-primitives.spec.ts` with Notification Center: badge count accuracy, panel opens and lists items, read/unread visually distinguished, empty state — per contracts/notification-center.contract.md

### Implementation for User Story 2

- [X] T010 [US2] Add `.notification-center-*` classes to `src/styles/tailwind.css` per contracts/notification-center.contract.md
- [X] T011 [US2] Create `src/components/notification-center/notification-center.html`, reusing Indicator's `.indicator-wrapper`/`.indicator` and Dropdown Menu's native Popover API pattern verbatim (verify against `src/components/dropdown-menu/dropdown-menu.html`, not assumed)
- [X] T012 [US2] Create `packages/react/src/NotificationCenter/NotificationCenter.tsx`, reusing `useDropdownMenu`'s imperative popoverTargetElement/popoverTargetAction wiring pattern (verify against `packages/react/src/DropdownMenu/DropdownMenu.tsx`'s own documented bug-avoidance — a manual onClick togglePopover() re-opens instead of closing)
- [X] T013 [US2] Add to `packages/react/src/index.ts`, vite.config.ts entries, `index.html` card

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Password strength feedback while typing (Priority: P3)

**Goal**: Ship Password Strength Meter (spec.md US3).

**Independent Test**: Type passwords of increasing complexity — confirm the strength indicator's fill and accessible label update accordingly.

### Tests for User Story 3

- [X] T014 [P] [US3] Extend `tests/e2e/feedback-primitives.spec.ts` with Password Strength Meter: empty/weak/fair/strong transitions, accessible label updates, never color-alone — per contracts/password-strength-meter.contract.md

### Implementation for User Story 3

- [X] T015 [US3] Create `src/scripts/password-strength-meter.js` (scoring heuristic + CSSOM fill assignment, research.md R5) and `.password-strength-meter-fill[data-level]` classes in `src/styles/tailwind.css`
- [X] T016 [US3] Create `src/components/password-strength-meter/password-strength-meter.html`, reusing Progress's existing `.progress-track`/`.progress-fill` verbatim
- [X] T017 [US3] Create `packages/react/src/PasswordStrengthMeter/PasswordStrengthMeter.tsx`, porting the same `scorePassword` function
- [X] T018 [US3] Add to `packages/react/src/index.ts`, vite.config.ts entries, `index.html` card

**Checkpoint**: All 3 user stories independently functional — 4/4 primitives shipped (Notification excluded per research.md R1).

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T019 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes
- [X] T020 [P] Run `npm run audit:contrast` — confirm zero new findings
- [X] T021 Run the full `feedback-primitives.spec.ts` suite across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures
- [X] T022 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions (spec.md SC-004). Before trusting the result: verify ports 5173/5174 are clean, reconcile the pass+fail+skip tally against `npx playwright test --list`'s CURRENT true total (re-run --list fresh, don't reuse a stale number — feature 028's own gate was off by 6 for exactly this reason), and check whether any catalog-wide count assertion (e.g. gallery-showcase.spec.ts's component count) needs updating now that 4 more components exist
- [X] T023 Draft the constitution amendment documenting the 4 new primitives, the Notification de-duplication finding, and closing feature 018's Feedback category to 4/5 (Notification explicitly excluded, not silently dropped)

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phases 3-5 (fully independent of each other) → Phase 6 (Polish, depends on all 3 stories).
- T004 (script) before T005 (HTML using it); T003 (CSS) before both.
- T011/T012 depend on Indicator/Dropdown Menu already existing (features 006/010) — no dependency on US1/US3.

## Implementation Strategy

**MVP = User Story 1** (RingProgress, SemiCircleProgress) — the most
broadly reusable, lowest-scope item. US2/US3 each ship independently.
