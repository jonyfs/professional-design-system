---

description: "Task list for feature implementation"
---

# Tasks: Advanced Form Inputs Batch

**Input**: Design documents from `/specs/039-advanced-form-inputs/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright visual regression + axe-core across
all 6 browser/viewport projects, matching every prior feature's
convention, plus the full pre-existing catalog suite as the
zero-regression backstop.

**Organization**: Tasks are grouped by user story (spec.md US1-US4).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Confirm the pre-existing baseline is clean before starting: `npm run audit:tokens` and `npm run audit:contrast` (expect 0 findings against all 119 themes)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: None beyond T001 — all 4 user stories are independent of each other; each story's shared helper module (`shared/mentions/`, `shared/input-mask/`) is created within that story's own phase, not a cross-story dependency.

**Checkpoint**: Baseline confirmed clean.

---

## Phase 3: User Story 1 - Freeform and suggestion-driven entry (Priority: P1) 🎯 MVP

**Goal**: Ship TagsInput, Autocomplete, Mentions (spec.md US1).

**Independent Test**: Render all three independently; confirm each opens/filters/selects correctly with mouse and keyboard alone, and TagsInput/Mentions entries are individually removable.

### Tests for User Story 1

- [x] T002 [P] [US1] Playwright scaffold in `tests/e2e/advanced-form-inputs.spec.ts` covering TagsInput (Enter/comma commit, paste-splitting, duplicate prevention, Backspace-remove-last), Autocomplete (filter narrowing, no-results state, mouse+keyboard commit), and Mentions (`@`-trigger detection, popover-at-cursor, token insertion) — per contracts/tags-input.contract.md, contracts/autocomplete.contract.md, contracts/mentions.contract.md

### Implementation for User Story 1

- [x] T003 [US1] Add `.tags-input*` to `src/styles/tailwind.css`; create `src/scripts/tags-input.js` per contracts/tags-input.contract.md
- [x] T004 [US1] Create `src/components/tags-input/tags-input.html`
- [x] T005 [US1] Add `.autocomplete-*` to `src/styles/tailwind.css`; create `src/scripts/autocomplete.js` reusing `shared/multi-select/index.ts`'s `filterOptions` per contracts/autocomplete.contract.md
- [x] T006 [US1] Create `src/components/autocomplete/autocomplete.html`
- [x] T007 [US1] Create `shared/mentions/index.ts` (`findActiveTrigger`/`insertMention`, research.md R4)
- [x] T008 [US1] Add `.mentions-*` to `src/styles/tailwind.css`; create `src/scripts/mentions.js` per contracts/mentions.contract.md
- [x] T009 [US1] Create `src/components/mentions/mentions.html`
- [x] T010 [P] [US1] Create `packages/react/src/TagsInput/TagsInput.tsx`, `packages/react/src/Autocomplete/Autocomplete.tsx`, `packages/react/src/Mentions/Mentions.tsx`
- [x] T011 [US1] Add all 3 to `packages/react/src/index.ts`, `vite.config.ts`/`tests/react-harness/vite.config.ts` multi-page entries; create `tests/react-harness/advanced-form-inputs.html` + `src/advanced-form-inputs-main.tsx`
- [x] T012 [US1] Add 3 cards to `index.html`'s "Advanced Forms & Interaction" (`#adv-forms`) section

**Checkpoint**: User Story 1 is independently verifiable and shippable as the MVP.

---

## Phase 4: User Story 2 - Hierarchical and structured selection (Priority: P2)

**Goal**: Ship Cascader, TreeSelect (spec.md US2).

**Independent Test**: Render both against a real 3-level sample dataset; confirm a full path can be selected via mouse and keyboard alone.

### Tests for User Story 2

- [x] T013 [P] [US2] Extend `tests/e2e/advanced-form-inputs.spec.ts` with Cascader (per-level panel rendering, leaf-only commit, Escape discards) and TreeSelect (TreeView disclosure reuse, node commit, Escape discards) — per contracts/cascader.contract.md and contracts/tree-select.contract.md

### Implementation for User Story 2

- [x] T014 [US2] Add `.cascader-*` to `src/styles/tailwind.css`; create `src/scripts/cascader.js` reusing Dropdown Menu's panel-open/outside-click mechanics per contracts/cascader.contract.md
- [x] T015 [US2] Create `src/components/cascader/cascader.html`
- [x] T016 [US2] Add `.tree-select-*` to `src/styles/tailwind.css`; create `src/scripts/tree-select.js` reusing TreeView's native `<details>`/`<summary>` markup verbatim per contracts/tree-select.contract.md
- [x] T017 [US2] Create `src/components/tree-select/tree-select.html`
- [x] T018 [P] [US2] Create `packages/react/src/Cascader/Cascader.tsx`, `packages/react/src/TreeSelect/TreeSelect.tsx`
- [x] T019 [US2] Add to `packages/react/src/index.ts`, vite.config.ts entries, 2 `index.html` cards

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Formatted, validated, and range value entry (Priority: P3)

**Goal**: Ship InputMask, JsonInput, RangeSlider (spec.md US3).

**Independent Test**: InputMask blocks non-conforming characters and formats pasted content to the matching prefix; JsonInput visibly flags invalid JSON before submit; RangeSlider's two handles move independently (mouse and keyboard) without crossing.

### Tests for User Story 3

- [x] T020 [P] [US3] Extend `tests/e2e/advanced-form-inputs.spec.ts` with InputMask (mask-character insertion, paste-prefix-matching), JsonInput (non-blocking inline validity state), and RangeSlider (independent handle drag/keyboard, never-cross clamp) — per contracts/input-mask.contract.md, contracts/json-input.contract.md, contracts/range-slider.contract.md

