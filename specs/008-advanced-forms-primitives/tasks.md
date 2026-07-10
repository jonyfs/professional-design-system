# Tasks: Advanced Forms Primitives

**Input**: Design documents from `/specs/008-advanced-forms-primitives/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/,
quickstart.md, constitution.md (v1.6.0)

**Tests**: Included — Playwright visual regression + `@axe-core/playwright`
accessibility scans, same pattern as every prior feature.

**Organization**: Tasks are grouped by user story (Combobox P1, Command
Palette P2). No Setup/Foundational phase for existing tooling — reuses
the scaffold entirely. `scripts/check-contrast.mjs` needs two new
`PAIRINGS` entries (research.md R4) for this feature's own usage of
`text-neutral-900`-on-white and `text-neutral-600`-on-white — added as
part of Phase 1's implementation, not deferred.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

Same single-project static frontend layout as every prior feature:
`src/components/<name>/`, `src/scripts/`, `tests/e2e/`. No
`packages/react/` changes (FR-013).

---

## Phase 1: User Story 1 - Combobox (Priority: P1) 🎯 MVP

**Goal**: Ship a from-scratch WAI-ARIA 1.2 Combobox — filter-as-you-type,
`aria-activedescendant` keyboard navigation, a Popover-API-hosted
listbox, a "No results" state, and disabled-option support — per
`contracts/combobox.contract.md`.

**Independent Test**: Drop the Combobox markup and `combobox.js` into a
blank page, type a partial match, and verify the listbox narrows, arrow
keys move `aria-activedescendant` among filtered options (wrapping),
Enter commits the active option and closes the listbox, Escape closes it
unchanged, and a non-matching query shows "No results."

### Tests for User Story 1

- [ ] T001 [P] [US1] Write `tests/e2e/combobox.spec.ts`: visual
      regression at 320/768/1024/1440px (closed and open-listbox states),
      an axe scan, an assertion that typing a substring narrows the
      listbox and wraps matches in `<mark>` (FR-002), ArrowDown/ArrowUp
      assertions moving `aria-activedescendant` among filtered options
      with wraparound at both ends (FR-003), an Enter assertion that
      commits the active option's value into the input and closes the
      listbox, an Escape assertion that closes the listbox without
      changing the input's value, a "No results" assertion for a
      non-matching query (FR-004), and a disabled-option assertion (skip
      during arrow-key traversal, no-op on click/Enter, `aria-disabled`
      present — FR-005, spec.md Edge Case)

### Implementation for User Story 1

- [ ] T002 [US1] Implement `src/components/combobox/combobox.html` per
      `contracts/combobox.contract.md` (no `popovertarget` on the input —
      `/speckit-analyze` confirmed it's inert on `type="text"`; the
      popover opens/closes exclusively via `combobox.js`). Gallery demo
      dataset should have enough entries (~50) that SC-001's "narrow to a
      single match by typing 3-4 characters" is a real, demonstrable test
      of the mechanism, not just illustrative
- [ ] T003 [US1] Add `.combobox-input`/`.combobox-listbox`/
      `.combobox-option`/`.combobox-option[aria-selected="true"]`/
      `.combobox-option[aria-disabled="true"]` (with
      `hover:bg-transparent active:bg-transparent` suppression — the
      `/speckit-analyze`-caught disabled-highlight fix)/`.combobox-option
      mark`/`.combobox-empty` `@apply` classes to `src/styles/
      tailwind.css` per `data-model.md`'s Combobox composition
- [ ] T004 [US1] Implement `src/scripts/combobox.js`: filtering
      (case-insensitive substring match, `<mark>`-wrapping matched
      substrings), `activeIndex` state clamped/reset on every filter
      pass, ArrowDown/ArrowUp navigation skipping `aria-disabled` options
      with wraparound, `aria-activedescendant`/`aria-selected` syncing,
      `aria-expanded` on the input synced to `true`/`false` on every
      popover open/close (Principle II gate, contracts/
      combobox.contract.md's Required Attributes table), Enter-to-commit,
      Escape-to-close, blur-to-close (supplementing the Popover API's own
      light-dismiss for Tab-away), disabled-option click no-op, and
      `showPopover()`/`hidePopover()` calls gated on a non-empty query
      only — **not** on having at least one match, since FR-004/spec.md
      Acceptance Scenario 5 requires the listbox to open and show
      `.combobox-empty` precisely on a zero-match non-empty query (per
      contracts/combobox.contract.md's Behavior wiring table verbatim)
- [ ] T005 [US1] Add a Combobox card to `index.html`'s gallery, linking
      to `src/components/combobox/combobox.html`
- [ ] T006 [US1] Add `combobox: resolve(__dirname, "src/components/combobox/combobox.html")`
      to `vite.config.ts`'s `rollupOptions.input`
- [ ] T007 [US1] Extend `scripts/check-contrast.mjs`'s `PAIRINGS` with
      this feature's own usage of `text-neutral-900`-on-white
      (option/input text, `<mark>` highlight) and
      `text-neutral-600`-on-white ("No results" text) per research.md R4
      — register the usage even though both base tokens are already
      ratified, per this project's established discipline
- [ ] T008 [US1] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations, including the two newly-registered
      pairings

**Checkpoint**: Combobox is independently shippable — filter-as-you-type,
full keyboard operability, AAA-compliant, wired into the gallery and the
production build.

---

## Phase 2: User Story 2 - Command Palette (Priority: P2)

**Goal**: Ship a Cmd/Ctrl+K global-shortcut Command Palette reusing
Modal's `<dialog>`/`showModal()` chrome, with the same filter/keyboard-nav
model as Combobox — per `contracts/command-palette.contract.md`.

**Independent Test**: Drop the Command Palette markup, the modified
`overlay.js`, and `command-palette.js` into a blank page; press Cmd/
Ctrl+K from an arbitrary starting focus state; verify the dialog opens
with its search input focused, typing narrows the action list, Enter on a
highlighted action fires a visible confirmation and closes the dialog,
and Escape closes it with focus restored to the pre-open target
(including on WebKit).

### Tests for User Story 2

- [ ] T009 [P] [US2] Write `tests/e2e/command-palette.spec.ts`: visual
      regression at 320/768/1024/1440px (closed and open states), an axe
      scan, a global-shortcut assertion (`page.keyboard.press` both
      `"Control+k"` and `"Meta+k"`) opening the dialog with its search
      input focused from an arbitrary starting focus state (e.g. focus
      placed on an unrelated link elsewhere on the page first — FR-006),
      a filter-narrows-the-action-list assertion matching Combobox's
      pattern, an Enter-executes-and-closes assertion (visible
      confirmation text + dialog closed), an Escape-closes-and-restores-
      focus assertion explicitly checked on WebKit (not just Chromium/
      Firefox — this project's WebKit-specific focus-restoration gap from
      feature 003), a Tab-stays-trapped-in-dialog assertion, and a
      double-shortcut-is-idempotent assertion (pressing Cmd/Ctrl+K while
      already open does not toggle it closed — spec.md Edge Case)

### Implementation for User Story 2

- [ ] T010 [US2] Modify `src/scripts/overlay.js`: extract the existing
      per-dialog backdrop-click-close and WebKit-safe `close`-time
      refocus logic out of `initDialogTriggers()`'s per-trigger loop into
      an exported `wireDialogClose(dialog)` function; call it from
      `initDialogTriggers()` for each `data-dialog-trigger` dialog as
      before (no behavior change). **Verify immediately after this
      change**: run `npx playwright test tests/e2e/modal.spec.ts
      tests/e2e/slide-over.spec.ts` and confirm both pass unmodified —
      this is a refactor of shared plumbing two already-shipped
      components depend on, not new behavior (research.md R3,
      `/speckit-analyze` finding I1)
- [ ] T011 [US2] Implement `src/components/command-palette/command-palette.html`
      per `contracts/command-palette.contract.md` (dialog chrome reusing
      Modal's `rounded-lg`/`shadow-xl`/`sm:max-w-lg` treatment verbatim,
      search input, action list, `aria-live="polite"` confirmation
      element, a visible `data-testid="command-palette-hint"` shortcut
      hint on the gallery page for discoverability). Gallery demo action
      list should have ~20 entries so SC-002's "<5 keystrokes for a
      20-action palette" is a real, demonstrable test, not just
      illustrative
- [ ] T012 [US2] Add `.command-palette-dialog`/`.command-palette-input`/
      `.command-palette-list`/`.command-palette-action`/
      `.command-palette-action[aria-selected="true"]`/
      `.command-palette-action[aria-disabled="true"]` (with the same
      disabled-hover/active suppression as Combobox)/`.command-palette-
      action mark`/`.command-palette-empty` `@apply` classes to
      `src/styles/tailwind.css` per `data-model.md`'s Command Palette
      composition
- [ ] T013 [US2] Implement `src/scripts/command-palette.js`: a
      document-level `keydown` listener checking `(event.metaKey ||
      event.ctrlKey) && event.key.toLowerCase() === "k"`, `preventDefault()`,
      a guard no-oping if another `<dialog open>` already exists, setting
      `dialog._lastTrigger = document.activeElement`, and calling
      `dialog.showModal()`; call `wireDialogClose(dialog)` (from T010)
      once for this dialog; independently implement the same filtering/
      `activeIndex`/`aria-activedescendant`/arrow-key/Enter/disabled-skip
      logic as `combobox.js` (data-model.md's explicit decision not to
      extract a third shared module — the two contexts differ enough
      that duplicating ~15 lines is cheaper than a forced abstraction);
      Enter writes a visible confirmation into
      `command-palette-confirmation` and calls `dialog.close()`
- [ ] T014 [US2] Add a Command Palette card to `index.html`'s gallery
      (including the shortcut hint), linking to
      `src/components/command-palette/command-palette.html`
- [ ] T015 [US2] Add `commandPalette: resolve(__dirname,
      "src/components/command-palette/command-palette.html")` to
      `vite.config.ts`'s `rollupOptions.input`
- [ ] T016 [US2] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations (reuses T007's pairings, no new ones needed)

**Checkpoint**: Combobox + Command Palette both independently shippable.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [ ] T017 Run the full project test suite (`npm run test:e2e`) — all
      existing specs (features 001-007 static + React harness) plus the
      two new ones; **explicitly confirm `modal.spec.ts` and
      `slide-over.spec.ts` still pass unmodified** after T010's
      `overlay.js` refactor, not just that the suite is green overall.
      Also run `npm run build` and confirm
      `dist/src/components/{combobox,command-palette}/` both exist
- [ ] T018 [P] Manual QA: execute quickstart.md's discoverability check
      (SC-005) — time an unfamiliar developer composing a Combobox with a
      custom option list using only its own gallery page. **NOT DONE by
      an AI agent** — requires a human tester, same outstanding status as
      every prior feature's equivalent item
- [ ] T019 Code review pass over
      `src/components/{combobox,command-palette}/**`,
      `src/scripts/{combobox,command-palette,overlay}.js`, and the
      `tailwind.css`/`vite.config.ts`/`check-contrast.mjs` diffs using the
      code-reviewer agent; address any CRITICAL/HIGH findings — pay
      particular attention to the `overlay.js` refactor's blast radius
      (Modal/Slide-over) since that is the highest-risk change in this
      feature
- [ ] T020 Generate Linux Playwright baselines via
      `gh workflow run update-snapshots.yml` → `gh run download` → copy
      the new `*-linux.png` files into each new component's
      `tests/e2e/<name>.spec.ts-snapshots/` directory. Never locally,
      never via local Docker. Confirm via `cmp` that pre-existing
      baselines this run regenerates are byte-identical to what's already
      committed before committing only the genuinely new files
- [ ] T021 Run `/speckit-constitution` to add a new "Advanced Forms &
      Interaction" Component Catalog section documenting Combobox and
      Command Palette's shipped patterns (MINOR version bump), per
      `quickstart.md`'s reminder — do not skip once implementation is
      verified stable
- [ ] T022 [P] Update root `README.md`'s Project Structure section to
      list the two new component directories and the two new
      `src/scripts/*.js` modules, consistent with every prior feature's
      README update pattern

---

## Dependencies & Execution Order

- **US1 (Combobox)** has no dependencies — can start immediately. MVP
  scope.
- **US2 (Command Palette)** has no dependency on US1's own component, but
  T010 (the `overlay.js` extraction) MUST complete and be verified
  (Modal/Slide-over specs still passing) before T013 (`command-
  palette.js`, which calls `wireDialogClose`) — this is the one real
  intra-feature ordering constraint, called out explicitly per
  `/speckit-analyze`'s finding.
- Within each story: tests before implementation, same TDD ordering as
  every prior feature.

## Parallel Execution Examples

```text
# Per-story test-writing tasks are the natural parallel entry points:
T001 [US1] tests/e2e/combobox.spec.ts
T009 [US2] tests/e2e/command-palette.spec.ts

# Within Phase 3, T018/T022 are independent of each other and of
# T017/T019/T020/T021 (sequenced: full-suite verification before code
# review, before baseline generation, before the constitution amendment):
T018 [P] manual discoverability QA
T022 [P] README update
```

## Implementation Strategy

**MVP first**: Phase 1 (Combobox) alone is a complete, shippable
increment — no dependency on Command Palette or on the `overlay.js`
refactor. Phase 2 adds an independently-testable increment, but its own
first task (T010) is a refactor of already-shipped shared code and MUST
be verified against Modal/Slide-over's existing test suite before
anything in Phase 2 builds on top of it. Phase 3's T020 (Linux baselines)
and T021 (constitution ratification) are required before this feature is
considered fully shipped, matching the precedent set by every prior
feature.
