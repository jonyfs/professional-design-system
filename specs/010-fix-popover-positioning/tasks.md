# Tasks: Fix Popover Panel Positioning

**Input**: Design documents from `/specs/010-fix-popover-positioning/`

**Prerequisites**: plan.md, spec.md, research.md, contracts/, quickstart.md,
constitution.md (v1.7.0)

**Tests**: Included — Playwright bounding-box-adjacency assertions (new),
plus full re-run of each affected component's existing suite.

**Organization**: Grouped by user story (Dropdown Menu P1, Combobox P2).
No Setup/Foundational phase — this is a modification of already-shipped
files, no new scaffold needed.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: User Story 1 - Dropdown Menu panel anchors to trigger (P1) 🎯 MVP

- [x] T001 [US1] Write the bounding-box-adjacency assertion FIRST in
      `tests/e2e/dropdown-menu.spec.ts` (before the fix) and confirm it
      FAILS against the current, unfixed code — proves the test would
      have caught the original bug (spec.md SC-003)
- [x] T002 [US1] Modify `src/scripts/dropdown-menu.js`: add a
      module-level `anchorCounter`, assign a unique
      `--dropdown-anchor-N` via `trigger.style.anchorName`/
      `menu.style.positionAnchor` per instance (contracts/
      dropdown-menu-positioning.contract.md)
- [x] T003 [US1] Modify `.dropdown-menu-panel` in `src/styles/
      tailwind.css`: remove `right-0` from the `@apply` line, add plain
      `position: absolute; top: anchor(bottom); right: anchor(right);`
      CSS
- [x] T004 [US1] Re-run T001's assertion — confirm it now PASSES
- [x] T005 [US1] Modify `packages/react/src/hooks/useDropdownMenu.ts`:
      add a `useId()`-derived, custom-ident-sanitized anchor name,
      assigned via `trigger.style.anchorName`/
      `panel.style.positionAnchor` in the existing ref effect
- [x] T006 [US1] Modify `.dropdown-menu-panel` in `packages/react/src/
      styles.css` identically to T003
- [x] T007 [US1] Add the same bounding-box-adjacency assertion to
      `tests/e2e/react-dropdown-menu.spec.ts`
- [x] T008 [US1] Run `tests/e2e/dropdown-menu.spec.ts` and
      `tests/e2e/react-dropdown-menu.spec.ts` in full — confirm zero
      regressions to existing keyboard/focus/ARIA assertions
- [x] T009 [US1] Run `node scripts/audit-tokens.mjs && node
      scripts/check-contrast.mjs` — confirm zero violations (no new
      tokens)

**Checkpoint**: Dropdown Menu (static + React) correctly anchors its
panel to its trigger, verified by a test that would have caught the
original bug.

---

## Phase 2: User Story 2 - Combobox listbox anchors to input (P2)

- [x] T010 [P] [US2] Write the bounding-box-adjacency assertion FIRST in
      `tests/e2e/combobox.spec.ts` (before the fix) and confirm it FAILS
      against the current, unfixed code
- [x] T011 [US2] Modify `src/scripts/combobox.js`: add a module-level
      `anchorCounter`, assign a unique `--combobox-anchor-N` via
      `input.style.anchorName`/`listbox.style.positionAnchor` per
      instance (contracts/combobox-positioning.contract.md)
- [x] T012 [US2] Modify `.combobox-listbox` in `src/styles/
      tailwind.css`: remove `left-0 right-0` from the `@apply` line, add
      plain `position: absolute; top: anchor(bottom); left:
      anchor(left); right: anchor(right);` CSS
- [x] T013 [US2] Re-run T010's assertion — confirm it now PASSES
- [x] T014 [US2] Run `tests/e2e/combobox.spec.ts` in full — confirm zero
      regressions to existing filter/keyboard/ARIA assertions
- [x] T015 [US2] Run `node scripts/audit-tokens.mjs && node
      scripts/check-contrast.mjs` — confirm zero violations

**Checkpoint**: Combobox correctly anchors its listbox to its input.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [x] T016 Run the full project test suite (`npm run test:e2e`) —
      confirm zero regressions across every existing spec, not just the
      two directly modified
- [x] T017 Compare every existing screenshot this run touches via `cmp`
      against what's already committed — confirm zero pixel drift (the
      fix should change page layout position, not the cropped element's
      own rendered appearance); only regenerate Linux baselines via
      `update-snapshots.yml` workflow_dispatch if drift is found
- [x] T018 Code review pass over the CSS/JS diffs using the
      code-reviewer agent; address any CRITICAL/HIGH findings — pay
      particular attention to the anchor-name uniqueness logic and
      whether it could collide with a future feature's own anchor usage.
      Result: APPROVE, 0 CRITICAL/HIGH. 1 MEDIUM (no documented
      fallback for browsers lacking `anchor()` support) — addressed via
      a comment in tailwind.css noting the accepted risk. 3 LOW notes
      (setProperty/camelCase divergence, untied 5px test tolerance,
      duplicated demo comments) — no action needed, informational only.
- [x] T019 Corrected the constitution's Dropdown Menu/Combobox entries (a
      correctness fix to already-ratified components, not a new catalog
      entry) — or a minimal wording tightening if the existing Dropdown
      Menu/Combobox descriptions imply positioning correctness that
      wasn't actually true until this fix
- [x] T020 [P] Update `MEMORY.md`/the saved
      `popover-absolute-positioning-bug.md` memory to reflect the bug is
      now fixed, not just documented

---

## Dependencies & Execution Order

- **US1 (Dropdown Menu)** has no dependency on US2 — can start
  immediately. MVP scope, and validates the fix strategy before applying
  it to Combobox.
- **US2 (Combobox)** has no dependency on US1 — independently
  implementable, ordered second per spec.md's stated rationale.
- Within each story: write the failing test first (T001/T010), confirm
  it fails, apply the fix, confirm it passes — this feature's version of
  TDD, directly proving the fix actually fixes something rather than
  coincidentally passing.

## Implementation Strategy

**MVP first**: Phase 1 (Dropdown Menu, both static and React) is a
complete, independently shippable increment. Phase 2 (Combobox) reuses
the identical strategy once proven. Phase 3's T017 (Linux baseline
check) and T019 (constitution check) are required before this feature
is considered fully shipped, matching the precedent set by every prior
feature.
