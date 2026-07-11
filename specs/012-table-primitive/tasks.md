# Tasks: Table Primitive

**Input**: Design documents from `/specs/012-table-primitive/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md,
contracts/table.contract.md, quickstart.md, constitution.md (v1.9.0)

**Tests**: Included — Playwright visual regression + axe-core, per
this project's established discipline.

**Organization**: Grouped by user story (baseline P1, zebra-striped P2,
trailing-action P3). No Setup/Foundational phase — reuses the existing
Vite/Tailwind/Playwright scaffold entirely.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: User Story 1 - Scannable tabular data (P1) 🎯 MVP

- [x] T001 [US1] Write `tests/e2e/table.spec.ts` FIRST: axe-core
      zero-violations assertion for the baseline table, plus assertions
      that header cells use `scope="col"` and pass AAA contrast
      (contract: contracts/table.contract.md's baseline markup shape) —
      confirm it FAILS against the current codebase (table.html doesn't
      exist yet)
- [x] T002 [US1] Add `.data-table-wrapper`, `.data-table`,
      `.data-table-header-cell`, `.data-table-cell` `@apply` blocks to
      `src/styles/tailwind.css` — named `.data-table*`, NOT `.table*`
      (research.md R1a: Tailwind's own core display utilities collide
      with `.table`/`.table-cell`/`.table-row`)
- [x] T003 [US1] Create `src/components/table/table.html`: baseline
      table section with a header row (3+ columns) and 4+ data rows,
      real `<table>`/`<thead>`/`<tbody>`/`<th scope="col">`/`<td>`
      semantic markup (no `<div>` grid), `data-testid="table-baseline"`
- [x] T004 [US1] Register `table` in `vite.config.ts`'s
      `rollupOptions.input` and add a Table card to `index.html`'s
      gallery, per this project's per-component convention
- [x] T005 [US1] Re-run T001's assertions — confirm they now PASS
- [x] T006 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px) for the baseline table state
- [x] T006a [US1] Add edge-case rows/assertions to `table.html`/
      `table.spec.ts` (spec.md Edge Cases): (a) a row with an empty
      cell — assert row height/alignment stays consistent; (b) a row
      with long cell content — assert it truncates with an ellipsis;
      (c) confirm the table wrapper scrolls horizontally at 320px
      rather than breaking page layout. Found a genuine axe-core
      violation while testing (c) at 320px: `scrollable-region-
      focusable` — `.data-table-wrapper`'s `overflow-x-auto` becomes a
      real scrollable region once the table content is wider than the
      viewport, and axe-core requires it to be keyboard-reachable.
      Fixed by adding `tabindex="0"`, `role="region"`, and a
      descriptive `aria-label` to every wrapper. Only fired at 320px,
      not 1440px — a reminder to test the full viewport matrix.

**Checkpoint**: Baseline Table renders correctly with real semantic
markup, zero a11y violations, AAA-compliant contrast — independently
shippable MVP.

---

## Phase 2: User Story 2 - Zebra-striped rows (P2)

- [x] T007 [US2] Add the zebra-striping acceptance scenario to
      `tests/e2e/table.spec.ts` FIRST: assert every even-indexed row has
      a `bg-neutral-50` background distinct from odd rows — confirm it
      FAILS (no zebra variant exists yet)
- [x] T008 [US2] Add `.data-table-row-zebra` `@apply` block to
      `src/styles/tailwind.css` per contracts/table.contract.md
- [x] T009 [US2] Add a zebra-striped table section to
      `src/components/table/table.html`, `data-testid="table-zebra"`
- [x] T010 [US2] Re-run T007's assertion — confirm it now PASSES
- [x] T011 [US2] Add Playwright visual regression assertions for the
      zebra-striped table state

**Checkpoint**: Zebra-striped Table variant renders correctly, zero
a11y violations.

---

## Phase 3: User Story 3 - Row with a trailing action (P3)

- [x] T012 [P] [US3] Add the trailing-action acceptance scenarios to
      `tests/e2e/table.spec.ts` FIRST: a row with a trailing Badge cell
      renders correctly, axe-core reports zero nested-interactive-
      control violations on a row with a trailing link cell — confirm
      these FAIL (no trailing-action markup exists yet)
- [x] T013 [US3] Add a trailing-action table section to
      `src/components/table/table.html` per contracts/table.contract.md
      (Badge reusing the already-ratified Badge classes verbatim, and a
      separate row/column using a text link reusing `.demo-link`
      verbatim — no new interactive CSS), `data-testid="table-trailing"`
- [x] T014 [US3] Re-run T012's assertions — confirm they now PASS
- [x] T015 [US3] Add Playwright visual regression assertions for the
      trailing-action table state

**Checkpoint**: All three Table variants (baseline, zebra-striped,
trailing-action) are implemented, tested, and visually verified.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [x] T016 Run `node scripts/audit-tokens.mjs && node
      scripts/check-contrast.mjs` — confirm zero token violations. Both
      passed clean (25 HTML files, 117 @apply blocks, 0 violations).
- [x] T017 Run the full project test suite (`npm run test:e2e`) —
      confirm zero regressions across every existing spec. Result: 2176
      passed, 26 skipped (unchanged from feature 011's baseline), zero
      failures.
- [x] T018 Code review pass over the CSS/HTML diffs using the
      code-reviewer agent; address any CRITICAL/HIGH findings.
      Result: APPROVE, 0 CRITICAL/HIGH. Independently re-verified the
      `.data-table*` naming against corePlugins.js — no collisions.
      Confirmed no Tab-order/keyboard assumptions comparable to feature
      011's (this feature's viewport test is deterministic CSS-property
      based, not engine-dependent — no Docker cross-check needed). 1
      MEDIUM (the `tabindex="0"` fix is unconditional, so keyboard users
      hit a no-op focus stop at viewports where nothing overflows — an
      inherent zero-JS tradeoff, documented in the contract rather than
      silently accepted) and 1 LOW (truncation test only checked 2 of
      3 `truncate` properties — added the missing `overflow: hidden`
      check) — both fixed.
- [x] T019 Generate Linux visual regression baselines via
      `gh workflow run update-snapshots.yml` (workflow_dispatch on
      ubuntu-latest — never locally/Docker for the actual baselines;
      Docker is only for the T018 behavioral cross-check above);
      download the artifact, verify zero drift on all pre-existing
      baselines via `cmp`, commit only the genuinely new Table
      baseline files. Result: 600 identical (zero drift), 18 new files
      (baseline/zebra/trailing × 320/768/1024/1440px + firefox/webkit
      1440px), visually verified correct.
- [x] T020 Run `/speckit-constitution` to update the existing "Tables"
      Component Catalog entry: replace the abstract pattern description
      with the actually-shipped `.data-table`/`.data-table-header-cell`/
      `.data-table-cell`/`.data-table-row-zebra` class names, remove the
      "documented but never built" gap note from the Lists entry that
      references it, and record the R1a naming-collision lesson.
      MINOR bump to v1.10.0.
- [ ] T021 Verify CI is green on the actual GitHub Actions run for the
      final commit (not just local/Docker verification) before
      reporting this feature as fully shipped

---

## Dependencies & Execution Order

- **US1 (baseline)** has no dependency — MVP, must ship first since
  US2/US3 both extend its row structure.
- **US2 (zebra-striped)** depends on US1's `.data-table-cell` base
  class existing.
- **US3 (trailing-action)** depends on US1's row structure but not on
  US2's striping.
- Within each story: write the failing test first, confirm it fails,
  implement, confirm it passes.

## Implementation Strategy

**MVP first**: Phase 1 (baseline table) is a complete, independently
shippable increment. Phases 2-3 add striping and composition
incrementally. Phase 4's T019 (Linux baseline), T020 (constitution
update), and T021 (real-CI verification, not just local checks — a
direct lesson from feature 011's two false "shipped" reports) are
required before this feature is considered fully shipped.
