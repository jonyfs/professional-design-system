# Tasks: React Component Library (Claude Design Compatibility)

**Input**: Design documents from `/specs/004-react-component-library/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/,
quickstart.md

**Tests**: Included — Playwright visual regression + `@axe-core/playwright`
against a new dev-only React test harness, reusing the existing
`tests/e2e/<name>.spec.ts` pattern rather than adding a second testing
paradigm (research.md).

**Organization**: Three checkpointed phases, one per user story, in
priority order — per plan.md's explicit note that this feature is NOT a
same-size continuation of features 001-003 and must not be treated as a
single flat task list. Each phase is independently completable and
verified before the next begins.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

New: `packages/react/`, `shared/design-tokens.ts`, `tests/react-harness/`,
`tests/e2e/react-*.spec.ts`. Modified: root `package.json`,
`tailwind.config.ts`, `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`.

---

## Phase 1: User Story 1 - Package Foundation Proven on Button (Priority: P1) 🎯 MVP

**Goal**: Stand up the entire new pipeline (npm workspace, shared tokens,
TypeScript build, compiled CSS, React test harness) and prove it end-to-
end on the single simplest component.

**Independent Test**: Build the package, import `Button` in the test
harness, confirm visual parity against `src/components/button/button.html`
and full TypeScript prop-completion.

### Foundational (blocks all of Phase 1)

- [x] T001 Extract `shared/design-tokens.ts` per `data-model.md`'s exact
      shape (`colors`, `borderRadius`, `fontFamily` — direct extraction
      from the current `tailwind.config.ts`, no new values)
- [x] T002 Modify root `tailwind.config.ts` to import `colors`,
      `borderRadius`, `fontFamily` from `shared/design-tokens.ts` instead
      of declaring them inline; run `npm run build` + `npm run test:e2e`
      to confirm zero visual change to the existing static site (the
      values are identical, only their source moved)
- [x] T003 Add `"workspaces": ["packages/*", "tests/react-harness"]` to
      root `package.json` per `contracts/react-package.contract.md` —
      `tests/react-harness` is listed explicitly since it lives outside
      the `packages/*` glob (an earlier draft omitted it; `/speckit-analyze`
      caught that this would break both `npm run dev --workspace
      tests/react-harness` and the harness's workspace-protocol
      dependency on `packages/react`). Depends on: T001, T004 (below)
      existing first if run in strict order, though in practice this
      task only edits root `package.json` and can be done any time
      before T006.
- [x] T004 Create `packages/react/package.json`, `tsconfig.json`,
      `tsup.config.ts`, `tailwind.config.ts` per
      `contracts/react-package.contract.md` (the `tailwind.config.ts`
      imports from `shared/design-tokens.ts`, so T001 MUST exist first)
- [x] T005 Create `packages/react/src/styles.css` (`@tailwind` directives
      + an empty `@layer components` block — populated per-component in
      later tasks, matching `src/styles/tailwind.css`'s structure)
- [x] T006 Run `npm install` at the repo root to wire the new workspaces
      (depends on T001, T003, T004 all existing first — installing
      before the workspace manifests exist resolves nothing new)

### Implementation for User Story 1

- [x] T007 [P] [US1] Write `tests/e2e/react-button.spec.ts`: same
      assertions as `tests/e2e/button.spec.ts` (visual regression, axe
      scan, hover/active/focus-visible/disabled states), pointed at the
      test harness instead of the static HTML page
- [x] T008 [US1] Create `tests/react-harness/` (minimal Vite + React app;
      `package.json` includes `"dependencies": {"@professional-design-system/react": "^0.1.0"}`
      — a plain semver range, not `"workspace:*"` (that's pnpm/Yarn
      syntax; npm has no `workspace:` protocol and errors
      `EUNSUPPORTEDPROTOCOL` on it — found during implementation),
      resolvable only because T003 added `tests/react-harness` itself to
      the root `workspaces` array — one page per component added
      incrementally — this task creates the harness shell + a Button
      demo page only)
- [x] T009 [US1] Implement `packages/react/src/Button/Button.tsx` per
      `contracts/component-props.contract.md`'s reference implementation
      (port `.btn-primary`/`.btn-secondary` `@apply` rules into
      `packages/react/src/styles.css`'s `@layer components`, verbatim
      from `src/styles/tailwind.css`)
- [x] T010 [US1] Export `Button`/`ButtonProps` from
      `packages/react/src/index.ts` per
      `contracts/react-package.contract.md`'s barrel-export shape
- [x] T011 [US1] Run `npm run build --workspace packages/react`; confirm
      `dist/index.mjs`, `dist/index.js`, `dist/index.d.ts`,
      `dist/styles.css` all exist and are non-empty
- [x] T012 [US1] Manually inspect `dist/index.d.ts`'s `ButtonProps` —
      confirm it's clean, flattened TypeScript with no hand-written
      override needed (SC-002's per-component bar)
- [x] T013 [US1] Extend `scripts/audit-tokens.mjs` and
      `scripts/check-contrast.mjs` to also scan
      `packages/react/src/**/*.tsx` `className` string literals and
      `packages/react/src/styles.css`'s `@apply` blocks (research.md);
      run both against the current state — expect 0 violations
- [x] T014 [US1] Run `tests/e2e/react-button.spec.ts`; confirm visual
      parity against the existing `button.spec.ts-snapshots/` baselines

**Checkpoint**: User Story 1 (package foundation + Button) is fully
functional and independently verified — MVP. **STOP and validate**
before proceeding: this is the point to discover any structural problem
with the whole approach, per plan.md's Scale/Scope note.

---

## Phase 2: User Story 2 - Remaining Non-Overlay Primitives (Priority: P2)

**Goal**: Port Text Input, Badge, Checkbox, Radio, Select, Toggle using
the exact pipeline proven in Phase 1 — no new tooling decisions.

**Independent Test**: For each of the six components, build the package,
render it in the harness, confirm visual/behavioral parity with its
existing HTML reference.

### Tests for User Story 2

- [x] T015 [P] [US2] Write `tests/e2e/react-text-input.spec.ts`,
      `react-badge.spec.ts`, `react-checkbox.spec.ts`, `react-radio.spec.ts`,
      `react-select.spec.ts`, `react-toggle.spec.ts` — each mirroring its
      existing static-HTML spec's assertions exactly

### Implementation for User Story 2

- [x] T016 [P] [US2] Implement `packages/react/src/TextInput/TextInput.tsx`
      per `data-model.md`'s prop table and `001/contracts/text-input.contract.md`
      (port the error-state/`aria-invalid`/`aria-describedby` logic exactly)
- [x] T017 [P] [US2] Implement `packages/react/src/Badge/Badge.tsx` per
      `001/contracts/badge.contract.md`'s four variants
- [x] T018 [P] [US2] Implement `packages/react/src/Checkbox/Checkbox.tsx` per
      `001/contracts/checkbox.contract.md`
- [x] T019 [P] [US2] Implement `packages/react/src/Radio/Radio.tsx` per
      `002/contracts/radio.contract.md` (native `name`-based mutual
      exclusivity — no custom JS)
- [x] T020 [P] [US2] Implement `packages/react/src/Select/Select.tsx` per
      `002/contracts/select.contract.md`
- [x] T021 [P] [US2] Implement `packages/react/src/Toggle/Toggle.tsx` per
      `002/contracts/toggle.contract.md` (including the
      `group-has-[:disabled]` label-dimming fix from feature 002's code
      review)
- [x] T022 [US2] Port all six components' `@apply` component classes
      into `packages/react/src/styles.css`; add each to
      `packages/react/src/index.ts`'s barrel export
- [x] T023 [US2] Add a harness demo page per component in
      `tests/react-harness/`
- [x] T024 [US2] Run `npm run build --workspace packages/react`; run
      `audit:tokens`/`audit:contrast` (expect 0 violations); run all six
      new Playwright specs, confirm visual parity against each existing
      HTML baseline; **also inspect `dist/index.d.ts`** for all six new
      `<Name>Props` interfaces (TextInput, Badge, Checkbox, Radio,
      Select, Toggle) — same clean-extraction bar as T012 checked for
      Button alone (`/speckit-analyze` caught that SC-002's "10/10
      components" bar had no task verifying it past Button)

**Checkpoint**: All 7 non-overlay primitives (Button + these 6) are
ported and independently verified.

---

## Phase 3: User Story 3 - Overlay Primitives via React Hooks (Priority: P3)

**Goal**: Port Modal, Toast, Slide-over, translating `overlay.js`/
`toast.js`'s imperative DOM wiring into the `useDialogTrigger` hook
(research.md) — the highest-risk piece, sequenced last.

**Independent Test**: Render `<Modal>`/`<SlideOver>`/`<Toast>` in the
harness; confirm the exact same focus-trap, dismissal, and focus-return
behavior as feature 003's Playwright suite, now via the React API.

### Tests for User Story 3

- [x] T025 [P] [US3] Write `tests/e2e/react-modal.spec.ts`,
      `react-slide-over.spec.ts`, `react-toast.spec.ts` — port every
      assertion from `tests/e2e/modal.spec.ts`/`slide-over.spec.ts`/
      `toast.spec.ts` (Tab-cycle containment, Shift+Tab wrap, Escape/
      backdrop/close-button dismissal with focus-return, pointer-
      inertness, `hasFocusableContent=false` edge case, no-console-error
      check via `expectNoConsoleErrors` — no CSP is added to the dev-only
      harness (`/speckit-analyze` found the CSP task copied from feature
      003 without re-deriving whether it applies to unpublished dev
      tooling with no real threat model; dropped rather than risk
      breaking Vite's dev-server HMR for no actual benefit), the console-
      error check still catches genuine runtime/render errors) against
      the harness's React-rendered versions

### Implementation for User Story 3

- [x] T026 [US3] Implement `packages/react/src/hooks/useDialogTrigger.ts`
      per `contracts/component-props.contract.md`'s reference
      implementation (the direct React port of `overlay.js`'s
      `initDialogTriggers()`, including the WebKit focus-return
      safeguard)
- [x] T027 [US3] Implement `packages/react/src/Modal/Modal.tsx` per
      `contracts/component-props.contract.md`'s reference implementation
      (using `useId()` for `aria-labelledby`, per the /speckit-analyze
      fix — NOT a hardcoded literal id)
- [x] T028 [US3] Implement `packages/react/src/SlideOver/SlideOver.tsx` —
      textually identical to `Modal.tsx` except `.slide-over-dialog`/
      `.slide-over-panel` classes, same as the HTML contracts'
      "only the CSS differs" relationship
- [x] T029 [US3] Implement `packages/react/src/Toast/Toast.tsx` per
      `003/contracts/toast.contract.md` (`role="status"`/
      `aria-live="polite"`, `onDismiss` called from the close button's
      `onClick` — no internal DOM removal, unlike `toast.js`, since a
      React component doesn't remove itself from a list it doesn't own).
      **Also append a short amendment note to
      `specs/003-overlays-modal-toast/contracts/toast.contract.md`**
      recording this deviation (React port: consumer-owned removal via
      `onDismiss`, vs. the original's internal `.remove()`) — found by
      `/speckit-analyze`: this feature's own data-model.md documented the
      difference, but the cited upstream contract didn't, leaving it as
      the source of truth only in one of the two places that reference it
- [x] T030 [US3] Port `.modal-dialog`/`.modal-panel`/`.slide-over-dialog`/
      `.slide-over-panel`/`.close-icon-btn`/`.toast`/`.toast-stack` `@apply`
      classes (including the `::backdrop` `theme()` rules) into
      `packages/react/src/styles.css`; add Modal/SlideOver/Toast to the
      barrel export
- [x] T031 [US3] Add harness demo pages for Modal (default +
      `hasFocusableContent=false` variant — the case that specifically
      needs `useId()`, not a hardcoded id), Slide-over (same), and Toast
- [x] T033 [US3] Run `npm run build --workspace packages/react`; run
      `audit:tokens`/`audit:contrast`; run all three new Playwright specs,
      confirm 1:1 behavioral parity with feature 003's original
      assertions; **also inspect `dist/index.d.ts`** for `ModalProps`,
      `ToastProps`, `SlideOverProps` — completes SC-002's 10/10 check
      across all three phases (T012 covered Button, T024 covered the six
      Phase 2 components, this covers the remaining three)

**Checkpoint**: All 10 components ported; package feature-complete.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [ ] T034 Run the full project test suite (`npm run test:e2e`) — all
      existing HTML specs plus all ten new `react-*.spec.ts` files;
      confirm zero regressions to the untouched static gallery
- [ ] T035 [P] Manual QA: execute quickstart.md's discoverability check
      (SC-005) — time an unfamiliar developer installing the package and
      rendering a component using only the generated types + contract
      docs. **NOT DONE by an AI agent** — requires a human tester, same
      outstanding status as every prior feature's equivalent item
- [ ] T036 [P] Manual QA: walk through quickstart.md's manual validation
      scenarios end to end; if no interactive browser session is
      available, substitute with explicit confirmation that each
      scenario has a corresponding automated Playwright assertion
- [ ] T037 Code review pass over `packages/react/**`,
      `shared/design-tokens.ts`, `tests/react-harness/**`, and the
      `tailwind.config.ts`/`audit-tokens.mjs`/`check-contrast.mjs` diffs
      using the code-reviewer agent; address any CRITICAL/HIGH findings
- [ ] T038 [P] Update root `README.md` with the new package (install/
      build/import instructions, link to `packages/react/`) and note
      that both the static gallery and the React package are maintained
      in parallel, per spec.md's Edge Cases

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US1)**: Foundational tasks (T001-T006) block everything else
  in the feature, not just US1 — every later phase builds on the
  workspace/shared-tokens/build scaffold set up here.
- **Phase 2 (US2)**: Depends on Phase 1's scaffold; the six components
  are otherwise independent of each other and of Phase 3.
- **Phase 3 (US3)**: Depends on Phase 1's scaffold only (not Phase 2) —
  Modal/Toast/Slide-over don't reuse any of the six Phase 2 components.
  Sequenced last for risk-ordering (plan.md), not a hard dependency.
- **Phase 4 (Polish)**: Depends on all three user stories being complete.

### Within Each User Story

- Test written before the matching implementation task (T007 before
  T009; T015 before T016-T021; T025 before T026-T029).
- Component implementation before its CSS is ported into the shared
  `styles.css` before it's added to the barrel export before the build
  is re-run.

### Parallel Opportunities

- T015 (six test files) can be split across parallel effort — each
  touches a different file.
- T016-T021 (six component implementations) are mutually independent
  and can proceed in parallel once T015's tests exist.
- T025 (three overlay test files) similarly parallelizable.
- T035/T036/T038 (Polish) are independent activities.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (foundational scaffold + Button)
2. **STOP and VALIDATE**: confirm the build produces the exact contract
   shape, the harness renders correctly, and the Playwright spec passes
   with true visual parity — before writing a single line of the other
   nine components
3. This is a legitimate, demoable MVP: a real, installable package with
   one working, typed, visually-identical component

### Incremental Delivery (the order this session follows)

1. Phase 1 (Button + foundation) → validate independently → MVP
2. Phase 2 (six non-overlay primitives) → validate independently
3. Phase 3 (Modal/Toast/Slide-over) → validate independently
4. Phase 4 Polish → full-suite verification, manual QA, code review

---

## Notes

- [P] tasks touch different files with no unmet dependencies.
- Every implementation task cites its existing `*.contract.md` — the
  React port MUST NOT deviate from the already-ratified markup/behavior
  without updating that contract first (same discipline as every prior
  feature).
- SC-005 (T035) is a manual UX timing outcome, not a scripted assertion.
- This feature's scope is genuinely larger than features 001-003
  combined (plan.md's Scale/Scope note) — the three-phase checkpoint
  structure above exists specifically so a partial completion (e.g.
  Phase 1 done, Phases 2-3 not yet started) is still a coherent,
  shippable, independently-valuable state, not a half-finished feature.
