# Tasks: React Port — Batch 2

**Input**: Design documents from `/specs/013-react-port-batch-2/`

**Organization**: Grouped by user story (US1: 7 zero-JS components P1,
US2: Alert P2, US3: Combobox P3, US4: Command Palette P4). Each
component gets: React component (+hook if needed) → harness entry →
e2e spec (visual parity + a11y + interaction) → vite.config registration.

---

## Phase 1: User Story 1 - Zero-JavaScript components (P1) 🎯 MVP

- [x] T001 [P] [US1] Port Pagination: `packages/react/src/Pagination/Pagination.tsx`, harness `pagination.html`/`pagination-main.tsx`, `tests/e2e/react-pagination.spec.ts`, register in both vite.configs and `index.ts`
- [x] T002 [P] [US1] Port Sidebar: `packages/react/src/Sidebar/Sidebar.tsx`, harness, spec, registrations
- [x] T003 [P] [US1] Port Navbar: `packages/react/src/Navbar/Navbar.tsx`, harness, spec, registrations
- [x] T004 [P] [US1] Port Avatar: `packages/react/src/Avatar/Avatar.tsx`, harness, spec, registrations
- [x] T005 [P] [US1] Port Card: `packages/react/src/Card/Card.tsx`, harness, spec, registrations
- [x] T006 [P] [US1] Port List: `packages/react/src/List/List.tsx`, harness, spec, registrations
- [x] T007 [P] [US1] Port Table: `packages/react/src/Table/Table.tsx`, harness, spec, registrations
- [x] T008 [US1] Run all 7 new specs, confirm visual parity + zero axe-core violations

**Checkpoint**: 7 zero-JS components fully ported and tested.

---

## Phase 2: User Story 2 - Alert (P2)

- [x] T009 [US2] Port Alert: `packages/react/src/Alert/Alert.tsx` (research.md R6 — `onDismiss` callback, no internal DOM removal), harness, `tests/e2e/react-alert.spec.ts`, registrations
- [x] T010 [US2] Verify dismiss removes the Alert from the harness's own rendered list (not just visually hides it)

**Checkpoint**: Alert ported with correct React-idiomatic dismiss semantics.

---

## Phase 3: User Story 3 - Combobox (P3)

- [x] T011 [US3] Write `tests/e2e/react-combobox.spec.ts` FIRST: filter-as-you-type, arrow-key navigation, Enter-commit, Escape-cancel, axe-core — confirm it FAILS (no component exists yet)
- [x] T012 [US3] Implement `packages/react/src/hooks/useCombobox.ts` per research.md R3 (Popover API, `useId()`-derived anchor-name, `setProperty()`)
- [x] T013 [US3] Implement `packages/react/src/Combobox/Combobox.tsx` consuming the hook
- [x] T014 [US3] Add harness entry, register in vite.config/index.ts
- [x] T015 [US3] Re-run T011 — confirm it now PASSES

**Checkpoint**: Combobox fully functional, matching the static reference's behavior.

---

## Phase 4: User Story 4 - Command Palette (P4)

