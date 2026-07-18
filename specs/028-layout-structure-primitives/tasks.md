---

description: "Task list for feature implementation"
---

# Tasks: Layout & Structure Primitives

**Input**: Design documents from `/specs/028-layout-structure-primitives/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright visual regression + axe-core across
all 6 browser/viewport projects, matching every prior feature's
convention, plus the full pre-existing catalog suite as the
zero-regression backstop.

**Organization**: Tasks are grouped by user story (spec.md US1-US4),
in the same P1→P4 risk/reuse-gradient order the spec itself uses.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Confirm the pre-existing baseline is clean before starting: `npm run audit:tokens` and `npm run audit:contrast` — both confirmed clean before any change

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: None beyond T001 — all 4 user stories are independent of
each other (each ships a disjoint set of primitives).

**Checkpoint**: Baseline confirmed clean — all 4 phases can proceed independently.

---

## Phase 3: User Story 1 - Consistent spacing without hand-rolled margins (Priority: P1) 🎯 MVP

**Goal**: Ship Stack, Group, Center (spec.md US1).

**Independent Test**: Compose a page fragment using only these 3 — confirm consistent, token-driven spacing with zero hardcoded values.

### Tests for User Story 1

- [X] T002 [P] [US1] Playwright scaffold in `tests/e2e/layout-structure-primitives.spec.ts` covering Stack/Group/Center: spacing renders correctly, Group wraps at 320px, Center centers both axes — per contracts/spacing-primitives.contract.md

### Implementation for User Story 1

- [X] T003 [US1] Add `.stack`/`.stack-{xs,sm,md,lg}`, `.group-row`/`.group-row-{xs,sm,md,lg}`, `.center` to `src/styles/tailwind.css` per contracts/spacing-primitives.contract.md
- [X] T004 [P] [US1] Create `src/components/stack/stack.html`, `src/components/group/group.html`, `src/components/center/center.html` (existing "trivial component" template — CSP meta, page-shell, demo-page-header, theme-selector, no dedicated script)
- [X] T005 [P] [US1] Create `packages/react/src/Stack/Stack.tsx`, `packages/react/src/Group/Group.tsx`, `packages/react/src/Center/Center.tsx` per contracts/spacing-primitives.contract.md's wrapper shape
- [X] T006 [US1] Add all 3 to `packages/react/src/index.ts` exports
- [X] T007 [US1] Add all 3 to `vite.config.ts` and `tests/react-harness/vite.config.ts` multi-page build entries; create `tests/react-harness/layout-structure-primitives.html` + `src/layout-structure-primitives-main.tsx`
- [X] T008 [US1] Add all 3 cards to `index.html`'s appropriate category section

**Checkpoint**: User Story 1 is independently verifiable and shippable as the MVP.

---

## Phase 4: User Story 2 - Consistent content width and a lightweight surface (Priority: P2)

**Goal**: Ship Container, Paper (spec.md US2).

**Independent Test**: Replace a hand-written max-width wrapper with Container, and a plain Card usage with Paper — confirm zero visual regression.

### Tests for User Story 2

- [X] T009 [P] [US2] Extend `tests/e2e/layout-structure-primitives.spec.ts` with Container/Paper: consistent max-width at all 4 breakpoints, Paper matches Card's border/radius/background minus shadow — per contracts/surface-primitives.contract.md

### Implementation for User Story 2

- [X] T010 [US2] Add `.container-page`, `.paper` to `src/styles/tailwind.css` per contracts/surface-primitives.contract.md — verify neither collides with an existing class (Tailwind's own built-in `.container` is why this isn't named `.container`)
- [X] T011 [P] [US2] Create `src/components/container/container.html`, `src/components/paper/paper.html`
- [X] T012 [P] [US2] Create `packages/react/src/Container/Container.tsx`, `packages/react/src/Paper/Paper.tsx`
- [X] T013 [US2] Add both to `packages/react/src/index.ts`, both vite.config.ts multi-page entries, both cards to `index.html`

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Responsive multi-item layout arrangement (Priority: P3)

**Goal**: Ship Grid, SimpleGrid, Flex (spec.md US3).

**Independent Test**: Replace a hand-written responsive grid with Grid — confirm identical responsive column behavior at all 4 breakpoints.

### Tests for User Story 3

- [X] T014 [P] [US3] Extend `tests/e2e/layout-structure-primitives.spec.ts` with Grid/SimpleGrid/Flex: column-count steps 1→2→configured at the 3 breakpoint thresholds (research.md R3), Flex direction prop — per contracts/grid-primitives.contract.md

### Implementation for User Story 3

- [X] T015 [US3] Add `.grid-responsive`/`.grid-cols-{2,3,4}-lg`, `.simple-grid`, `.flex-row-primitive`/`.flex-col-primitive` to `src/styles/tailwind.css` per contracts/grid-primitives.contract.md
- [X] T016 [P] [US3] Create `src/components/grid/grid.html`, `src/components/simple-grid/simple-grid.html`, `src/components/flex/flex.html`
- [X] T017 [P] [US3] Create `packages/react/src/Grid/Grid.tsx`, `packages/react/src/SimpleGrid/SimpleGrid.tsx`, `packages/react/src/Flex/Flex.tsx`
- [X] T018 [US3] Add all 3 to `packages/react/src/index.ts`, vite.config.ts entries, `index.html` cards

**Checkpoint**: User Stories 1-3 all work independently.

---

## Phase 6: User Story 4 - Composable page shell (Priority: P4)

**Goal**: Ship AppShell, composing existing Navbar/Sidebar (spec.md US4).

**Independent Test**: Build header+sidebar+main using only AppShell+Navbar+Sidebar — confirm correct positioning/scroll at all breakpoints including the mobile stacked-sidebar reflow.

### Tests for User Story 4

- [X] T019 [P] [US4] Extend `tests/e2e/layout-structure-primitives.spec.ts` with AppShell: 3 regions position correctly at 1440px, sidebar stacks above main below 768px (research.md R5), Navbar's native mobile-menu still functions inside AppShell, AppShell renders correctly with no `sidebar` prop — per contracts/app-shell.contract.md

### Implementation for User Story 4

- [X] T020 [US4] Add `.app-shell`, `.app-shell-body`, `.app-shell-main` to `src/styles/tailwind.css` per contracts/app-shell.contract.md
- [X] T021 [US4] Create `src/components/app-shell/app-shell.html`, embedding real Navbar/Sidebar markup verbatim (copy their existing demo markup, not new markup)
- [X] T022 [US4] Create `packages/react/src/AppShell/AppShell.tsx` accepting `header`/`sidebar`/`children` props per contracts/app-shell.contract.md — verify it does NOT import Navbar/Sidebar itself (props-based composition only)
- [X] T023 [US4] Add AppShell to `packages/react/src/index.ts`, vite.config.ts entries, `index.html` card

**Checkpoint**: All 4 user stories independently functional — 9/9 primitives shipped.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T024 [P] Run `npm run audit:tokens` — passed, 0 violations (88 HTML files, 309 @apply blocks, 79 .tsx files scanned)
- [X] T025 [P] Run `npm run audit:contrast` — passed, only pre-existing documented gaps, zero new findings
- [X] T026 Run the full `layout-structure-primitives.spec.ts` suite across all 6 browser/viewport projects — 132 passed, 0 failures
- [X] T027 Run the FULL pre-existing catalog suite (all specs, all projects) — first attempt found a REAL regression: `tests/e2e/gallery-showcase.spec.ts` hardcoded "78 components" (feature 026's count), broken by this feature's 9 additions (catalog now at 87). Fixed the count assertion and added the missing "Layout & Structure" category to the quick-jump nav test loop; re-verified in isolation (90 passed). Second, clean full run: 5319 passed + 3 failed + 30 skipped = 5352, reconciling exactly against the updated `npx playwright test --list` total (5346 + 6 new nav-link tests from the fix = 5352). The 3 failures are all the same already-documented, confirmed-flaky menubar rapid-arrow race test (features 026/027's precedent) — zero unexplained failures.
- [X] T028 Draft the constitution amendment documenting the 9 new primitives, closing feature 018's Layout & Structure category to 9/9, and the AppShell mobile-reflow correction (research.md R5) — v1.25.0

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phases 3-6 (fully independent of each other) → Phase 7 (Polish, depends on all 4 stories).
- Within each story: tailwind.css classes (e.g. T003) before HTML/React files that use them (T004-T005); both before index/vite.config wiring (T006-T007); wiring before index.html cards (T008).
- T021/T022 (AppShell) depend on Navbar/Sidebar already existing (feature 007) — no dependency on T003-T018's primitives, though AppShell's demo page commonly wraps content in Container/Stack once those exist (T004/T011), so implementing US1-US3 first is recommended but not required.

## Implementation Strategy

**MVP = User Story 1** (Stack, Group, Center) — the simplest, most
foundational, and most broadly reusable of the 4. Each subsequent
story ships independently and adds value without blocking the
others — proceed P1→P4 for the natural risk/reuse gradient, or in
parallel if staffed.
