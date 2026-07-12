# Tasks: Micro-Interaction & Utility Primitives

**Input**: Design documents from `/specs/014-micro-interaction-primitives/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md,
contracts/*.md (10 files), quickstart.md, constitution.md (v1.10.0)

**Tests**: Included — Playwright visual regression + axe-core, per this
project's established discipline.

**Organization**: Grouped by user story (P1 MVP: Textarea/Divider/Kbd/
Skeleton; P2: Tooltip/Progress/Button Group/Empty State; P3: Popover;
P4: Context Menu). One small Foundational task precedes everything
(the `mono` font token Kbd depends on). No other setup needed — reuses
the existing Vite/Tailwind/Playwright scaffold entirely.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Foundational (blocking — required before Kbd's tasks in US1)

- [X] T001 Add `mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]`
      to the `fontFamily` object in `shared/design-tokens.ts` (research.md
      R3), following the existing `sans` key's exact structure

---

## Phase 2: User Story 1 - Foundational static primitives (P1) 🎯 MVP

Textarea, Divider, Kbd, Skeleton — four independent, zero/near-zero-JS
components. Independently testable: each renders correctly and passes
axe-core/keyboard checks in isolation, with no dependency on any other
component in this feature (Kbd depends only on T001 above).

### Textarea

- [X] T002 [P] [US1] Write `tests/e2e/textarea.spec.ts` FIRST: axe-core
      zero-violations for default/error/disabled states (contract:
      contracts/textarea.contract.md), assert vertical-only resize
      (`resize-y`, never `resize`) — confirm it FAILS (component doesn't
      exist yet)
- [X] T003 [US1] Add the Textarea `@apply` block to
      `src/styles/tailwind.css`, reusing TextInput's exact ratified
      classes verbatim per contracts/textarea.contract.md
- [X] T004 [US1] Create `src/components/textarea/textarea.html`: default,
      error, and disabled states, `rows="4"` default
- [X] T005 [US1] Register `textarea` in `vite.config.ts`'s
      `rollupOptions.input` and add a Textarea card to `index.html`'s gallery
- [X] T006 [US1] Re-run T002's assertions — confirm they now PASS
- [X] T007 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px) for all three Textarea states

### Divider

- [X] T008 [P] [US1] Write `tests/e2e/divider.spec.ts` FIRST: assert the
      semantic `<hr>` variant and the `role="separator"` div variant
      (both orientations) per contracts/divider.contract.md — confirm
      it FAILS
- [X] T009 [US1] Add `.divider`/`.divider-vertical` `@apply` blocks to
      `src/styles/tailwind.css`
- [X] T010 [US1] Create `src/components/divider/divider.html`: semantic
      horizontal `<hr>` example inside a vertical layout, non-semantic
      horizontal `role="separator"` div example (reusing `.divider`
      verbatim — a `/speckit-analyze` finding caught this variant missing
      from the original contract), and a vertical `role="separator"`
      example inside a flex toolbar
- [X] T011 [US1] Register `divider` in `vite.config.ts`'s
      `rollupOptions.input` and add a Divider card to `index.html`'s gallery
- [X] T012 [US1] Re-run T008's assertions — confirm they now PASS
- [X] T013 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px) for both orientations

### Kbd (depends on T001)

- [X] T014 [P] [US1] Write `tests/e2e/kbd.spec.ts` FIRST: assert the
      `<kbd>` element renders with `font-mono` applied and passes
      axe-core (contract: contracts/kbd.contract.md) — confirm it FAILS
- [X] T015 [US1] Add the `.kbd` `@apply` block to
      `src/styles/tailwind.css` (requires T001's `mono` token)
- [X] T016 [US1] Create `src/components/kbd/kbd.html`: a `⌘K`
      two-key example and a single-key example, inline within a sentence
- [X] T017 [US1] Register `kbd` in `vite.config.ts`'s
      `rollupOptions.input` and add a Kbd card to `index.html`'s gallery
- [X] T018 [US1] Re-run T014's assertions — confirm they now PASS
- [X] T019 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px)
- [X] T019a [US1] Run `npm run audit:contrast` and confirm the "Kbd text"
      `PAIRINGS` entry (already added to `scripts/check-contrast.mjs`)
      reports 9.86:1, matching research.md R11 — a `/speckit-analyze`
      finding: the script entry existed but nothing had explicitly cited
      or re-verified the number

### Skeleton

- [X] T020 [P] [US1] Write `tests/e2e/skeleton.spec.ts` FIRST: assert all
      three presets render (`aria-hidden="true"`), assert
      `animate-pulse` is present, and assert `motion-reduce:animate-none`
      overrides it when `prefers-reduced-motion: reduce` is emulated
      (contract: contracts/skeleton.contract.md) — confirm it FAILS
- [X] T021 [US1] Add `.skeleton`/`.skeleton-text`/`.skeleton-avatar-sm`/
      `.skeleton-avatar-lg`/`.skeleton-card` `@apply` blocks to
      `src/styles/tailwind.css` — confirm `.skeleton-avatar-*` sizes
      exactly match Avatar's `h-8 w-8`/`h-10 w-10` and `.skeleton-card`'s
      radius matches Card's `rounded-lg`
- [X] T022 [US1] Create `src/components/skeleton/skeleton.html`: all four
      presets side by side
- [X] T023 [US1] Register `skeleton` in `vite.config.ts`'s
      `rollupOptions.input` and add a Skeleton card to `index.html`'s
      gallery
- [X] T024 [US1] Re-run T020's assertions — confirm they now PASS
- [X] T025 [US1] Add Playwright visual regression assertions
      (320/768/1024/1440px), including a reduced-motion-emulated screenshot

**Checkpoint**: All four P1 components shipped, tested, and visually
verified — this is a fully viable, independently demonstrable MVP slice.

---

## Phase 3: User Story 2 - Interactive feedback primitives (P2)

Tooltip, Progress, Button Group, Empty State. Independently testable per
component; no dependency on P1 or on each other.

### Tooltip

- [X] T026 [P] [US2] Write `tests/e2e/tooltip.spec.ts` FIRST: assert the
      tooltip becomes visible on `:hover` AND on keyboard Tab-focus of the
      trigger (not just mouse), and is hidden otherwise; ALSO assert that
      hovering the wrapper of a DISABLED trigger still reveals the label
      (spec.md Edge Cases — a `/speckit-analyze` finding: the contract
      explains why `:hover`/`:focus-within` on the wrapper should handle
      this, but nothing had verified it) (contract:
      contracts/tooltip.contract.md) — confirm it FAILS
- [X] T027 [US2] Add `.tooltip-wrapper`/`.tooltip`/`.tooltip-top`
      `@apply`+plain-CSS block to `src/styles/tailwind.css` (CSS Anchor
      Positioning properties `anchor-name`/`position-anchor`/`anchor()`
      require plain CSS, not `@apply` — same pattern as Dropdown Menu's
      existing anchor rules). Also add 4 pre-declared numbered
      `.tooltip-anchor-N`/`.tooltip-target-N` class pairs (research.md
      R12, found during implementation): this project's CSP
      (`style-src 'self'`) silently blocks inline `style="anchor-name:
      ..."` attributes, confirmed empirically — real stylesheet classes
      are the zero-JS-compatible fix
