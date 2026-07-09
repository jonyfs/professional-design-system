# Tasks: Navigation & Disclosure Primitives

**Input**: Design documents from `/specs/005-navigation-disclosure-primitives/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/,
quickstart.md, constitution.md (v1.3.4)

**Tests**: Included — Playwright visual regression + `@axe-core/playwright`
accessibility scans, plus new keyboard-navigation assertions specific to
each component (roving-tabindex/arrow-key for Tabs, Escape/outside-click/
Tab-closes/arrow-key for Dropdown Menu, native `<details>` toggle +
`exclusive`-variant for Accordion), same pattern as features 001-004.

**Organization**: Tasks are grouped by user story (Breadcrumbs P1,
Accordion/Disclosure P2, Tabs P3, Dropdown Menu P4). No Setup/Foundational
phase for existing tooling (Vite, Tailwind, Playwright,
`tests/e2e/a11y-helper.ts`, `shared/design-tokens.ts`) — unchanged from
prior features; `scripts/audit-tokens.mjs`/`scripts/check-contrast.mjs`
also need no changes for this feature (research.md R3 verified no new
tokens are required). Unlike feature 003, `/speckit-analyze` findings for
this feature were fixed directly in the design documents (spec.md,
data-model.md, research.md, contracts/) before this task list was
generated — no design-doc fix-up task is needed here.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)

## Path Conventions

Same single-project static frontend layout as features 001-003:
`src/components/<name>/`, `src/scripts/`, `tests/e2e/`. No
`packages/react/` changes — React porting is explicitly out of scope
(FR-014).

---

## Phase 1: User Story 1 - Breadcrumbs (Priority: P1) 🎯 MVP

**Goal**: Ship a Breadcrumbs primitive with zero JavaScript, per
`contracts/breadcrumbs.contract.md`, completing the constitution's
pre-existing (previously unimplemented) Breadcrumbs catalog entry.

**Independent Test**: Drop the Breadcrumbs markup into a blank page and
verify the ancestor trail is link-navigable, the current page is
non-interactive text with `aria-current="page"`, and the trail lives in
its own `<nav aria-label="Breadcrumb">` — all without any other component
present.

### Tests for User Story 1

> Write first; they MUST fail until T002 exists.

- [x] T001 [P] [US1] Write `tests/e2e/breadcrumbs.spec.ts`: visual
      regression at 320/768/1024/1440px for the 3-level and single-entry
      variants, an axe scan, an assertion that ancestor links are present
      in hierarchical order and keyboard-focusable, an assertion that the
      current page renders as non-interactive text with
      `aria-current="page"`, and a 320px assertion that a long trail wraps
      onto a second line rather than overflowing horizontally (spec.md
      Edge Case, `breadcrumbs.contract.md`'s `flex-wrap` fix)

### Implementation for User Story 1

- [x] T002 [US1] Implement `src/components/breadcrumbs/breadcrumbs.html`
      per `contracts/breadcrumbs.contract.md` (both the 3-level and
      single-entry variants on the same standalone page)
- [x] T003 [US1] Add `.breadcrumb-nav`/`.breadcrumb-link`/
      `.breadcrumb-divider`/`.breadcrumb-current` `@apply` classes to
      `src/styles/tailwind.css` per `data-model.md`'s Breadcrumbs
      composition — the constitution's pre-existing ratified pattern, used
      verbatim, plus the `active:text-neutral-700` state added to
      `.breadcrumb-link` after a second `/speckit-analyze` pass
      (`disabled:` is deliberately NOT added, since Tailwind's `disabled:`
      variant cannot match an `<a>` element regardless of what utility is
      appended — see data-model.md's Principle V compliance note)
- [x] T004 [US1] Add a Breadcrumbs card to `index.html`'s gallery, linking
      to `src/components/breadcrumbs/breadcrumbs.html`
- [x] T005 [US1] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations (research.md R3: no new tokens expected)

**Checkpoint**: Breadcrumbs is independently shippable — zero JS, visually
correct at all breakpoints, AAA-compliant, wired into the gallery.

---

## Phase 2: User Story 2 - Accordion / Disclosure (Priority: P2)

**Goal**: Ship an Accordion/Disclosure primitive using native
`<details>`/`<summary>` (zero JS) — including the `exclusive`
single-open-at-a-time variant via the native shared-`name` mechanism — per
`contracts/accordion.contract.md`.

**Independent Test**: Drop the Accordion markup into a blank page and
verify each item toggles independently via mouse and keyboard, the
chevron rotates with state, and the `exclusive` variant's items close each
other natively when one opens — all without any other component present.

### Tests for User Story 2

> Write first; they MUST fail until T007 exists.

- [x] T006 [P] [US2] Write `tests/e2e/accordion.spec.ts`: visual
      regression at 320/768/1024/1440px for closed/open states (both the
      independent and `exclusive` variants), an axe scan, a
      click-to-toggle assertion, a keyboard-activation assertion (Enter/
      Space on a focused `<summary>`), an independence assertion (opening
      one independent item leaves others' state unchanged), an
      `exclusive`-variant assertion (opening one item closes any other
      open item in the same `name` group, verified as native browser
      behavior with no JS event fired), and a long-content assertion that
      expanding pushes subsequent content down with no layout jump on the
      trigger row itself (spec.md Edge Case)

### Implementation for User Story 2

- [x] T007 [US2] Implement `src/components/accordion/accordion.html` per
      `contracts/accordion.contract.md` (both the independent and
      `exclusive`-variant demos on the same standalone page)
- [x] T008 [US2] Add `.accordion-item`/`.accordion-trigger`/
      `.accordion-chevron`/`.accordion-content` `@apply` classes to
      `src/styles/tailwind.css` per `data-model.md`'s Accordion
      composition (including the `hover:`/`active:` states added after
      `/speckit-analyze`)
- [x] T009 [US2] Add an Accordion card to `index.html`'s gallery, linking
      to `src/components/accordion/accordion.html`
- [x] T010 [US2] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations

**Checkpoint**: Breadcrumbs + Accordion both independently shippable —
zero JS across both components so far.

---

## Phase 3: User Story 3 - Tabs (Priority: P3)

**Goal**: Ship a Tabs primitive implementing the full WAI-ARIA Tabs
pattern (roving tabindex, arrow-key navigation) via a new `tabs.js`
module — the first JavaScript in this feature — per
`contracts/tabs.contract.md`.

**Independent Test**: Drop the Tabs markup and `tabs.js` into a blank
page and verify exactly one panel is visible at a time, clicking an
unselected tab switches the panel, and Left/Right/Home/End arrow keys
move focus and selection between tabs without requiring intermediate Tab
key presses — all without any other component present.

### Tests for User Story 3

> Write first; they MUST fail until T012-T013 exist.

- [x] T011 [P] [US3] Write `tests/e2e/tabs.spec.ts`: visual regression at
      320/768/1024/1440px for each tab's selected state, an axe scan, a
      default-state assertion (exactly one tab selected/one panel visible
      on load), a click-to-switch assertion, roving-tabindex assertions
      (only the selected tab has `tabindex="0"`), Left/Right arrow-key
      assertions including wrap-around at both ends, Home/End assertions,
      and a 320px assertion that an overflowing tab row scrolls
      horizontally rather than wrapping or truncating labels (spec.md
      Edge Case, `tabs.contract.md`'s `overflow-x-auto` fix)

### Implementation for User Story 3

- [x] T012 [US3] Implement `src/scripts/tabs.js`'s `initTabs()` per
      `contracts/tabs.contract.md`'s reference implementation
      (`[data-tabs]`-root wiring, `select()`, click + keydown handlers)
- [x] T013 [US3] Implement `src/components/tabs/tabs.html` per
      `contracts/tabs.contract.md` (3 tabs/panels, loading `tabs.js` as a
      module)
- [x] T014 [US3] Add `.tabs-list`/`.tab-trigger`/
      `.tab-trigger[aria-selected="true"]`/`.tab-panel` `@apply` classes
      to `src/styles/tailwind.css` per `data-model.md`'s Tabs composition
      (including `overflow-x-auto`, `active:`, and `disabled:opacity-50
      disabled:cursor-not-allowed` — the literal pattern every other
      disabled declaration in this project uses, not a custom color-only
      substitute — both added across two `/speckit-analyze` passes)
- [x] T015 [US3] Add a Tabs card to `index.html`'s gallery, linking to
      `src/components/tabs/tabs.html`
- [x] T016 [US3] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations

**Checkpoint**: Breadcrumbs + Accordion + Tabs all independently
shippable — this feature's first JS module verified working end to end.

---

## Phase 4: User Story 4 - Dropdown Menu (Priority: P4)

**Goal**: Ship a Dropdown Menu primitive using the native Popover API for
open/close/light-dismiss/top-layer behavior, plus a new
`dropdown-menu.js` module for arrow-key navigation, `aria-expanded`
syncing, and explicit focus-return, per
`contracts/dropdown-menu.contract.md`.

**Independent Test**: Drop the Dropdown Menu markup and
`dropdown-menu.js` into a blank page and verify the menu opens via mouse
and keyboard with focus landing on the first item, Up/Down arrow keys
navigate between (non-disabled) items with wrap-around, selecting an item
fires its action and closes the menu, and Escape/outside-click/Tab all
close the menu without firing an action — with focus returning to the
trigger in every closing path — all without any other component present.

### Tests for User Story 4

> Write first; they MUST fail until T018-T019 exist.

- [x] T017 [P] [US4] Write `tests/e2e/dropdown-menu.spec.ts`: visual
      regression at 320/768/1024/1440px for closed/open states, an axe
      scan, an open-via-click assertion with first-item-focus check, an
      open-via-keyboard assertion, Up/Down arrow-key assertions including
      wrap-around and skipping the disabled "Archive" item (spec.md Edge
      Case), an item-selection assertion (action fires, menu closes,
      focus returns to trigger), an Escape assertion (closes without
      firing an action, focus returns to trigger), an outside-click
      assertion (same), and a Tab-closes-the-menu assertion per the APG
      convention `dropdown-menu.contract.md` implements — explicitly
      verifying `trigger.focus()` fires on every one of these closing
      paths, not assumed from Popover API defaults (the real gap
      `/speckit-analyze` caught in the design docs)

### Implementation for User Story 4

- [x] T018 [US4] Implement `src/scripts/dropdown-menu.js`'s
      `initDropdownMenus()` per `contracts/dropdown-menu.contract.md`'s
      reference implementation (`toggle`-event `aria-expanded` sync +
      explicit `trigger.focus()` on close, arrow-key/Tab `keydown`
      handling, per-item `click` → `hidePopover()`)
- [x] T019 [US4] Implement `src/components/dropdown-menu/dropdown-menu.html`
      per `contracts/dropdown-menu.contract.md` (trigger + 4 items
      including one `disabled`, loading `dropdown-menu.js` as a module)
- [x] T020 [US4] Add `.dropdown-menu-panel`/`.dropdown-menu-item`
      `@apply` classes to `src/styles/tailwind.css` per
      `data-model.md`'s Dropdown Menu composition (including the layered
      focus-visible outline + bg highlight, `active:`, and
      `disabled:opacity-50 disabled:cursor-not-allowed` — the literal
      pattern every other disabled declaration in this project uses, not
      a custom color-only substitute — all added across two
      `/speckit-analyze` passes)
- [x] T021 [US4] Add a Dropdown Menu card to `index.html`'s gallery,
      linking to `src/components/dropdown-menu/dropdown-menu.html`
- [x] T022 [US4] Run `npm run audit:tokens && npm run audit:contrast` —
      confirm zero violations

**Checkpoint**: All four Navigation & Disclosure primitives independently
shippable.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T023 Run the full project test suite (`npm run test:e2e`) — all
      existing specs (static gallery features 001-003 + React harness
      feature 004) plus the four new specs (`breadcrumbs.spec.ts`,
      `accordion.spec.ts`, `tabs.spec.ts`, `dropdown-menu.spec.ts`);
      confirm zero regressions
- [ ] T024 [P] Manual QA: execute quickstart.md's discoverability check
      (SC-004) — time an unfamiliar developer composing a working Tabs
      instance with 3 panels using only the Tabs gallery page as
      reference. **NOT DONE by an AI agent** — requires a human tester,
      same outstanding status as every prior feature's equivalent item
      (SC-001/SC-005 in features 001-004)
- [x] T025 Code review pass over
      `src/components/{breadcrumbs,accordion,tabs,dropdown-menu}/**`,
      `src/scripts/{tabs,dropdown-menu}.js`, and the `tailwind.css` diff
      using the code-reviewer agent; address any CRITICAL/HIGH findings
- [x] T026 Generate Linux Playwright baselines via
      `gh workflow run update-snapshots.yml` → `gh run download` →
      copy the new `*-linux.png` files into each new component's
      `tests/e2e/<name>.spec.ts-snapshots/` directory. Never locally,
      never via local Docker (feature 001's CI incident). Confirm via
      `cmp` that any pre-existing baselines the run regenerates are
      byte-identical to what's already committed, same verification
      feature 004 did, before committing only the genuinely new files
- [x] T027 Run `/speckit-constitution` to ratify a new "Navigation &
      Disclosure" Component Catalog section (MINOR version bump — new
      catalog guidance added, not a correction) reflecting the actual
      shipped patterns for Breadcrumbs (already-ratified, now
      cross-referenced as implemented), Accordion, Tabs, and Dropdown
      Menu, per `quickstart.md`'s reminder — this is the "propose in
      Phase 1, ratify what shipped" step already used for genuinely new
      patterns in prior features (e.g. v1.3.0's `-strong` status tokens);
      do not skip it once implementation is verified stable
- [x] T028 [P] Update root `README.md`'s Project Structure section to
      list the four new component directories and `src/scripts/tabs.js`/
      `dropdown-menu.js`, consistent with feature 004's README update
      pattern

---

## Dependencies & Execution Order

- **US1 (Breadcrumbs)** has no dependencies — can start immediately. MVP
  scope.
- **US2 (Accordion)** has no dependencies on US1 — independently
  implementable and testable, ordered second only by spec.md priority.
- **US3 (Tabs)** has no dependencies on US1/US2 — independently
  implementable, ordered third by spec.md priority (first JS module).
- **US4 (Dropdown Menu)** has no dependencies on US1/US2/US3 — the
  Trigger's-containing-hidden-Tabs-panel Edge Case is explicitly
  documented as out of scope for this feature's own gallery composition
  (`dropdown-menu.contract.md`), so US4 does not require US3 to be
  complete first, only to exist in the codebase if that composition were
  ever attempted (it isn't, in this feature).
- All four user-story phases (1-4) can proceed in parallel by different
  contributors once this task list exists; Polish (Phase 5) requires all
  four complete.
- Within each story: tests (T001/T006/T011/T017) before implementation,
  same TDD ordering as every prior feature.

## Parallel Execution Examples

```text
# Per-story test-writing tasks are the natural parallel entry points —
# each targets a different new spec file with no shared dependency:
T001 [US1] tests/e2e/breadcrumbs.spec.ts
T006 [US2] tests/e2e/accordion.spec.ts
T011 [US3] tests/e2e/tabs.spec.ts
T017 [US4] tests/e2e/dropdown-menu.spec.ts

# Within Phase 5, T024/T028 are independent of each other and of T023/
# T025/T026 (sequenced: full-suite verification before code review,
# before baseline generation, before the constitution amendment which
# should reflect final, reviewed, tested patterns):
T024 [P] manual discoverability QA
T028 [P] README update
```

## Implementation Strategy

**MVP first**: Phase 1 (Breadcrumbs) alone is a complete, shippable
increment — zero JS, matches the constitution's pre-existing catalog
entry. Phases 2-4 add independently-testable increments in spec.md's
priority order, each introducing progressively more interaction
complexity (native-element-only → native-element-plus-JS-for-keyboard →
native-Popover-API-plus-JS). Phase 5 is not optional polish in the sense
of being skippable — T026 (Linux baselines) and T027 (constitution
ratification) are both required before this feature can be considered
fully shipped, matching the precedent set by every prior feature.