### Implementation for User Story 3

- [x] T021 [US3] Create `shared/input-mask/index.ts` (`applyMask`/`MASK_PRESETS`, research.md R2)
- [x] T022 [US3] Add `.input-mask` to `src/styles/tailwind.css`; create `src/scripts/input-mask.js` per contracts/input-mask.contract.md
- [x] T023 [US3] Create `src/components/input-mask/input-mask.html`
- [x] T024 [US3] Add `.json-input*` to `src/styles/tailwind.css`; create `src/scripts/json-input.js` per contracts/json-input.contract.md
- [x] T025 [US3] Create `src/components/json-input/json-input.html`
- [x] T026 [US3] Add `.range-slider-rows*` to `src/styles/tailwind.css`; create `src/scripts/range-slider.js` (clamp logic; real a11y finding during implementation: switched from overlapping inputs to two genuinely separate rows after axe-core caught a real WCAG 2.5.8 target-offset conflict with the overlapping-inputs technique) per contracts/range-slider.contract.md
- [x] T027 [US3] Create `src/components/range-slider/range-slider.html`
- [x] T028 [P] [US3] Create `packages/react/src/InputMask/InputMask.tsx`, `packages/react/src/JsonInput/JsonInput.tsx`, `packages/react/src/RangeSlider/RangeSlider.tsx`
- [x] T029 [US3] Add all 3 to `packages/react/src/index.ts`, vite.config.ts entries, 3 `index.html` cards

**Checkpoint**: User Stories 1, 2, AND 3 all work independently.

---

## Phase 6: User Story 4 - Small enhancements to existing inputs (Priority: P4)

**Goal**: Ship FloatLabel, extend the existing Rating component with an interactive mode (spec.md US4).

**Independent Test**: FloatLabel's label animates between focus/blur/fill states via CSS alone; Interactive Rating sets a value by click and by Arrow-key navigation while focused, without altering the pre-existing read-only demos.

### Tests for User Story 4

- [x] T030 [P] [US4] Extend `tests/e2e/advanced-form-inputs.spec.ts` with FloatLabel (`:placeholder-shown`/`:focus`-driven position, `prefers-reduced-motion` respected) and Interactive Rating (click-to-set, Arrow-key navigation, pre-existing read-only demos unchanged) — per contracts/float-label.contract.md and contracts/interactive-rating.contract.md

### Implementation for User Story 4

- [x] T031 [US4] Add `.float-label-*` to `src/styles/tailwind.css`; create `src/scripts/float-label.js` (real cross-browser finding during implementation: Tailwind auto-generates an unconditionally-true `:-moz-placeholder` fallback in modern Firefox, so fill-state uses a `data-filled` attribute toggled from real `.value` instead of `:placeholder-shown`; focus state remains CSS-only) per contracts/float-label.contract.md
- [x] T032 [US4] Create `src/components/float-label/float-label.html`
- [x] T033 [US4] Add `.rating-interactive*` to `src/styles/tailwind.css`; append the native-radio-group interactive markup to the EXISTING `src/components/rating/rating.html` (does not touch the pre-existing `aria-hidden` read-only demos) per contracts/interactive-rating.contract.md
- [x] T034 [P] [US4] Create `packages/react/src/FloatLabel/FloatLabel.tsx`; extend the EXISTING `packages/react/src/Rating/Rating.tsx` with an `interactive`/`onChange` prop (default `interactive: false` preserves current behavior)
- [x] T035 [US4] Add FloatLabel to `packages/react/src/index.ts`, vite.config.ts entries, 1 `index.html` card (Rating's existing card needs no new entry, just updated demo content)

**Checkpoint**: All 4 user stories independently functional — 10/10 components shipped, closing feature 018's Advanced Form Inputs candidates #10-27.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T036 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes
- [x] T037 [P] Run `npm run audit:contrast` — confirm zero new undocumented findings across all 119 themes
- [x] T038 Run the full `advanced-form-inputs.spec.ts` suite across all 6 browser/viewport projects — confirm 0 axe-core violations and 0 failures (221 passed, 1 skipped — Firefox synthetic-ClipboardEvent limitation, matching pin-input.spec.ts's own documented precedent)
- [x] T039 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions (spec.md SC-004). Result: 6654 passed, 5 failed (all pre-existing, unrelated: Menubar rapid-ArrowRight race condition ×4, Team/Workspace Switcher ×1 — same known flaky issues present before this feature), 31 skipped (30 pre-existing + 1 new Firefox ClipboardEvent skip), 6690 total — zero regressions. `gallery-showcase.spec.ts`'s count updated 114 → 123 (9 new cards; Rating is a modification, no new card) and `index.html`'s stat copy updated to match.
- [x] T040 Draft the constitution amendment documenting the 10 new/extended components and closing feature 018's Advanced Form Inputs category candidates #10-27

---

## Dependencies & Execution Order

- Phase 1 (T001) → Phases 3-6 (fully independent of each other) → Phase 7 (Polish, depends on all 4 stories).
- T003 before T004; T005 before T006; T007 before T008 before T009; T014 before T015; T016 before T017; T021 before T022 before T023; T024 before T025; T026 before T027; T031 before T032; T033 depends on the existing `rating.html` (feature 016) already shipped.
- Phase 6's T033/T034 depend only on the pre-existing Rating component (feature 016), not on any other phase in this feature.

## Implementation Strategy

**MVP = User Story 1** (TagsInput, Autocomplete, Mentions) — the
highest-frequency, most-reused-mechanism family in this batch. US2/
US3/US4 each ship independently.
