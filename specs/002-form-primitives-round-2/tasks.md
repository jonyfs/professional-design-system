# Tasks: Form Primitives — Round 2

**Input**: Design documents from `/specs/002-form-primitives-round-2/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/,
quickstart.md, constitution.md (v1.3.3)

**Tests**: Included — Playwright visual regression + `@axe-core/playwright`
accessibility scans per component, same pattern as feature 001.

**Organization**: Tasks are grouped by user story (Radio P1, Select P2,
Toggle P3). No Setup or Foundational phase — all tooling (Vite, Tailwind,
Playwright, `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs` with
its `RING_PAIRINGS`, `tests/e2e/a11y-helper.ts`) already exists from
feature 001 and needs no changes for this feature.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Same single-project static frontend layout as feature 001:
`src/components/<name>/`, `tests/e2e/`.

---

## Phase 1: User Story 1 - Drop-in Accessible Radio Group (Priority: P1) 🎯 MVP

**Goal**: Ship an accessible Radio group primitive with default/checked/
focus-visible/disabled states and native mutual exclusivity.

**Independent Test**: Drop a 3-option radio group into a blank page; exactly
one option is selectable at a time, every state is visually distinct, and
keyboard operation works without any other component present.

### Tests for User Story 1

> Write first; they MUST fail until T003 exists.

- [ ] T001 [P] [US1] Write `tests/e2e/radio.spec.ts`: visual regression at
      320/768/1024/1440px for default/checked/focus-visible/disabled states,
      an axe scan (via `tests/e2e/a11y-helper.ts`), a mutual-exclusivity
      assertion (selecting one option deselects the previously-selected one
      in the same `name` group), and a long-label wrap assertion (Edge Case)

### Implementation for User Story 1

- [ ] T002 [US1] Implement `src/components/radio/radio.html` per
      `contracts/radio.contract.md` (3-option group sharing one `name`,
      one option disabled, `peer`/`peer-disabled:opacity-50` label dimming)
- [ ] T003 [US1] Wire the Radio partial into `index.html`'s gallery as a new
      card linking to the standalone page (same pattern as the four
      feature 001 cards)
- [ ] T004 [US1] Run `npm run audit:tokens` and `npm run audit:contrast`;
      fix any violation before proceeding (expected: 0, per research.md's
      "no new tokens" verification)

**Checkpoint**: User Story 1 (Radio) is fully functional and testable
independently — MVP.

---

## Phase 2: User Story 2 - Drop-in Accessible Select (Priority: P2)

**Goal**: Ship an accessible Select primitive with default/focus/error/
disabled states, visually consistent with Text Input.

**Independent Test**: Drop the Select markup into a blank page (no other
component required); default, focus, and error states render and behave
correctly in isolation, fully keyboard-operable.

### Tests for User Story 2

- [ ] T005 [P] [US2] Write `tests/e2e/select.spec.ts`: visual regression at
      all four breakpoints for default/focus/error/disabled states, an axe
      scan, and an assertion that the error state sets `aria-invalid="true"`
      + `aria-describedby` pointing at a visible `text-error-strong` message
      that remains present even with no option selected (Edge Case)

### Implementation for User Story 2

- [ ] T006 [US2] Implement `src/components/select/select.html` per
      `contracts/select.contract.md` (default/focus/error/disabled,
      matching Text Input's exact token treatment)
- [ ] T007 [US2] Wire the Select partial into `index.html`'s gallery
- [ ] T008 [US2] Run `npm run audit:tokens` and `npm run audit:contrast`;
      fix any violation before proceeding (expected: 0)

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 3: User Story 3 - Drop-in Accessible Toggle/Switch (Priority: P3)

**Goal**: Ship an accessible Toggle primitive with off/on/focus-visible/
disabled states and a properly-contrasted track boundary.

**Independent Test**: Drop the Toggle markup into a blank page
independently of other components; off/on states, focus ring, and disabled
state all render and behave correctly, Space/click toggles when focused.

### Tests for User Story 3

- [ ] T009 [P] [US3] Write `tests/e2e/toggle.spec.ts`: visual regression at
      all four breakpoints for off/on/focus-visible/disabled(+on) states, an
      axe scan, a Space-key toggle assertion, and an assertion that no
      `aria-checked`/`role="switch"` is present (native checkbox semantics
      only, per FR-006)

### Implementation for User Story 3

- [ ] T010 [US3] Implement `src/components/toggle/toggle.html` per
      `contracts/toggle.contract.md` (`sr-only` checkbox input, track with
      `ring-neutral-500` boundary state-invariant across off/on, dot sliding
      via `peer-checked:translate-x-5`, both track and dot dimming via
      `peer-disabled:opacity-50`)
- [ ] T011 [US3] Wire the Toggle partial into `index.html`'s gallery
- [ ] T012 [US3] Run `npm run audit:tokens` and `npm run audit:contrast`;
      fix any violation before proceeding (expected: 0 — `RING_PAIRINGS`
      already covers the new `ring-neutral-500` claim)

**Checkpoint**: All three user stories (Radio, Select, Toggle) are
independently functional.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Whole-feature verification spanning all three new components.

- [ ] T013 Run `npm run build && npm run test:e2e` for the full suite (all
      seven component specs — four from feature 001 plus Radio/Select/
      Toggle); confirm every visual regression, axe scan, and keyboard
      assertion passes
- [ ] T014 Trigger `gh workflow run update-snapshots.yml`, wait for
      completion, download its `updated-snapshots` artifact
      (`gh run download <run-id> -n updated-snapshots -D /tmp/updated-snapshots`),
      and copy the new component specs' `*-linux.png` files into their
      `tests/e2e/<name>.spec.ts-snapshots/` directories. Do **not** generate
      these locally or via local Docker — feature 001's CI incident showed
      neither is bit-identical to the real runner (research.md)
- [ ] T015 [P] Manual QA: execute quickstart.md's "Discoverability check
      (SC-001)" — time an unfamiliar teammate copying a working Radio group
      into a scratch page; record whether it took under 2 minutes. **NOT
      DONE by an AI agent** — requires a human tester, same outstanding
      status as feature 001's equivalent item
- [ ] T016 [P] Manual QA: walk through quickstart.md's 9 numbered manual
      validation scenarios end to end and record pass/fail for each
- [ ] T017 Code review pass over the three new components
      (`src/components/{radio,select,toggle}/**`) and the
      `check-contrast.mjs` diff using the code-reviewer agent; address any
      CRITICAL/HIGH findings before considering the feature done
- [ ] T018 [P] Update `README.md`'s project structure section to list the
      three new component directories alongside the existing four

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Stories (Phases 1-3)**: No shared setup/foundational phase needed
  — all reuse existing, unchanged tooling. Independent of each other; this
  session proceeds sequentially in priority order (P1 → P2 → P3).
- **Polish (Phase 4)**: Depends on all three user stories being complete.

### User Story Dependencies

- **User Story 1 (Radio, P1)**: No dependency on other stories.
- **User Story 2 (Select, P2)**: No dependency on US1.
- **User Story 3 (Toggle, P3)**: No dependency on US1/US2.

### Within Each User Story

- Test written and observed failing before the matching implementation task.
- Implementation before gallery wiring before the audit-script run.
- Story complete (including its audit run) before moving to the next
  priority.

### Parallel Opportunities

- T001, T005, T009 (the three story tests) can run in parallel across
  stories if staffed — each touches a different file.
- T015/T016/T018 (Polish) can run in parallel — independent activities.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: User Story 1 (Radio)
2. **STOP and VALIDATE**: run T004's audits and T001's Playwright spec
   independently
3. This is a legitimate, demoable MVP increment on top of feature 001

### Incremental Delivery (the order this session follows)

1. User Story 1 (Radio) → validate independently → MVP
2. User Story 2 (Select) → validate independently
3. User Story 3 (Toggle) → validate independently
4. Phase 4 Polish → full-suite verification (against CI-runner-generated
   baselines), manual QA, code review

---

## Notes

- [P] tasks touch different files with no unmet dependencies.
- Every implementation task cites its `contracts/*.md` file — do not
  deviate from the documented markup contract without updating the
  contract first (and the constitution, if a token is involved).
- Commit after each checkpoint (end of each user story), matching feature
  001's cadence.
- SC-001 (T015) is a manual UX timing outcome, not a scripted assertion —
  do not attempt to automate it.
- T014 exists specifically because feature 001 shipped one CI failure from
  darwin-vs-linux snapshot naming and a second from local-Docker-vs-real-
  runner font rendering — this task encodes the lesson so it isn't
  relearned.
