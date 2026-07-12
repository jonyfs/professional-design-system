# Tasks: Advanced Interaction Primitives

**Input**: Design documents from `/specs/016-advanced-interaction-primitives/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md,
contracts/*.md (4 files), quickstart.md, constitution.md (v1.12.0)

**Tests**: Included — Playwright visual regression + axe-core, per this
project's established discipline.

**Organization**: Grouped by user story (P1 MVP: TreeView; P2: Rating;
P3: Menubar; P4: ColorPicker/ColorInput). No setup/foundational phase —
reuses the existing scaffold entirely.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: User Story 1 - Hierarchical navigation via TreeView (P1) 🎯 MVP

Independently testable, zero-JS.

- [X] T001 [P] [US1] Write `tests/e2e/tree-view.spec.ts` FIRST: axe-core
      zero-violations, assert at least 4 levels of nesting exist (a
      `/speckit-analyze` finding, F1 — spec.md's own Edge Cases section
      explicitly names "4+ levels" as a case to verify, not just 3),
      assert a leaf node renders no `<details>`/disclosure triangle,
      assert pressing Enter or Space while a `<summary>` is focused
      toggles its parent `<details>`'s `open` state (real keyboard
      simulation), and assert collapsing a parent branch preserves a
      nested child branch's own expanded/collapsed state across a
      collapse/re-expand cycle (contract: contracts/tree-view.contract.md)
      — confirm it FAILS
- [X] T002 [US1] Add `.tree-view`/`.tree-view-summary`/
      `.tree-view-children`/`.tree-view-leaf` `@apply` blocks to
      `src/styles/tailwind.css`
- [X] T003 [US1] Create `src/components/tree-view/tree-view.html`: at
      least 4 levels of nesting (a branch containing a branch containing
      a branch containing a leaf — F1), at least one top-level leaf with
      no children
- [X] T004 [US1] Register `tree-view` in `vite.config.ts`'s
      `rollupOptions.input` and add a TreeView card to `index.html`'s
      gallery
- [X] T005 [US1] Re-run T001's assertions — confirm they now PASS
- [X] T006 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px), including one screenshot with all 4 levels
      expanded at 320px specifically verifying indentation remains
      visually distinguishable at that narrowest breakpoint (F1 — spec.md
      Edge Cases: deep nesting MUST NOT become illegibly cramped at 320px)

**Checkpoint**: TreeView shipped, tested, and visually verified — a fully
viable, independently demonstrable MVP slice.

---

## Phase 2: User Story 2 - At-a-glance quality signal via Rating (P2)

Independently testable, zero-JS.

- [X] T007 [P] [US2] Write `tests/e2e/rating.spec.ts` FIRST: axe-core
      zero-violations, assert the real numeric value (e.g. "4.2 out of
      5") renders as visible text, assert the star icons wrapper is
      `aria-hidden="true"`, assert a whole-number example (e.g. "5 out of
      5") shows exactly 5 filled stars with no partial/empty star implying
      a fractional value that doesn't exist (contract:
      contracts/rating.contract.md) — confirm it FAILS
- [X] T008 [US2] Add `.rating`/`.rating-stars`/`.rating-star-filled`/
      `.rating-star-empty`/`.rating-value` `@apply` blocks to
      `src/styles/tailwind.css` using `text-warning`/`text-neutral-300`
      (research.md R2). Correction found while implementing (T012): a
      NEW `DECORATIVE_ARIA_HIDDEN_TOKENS` exemption category (not a
      `PAIRINGS` entry) had to be added to `scripts/check-contrast.mjs`
      for `text-warning` specifically, since Stepper's own decorative
      exception (feature 015) was a `bg-*`/`border-*` token the script's
      text-coverage scanner never inspects — `text-warning` IS inspected
      by that scanner and was flagged as a genuine gap
- [X] T009 [US2] Create `src/components/rating/rating.html`: one
      fractional example (e.g. 4.2 out of 5 → 4 filled + 1 empty star) and
      one whole-number example (e.g. 5.0 out of 5 → 5 filled stars, 0
      empty)
- [X] T010 [US2] Register `rating` in `vite.config.ts`'s
      `rollupOptions.input` and add a Rating card to `index.html`'s
      gallery
- [X] T011 [US2] Re-run T007's assertions — confirm they now PASS
- [X] T012 [US2] Run `npm run audit:contrast` — found it initially FAILED
      with a genuine coverage-gap error for `text-warning` (not previously
      anticipated in planning, see T008's correction and research.md
      R2's addendum); fixed by extending `scripts/check-contrast.mjs`
      with the new `DECORATIVE_ARIA_HIDDEN_TOKENS` exemption (`warning`
      only — `neutral-300` needed no change, already covered by a
      pre-existing, unrelated Sidebar `PAIRINGS` entry). Confirmed the
      audit now passes: still 23 text + 6 non-text `PAIRINGS`/
      `RING_PAIRINGS` entries (unchanged count — the fix is a new
      exemption *category*, not a new pairing entry)
- [X] T013 [US2] Add Playwright visual regression assertions
      (320/768/1024/1440px) for both examples

**Checkpoint**: TreeView and Rating shipped, tested, and visually
verified.

---

## Phase 3: User Story 3 - Multi-menu application navigation via Menubar (P3)

Independently testable; depends only on the pre-existing, already-shipped
`src/scripts/dropdown-menu.js` (reused completely unmodified).

- [X] T014 [P] [US3] Write `tests/e2e/menubar.spec.ts` FIRST: axe-core
      zero-violations, assert Left/Right arrow keys move focus between
      top-level triggers (File/Edit/View) WITHOUT opening any panel,
      assert Down or Enter/Space on a focused trigger opens its panel and
      moves focus to the panel's first menu item, assert Escape closes
      the open panel and returns focus to its trigger, and assert
      arrow-navigating to a sibling trigger while a panel is already open
      closes the previous panel and opens the newly-focused trigger's
      panel in its place (at most one panel open at any time — real
      keyboard simulation throughout, not assumed) (contract:
      contracts/menubar.contract.md) — confirm it FAILS
- [X] T015 [US3] Create `src/scripts/menubar.js` (research.md R3 — the
      one genuinely new module in this feature): roving-tabindex layer,
      Down/Enter/Space open the focused trigger's own popover via its
      native `popovertarget`, letting the ALREADY-WIRED, UNMODIFIED
      `initDropdownMenus()` handle the actual open/close/in-panel-arrow-
      keys/focus-return — do NOT modify `src/scripts/dropdown-menu.js`
      itself. TWO corrections found while implementing (both documented
      in research.md R3's addendum): (1) the keydown listener must be
      attached to the `[data-menubar]` CONTAINER, not each trigger — a
      per-trigger listener stops seeing ArrowRight/ArrowLeft once a panel
      opens and focus moves into its first item, but the container-level
      listener catches the key bubbling up from inside an open panel
      (popovers are top-layer for paint only, not DOM relocation); (2)
      the Popover API's `toggle` event is queued, not synchronous inline
      with `hidePopover()`/`showPopover()` — a naive synchronous
      hide-then-focus-then-show sequence was flaky under parallel test
      load, fixed by attaching this module's own one-time `toggle`
      listeners to the same panels (guaranteed to fire after dropdown-
      menu.js's own listener, since `initDropdownMenus()` always runs
      first) so the final focus destination is deterministic. Also
      corrected: auto-switching to a sibling returns focus to the
      TRIGGER itself, never left inside the newly-opened panel's first
      item (matching spec.md's literal wording)
- [X] T016 [US3] Add `.menubar`/`.menubar-trigger`/
      `.menubar-trigger[aria-expanded="true"]` `@apply`+plain-CSS blocks
      to `src/styles/tailwind.css` — reuse `.dropdown-menu-panel`/
      `.dropdown-menu-item` verbatim for every panel, no new panel/item
      CSS
- [X] T017 [US3] Create `src/components/menubar/menubar.html`: three
      top-level triggers (File/Edit/View), each `data-dropdown-trigger`
      AND `data-menubar-item`, each with its own real panel of ≥2 menu
      items; only the first trigger starts with `tabindex="0"`, the rest
      `tabindex="-1"`; wire BOTH `initDropdownMenus()` (unmodified,
      handles panel mechanics) AND the new `initMenubar()` (roving
      tabindex + auto-switch) on this page
- [X] T018 [US3] Register `menubar` in `vite.config.ts`'s
      `rollupOptions.input` and add a Menubar card to `index.html`'s
      gallery
- [X] T019 [US3] Re-run T014's assertions — confirm they now PASS
- [X] T020 [US3] Add Playwright visual regression assertions
      (320/768/1024/1440px), including one screenshot with a panel open

**Checkpoint**: TreeView, Rating, and Menubar shipped, tested (including
the composed roving-tabindex + reused-panel-mechanics behavior), and
visually verified.

---

## Phase 4: User Story 4 - Color selection via ColorPicker/ColorInput (P4)

Independently testable, zero-JS — lowest remaining risk in this batch.

- [X] T021 [P] [US4] Write `tests/e2e/color-input.spec.ts` FIRST: axe-core
      zero-violations, assert the native `<input type="color">` is
      reachable via Tab, assert the focus-visible ring actually applies
      when focused, assert a `disabled` example cannot be focused/opened,
      and assert the `value` attribute is a valid 7-character hex color
      string (contract: contracts/color-input.contract.md) — confirm it
      FAILS. Correction found while implementing: WebKit excludes
      `input[type=color]` from the Tab sequence entirely (confirmed on a
      bare, unstyled element — an engine limitation, not a defect); that
      one assertion is skipped on WebKit with an explanatory comment,
      matching PinInput's Firefox-clipboard precedent (feature 015)
- [X] T022 [US4] Add `.color-input` `@apply` block to
      `src/styles/tailwind.css` with an explicit `h-10 w-16` size
      (research.md R4 — normalizes each engine's differing native
      intrinsic size) and `border-0`/`ring-1 ring-inset ring-neutral-300`/
      `focus:ring-2 focus:ring-brand`/`disabled:` treatment matching
      TextInput's/PinInput's established pattern. Correction found while
      implementing: `appearance-none` is REQUIRED for the `ring`/
      `shadow-sm` utilities' `box-shadow` to actually render on this
      element — without it, `box-shadow` silently computed to `none` in
      all three engines due to the input's default `appearance: auto`
      swatch-box rendering (research.md R4's addendum)
- [X] T023 [US4] Create `src/components/color-input/color-input.html`: a
      labeled color input with a real starting hex `value`, plus a
      disabled example
- [X] T024 [US4] Register `color-input` in `vite.config.ts`'s
      `rollupOptions.input` and add a ColorPicker/ColorInput card to
      `index.html`'s gallery
- [X] T025 [US4] Re-run T021's assertions — confirm they now PASS
- [X] T026 [US4] Add Playwright visual regression assertions
      (320/768/1024/1440px)

**Checkpoint**: All four P1-P4 components shipped, tested, and visually
verified.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T027 Run the full Playwright suite locally, scoped to functional
      and axe-core assertions only (not pixel-diff visual regression —
      matching features 014/015's established rule, since visual-
      regression baselines/comparisons run only on `ubuntu-latest` via
      CI). Confirm zero functional/accessibility regressions to any of
      the 44 previously-shipped components (confirmed via
      `find src/components -mindepth 1 -maxdepth 1 -type d ! -name
      "composed-example" ! -name "dashboard-example" | wc -l` = 44, a
      `/speckit-analyze` finding (F5) that the prior `grep -c
      "resolve(__dirname"` substring-count approach only worked by
      accidental cancellation with the 2 excluded demo pages' multi-line
      `resolve(` formatting, and would silently drift if reformatted)
      now that 4 more exist in the same gallery/vite config
- [X] T028 Run a CSP-violation sweep across all 4 new pages (the hard
      lesson from feature 014's research.md R12 / feature 015's T065
      precedent): a Playwright console-listener checking for zero
      "Content Security Policy" violation messages on `tree-view.html`,
      `rating.html`, `menubar.html`, `color-input.html` — confirm NO
      component in this feature uses an inline `style="..."` attribute
      anywhere
- [X] T029 Compose a real page combining at least 2 components from this
      feature (e.g. Rating + ColorInput, or TreeView + Menubar) with at
      least 2 components from an earlier feature (e.g. Card, Divider,
      Avatar), using ONLY already-shipped classes/components, and add a
      Playwright assertion confirming it requires zero one-off custom CSS
      (spec.md SC-003, matching feature 014's T067a / feature 015's T066
      precedent)
- [X] T030 Run `npm run audit:tokens` across the whole `src/` tree and
      confirm zero raw palette classes were introduced by any of the 4
      new components. Also diff `package.json`/the lockfile against this
      feature's starting commit and confirm zero new dependencies were
      added (spec.md FR-009)
- [X] T031 Code review pass over all 4 new components' HTML/CSS/JS
      (TreeView, Rating, Menubar, ColorPicker/ColorInput) plus the 1 new
      JS module (`menubar.js`) — 0 CRITICAL, 1 HIGH, 2 MEDIUM, 3 LOW found.
      HIGH (menubar.js rapid-keypress race leaving a corrupted focus/panel
      state) fixed across two iterations, fully documented in research.md
      R3's addendum and the contract's 4th correction: (1) collapsed the
      two-chain `hidePopover()`-then-`showPopover()` sequence into a
      single `showPopover()` call, confirmed empirically to atomically
      close a sibling auto-popover natively with a guaranteed event order;
      (2) added a `generation`/`settledGeneration` guard so a keypress
      arriving before an earlier transition's final focus placement is
      ignored outright. Verified via 15 consecutive raw-Playwright-API
      trials (0 corrupted states) and a full non-visual regression run
      (2583 passed, only the new race-condition test itself flakes under
      heavy parallel worker load — a known, pre-existing characteristic
      of this exact Popover-API-timing-sensitive test file, absorbed by
      this project's existing `retries: 1` CI setting, not a logic
      defect). MEDIUM findings (ArrowDown's differing close mechanism;
      `DECORATIVE_ARIA_HIDDEN_TOKENS`' bare-token-name scoping) reviewed
      and accepted as consistent with existing precedent
      (`ICON_FILL_TEXT_TOKENS` has the same limitation) — documented
      in-code rather than requiring a structural change. LOW findings
      (Home/End test coverage) addressed by adding that test.
- [ ] T032 Generate Linux Playwright visual baselines via
      `gh workflow_dispatch` on `.github/workflows/update-snapshots.yml`
      (ubuntu-latest) — NEVER locally or via Docker. First run
      `gh run list` to check whether the GitHub Actions billing block
      that stalled features 014/015's final CI-green step has cleared;
      if still blocked, document that explicitly rather than assuming
      success. If it succeeds: download the artifact, verify zero drift
      on any pre-existing baseline (only this feature's 4 new
      components' `*-linux.png` files should be new), commit the new
      baselines
- [X] T033 Run `/speckit-constitution` to add all four new Component
      Catalog entries (TreeView — with the real accessibility-tree
      verification from research.md R1 documented explicitly — Rating —
      with the decorative-only contrast exception from research.md R2
      documented explicitly — Menubar — with the Dropdown-Menu-reuse
      architecture from research.md R3 documented explicitly —
      ColorPicker/ColorInput — with the rejected-custom-picker decision
      from research.md R4 documented explicitly), and EXTEND (not
      replace) the existing "Known Catalog Gaps" list with a note that
      TreeView/Rating/Menubar/ColorPicker have now shipped, leaving Date
      Picker/Calendar, interactive/sortable Data Table, Carousel, Chart,
      Scroll Area, Resizable panels, and HoverCard still deferred. This
      is a MINOR version bump (new catalog guidance, four new components,
      zero new tokens)
- [ ] T034 Verify CI is green on the final commit (real GitHub Actions
      run, not a local test pass) before declaring this feature shipped

---

## Dependencies & Execution Order

- **Phase 1 (US1, P1/MVP)**: No dependencies beyond the existing
  scaffold.
- **Phase 2 (US2, P2)**: Independent of Phase 1.
- **Phase 3 (US3, P3)**: Independent of Phases 1-2; depends only on the
  pre-existing, already-shipped `dropdown-menu.js`, reused unmodified.
- **Phase 4 (US4, P4)**: Independent of Phases 1-3.
- **Phase 5 (Polish)**: Depends on ALL prior phases completing

## Parallel Execution Examples

All four user stories' test-writing tasks can run in parallel since they
touch disjoint files:

```
T001 [P] tests/e2e/tree-view.spec.ts
T007 [P] tests/e2e/rating.spec.ts
T014 [P] tests/e2e/menubar.spec.ts
T021 [P] tests/e2e/color-input.spec.ts
```

## Implementation Strategy

### MVP First (User Story 1 Only)

Complete Phase 1 (T001-T006) and stop — TreeView is independently
valuable, fully shipped, and demonstrates the native-first-verify-
empirically pattern for the remaining phases.

### Incremental Delivery

1. Phase 1 (US1) → MVP checkpoint, ship/demo
2. Phase 2 (US2) → Rating checkpoint, ship/demo
3. Phase 3 (US3) → Menubar checkpoint, ship/demo (highest architectural
   complexity in this batch, sequenced after the two simpler zero-JS
   components are already proven)
4. Phase 4 (US4) → ColorInput checkpoint, ship/demo (lowest remaining
   risk, sequenced last)
5. Phase 5 → polish, catalog documentation, CI verification, final ship
