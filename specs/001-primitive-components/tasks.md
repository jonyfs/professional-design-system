# Tasks: Design System Primitive Components

**Input**: Design documents from `/specs/001-primitive-components/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md,
constitution.md (v1.3.1)

**Tests**: Included — Playwright visual regression + `@axe-core/playwright` accessibility
scans per component, per the testing strategy in plan.md/research.md.

**Organization**: Tasks are grouped by user story (Button P1, Text Input P2, Badge+Checkbox
P3) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Single-project static frontend, per plan.md's Project Structure: `src/components/<name>/`,
`tests/e2e/`, `scripts/` at repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic tooling — nothing here is component-specific.

- [ ] T001 Create `package.json` at repo root with devDependencies `vite@^5`,
      `tailwindcss@^3.4`, `postcss`, `autoprefixer`, `@playwright/test`,
      `@axe-core/playwright`, `wcag-contrast`, and npm scripts `dev`, `build`,
      `test:e2e`, `audit:tokens`, `audit:contrast`
- [ ] T002 [P] Create `tailwind.config.ts` with `theme.extend` mapping the constitution
      v1.3.1 semantic palette verbatim: `brand` (light/DEFAULT/dark), `neutral` (50-900),
      and `status` (success/warning/error/info + success-strong/warning-strong/error-strong)
- [ ] T003 [P] Create `postcss.config.js` wiring `tailwindcss` + `autoprefixer`
- [ ] T004 [P] Create `src/styles/tailwind.css` containing only the three `@tailwind`
      directives (base/components/utilities) — no custom rules (Principle III)
- [ ] T005 Create `vite.config.ts` configuring a multi-page build (gallery `index.html` +
      per-component HTML entries under `src/components/*/`)
- [ ] T006 Create `index.html` gallery shell at repo root: links `src/styles/tailwind.css`,
      declares one `<section>` placeholder per component (Button, Text Input, Badge,
      Checkbox) for later wiring
- [ ] T007 [P] Create `playwright.config.ts` with projects for chromium/firefox/webkit and
      viewport presets for 320/768/1024/1440px per web/testing.md breakpoints

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared compliance gates that every component's implementation depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T008 Create `scripts/audit-tokens.mjs`: parses the built HTML output for any
      Tailwind color/border-radius utility class not present in `tailwind.config.ts`'s
      `theme.extend` allowlist; exits non-zero and lists offending classes/files on
      violation (Principle IV gate, FR-005/SC-004)
- [ ] T009 [P] Create `scripts/check-contrast.mjs`: uses `wcag-contrast` to compute the
      ratio for every foreground/background token pairing documented in
      `contracts/*.md`; exits non-zero if any pairing is below 7:1 (normal text) or
      4.5:1 (large text/UI component) (Principle II gate, FR-008/SC-003)
- [ ] T010 Create `tests/e2e/a11y-helper.ts`: a shared Playwright fixture wrapping
      `@axe-core/playwright`'s `AxeBuilder` for reuse across all component specs

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Drop-in Accessible Button (Priority: P1) 🎯 MVP

**Goal**: Ship an accessible Button primitive with default/hover/active/focus-visible/
disabled states, AAA-compliant, keyboard-operable.

**Independent Test**: Drop the Button markup into a blank page; every state is visually
distinct and keyboard-operable without any other component present.

### Tests for User Story 1

> Write these first; they MUST fail until T013 exists.

- [ ] T011 [P] [US1] Write `tests/e2e/button.spec.ts`: visual regression screenshots at
      320/768/1024/1440px for default/hover/active/focus-visible/disabled states, an
      axe scan (via T010's helper) asserting zero violations, a keyboard-focus
      assertion (Tab reveals the brand-token focus ring, no browser default outline),
      and a keyboard-activation assertion (Enter fires the Button's action when
      focused, per FR-006) — implement this by having the test itself attach a
      `click` listener via `page.evaluate` before pressing Enter (native
      `<button>` elements dispatch `click` on Enter with zero JS in the
      shipped markup); no `onclick`/instrumentation hook belongs in
      button.html itself

### Implementation for User Story 1

- [ ] T012 [US1] Implement `src/components/button/button.html` per
      `contracts/button.contract.md` (primary variant on `bg-brand-dark` + secondary
      neutral-outline variant, full hover/active/focus-visible/disabled state set)
- [ ] T013 [US1] Wire the Button partial into `index.html`'s Button gallery section,
      showing both variants and every state side by side
- [ ] T014 [US1] Run `npm run audit:tokens` and `npm run audit:contrast`; fix any
      violation found in the Button markup before proceeding

**Checkpoint**: User Story 1 (Button) is fully functional and testable independently — MVP.

---

## Phase 4: User Story 2 - Drop-in Accessible Text Input (Priority: P2)

**Goal**: Ship an accessible Text Input primitive with default/focus/error/disabled
states, inline error messaging, AAA-compliant.

**Independent Test**: Drop the Text Input markup into a blank page (no Button required);
default, focus, and error states render and behave correctly in isolation.

### Tests for User Story 2

- [ ] T015 [P] [US2] Write `tests/e2e/text-input.spec.ts`: visual regression at all four
      breakpoints for default/focus/error/disabled states, an axe scan, and an assertion
      that the error state sets `aria-invalid="true"` + `aria-describedby` pointing at a
      visible `text-error-strong` message

### Implementation for User Story 2

- [ ] T016 [US2] Implement `src/components/text-input/text-input.html` per
      `contracts/text-input.contract.md` (default/focus/error/disabled, error message
      using `text-error-strong`)
- [ ] T017 [US2] Wire the Text Input partial into `index.html`'s Text Input gallery
      section, showing default, focus, error (with placeholder + error message
      together per the Edge Case), and disabled states
- [ ] T018 [US2] Run `npm run audit:tokens` and `npm run audit:contrast`; fix any
      violation found in the Text Input markup before proceeding

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Drop-in Badge & Checkbox (Priority: P3)

**Goal**: Ship the four Badge variants and an accessible Checkbox, completing the "first
slice" of primitives needed for a real screen.

**Independent Test**: Drop Badge and Checkbox markup into a blank page independently of
Button/Input; all four Badge variants render with correct tokens, and Checkbox exposes
correct checked state natively with a visible focus ring.

### Tests for User Story 3

- [ ] T019 [P] [US3] Write `tests/e2e/badge.spec.ts`: visual regression at all four
      breakpoints for the four variants side by side, and an axe scan
- [ ] T020 [P] [US3] Write `tests/e2e/checkbox.spec.ts`: visual regression for
      unchecked/checked/focus-visible/disabled/disabled+checked states, an axe scan,
      and a keyboard assertion (Space toggles checked state when focused)

### Implementation for User Story 3

- [ ] T021 [P] [US3] Implement `src/components/badge/badge.html` per
      `contracts/badge.contract.md` (success/error/warning/neutral, using the
      `-strong` text tokens and semantic ring tokens)
- [ ] T022 [P] [US3] Implement `src/components/checkbox/checkbox.html` per
      `contracts/checkbox.contract.md` (unchecked/checked/focus-visible/disabled,
      disabled+checked combined per the Edge Case)
- [ ] T023 [US3] Wire the Badge and Checkbox partials into `index.html`'s respective
      gallery sections
- [ ] T024 [US3] Run `npm run audit:tokens` and `npm run audit:contrast`; fix any
      violation found in the Badge/Checkbox markup before proceeding

**Checkpoint**: All user stories (Button, Text Input, Badge, Checkbox) are independently
functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Whole-feature verification that spans all four components.

- [ ] T025 Run `npm run build && npm run test:e2e` for the full suite (all four component
      specs); confirm every visual regression, axe scan, and keyboard assertion passes
- [ ] T026 [P] Manual QA: execute quickstart.md's "Discoverability check (SC-001)" —
      time an unfamiliar teammate copying a working Button into a scratch page; record
      whether it took under 2 minutes
- [ ] T027 [P] Manual QA: walk through quickstart.md's 9 numbered manual validation
      scenarios end to end and record pass/fail for each
- [ ] T028 Code review pass over all component markup (`src/components/**`) and the two
      audit scripts (`scripts/*.mjs`) using the code-reviewer agent; address any
      CRITICAL/HIGH findings before considering the feature done
- [ ] T029 [P] Create `README.md` at repo root documenting the npm scripts (`dev`,
      `build`, `test:e2e`, `audit:tokens`, `audit:contrast`) and how to open the
      component gallery

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
  (the audit scripts need `tailwind.config.ts` from T002 to know the token allowlist).
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion. Independent
  of each other — can proceed sequentially in priority order (P1 → P2 → P3, as this
  session will do) or in parallel if staffed.
- **Polish (Phase 6)**: Depends on all three user stories being complete.

### User Story Dependencies

- **User Story 1 (Button, P1)**: No dependency on other stories.
- **User Story 2 (Text Input, P2)**: No dependency on US1 — independently testable, may
  share the gallery page visually but not markup.
- **User Story 3 (Badge + Checkbox, P3)**: No dependency on US1/US2.

### Within Each User Story

- Tests (T011/T015/T019-T020) MUST be written and observed failing before the matching
  implementation task.
- Implementation before gallery wiring before the audit-script run.
- Story complete (including its audit run) before moving to the next priority.

### Parallel Opportunities

- T002-T004, T007 (Setup) can run in parallel — different files.
- T009 (Foundational) can run in parallel with T008 — different files.
- T011 (US1 test) has no [P] peer within its story but can run in parallel with T015/
  T019/T020 across stories if staffed.
- T021/T022 (US3 implementation) can run in parallel — different files.
- T026/T027/T029 (Polish) can run in parallel — independent activities.

---

## Parallel Example: Setup Phase

```bash
Task: "Create tailwind.config.ts with the v1.3.1 semantic palette"
Task: "Create postcss.config.js wiring tailwindcss + autoprefixer"
Task: "Create src/styles/tailwind.css with @tailwind directives only"
Task: "Create playwright.config.ts with breakpoint projects"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Button)
4. **STOP and VALIDATE**: run T014's audit scripts and T011's Playwright spec independently
5. This is a legitimate, demoable MVP — a single AAA-compliant, fully-stated Button

### Incremental Delivery (the order this session follows)

1. Setup + Foundational → foundation ready
2. User Story 1 (Button) → validate independently → MVP
3. User Story 2 (Text Input) → validate independently
4. User Story 3 (Badge + Checkbox) → validate independently
5. Phase 6 Polish → full-suite verification, manual QA, code review

---

## Notes

- [P] tasks touch different files with no unmet dependencies.
- Every implementation task cites its `contracts/*.md` file — do not deviate from the
  documented markup contract without updating the contract first (and, if a token is
  involved, the constitution — see the v1.3.1 amendment precedent from this session).
- Commit after each checkpoint (end of Phase 1, Phase 2, and each user story), not
  after every single task — matches this session's git-workflow cadence.
- SC-001 (T026) is a manual UX timing outcome, not a scripted assertion — do not attempt
  to automate it.
