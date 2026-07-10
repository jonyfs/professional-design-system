# Tasks: Lists Primitive

**Input**: Design documents from `/specs/011-lists-primitive/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md,
contracts/list.contract.md, quickstart.md, constitution.md (v1.8.0)

**Tests**: Included — Playwright visual regression + axe-core + keyboard
navigation, per this project's established discipline.

**Organization**: Grouped by user story (read-only P1, interactive P2,
trailing-action P3). No Setup/Foundational phase — reuses the existing
Vite/Tailwind/Playwright scaffold entirely.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: User Story 1 - Read-only list of records (P1) 🎯 MVP

- [x] T001 [US1] Write `tests/e2e/list.spec.ts` FIRST: axe-core
      zero-violations assertion for the read-only list, plus an
      assertion that each row's avatar/title/metadata renders (contract:
      contracts/list.contract.md's read-only markup shape) — confirm it
      FAILS against the current codebase (list.html doesn't exist yet)
- [x] T002 [US1] Add `.list`, `.list-row`, `.list-row-title`,
      `.list-row-metadata` `@apply` blocks to `src/styles/
      tailwind.css`, using the corrected `text-neutral-600` metadata
      token (research.md R1) — NOT the previously-ratified
      `text-neutral-500`. Renamed from the originally-planned
      `.list-item*` to `.list-row*`: Tailwind's own core `display`
      plugin defines a `.list-item { display: list-item }` utility,
      and since utilities is a later `@layer` than components, a class
      literally named `list-item` had its `display: flex` silently
      overridden — caught empirically via a real rendering bug (rows
      collapsed vertically), not assumed.
- [x] T003 [US1] Create `src/components/list/list.html`: read-only list
      section with 4+ rows, reusing `.avatar-img`/`.avatar-fallback`/
      `avatar-lg` verbatim (feature 006) for the avatar slot, one row
      using the image variant and one using the initials-fallback
      variant (data-model.md's "avatar" field), each with
      `data-testid="list-item-readonly"` (or indexed variants)
- [x] T004 [US1] Register `list` in `vite.config.ts`'s
      `rollupOptions.input` and add a Lists card to `index.html`'s
      gallery, per this project's per-component convention
- [x] T005 [US1] Re-run T001's assertions — confirm they now PASS
- [x] T006 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px) for the read-only list state in
      `tests/e2e/list.spec.ts`
- [x] T006a [US1] Add two edge-case rows to `list.html`'s read-only
      section and matching assertions in `tests/e2e/list.spec.ts`
      (spec.md Edge Cases): (a) a row with no metadata — assert the
      avatar remains vertically centered against the title-only text
      block; (b) a row with a very long title — assert it truncates
      with an ellipsis (`truncate` class) rather than wrapping or
      breaking the row's height

**Checkpoint**: Read-only Lists renders correctly, zero a11y violations,
AAA-compliant metadata contrast — independently shippable MVP.

---

## Phase 2: User Story 2 - Interactive, navigable list (P2)

- [x] T007 [US2] Add the interactive-row acceptance scenarios to
      `tests/e2e/list.spec.ts` FIRST: keyboard navigation (Tab reaches
      every interactive row in document order, Enter activates it),
      hover state assertion, axe-core zero-violations for the
      interactive state — confirm these FAIL (no interactive variant
      exists yet). Tab-order assertion skipped on webkit-1440: WebKit's
      default keyboard-access setting excludes `<a>` links from the Tab
      order entirely (confirmed empirically — Tab never leaves `<body>`
      on this page, while it reaches a `<button>` fine on the same
      engine elsewhere in the suite) — a genuine, pre-existing
      Safari/WebKit platform limitation, not a component defect.
- [x] T008 [US2] Add `.list-row-interactive` `@apply` block to
      `src/styles/tailwind.css` per contracts/list.contract.md (hover,
      focus-visible, active states — Principle V state completeness)
- [x] T009 [US2] Add an interactive-list section to
      `src/components/list/list.html`: each row wrapped in a single
      `<a href="#">` per contracts/list.contract.md's interactive
      markup shape, `data-testid="list-item-interactive"`
- [x] T010 [US2] Re-run T007's assertions — confirm they now PASS
- [x] T011 [US2] Add Playwright visual regression assertions for the
      interactive list's default/hover/focus-visible states

**Checkpoint**: Interactive Lists variant is fully keyboard-navigable
with visible focus/hover states, zero a11y violations.

---

## Phase 3: User Story 3 - List row with a trailing action (P3)

- [x] T012 [P] [US3] Add the trailing-action acceptance scenarios to
      `tests/e2e/list.spec.ts` FIRST: a row with a trailing Badge
      renders correctly aligned, axe-core reports zero
      nested-interactive-control violations on an interactive row with
      a trailing Badge — confirm these FAIL (no trailing-action markup
      exists yet)
- [x] T013 [US3] Add a trailing-action row to
      `src/components/list/list.html` per contracts/list.contract.md's
      third markup shape (Badge reusing the already-ratified Badge
      classes verbatim — no new Badge CSS), `data-testid=
      "list-item-trailing"`; add a second trailing-action row using a
      chevron icon instead of a Badge (spec's edge case: trailing
      content must never itself be focusable)
- [x] T014 [US3] Re-run T012's assertions — confirm they now PASS
- [x] T015 [US3] Add Playwright visual regression assertions for the
      trailing-action row states

**Checkpoint**: All three Lists variants (read-only, interactive,
trailing-action) are implemented, tested, and visually verified.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [x] T016 Run `node scripts/audit-tokens.mjs && node
      scripts/check-contrast.mjs` — confirm zero token violations and
      confirm `text-neutral-600` (not `-500`) is the pairing reported
      for list-item metadata, AAA-compliant. Confirmed `neutral-600` is
      already a covered PAIRINGS token (Badge neutral entry) — no new
      entry needed, matching Card's own precedent of reusing this exact
      token without a dedicated pairing.
- [x] T017 Run the full project test suite (`npm run test:e2e`) —
      confirm zero regressions across every existing spec, not just
      `list.spec.ts`. Result (before code review fixes): 2091 passed, 27
      skipped, zero failures. Result (after code review fixes, see
      T018): 2092 passed, 26 skipped (back to the pre-existing
      baseline — the WebKit skip was replaced with a real fix), zero
      failures.
- [x] T018 Code review pass over the CSS/HTML diffs using the
      code-reviewer agent; address any CRITICAL/HIGH findings.
      Result: 0 CRITICAL, 2 HIGH (both fixed), 1 MEDIUM (fixed — turned
      out to be a real, verifiable improvement), 2 LOW (no action
      needed, confirmed not actual issues). Fixes applied:
      (1) `.list` was missing `overflow-hidden`, so a hover/focus
      background on the first/last row poked out past the container's
      rounded corners — added, matching `.modal-panel`'s existing
      `overflow-hidden`/`rounded-lg` pairing.
      (2) `CLAUDE.md`'s feature-011 paragraph still said `.list-item`
      (the exact name renamed away from due to the Tailwind corePlugins
      collision) — corrected to `.list-row`.
      (3, MEDIUM) The WebKit Tab-order test.skip was investigated
      further rather than accepted as final: confirmed empirically via
      a standalone script that `tabindex="0"` makes WebKit include an
      `<a>` in its Tab order (a plain `<a href>` was skipped while an
      identical `<a tabindex="0">` was focused correctly). This meant
      real Safari users on default settings could not keyboard-navigate
      into an interactive Lists row — a genuine, fixable end-user
      accessibility gap, not just a CI-environment quirk. Added
      `tabindex="0"` to every `.list-row-interactive` anchor, removed
      the `test.skip`, and the assertion now passes on all engines
      including webkit-1440 (0 skips, up from 1).
      Also fixed two pre-existing doc-drift issues found while applying
      the above: `contracts/list.contract.md` still referenced the
      pre-rename `.list-item*` class names throughout, and its
      trailing-Badge markup example incorrectly showed an `<a>` wrapper
      when the shipped code (and the read-only User Story 3 acceptance
      criteria) uses a plain non-interactive `<div>` — corrected both.
- [x] T019 Generate Linux visual regression baselines via
      `gh workflow run update-snapshots.yml` (workflow_dispatch on
      ubuntu-latest — never locally/Docker); download the artifact,
      verify zero drift on all pre-existing baselines via `cmp`, commit
      only the genuinely new Lists baseline files. Result: 582
      identical (zero drift), 18 new files (readonly/interactive/
      trailing × 320/768/1024/1440px + firefox/webkit 1440px),
      visually verified correct.
- [x] T020 Run `/speckit-constitution` to correct the existing "Lists"
      Component Catalog entry: replace `text-xs text-neutral-500` with
      `text-xs text-neutral-600` for metadata, remove the "KNOWN GAP"
      note (now resolved), and add the new `.list`/`.list-row`/
      `.list-row-interactive` primitive documentation. Judged MINOR
      (new catalog guidance for a genuinely shipped component, matching
      v1.3.0's own new-token precedent) — bumped to v1.9.0. Also
      recorded a new KNOWN GAP: Table has the identical "documented but
      never built" defect Lists had (discovered during this feature's
      planning), flagged for whichever future feature ships it.

---

## Dependencies & Execution Order

- **US1 (read-only)** has no dependency — MVP, must ship first since
  US2/US3 both extend its row structure.
- **US2 (interactive)** depends on US1's `.list-item` base class
  existing (extends it with `.list-item-interactive`).
- **US3 (trailing-action)** depends on US2's interactive row (the
  nested-interactive-control constraint only matters once a row is
  itself interactive) but the read-only trailing-action variant only
  needs US1.
- Within each story: write the failing test first, confirm it fails,
  implement, confirm it passes — this project's established TDD
  discipline.

## Implementation Strategy

**MVP first**: Phase 1 (read-only list) is a complete, independently
shippable increment closing the AAA contrast gap on its own. Phases 2-3
add interactivity and composition incrementally. Phase 4's T019 (Linux
baseline) and T020 (constitution correction) are required before this
feature is considered fully shipped, matching the precedent set by every
prior feature.
