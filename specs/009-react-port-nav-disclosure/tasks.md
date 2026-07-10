# Tasks: React Port — Navigation & Disclosure Primitives

**Input**: Design documents from `/specs/009-react-port-nav-disclosure/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/,
quickstart.md, constitution.md (v1.7.0)

**Tests**: Included — Playwright pixel-parity + `@axe-core/playwright`
accessibility scans against each static reference's own approved
baselines, same pattern as feature 004's first 10 React ports.

**Organization**: Tasks are grouped by user story (Breadcrumbs P1,
Accordion P2, Tabs P3, Dropdown Menu P4). No Setup/Foundational phase —
reuses `packages/react/`'s existing tsup build, compiled stylesheet, and
`tests/react-harness/` scaffold entirely (feature 004). No new
`shared/design-tokens.ts` or `check-contrast.mjs`/`audit-tokens.mjs`
changes needed — zero new tokens (research.md).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US4)

## Path Conventions

`packages/react/src/<Name>/<Name>.tsx`, `tests/react-harness/`,
`tests/e2e/react-<name>.spec.ts` — matching feature 004's exact layout.

---

## Phase 1: User Story 1 - Breadcrumbs (Priority: P1) 🎯 MVP

**Goal**: Port `Breadcrumbs` as a pure-markup component — no hooks, no
state — per `contracts/breadcrumbs.contract.md`.

**Independent Test**: Render `<Breadcrumbs items={...} currentLabel="...">`
in the harness and confirm pixel parity with
`src/components/breadcrumbs/breadcrumbs.html`.

### Tests for User Story 1

- [x] T001 [P] [US1] Write `tests/e2e/react-breadcrumbs.spec.ts`: visual
      regression at 320/768/1024/1440px comparing against
      `breadcrumbs.spec.ts`'s existing approved baselines, an axe scan,
      and a port of every keyboard/semantic acceptance scenario from
      `tests/e2e/breadcrumbs.spec.ts` (ancestor links keyboard-focusable
      in order, current page non-interactive with `aria-current="page"`,
      single-entry trail still renders the nav wrapper)

### Implementation for User Story 1

- [x] T002 [US1] Implement `packages/react/src/Breadcrumbs/Breadcrumbs.tsx`
      per `contracts/breadcrumbs.contract.md` — `BreadcrumbItem`/
      `BreadcrumbsProps` types, pure markup, no hooks
- [x] T003 [US1] Add `.breadcrumb-nav`/`.breadcrumb-link`/
      `.breadcrumb-divider`/`.breadcrumb-current` `@apply` classes
      (ported verbatim from `src/styles/tailwind.css`) to
      `packages/react/src/styles.css`'s `@layer components` block
      (research.md R4)
- [x] T004 [US1] Export `Breadcrumbs`/`BreadcrumbsProps`/`BreadcrumbItem`
      from `packages/react/src/index.ts`
- [x] T005 [US1] Add `tests/react-harness/breadcrumbs.html` +
      `src/breadcrumbs-main.tsx` demo page, and a
      `breadcrumbs: resolve(__dirname, "breadcrumbs.html")` entry to
      `tests/react-harness/vite.config.ts`'s `rollupOptions.input`
- [x] T006 [US1] Run `npm run build --workspace packages/react &&
      npm run audit:tokens && npm run audit:contrast` — confirm zero
      violations (no new tokens)

**Checkpoint**: Breadcrumbs is independently shippable — pixel-identical
to the static reference, zero new logic.

---

## Phase 2: User Story 2 - Accordion (Priority: P2)

**Goal**: Port `Accordion` keeping the native `<details name="...">`
exclusive-group mechanism verbatim — zero React state — per
`contracts/accordion.contract.md`.

**Independent Test**: Render an `exclusive` `Accordion` with 3 items;
opening one collapses any other open item; render without `exclusive`
and confirm multiple items stay open.

### Tests for User Story 2

- [x] T007 [P] [US2] Write `tests/e2e/react-accordion.spec.ts`: visual
      regression comparing against `accordion.spec.ts`'s baselines, an
      axe scan, an exclusive-group assertion (opening item 2 closes
      item 1), a non-exclusive assertion (both stay open), and an
      Enter/Space-on-summary keyboard toggle assertion

### Implementation for User Story 2

- [x] T008 [US2] Implement `packages/react/src/Accordion/Accordion.tsx`
      per `contracts/accordion.contract.md` — `useId()` for the shared
      `name` when `exclusive`, no `useState`/`useEffect`
- [x] T009 [US2] Add `.accordion-item`/`.accordion-trigger`/
      `.accordion-chevron`/`.accordion-content` `@apply` classes (ported
      verbatim) to `packages/react/src/styles.css`
- [x] T010 [US2] Export `Accordion`/`AccordionProps`/`AccordionItemData`
      from `packages/react/src/index.ts`
- [x] T011 [US2] Add `tests/react-harness/accordion.html` +
      `src/accordion-main.tsx` (both exclusive and non-exclusive demo
      groups) and a `vite.config.ts` entry
- [x] T012 [US2] Run `npm run build --workspace packages/react &&
      npm run audit:tokens && npm run audit:contrast` — confirm zero
      violations

**Checkpoint**: Breadcrumbs + Accordion both independently shippable.

---

## Phase 3: User Story 3 - Tabs (Priority: P3)

**Goal**: Port `Tabs` as idiomatic React state implementing the WAI-ARIA
roving-tabindex pattern — per `contracts/tabs.contract.md`.

**Independent Test**: Render `Tabs` with 4 tabs (1 disabled); verify
default selection, click-to-switch, Left/Right/Home/End keyboard
navigation skipping the disabled tab, and roving tabindex.

### Tests for User Story 3

- [x] T013 [P] [US3] Write `tests/e2e/react-tabs.spec.ts`: visual
      regression comparing against `tabs.spec.ts`'s baselines, an axe
      scan, and a full port of `tests/e2e/tabs.spec.ts`'s acceptance
      scenarios (exactly one tab selected/panel visible on load,
      click-switches-panel, roving tabindex — only selected tab in Tab
      order, Right/Left wrap at ends, Home/End jump to first/last,
      disabled tab skipped during arrow-key nav)

### Implementation for User Story 3

- [x] T014 [US3] Implement `packages/react/src/Tabs/Tabs.tsx` per
      `contracts/tabs.contract.md` — `useState<string>` for
      `selectedId`, a tab-button ref map, `onKeyDown` handler computing
      the next tab id **locally** before calling both `setSelectedId`
      and `.focus()` on that same local id (research.md R2 /
      `/speckit-analyze` M1 — never re-read `selectedId` state for the
      focus call, since React 18 batches the update)
- [x] T015 [US3] Add `.tab-trigger`/`.tab-trigger[aria-selected="true"]`/
      `.tab-panel` `@apply` classes (ported verbatim) to
      `packages/react/src/styles.css`
- [x] T016 [US3] Export `Tabs`/`TabsProps`/`TabData` from
      `packages/react/src/index.ts`
- [x] T017 [US3] Add `tests/react-harness/tabs.html` +
      `src/tabs-main.tsx` (4 tabs, 1 disabled) and a `vite.config.ts`
      entry
- [x] T018 [US3] Run `npm run build --workspace packages/react &&
      npm run audit:tokens && npm run audit:contrast` — confirm zero
      violations

**Checkpoint**: Breadcrumbs + Accordion + Tabs all independently
shippable.

---

## Phase 4: User Story 4 - Dropdown Menu (Priority: P4)

**Goal**: Port `DropdownMenu` as an idiomatic `useDropdownMenu` hook
driving the real Popover API imperatively via refs — per
`contracts/dropdown-menu.contract.md`.

**Independent Test**: Render `DropdownMenu` with a trigger and 4 items (1
disabled); click the trigger, confirm the panel opens with focus on the
first item; arrow-key navigation skips the disabled item; Escape/Tab
closes with focus returned to the trigger.

### Tests for User Story 4

- [x] T019 [P] [US4] Write `tests/e2e/react-dropdown-menu.spec.ts`:
      visual regression comparing against `dropdown-menu.spec.ts`'s
      baselines, an axe scan, and a full port of
      `tests/e2e/dropdown-menu.spec.ts`'s acceptance scenarios (opens
      via click with focus on the first item, arrow-key roving focus
      skipping the disabled item with wraparound, Tab closes the menu,
      Escape closes the menu, explicit focus-return to the trigger on
      every closing path, `aria-expanded` synced)

### Implementation for User Story 4

- [x] T020 [US4] Implement `packages/react/src/hooks/useDropdownMenu.ts`
      per `contracts/dropdown-menu.contract.md` — sets
      `panelRef.current.popover = "auto"` **imperatively via the DOM
      property**, never a JSX `popover` attribute (`/speckit-analyze`
      CRITICAL finding C1 — the JSX attribute does not typecheck under
      this package's pinned `@types/react` `^18.3.0`); arrow-key handler
      calls `.focus()` synchronously on the computed next item (finding
      H2); no `aria-selected` anywhere (finding H1 — not a valid ARIA
      state on `role="menuitem"`); explicit `triggerRef.current?.focus()`
      on every closing path
- [x] T021 [US4] Implement `packages/react/src/DropdownMenu/DropdownMenu.tsx`
      as a thin consumer of `useDropdownMenu`, per
      `contracts/dropdown-menu.contract.md`'s Rendered markup
- [x] T022 [US4] Add `.dropdown-menu-panel`/`.dropdown-menu-item`
      `@apply` classes (ported verbatim) to
      `packages/react/src/styles.css`
- [x] T023 [US4] Export `DropdownMenu`/`DropdownMenuProps`/
      `DropdownMenuItemData` from `packages/react/src/index.ts`
- [x] T024 [US4] Add `tests/react-harness/dropdown-menu.html` +
      `src/dropdown-menu-main.tsx` (4 items, 1 disabled) and a
      `vite.config.ts` entry
- [x] T025 [US4] Run `npm run build --workspace packages/react &&
      npm run audit:tokens && npm run audit:contrast` — confirm zero
      violations

**Checkpoint**: All four ported components independently shippable.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T026 Run the full project test suite (`npm run test:e2e`) — all
      existing specs (features 001-008 static + React harness) plus the
      four new ones; confirm zero regressions. Also run
      `npm run build --workspace packages/react` and confirm the new
      component `.d.ts`/exports appear in `packages/react/dist/`
- [ ] T027 [P] Manual QA: execute quickstart.md's discoverability check
      (SC-003) — time an unfamiliar developer composing a working `Tabs`
      or `DropdownMenu` instance using only exported TypeScript prop
      types. **NOT DONE by an AI agent** — requires a human tester, same
      outstanding status as every prior feature's equivalent item
- [ ] T028 Code review pass over
      `packages/react/src/{Breadcrumbs,Accordion,Tabs,DropdownMenu}/**`,
      `packages/react/src/hooks/useDropdownMenu.ts`, and the
      `styles.css`/`index.ts`/`vite.config.ts` diffs using the
      code-reviewer agent; address any CRITICAL/HIGH findings — pay
      particular attention to the imperative `popover` property wiring
      and the arrow-key focus-management logic, the two highest-risk
      pieces of new logic in this feature
- [ ] T029 Generate Linux Playwright baselines via
      `gh workflow run update-snapshots.yml` → `gh run download` → copy
      the new `*-linux.png` files into each new spec's own
      `tests/e2e/react-<name>.spec.ts-snapshots/` directory. Never
      locally, never via local Docker. Confirm via `cmp` that
      pre-existing baselines this run regenerates are byte-identical to
      what's already committed before committing only the genuinely new
      files
- [ ] T030 Confirm no `/speckit-constitution` amendment is needed (this
      feature introduces no new Component Catalog entry — a pure
      platform port, FR-008) — verify the existing Navigation &
      Disclosure section's prose still accurately describes the shipped
      behavior with no edits required, per quickstart.md's reminder
- [ ] T031 [P] Update root `README.md`: move Breadcrumbs/Accordion/Tabs/
      Dropdown Menu from the "static-only for now" list to the "also
      published as React" list, and add the 4 new
      `packages/react/src/*/*.tsx` files to the Project Structure
      section if it enumerates them

---

## Dependencies & Execution Order

- **US1 (Breadcrumbs)** has no dependencies — can start immediately. MVP
  scope.
- **US2 (Accordion)** has no dependency on US1 — independently
  implementable.
- **US3 (Tabs)** has no dependency on US1/US2 — independently
  implementable.
- **US4 (Dropdown Menu)** has no dependency on US1/US2/US3 —
  independently implementable, ordered last per spec.md's stated
  rationale (most involved interaction model, benefits from patterns
  proven earlier in this same feature).
- Within each story: tests before implementation, same TDD ordering as
  every prior feature.

## Parallel Execution Examples

```text
# Per-story test-writing tasks are the natural parallel entry points:
T001 [US1] tests/e2e/react-breadcrumbs.spec.ts
T007 [US2] tests/e2e/react-accordion.spec.ts
T013 [US3] tests/e2e/react-tabs.spec.ts
T019 [US4] tests/e2e/react-dropdown-menu.spec.ts

# Within Phase 5, T027/T031 are independent of each other and of
# T026/T028/T029/T030 (sequenced: full-suite verification before code
# review, before baseline generation, before the constitution check):
T027 [P] manual discoverability QA
T031 [P] README update
```

## Implementation Strategy

**MVP first**: Phase 1 (Breadcrumbs) alone is a complete, shippable
increment — pure markup, no hooks. Phases 2-4 add independently-
testable increments in spec.md's priority order, each introducing real
technical decisions verified during Phase 0 research and corrected by
`/speckit-analyze` before this tasks.md was written. Phase 5's T029
(Linux baselines) is required before this feature is considered fully
shipped, matching the precedent set by every prior feature; T030 replaces
the usual constitution-ratification task since this feature adds no new
catalog entry.