- [x] T016 [US4] Write `tests/e2e/react-command-palette.spec.ts` FIRST: global Cmd/Ctrl+K from an unrelated focus state, filter/arrow-nav/Enter-execute, Escape-closes-with-focus-return (WebKit-safe) — confirm it FAILS
- [x] T017 [US4] Implement `packages/react/src/hooks/useCommandPalette.ts` per research.md R2/R4 (reuses `useDialogTrigger` verbatim, independent filter logic from Combobox per research.md R3's sibling decision)
- [x] T018 [US4] Implement `packages/react/src/CommandPalette/CommandPalette.tsx`
- [x] T019 [US4] Add harness entry (including an unrelated focus target, matching `command-palette.html`'s own test setup), register in vite.config/index.ts
- [x] T020 [US4] Re-run T016 — confirm it now PASSES

**Checkpoint**: Command Palette fully functional, global shortcut verified not to conflict with any other component's own keyboard handling.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T021 Run `node scripts/audit-tokens.mjs && node scripts/check-contrast.mjs`.
      Result: both passed clean (25 HTML files, 171 @apply blocks
      across 2 CSS files, 24 .tsx files, 0 violations).
- [x] T022 Run the full project test suite (`npm run test:e2e`) —
      confirm zero regressions. Result: 2452 passed, 26 skipped
      (unchanged baseline), zero failures. Also found and fixed a real
      flaky-under-load bug in the new Command Palette tests: two tests
      pressed the global Cmd/Ctrl+K shortcut immediately after
      page.goto() without first waiting for any element to be
      focusable, so under heavy concurrent test-suite load the keydown
      could fire before React finished mounting and attaching its
      listener — fixed by focusing a real element first, matching the
      pattern already used by the file's other (passing) tests.
      Verified stable across two full consecutive runs after the fix.
- [x] T023 Code review pass over all new component/hook diffs using the
      code-reviewer agent; address CRITICAL/HIGH findings.
      Result: 0 CRITICAL, 1 HIGH (fixed), 2 MEDIUM (fixed), 2 LOW
      (pre-existing/no action needed).
      (1, HIGH) `useCombobox`'s `suppressNextAutoOpen` ref-flag hack
      had a real bug: it only got reset when `query` state actually
      changed, so committing a value IDENTICAL to what was already
      typed (e.g. typing the exact option label, then Enter) left the
      flag stuck `true` forever, silently breaking the listbox's next
      legitimate reopen. Fixed by removing the reactive `[query]`
      effect and flag entirely — `onInputChange` now calls open()/
      close() directly, mirroring combobox.js's own imperative
      structure exactly instead of faking it reactively. Added a
      regression test proving the exact scenario now works.
      (2, MEDIUM) Command Palette's global shortcut guard checked
      `document.querySelector("dialog[open]")` — page-wide, so any
      other open Modal/SlideOver (or a second CommandPalette instance)
      would incorrectly block this palette from opening. Fixed to
      check this instance's own `dialogRef.current?.open` instead.
      (3, MEDIUM) `ListItemData.href` is optional in the type even
      though data-model.md requires it per-item when `interactive` is
      set — TypeScript can't enforce a per-item requirement keyed on a
      sibling list-level prop via a clean discriminated union, so added
      a dev-only `console.warn` (gated on `NODE_ENV !== "production"`)
      catching the caller error instead.
      Also found and fixed an unrelated, pre-existing flaky test
      (`tests/e2e/react-button.spec.ts`, from feature 004, already
      flagged in memory) while verifying zero regressions: a bare
      `page.evaluate()`/`querySelector()` with no wait for hydration
      could return null under heavy concurrent test-suite load — the
      same class of issue as T022's Command Palette fix. Fixed with an
      explicit `waitFor({ state: "attached" })` first.
- [ ] T024 Generate Linux visual regression baselines via `gh workflow run update-snapshots.yml`; verify zero drift via `cmp`; commit only genuinely new baseline files
- [ ] T025 Update the constitution if any React-specific pattern warrants catalog documentation (judge at ratification time — likely a lighter-touch amendment than 011/012 since this is a packaging port, not new visual/interaction ratification)
- [ ] T026 Verify CI is green on the actual GitHub Actions run for the final commit before reporting this feature as fully shipped (lesson from features 011/012)

---

## Dependencies & Execution Order

- US1's 7 components are fully independent of each other (parallelizable).
- US2 (Alert) has no dependency on US1.
- US3 (Combobox) has no dependency on US1/US2.
- US4 (Command Palette) depends on `useDialogTrigger` already existing
  (it does, feature 004) — no dependency on US3 despite similar filter
  logic (deliberately not shared, matching the static reference's own
  documented decision).

## Implementation Strategy

**MVP first**: Phase 1 (7 zero-JS ports) is the highest-value,
lowest-risk increment. Phases 2-4 add increasing interaction
complexity. Phase 5's T024 (Linux baseline) and T026 (real-CI
verification) are required before this feature is considered fully
shipped, per the established precedent from every prior feature.
