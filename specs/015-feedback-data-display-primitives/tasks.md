# Tasks: Feedback & Data Display Primitives

**Input**: Design documents from `/specs/015-feedback-data-display-primitives/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md,
contracts/*.md (10 files), quickstart.md, constitution.md (v1.11.0)

**Tests**: Included — Playwright visual regression + axe-core, per this
project's established discipline.

**Organization**: Grouped by user story (P1 MVP: Spinner/AspectRatio/
Indicator/DataList; P2: Slider/Stepper/File Input; P3: Timeline;
P4: Stat Card/PinInput). No setup/foundational phase — reuses the
existing scaffold entirely.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: User Story 1 - Foundational feedback & layout primitives (P1) 🎯 MVP

Spinner, AspectRatio, Indicator, DataList — four independent, zero-JS
components. Independently testable in isolation, no dependency on any
other component in this feature.

### Spinner

- [X] T001 [P] [US1] Write `tests/e2e/spinner.spec.ts` FIRST: axe-core
      zero-violations, assert `role="status"` + accessible name, assert
      `animate-spin` present and `motion-reduce:animate-none` overrides
      it when reduced motion is emulated (contract:
      contracts/spinner.contract.md) — confirm it FAILS
- [X] T002 [US1] Add `.spinner`/`.spinner-sm`/`.spinner-lg` `@apply`
      blocks to `src/styles/tailwind.css`, sizes matching Avatar's
      `h-8 w-8`/`h-10 w-10` scale verbatim
- [X] T003 [US1] Create `src/components/spinner/spinner.html`: both size
      presets
- [X] T004 [US1] Register `spinner` in `vite.config.ts`'s
      `rollupOptions.input` and add a Spinner card to `index.html`'s
      gallery
- [X] T005 [US1] Re-run T001's assertions — confirm they now PASS
- [X] T006 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px), including a reduced-motion-emulated
      screenshot

### AspectRatio

- [X] T007 [P] [US1] Write `tests/e2e/aspect-ratio.spec.ts` FIRST: axe-core
      zero-violations, assert the container's computed `aspect-ratio`
      CSS property matches the declared ratio for at least two presets
      (16:9, 1:1) (contract: contracts/aspect-ratio.contract.md) —
      confirm it FAILS
- [X] T008 [US1] Confirm empirically (research.md R5) that AspectRatio
      needs NO new `@apply` class — build the demo directly with plain
      `aspect-[16/9]`/`aspect-square`/`aspect-[4/3]` utilities; if a real
      gap is found, add the minimal class and update
      contracts/aspect-ratio.contract.md to match reality
- [X] T009 [US1] Create `src/components/aspect-ratio/aspect-ratio.html`:
      16:9, 1:1, and 4:3 examples with real `alt` text on each image
- [X] T010 [US1] Register `aspect-ratio` in `vite.config.ts`'s
      `rollupOptions.input` and add an AspectRatio card to `index.html`'s
      gallery
- [X] T011 [US1] Re-run T007's assertions — confirm they now PASS
- [X] T012 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px) for all three ratio presets

### Indicator

- [X] T013 [P] [US1] Write `tests/e2e/indicator.spec.ts` FIRST: axe-core
      zero-violations, assert the indicator itself is `aria-hidden="true"`,
      assert a count above 99 renders as "99+", AND assert the host
      element's accessible name (via the visually-hidden sibling span)
      includes the actual count for the count variant (e.g. "3 unread
      notifications") — a `/speckit-analyze` finding: the original
      contract only said this "should" happen, with no task ever
      asserting it, meaning a screen-reader user would have gotten zero
      notification-count information as originally scoped (contract:
      contracts/indicator.contract.md) — confirm it FAILS
- [X] T014 [US1] Add `.indicator-wrapper`/`.indicator`/
      `.indicator-error`/`.indicator-success`/`.indicator-warning`/
      `.indicator-info`/`.indicator-neutral`/`.indicator-dot` `@apply`
      blocks to `src/styles/tailwind.css` — use the `-strong` status
      tokens (`bg-error-strong` etc.) and `bg-neutral-700` for solid
      fills, NEVER the base `bg-error`/`bg-success`/etc. tokens
      (research.md R9 — the base tokens fail contrast with white text)
- [X] T015 [US1] Create `src/components/indicator/indicator.html`: a
      count-variant example (notification bell + count, with the
      visually-hidden sibling span reading e.g. "3 unread notifications"
      — the count value included, not just "Notifications") and a
      dot-variant example (simpler label, e.g. "Unread notifications",
      no number required since the dot carries no count), at least 2
      severity colors shown
- [X] T016 [US1] Register `indicator` in `vite.config.ts`'s
      `rollupOptions.input` and add an Indicator card to `index.html`'s
      gallery
- [X] T017 [US1] Re-run T013's assertions — confirm they now PASS
- [X] T018 [US1] Run `npm run audit:contrast` and confirm the 5 new
      "Indicator {severity}" `PAIRINGS` entries (already added to
      `scripts/check-contrast.mjs` during planning) report 7.68:1 /
      9.07:1 / 8.31:1 / 8.72:1 / 10.31:1 respectively, matching
      research.md R9 — re-verify against the actual shipped classes, not
      just the research.md figures
- [X] T019 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px) for both variants

### DataList

- [X] T020 [P] [US1] Write `tests/e2e/data-list.spec.ts` FIRST: axe-core
      zero-violations, assert real `<dl>`/`<dt>`/`<dd>` elements are used
      (contract: contracts/data-list.contract.md) — confirm it FAILS
- [X] T021 [US1] Confirm empirically (research.md R5) that DataList needs
      NO new `@apply` class — build the demo directly with the existing
      `text-sm font-medium text-neutral-900`/`text-sm text-neutral-600`
      label/value pairing; if a real gap is found, add the minimal class
      and update contracts/data-list.contract.md to match reality
- [X] T022 [US1] Create `src/components/data-list/data-list.html`: at
      least 4 key-value pairs (e.g. Status, Created, Owner, Plan)
- [X] T023 [US1] Register `data-list` in `vite.config.ts`'s
      `rollupOptions.input` and add a DataList card to `index.html`'s
      gallery
- [X] T024 [US1] Re-run T020's assertions — confirm they now PASS
- [X] T025 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px)

**Checkpoint**: All four P1 components shipped, tested, and visually
verified — a fully viable, independently demonstrable MVP slice.

---

## Phase 2: User Story 2 - Form & progress primitives (P2)

Slider, Stepper, File Input. Independently testable per component; no
dependency on P1 or on each other.

### Slider

- [X] T026 [P] [US2] Write `tests/e2e/slider.spec.ts` FIRST: axe-core
      zero-violations, assert arrow-key/Home/End presses change the
      native `value` and `aria-valuenow` (real keyboard simulation, not
      assumed) (contract: contracts/slider.contract.md) — confirm it
      FAILS
- [X] T027 [US2] Add `.slider` `@apply` block to
      `src/styles/tailwind.css` using `accent-brand-dark` (research.md
      R2 — confirmed supported in all 3 target engines, no vendor-
      prefixed pseudo-elements needed) on `bg-neutral-200`
- [X] T028 [US2] Create `src/components/slider/slider.html`: a labeled
      range example with visible min/max
- [X] T029 [US2] Register `slider` in `vite.config.ts`'s
      `rollupOptions.input` and add a Slider card to `index.html`'s
      gallery
- [X] T030 [US2] Re-run T026's assertions — confirm they now PASS
- [X] T031 [US2] Run `npm run audit:contrast` and confirm Slider's
      fill/track pairing is already covered by Progress's existing
      "Progress fill vs track" `RING_PAIRINGS` entry (research.md R1 —
      identical two colors, `bg-brand-dark`/`bg-neutral-200`) — do NOT
      add a duplicate entry; confirm the existing one still passes
- [X] T032 [US2] Add Playwright visual regression assertions
      (320/768/1024/1440px)

### Stepper

- [X] T033 [P] [US2] Write `tests/e2e/stepper.spec.ts` FIRST: axe-core
      zero-violations, assert `aria-current="step"` on the current step
      only, AND assert the two boundary states from spec.md's Edge Cases
      render correctly: a first-step example (zero completed steps, only
      current + upcoming) and a last-step example (zero upcoming steps,
      only completed + current) — a `/speckit-analyze` finding (E1) that
      the original task only covered the middle-of-sequence case
      (contract: contracts/stepper.contract.md) — confirm it FAILS
- [X] T034 [US2] Add `.stepper`/`.stepper-step`/`.stepper-step-completed`/
      `.stepper-step-current`/`.stepper-step-upcoming`/`.stepper-circle`
      `@apply`+plain-CSS blocks to `src/styles/tailwind.css` (the
      `::after` connector-line pseudo-element needs plain CSS, matching
      Dropdown Menu's existing precedent for non-`@apply`-expressible
      rules)
- [X] T035 [US2] Create `src/components/stepper/stepper.html`: a 4-step
      example with one completed, one current, two upcoming, PLUS a
      first-step example (current step 1, zero completed) and a
      last-step example (current step 4, zero upcoming) — covering the
      boundary states T033 now asserts (E1)
- [X] T036 [US2] Register `stepper` in `vite.config.ts`'s
      `rollupOptions.input` and add a Stepper card to `index.html`'s
      gallery
- [X] T037 [US2] Re-run T033's assertions — confirm they now PASS
- [X] T038 [US2] Add Playwright visual regression assertions
      (320/768/1024/1440px)

### File Input

- [X] T039 [P] [US2] Write `tests/e2e/file-input.spec.ts` FIRST: axe-core
      zero-violations, assert the native `<input type="file">` is
      reachable via Tab and carries the correct `accept` attribute,
      assert the focus-visible outline actually applies when the input
      is focused (a `/speckit-analyze` finding — the original contract's
      DOM order made this rule permanently unmatchable), assert selecting
      a file makes the filename paragraph visible with the correct text
      (real file selection simulated via Playwright's `setInputFiles`,
      not assumed), and assert a `disabled` input dims the surrounding
      drop-zone content (contract: contracts/file-input.contract.md) —
      confirm it FAILS
- [X] T039a [US2] Create `src/scripts/file-input.js` (a
      `/speckit-analyze` finding: spec.md's "selected filename is
      visible" requirement has no CSS-only solution since the native
      input is `opacity-0` — this is a second small new JS module,
      alongside `pin-input.js`, distinct from and NOT part of the
      drag-and-drop deferral decision in R6): a `change`-event listener
      populating and un-hiding the filename paragraph
- [X] T040 [US2] Add `.file-drop-zone`/`.file-input-native` `@apply`
      blocks to `src/styles/tailwind.css`, including the `disabled:`
      variants on both the input and (via the sibling selector) the
      drop-zone content
- [X] T041 [US2] Create `src/components/file-input/file-input.html`: a
      labeled drop-zone example with the native `<input type="file">`
      placed FIRST inside `.file-drop-zone` (not last — required for the
      focus-visible sibling selector to match at all), wired to
      `initFileInputs()` from T039a (click-to-browse only; drag-and-drop
      JS explicitly deferred per research.md R6, do not implement it
      here)
- [X] T042 [US2] Register `file-input` in `vite.config.ts`'s
      `rollupOptions.input` and add a File Input card to `index.html`'s
      gallery
- [X] T043 [US2] Re-run T039's assertions — confirm they now PASS
- [X] T044 [US2] Add Playwright visual regression assertions
      (320/768/1024/1440px)

**Checkpoint**: All three P2 components shipped, tested, and visually
verified.

---

## Phase 3: User Story 3 - Timeline (P3)

- [X] T045 [US3] Write `tests/e2e/timeline.spec.ts` FIRST: axe-core
      zero-violations, assert a real `<ol>` and real `<time datetime="...">`
      elements are used, AND assert the two edge cases from spec.md's
      Edge Cases render without layout defects: a single-event timeline
      (no connector line dangling past the one item) and a long-
      description event (text wraps within `.timeline-content` without
      overflowing or breaking the connector alignment) — a
      `/speckit-analyze` finding (E2) that these edge cases had no
      corresponding assertion (contract: contracts/timeline.contract.md)
      — confirm it FAILS
- [X] T046 [US3] Add `.timeline`/`.timeline-item`/`.timeline-content`
      `@apply`+plain-CSS blocks to `src/styles/tailwind.css` (the
      `::before` connector-line pseudo-element needs plain CSS)
- [X] T047 [US3] Create `src/components/timeline/timeline.html`: at
      least 3 chronological events, each reusing `.avatar-fallback
      avatar-sm` verbatim for the actor, PLUS a single-event timeline
      example and an example with one long, multi-sentence event
      description — covering the edge cases T045 now asserts (E2)
- [X] T048 [US3] Register `timeline` in `vite.config.ts`'s
      `rollupOptions.input` and add a Timeline card to `index.html`'s
      gallery
- [X] T049 [US3] Re-run T045's assertions — confirm they now PASS
- [X] T050 [US3] Add Playwright visual regression assertions
      (320/768/1024/1440px)

**Checkpoint**: Timeline shipped, tested, and visually verified.

---

## Phase 4: User Story 4 - Stat/Metric Card and PinInput (P4)

Stat Card first (lowest remaining risk), PinInput last (highest-risk item
in this feature — the only component needing new interaction script).

### Stat/Metric Card

- [X] T051 [P] [US4] Write `tests/e2e/stat-card.spec.ts` FIRST: axe-core
      zero-violations, assert the metric/label/trend are all present as
      real text (contract: contracts/stat-card.contract.md) — confirm it
      FAILS
- [X] T052 [US4] Confirm empirically that Stat Card needs no new class
      beyond the existing `.card` + typography tokens — build the demo
      directly; if a real gap is found, add the minimal class and update
      contracts/stat-card.contract.md to match reality
- [X] T053 [US4] Create `src/components/stat-card/stat-card.html`: at
      least one example with a positive trend and one with a negative
      trend, reusing `text-success-strong`/`text-error-strong` verbatim
- [X] T054 [US4] Register `stat-card` in `vite.config.ts`'s
      `rollupOptions.input` and add a Stat Card card to `index.html`'s
      gallery
- [X] T055 [US4] Re-run T051's assertions — confirm they now PASS
- [X] T056 [US4] Add Playwright visual regression assertions
      (320/768/1024/1440px)

### PinInput

- [X] T057 [US4] Write `tests/e2e/pin-input.spec.ts` FIRST: axe-core
      zero-violations, assert typing a digit advances focus to the next
      box, assert pasting a full code (real clipboard-event simulation,
      not assumed) distributes correctly across all boxes, assert
      Backspace on an empty box moves focus to the previous box, assert
      a paste containing non-numeric characters or excess-length content
      is rejected/truncated per spec.md Edge Cases (contract:
      contracts/pin-input.contract.md) — confirm it FAILS
- [X] T058 [US4] Create `src/scripts/pin-input.js` (research.md R4 — the
      one genuinely new JS module in this feature): per-box `input`
      listener (numeric-only filter, auto-advance), `keydown` listener
      (Backspace-retreat on empty), `paste` listener
      (`event.preventDefault()`, numeric-filter, length-clamp, distribute
      across remaining boxes)
- [X] T059 [US4] Add `.pin-input`/`.pin-input-box` `@apply` block to
      `src/styles/tailwind.css`, reusing TextInput's exact ring/focus
      treatment
- [X] T060 [US4] Create `src/components/pin-input/pin-input.html`: a
      6-box verification-code example inside a real `<fieldset>`/
      `<legend>`, each box with its own `aria-label`
- [X] T061 [US4] Register `pin-input` in `vite.config.ts`'s
      `rollupOptions.input` and add a PinInput card to `index.html`'s
      gallery
- [X] T062 [US4] Re-run T057's assertions — confirm they now PASS
- [X] T063 [US4] Add Playwright visual regression assertions
      (320/768/1024/1440px)

**Checkpoint**: Stat Card and PinInput shipped, tested (including the
paste-splitting/auto-advance/Backspace-retreat behavior), and visually
verified.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T064 Run the full Playwright suite locally, scoped to functional
      and axe-core assertions only (not pixel-diff visual regression —
      matching feature 014's established rule, since visual-regression
      baselines/comparisons run only on `ubuntu-latest` via CI). Confirm
      zero functional/accessibility regressions to any of the 34
      previously-shipped components (feature 014's 10 are already counted
      within that 34, not additional to it) now that 10 more exist in the
      same gallery/vite config
- [X] T065 Run a CSP-violation sweep across all 10 new pages (the hard
      lesson from feature 014's research.md R12): a Playwright
      console-listener checking for zero "Content Security Policy"
      violation messages on `spinner.html`, `aspect-ratio.html`,
      `indicator.html`, `data-list.html`, `slider.html`, `stepper.html`,
      `file-input.html`, `timeline.html`, `stat-card.html`,
      `pin-input.html` — confirm NO component in this feature uses an
      inline `style="..."` attribute anywhere
- [X] T066 Compose a real page combining at least 2 components from this
      feature (e.g. Stat Card + Spinner, or Timeline + Indicator) with at
      least 2 components from feature 014 or earlier (e.g. Divider,
      Button Group), using ONLY already-shipped classes/components, and
      add a Playwright assertion confirming it requires zero one-off
      custom CSS (spec.md SC-003, matching feature 014's T067a
      precedent)
- [X] T067 Run `npm run audit:tokens` across the whole `src/` tree and
      confirm zero raw palette classes were introduced by any of the 10
      new components. Also diff `package.json`/the lockfile against this
      feature's starting commit and confirm zero new dependencies were
      added (spec.md FR-012)
- [X] T068 Code review pass over all 10 new components' HTML/CSS/JS
      (Spinner, AspectRatio, Indicator, DataList, Slider, Stepper, File
      Input, Timeline, Stat Card, PinInput) plus the 2 new JS modules
      (`pin-input.js`, `file-input.js`) — address CRITICAL/HIGH findings before
      proceeding
- [ ] T069 Generate Linux Playwright visual baselines via
      `gh workflow_dispatch` on `.github/workflows/update-snapshots.yml`
      (ubuntu-latest) — NEVER locally or via Docker. Download the
      artifact, verify zero drift on any pre-existing baseline (only
      this feature's 10 new components' `*-linux.png` files should be
      new), commit the new baselines
- [X] T070 Run `/speckit-constitution` to add all ten new Component
      Catalog entries (Spinner, AspectRatio, Indicator — with the real
      contrast-defect finding from research.md R9 documented explicitly
      — DataList, Slider, Stepper, File Input — with the drag-and-drop
      deferral explicitly noted — Timeline, Stat/Metric Card, PinInput),
      and EXTEND (not replace) the existing "Known Catalog Gaps" list
      from feature 014 with TreeView, Rating, Menubar, ColorPicker/
      ColorInput, and HoverCard. This is a MINOR version bump (new
      catalog guidance, ten new components, zero new tokens)
- [ ] T071 Verify CI is green on the final commit (real GitHub Actions
      run, not a local test pass) before declaring this feature shipped

---

## Dependencies & Execution Order

- **Phase 1 (US1, P1/MVP)**: No dependencies beyond the existing
  scaffold. All four components are independent of each other — fully
  parallelizable across component boundaries
- **Phase 2 (US2, P2)**: Independent of Phase 1 and of each other
  (Slider/Stepper/File Input can all proceed in parallel)
- **Phase 3 (US3, P3)**: Independent of Phases 1-2; depends only on the
  pre-existing, already-shipped Avatar component for its actor slot
- **Phase 4 (US4, P4)**: Independent of Phases 1-3. Stat Card has no
  dependencies; PinInput depends on nothing else in this feature but is
  sequenced last as the highest-risk item
- **Phase 5 (Polish)**: Depends on ALL prior phases completing

## Parallel Execution Examples

Within Phase 1 (US1), all four components' test-writing tasks can run in
parallel since they touch disjoint files:

```
T001 [P] tests/e2e/spinner.spec.ts
T007 [P] tests/e2e/aspect-ratio.spec.ts
T013 [P] tests/e2e/indicator.spec.ts
T020 [P] tests/e2e/data-list.spec.ts
```

Within Phase 2 (US2), the same pattern applies to T026/T033/T039.

## Implementation Strategy

### MVP First (User Story 1 Only)

Complete Phase 1 (T001-T025) and stop — Spinner, AspectRatio, Indicator,
DataList are independently valuable, fully shipped, and demonstrate the
pattern for the remaining phases before taking on any of their added
risk (native form controls, connector-line composition, new JS).

### Incremental Delivery

1. Phase 1 (US1) → MVP checkpoint, ship/demo
2. Phase 2 (US2) → form/progress primitives checkpoint, ship/demo
3. Phase 3 (US3) → Timeline checkpoint, ship/demo
4. Phase 4 (US4) → Stat Card + PinInput checkpoint, ship/demo (highest-risk
   item, PinInput, last once every simpler pattern is already proven)
5. Phase 5 → polish, catalog documentation, CI verification, final ship