- [X] T028 [US2] Create `src/components/tooltip/tooltip.html`: an
      icon-only button trigger with a visible-on-hover-and-focus tooltip
      label, PLUS a second example with a disabled trigger (to exercise
      T026's disabled-hover assertion) — zero JavaScript per research.md
      R4, using the numbered `.tooltip-anchor-N`/`.tooltip-target-N`
      classes from T027 (never inline `style="..."`, per R12)
- [X] T029 [US2] Register `tooltip` in `vite.config.ts`'s
      `rollupOptions.input` and add a Tooltip card to `index.html`'s
      gallery
- [X] T030 [US2] Re-run T026's assertions — confirm they now PASS
- [X] T030a [US2] Add a regression test to `tooltip.spec.ts` (research.md
      R12) asserting the computed `anchor-name` is applied with zero CSP
      console violations, using `expectNoConsoleErrors` from
      `tests/e2e/a11y-helper.ts` — this exact bug class was silent to
      every ARIA/opacity assertion T026 already had
- [X] T031 [US2] Add Playwright visual regression assertions
      (320/768/1024/1440px) for both the hidden and the hover-revealed
      state — full-page screenshots, not element-scoped, since the
      `position: fixed` tooltip escapes the demo wrapper's own bounding
      box for element-screenshot cropping purposes

### Progress

- [X] T032 [P] [US2] Write `tests/e2e/progress.spec.ts` FIRST: assert
      `role="progressbar"` with correct `aria-valuenow`/`aria-valuemin`/
      `aria-valuemax`, and an indeterminate variant with `aria-valuenow`
      omitted (contract: contracts/progress.contract.md) — confirm it FAILS
- [X] T033 [US2] Add `.progress-track`/`.progress-fill`/
      `.progress-fill-indeterminate` `@apply` blocks to
      `src/styles/tailwind.css`, `.progress-fill-indeterminate` gated
      with `motion-reduce:animate-none` (reusing T021's precedent)
- [X] T033a [US2] Create `src/scripts/progress.js` (research.md R12,
      found during implementation): sets the fill's `style.width` via
      direct CSSOM property assignment from a `data-value` attribute —
      this project's CSP blocks the inline `style="width: 60%"`
      attribute a static-only implementation would otherwise use, and a
      continuous 0-100% value space can't be pre-declared as a small
      numbered class set the way Tooltip's anchor pairings were (T027)
- [X] T034 [US2] Create `src/components/progress/progress.html`: a 60%
      determinate example (`data-progress-fill data-value="60"`, wired to
      T033a's script — never inline `style="width: ..."`, per R12) and an
      indeterminate example
- [X] T035 [US2] Register `progress` in `vite.config.ts`'s
      `rollupOptions.input` and add a Progress card to `index.html`'s
      gallery
- [X] T036 [US2] Re-run T032's assertions — confirm they now PASS
- [X] T036a [US2] Add a regression test to `progress.spec.ts` (research.md
      R12) asserting the fill's width is actually applied with zero CSP
      console violations, using `expectNoConsoleErrors`
- [X] T037 [US2] Run `npm run audit:contrast` (or
      `node scripts/check-contrast.mjs` directly) and confirm the
      "Progress fill vs track" `RING_PAIRINGS` entry (already added to
      `scripts/check-contrast.mjs` — a `/speckit-analyze` pass found the
      auto-scan alone wouldn't catch this pairing) reports 6.38:1,
      matching research.md R1 — do not just trust the research.md number,
      re-verify it against the actual shipped classes now that the entry
      exists
- [X] T038 [US2] Add Playwright visual regression assertions
      (320/768/1024/1440px) for both determinate and indeterminate states

### Button Group

- [X] T039 [P] [US2] Write `tests/e2e/button-group.spec.ts` FIRST: assert
      only one segment can be checked at a time, assert `role="group"`
      with `aria-label`, and add a REAL keyboard-navigation assertion
      (arrow keys move the checked segment; Tab enters/exits the whole
      group as one stop) — do not just visually screenshot it, actually
      drive focus and key presses via Playwright (contract:
      contracts/button-group.contract.md) — confirm it FAILS
- [X] T040 [US2] Add `.button-group`/`.button-group-segment` `@apply`+
      plain-CSS block to `src/styles/tailwind.css` (the `input:checked +`/
      `input:focus-visible +` sibling rules need plain CSS, matching
      Toggle's existing precedent for state-driven sibling styling)
- [X] T041 [US2] Create `src/components/button-group/button-group.html`:
      a 3-option segmented control (e.g. List/Grid/Table view switcher),
      visually-hidden native radio inputs sharing one `name`
- [X] T042 [US2] Register `button-group` in `vite.config.ts`'s
      `rollupOptions.input` and add a Button Group card to `index.html`'s
      gallery
- [X] T043 [US2] Re-run T039's assertions — confirm they now PASS,
      including the keyboard-navigation assertion
- [X] T044 [US2] Run `npm run audit:contrast` and confirm the active
      segment's `bg-brand-dark`/`text-white` pairing reports 7.90:1,
      matching research.md R2
- [X] T045 [US2] Add Playwright visual regression assertions
      (320/768/1024/1440px) for default, active-segment, and disabled-segment
      states

### Empty State

- [X] T046 [P] [US2] Write `tests/e2e/empty-state.spec.ts` FIRST: assert
      zero axe-core violations and that the icon (if present) is
      `aria-hidden="true"` (contract: contracts/empty-state.contract.md)
      — confirm it FAILS
- [X] T047 [US2] Build the Empty State composition directly in
      `src/components/empty-state/empty-state.html` using ONLY existing
      utilities and already-ratified classes (`.btn-primary`, existing
      typography classes) — per research.md R6, confirm no new CSS class
      is actually needed while building this; if a genuine gap is found,
      add the minimal class to `src/styles/tailwind.css` and update
      contracts/empty-state.contract.md to match reality
- [X] T048 [US2] Register `empty-state` in `vite.config.ts`'s
      `rollupOptions.input` and add an Empty State card to `index.html`'s
      gallery
- [X] T049 [US2] Re-run T046's assertions — confirm they now PASS
- [X] T050 [US2] Add Playwright visual regression assertions
      (320/768/1024/1440px)

**Checkpoint**: All four P2 components shipped, tested, contrast-verified,
and visually verified.

---

## Phase 4: User Story 3 - Popover (P3)

Depends only on Dropdown Menu's existing `dropdown-menu.js` module
(already shipped, feature 005) as a reference for extraction — not on
any component from this feature.

- [X] T051 [US3] Write `tests/e2e/popover.spec.ts` FIRST: assert the
      panel opens on trigger click, closes on Escape, AND closes on an
      outside click (Popover API's native light-dismiss — assert it
      directly, don't assume it, per research.md R9); assert focus
      returns to the trigger button after the panel closes via Escape
      (a `/speckit-analyze` finding — this component hosts real
      interactive content, so losing focus on close would be a real
      accessibility regression, the same class of gap already fixed for
      Context Menu); ALSO assert that removing the trigger element from
      the DOM while the panel is open causes the panel to close rather
      than remain an orphaned floating element (spec.md Edge Cases,
      research.md R10) (contract: contracts/popover.contract.md) —
      confirm it FAILS
- [X] T052 [US3] Create `src/scripts/popover.js`: extract the generic
      (item-list-independent) parts of `dropdown-menu.js`'s Popover-API +
      unique-`anchor-name`-per-instance + `aria-expanded`-sync wiring —
      no roving-focus/item-list logic, since Popover hosts arbitrary
      content, but DO carry over the close-path `trigger.focus()` call
      from `dropdown-menu.js`'s `toggle` listener (open-path
      focus-first-item is dropped, since arbitrary content has no "first
      item"; close-path focus-return is not). Also add a
      `MutationObserver` watching for the trigger's removal from the DOM
      and calling `panel.hidePopover()` when it's removed while open
      (research.md R10 — a `/speckit-analyze` finding: spec.md's Edge
      Cases require this, and native `popover="auto"` panels don't
      auto-close when their trigger is removed)
- [X] T053 [US3] Add the `.popover-panel` `@apply` block to
      `src/styles/tailwind.css`, reusing Dropdown Menu's panel treatment
      (`border-neutral-300`/`bg-white`/`shadow-lg`) verbatim, plus
      `position-try-fallbacks: flip-block, flip-inline;` (research.md R8 —
      viewport-edge repositioning Dropdown Menu itself never solved;
      verified supported on all three target engines)
- [X] T054 [US3] Create `src/components/popover/popover.html`: a "Share"
      trigger revealing a small form (a read-only link field + a copy
      button) as the panel's arbitrary content
- [X] T055 [US3] Register `popover` in `vite.config.ts`'s
      `rollupOptions.input` and add a Popover card to `index.html`'s
      gallery
- [X] T056 [US3] Re-run T051's assertions — confirm they now PASS
- [X] T057 [US3] Add a Playwright assertion that the panel repositions to
      stay fully within the viewport when its trigger sits near an edge
      (resize the page/viewport in-test, don't just eyeball it)
- [X] T058 [US3] Add Playwright visual regression assertions
      (320/768/1024/1440px) for the open panel state

**Checkpoint**: Popover shipped, tested (including native light-dismiss
assertions), and visually verified.

---

## Phase 5: User Story 4 - Context Menu (P4)

The highest-risk item in this feature (research.md R5's genuine
divergence from Dropdown Menu). Depends only on the existing, already-
shipped `dropdown-menu.js` as a reference to fork from.

- [X] T059 [US4] Write `tests/e2e/context-menu.spec.ts` FIRST: assert
      right-clicking the target element suppresses the native browser
      context menu and opens this component's menu at the cursor
      position; assert arrow keys rove focus between items (mirroring
      Dropdown Menu's existing test pattern); assert a right-click near
      the viewport's edge still renders the menu fully within the
      viewport's bounding box; ALSO assert focus returns to the
      right-clicked target element after the menu closes via Escape,
      item selection, or outside click (a `/speckit-analyze` finding —
      T060 builds this focus-return mechanism but the original test task
      never asserted it) (contract: contracts/context-menu.contract.md)
      — confirm it FAILS
- [X] T060 [US4] Create `src/scripts/context-menu.js`: fork
      `dropdown-menu.js`'s `contextmenu` handling — `event.preventDefault()`,
      `showPopover()`, then set `style.left`/`style.top` from
      `event.clientX`/`event.clientY` clamped against
      `window.innerWidth`/`innerHeight` minus the panel's measured
      `offsetWidth`/`offsetHeight` (research.md R5) — copy the
      arrow-key-roving-focus logic from `dropdown-menu.js` verbatim,
      since that part has no positioning dependency. Also fork the
      `toggle`-event-driven focus-init (moving focus to the first menu
      item once the panel opens) and focus-return (returning focus to the
      triggering element on close) wiring — a `/speckit-analyze` finding
      caught this as missing from the original task description; without
      it, a keyboard/screen-reader user has no item focused immediately
      after a right-click opens the menu, which US4 AC3 requires
- [X] T061 [US4] Reuse Dropdown Menu's existing `.dropdown-menu-panel`/
      `.dropdown-menu-item` classes verbatim for Context Menu's panel —
      confirm in `src/styles/tailwind.css` that no new class is needed
      beyond what Dropdown Menu already ships (per
      contracts/context-menu.contract.md)
- [X] T062 [US4] Create `src/components/context-menu/context-menu.html`:
      a right-clickable row/element (e.g. a file-list row) with a
      3-action menu (one item disabled)
- [X] T063 [US4] Register `context-menu` in `vite.config.ts`'s
      `rollupOptions.input` and add a Context Menu card to `index.html`'s
      gallery
- [X] T064 [US4] Re-run T059's assertions — confirm they now PASS
- [X] T065 [US4] Add Playwright visual regression assertions
      (320/768/1024/1440px) for the open menu state, plus a
      viewport-edge-triggered screenshot showing the clamped position
- [X] T066 [P] Assess whether Command Palette's existing markup
      (`src/components/command-palette/command-palette.html`, feature
      008) should adopt the new Kbd component (`.kbd`, from T015) to
      display its ⌘K shortcut, per contracts/kbd.contract.md's
      cross-reference note. If yes: apply it and re-run Command
      Palette's existing Playwright suite to confirm zero regressions.
      If the existing markup already communicates the shortcut
      adequately without it, document that decision in this task's
      commit message instead — do not change it without a real reason.
      (No `[Story]` label: this task is about Kbd/US1 and pre-existing
      Command Palette, not Context Menu/US4 — sequenced here only
      because it depends on T015 completing, a `/speckit-analyze`
      traceability finding.)

**Checkpoint**: Context Menu shipped, tested (including the
cursor-anchoring and viewport-clamping behavior that makes it diverge
from Dropdown Menu), and visually verified. Command Palette's Kbd
adoption assessed and applied or explicitly declined.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T067 Run the full Playwright suite locally, but scoped to
      functional and axe-core assertions only (NOT pixel-diff visual
      regression — a `/speckit-analyze` finding caught the original
      wording implying a full local run, which contradicts this
      project's own established rule that visual-regression baselines/
      comparisons run only on `ubuntu-latest` via CI, since even two
      Linux environments render fonts differently; the 10 new
      components also have no committed baseline yet at this point —
      that's T070's job). Confirm zero functional/accessibility
      regressions to any of the 24 previously-shipped components now
      that 10 more exist in the same gallery/vite config
- [X] T067a Compose a real page combining at least 2 P1/P2 components
      (e.g. Textarea + Divider + Button Group + Tooltip, in one demo
      section) using ONLY already-shipped classes/components, and add a
      Playwright assertion confirming it requires zero one-off custom
      CSS beyond ratified classes (spec.md SC-003, flagged uncovered by
      `/speckit-analyze`)
- [X] T068 Run `npm run audit:tokens` across the whole `src/` tree and
      confirm zero raw palette classes were introduced by any of the 10
      new components. Also diff `package.json`/the lockfile against this
      feature's starting commit and confirm zero new dependencies were
      added (spec.md FR-012 — `/speckit-analyze` found no task had
      explicitly checked this)
- [X] T069 Code review pass over all 10 new components' HTML/CSS/JS
      (Textarea, Divider, Kbd, Skeleton, Tooltip, Progress, Button Group,
      Empty State, Popover, Context Menu) plus the 2 new/modified JS
      modules (`popover.js`, `context-menu.js`) and the `mono` token
      addition — address CRITICAL/HIGH findings before proceeding
- [ ] T070 Generate Linux Playwright visual baselines via
      `gh workflow_dispatch` on `.github/workflows/update-snapshots.yml`
      (ubuntu-latest) — NEVER locally or via Docker, per this project's
      established rule. Download the artifact, verify zero drift on any
      pre-existing baseline (only the 10 new components' `*-linux.png`
      files should be new), commit the new baselines
- [X] T071 Run `/speckit-constitution` to add all ten new Component
      Catalog entries (Textarea, Divider, Kbd, Skeleton, Tooltip,
      Progress, Button Group — with its native-radio-group keyboard
      model explicitly documented per research.md R2 — Popover, and
      Context Menu with its cursor-anchoring divergence from Dropdown
      Menu per research.md R5 explicitly documented; Empty State
      documented as a compositional recipe, not a new CSS class, per
      research.md R6), record the new `fontFamily.mono` token in the
      Design Foundations section, and record Date Picker/Calendar,
      interactive/sortable Data Table, Carousel, Chart, Scroll Area, and
      Resizable panels as an explicit known-gap follow-up — matching how
      Table was recorded as a gap before feature 012 built it. This is a
      MINOR version bump (new catalog guidance + one new token,
      following the same pattern as v1.9.0's Lists addition)
- [ ] T072 Verify CI is green on the final commit (real GitHub Actions
      run, not a local test pass) before declaring this feature shipped

---

## Dependencies & Execution Order

- **Phase 1 (Foundational)**: T001 only — blocks Kbd's tasks (T014-T019)
  in Phase 2, nothing else
- **Phase 2 (US1, P1/MVP)**: Textarea/Divider/Skeleton have no
  dependencies beyond the existing scaffold; Kbd depends on T001.
  All four components are independent of each other — fully parallelizable
  across component boundaries
- **Phase 3 (US2, P2)**: Independent of Phase 2 and of each other
  (Tooltip/Progress/Button Group/Empty State can all proceed in parallel)
- **Phase 4 (US3, P3)**: Independent of Phases 2-3; depends only on the
  pre-existing, already-shipped `dropdown-menu.js` as an extraction source
- **Phase 5 (US4, P4)**: Independent of Phases 2-4; depends only on the
  pre-existing `dropdown-menu.js` as a fork source. T066 additionally
  depends on T015 (Kbd's CSS) and the pre-existing Command Palette markup
- **Phase 6 (Polish)**: Depends on ALL prior phases completing

## Parallel Execution Examples

Within Phase 2 (US1), all four components' test-writing tasks can run
in parallel since they touch disjoint files:

```
T002 [P] tests/e2e/textarea.spec.ts
T008 [P] tests/e2e/divider.spec.ts
T014 [P] tests/e2e/kbd.spec.ts       (write test now; T015 still waits on T001)
T020 [P] tests/e2e/skeleton.spec.ts
```

Within Phase 3 (US2), the same pattern applies to T026/T032/T039/T046.

Phases 2, 3, 4, and 5 themselves have no cross-phase file conflicts (each
introduces entirely new files) and could in principle be executed in
parallel by independent workers, though the phase ordering above reflects
increasing implementation risk (R1-R8), not a hard technical dependency.

## Implementation Strategy

### MVP First (User Story 1 Only)

Complete Phase 1 (T001) + Phase 2 (T002-T025) and stop — Textarea,
Divider, Kbd, and Skeleton are independently valuable, fully shipped, and
demonstrate the pattern for the remaining three phases before taking on
any of their added risk (JS-driven state, contrast-critical fills,
cursor-anchoring positioning).

### Incremental Delivery

1. Phase 1 + Phase 2 (US1) → MVP checkpoint, ship/demo
2. Phase 3 (US2) → feedback primitives checkpoint, ship/demo
3. Phase 4 (US3) → Popover checkpoint, ship/demo
4. Phase 5 (US4) → Context Menu checkpoint, ship/demo (highest-risk item
   last, once every simpler pattern in this batch is already proven)
5. Phase 6 → polish, catalog documentation, CI verification, final ship
