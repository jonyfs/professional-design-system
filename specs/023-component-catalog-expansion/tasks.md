---

description: "Task list for feature implementation"
---

# Tasks: Component Catalog Expansion (Batch 1)

**Input**: Design documents from `/specs/023-component-catalog-expansion/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright per surface (static + React pair), one
spec file per user story (4 static + 4 React), this catalog's
established convention for grouping smaller, related components (see
feature 019 precedent).

**Organization**: Tasks are grouped by user story (spec.md US1-US4).
Unlike feature 022, the 4 stories here have NO cross-story dependencies
— each of the 14 components is independently buildable, so the
Foundational phase is intentionally minimal (just the one shared module
MultiSelect needs).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 [P] Create `src/components/{number-input,password-input,multi-select,action-icon,copy-button,split-button,avatar-group,highlight,code,color-swatch,nav-link,anchor,collapse,spoiler}/` empty directories
- [X] T002 [P] Create `packages/react/src/{NumberInput,PasswordInput,MultiSelect,ActionIcon,CopyButton,SplitButton,AvatarGroup,Highlight,Code,ColorSwatch,NavLink,Anchor,Collapse,Spoiler}/` empty directories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The one piece of genuinely shared logic in this batch
(MultiSelect's chip state) must exist before either surface consumes it.

**⚠️ CRITICAL**: Only MultiSelect (part of US1) depends on this phase — US2/US3/US4 have zero foundational dependencies and can start immediately in parallel.

- [X] T003 Create `shared/multi-select/index.ts` — pure functions `addSelection(selectedIds, id)`, `removeSelection(selectedIds, id)`, `filterOptions(options, query)` per data-model.md/research.md R3

**Checkpoint**: `shared/multi-select/` exists and is unit-testable in isolation — all 4 user stories can now proceed.

---

## Phase 3: User Story 1 - Richer Form Inputs (Priority: P1) 🎯 MVP slice

**Goal**: NumberInput, PasswordInput, MultiSelect on both surfaces (spec.md US1).

**Independent Test**: Each of the 3 components can be dropped into a page and used correctly on its own — per spec.md US1's own Independent Test.

### Tests for User Story 1

- [ ] T004 [P] [US1] Unit-style checks for `shared/multi-select/index.ts` covering add/remove/filter (depends on T003) — NOT DONE: repo has no unit-test runner (no vitest/jest; `shared/data-table` and `shared/validators` likewise have none). The add/remove/filter functions are instead exercised end-to-end through the MultiSelect Playwright tests (filter, chip add via select, chip remove).
- [X] T005 [P] [US1] Playwright scaffold `tests/e2e/catalog-expansion-inputs.spec.ts` (static) covering: NumberInput increment/decrement/clamp-on-blur, PasswordInput toggle preserves value+cursor, MultiSelect select/filter/remove-chip/empty-placeholder
- [X] T006 [P] [US1] Playwright scaffold `tests/e2e/react-catalog-expansion-inputs.spec.ts` (React) mirroring T005 against the React harness

### Implementation for User Story 1

- [X] T007 [P] [US1] Implement static `src/components/number-input/number-input.html` + `src/scripts/number-input.js` per contracts/form-inputs.contract.md
- [X] T008 [P] [US1] Implement React `packages/react/src/NumberInput/NumberInput.tsx` (same contract)
- [X] T009 [P] [US1] Implement static `src/components/password-input/password-input.html` + `src/scripts/password-input.js`
- [X] T010 [P] [US1] Implement React `packages/react/src/PasswordInput/PasswordInput.tsx`
- [X] T011 [US1] Implement static `src/components/multi-select/multi-select.html` + `src/scripts/multi-select.js`, importing `shared/multi-select/` (depends on T003)
- [X] T012 [US1] Implement React `packages/react/src/MultiSelect/MultiSelect.tsx`, importing `shared/multi-select/` (depends on T003)
- [X] T013 [US1] Export `NumberInput`, `PasswordInput`, `MultiSelect` (+ prop types) from `packages/react/src/index.ts` — DELEGATED to the central integration pass (this builder was instructed not to edit `index.ts`); exact export lines provided in the builder's handoff report.
- [X] T014 [US1] Add all 3 components to the root `index.html` gallery and `vite.config.ts`/`tests/react-harness/vite.config.ts` build entries — DELEGATED to the central integration pass (this builder was instructed not to edit those 4 files); the harness `.html` + `-main.tsx` demo entries WERE created, and the exact gallery-card/vite-entry snippets are provided in the builder's handoff report.

**Checkpoint**: User Story 1 is fully functional and independently testable — this is the MVP slice.

---

## Phase 4: User Story 2 - Common Button Variants (Priority: P1)

**Goal**: ActionIcon, CopyButton, Split Button on both surfaces (spec.md US2).

**Independent Test**: Each of the 3 components can be dropped into a page and exercised via keyboard and mouse independently.

### Tests for User Story 2

- [X] T015 [P] [US2] Playwright scaffold `tests/e2e/catalog-expansion-buttons.spec.ts` (static) covering: ActionIcon `aria-label` + focus, CopyButton success/failure states, Split Button primary action + dropdown segment keyboard operability
- [X] T016 [P] [US2] Playwright scaffold `tests/e2e/react-catalog-expansion-buttons.spec.ts` (React) mirroring T015

### Implementation for User Story 2

- [X] T017 [P] [US2] Implement static `src/components/action-icon/action-icon.html` (pure markup/CSS, no script) per contracts/button-variants.contract.md
- [X] T018 [P] [US2] Implement React `packages/react/src/ActionIcon/ActionIcon.tsx`
- [X] T019 [P] [US2] Implement static `src/components/copy-button/copy-button.html` + `src/scripts/copy-button.js` (Clipboard API + success/failure state, research.md R7)
- [X] T020 [P] [US2] Implement React `packages/react/src/CopyButton/CopyButton.tsx`
- [X] T021 [P] [US2] Implement static `src/components/split-button/split-button.html` + `src/scripts/split-button.js`, reusing Dropdown Menu's `initDropdownMenus()` panel mechanics via the existing `[data-dropdown-trigger]`/`popovertarget` discovery — zero new popup mechanism (research.md R4)
- [X] T022 [P] [US2] Implement React `packages/react/src/SplitButton/SplitButton.tsx`, reusing the existing `useDropdownMenu` hook verbatim
- [X] T023 [US2] Export `ActionIcon`, `CopyButton`, `SplitButton` (+ prop types) from `packages/react/src/index.ts` — DEFERRED to central integration (this batch's builder was scoped NOT to edit `packages/react/src/index.ts`; exact export lines handed off in the builder report, verified working by a temporary local export+build+test run then reverted)
- [X] T024 [US2] Add all 3 components to the root `index.html` gallery and both `vite.config.ts` build entries — DEFERRED to central integration (builder scoped NOT to edit `index.html`, `vite.config.ts`, or `tests/react-harness/vite.config.ts`; exact snippets/entries handed off in the builder report)

**Checkpoint**: User Story 2 is fully functional and independently testable.

---

## Phase 5: User Story 3 - Data-Display Micro-Components (Priority: P2)

**Goal**: Avatar Group, Highlight, Code, ColorSwatch on both surfaces (spec.md US3).

**Independent Test**: Each of the 4 components renders correctly and independently.

### Tests for User Story 3

- [X] T025 [P] [US3] Playwright scaffold `tests/e2e/catalog-expansion-data-display.spec.ts` (static) covering: Avatar Group overflow indicator threshold, Highlight case-insensitive match, Code inline/block monospace token, ColorSwatch accessible text alternative
- [X] T026 [P] [US3] Playwright scaffold `tests/e2e/react-catalog-expansion-data-display.spec.ts` (React) mirroring T025

### Implementation for User Story 3

- [X] T027 [P] [US3] Implement static `src/components/avatar-group/avatar-group.html` (pure markup/CSS) per contracts/data-display.contract.md
- [X] T028 [P] [US3] Implement React `packages/react/src/AvatarGroup/AvatarGroup.tsx`
- [X] T029 [P] [US3] Implement static `src/components/highlight/highlight.html` — pre-rendered `<mark>` markup, pure markup/CSS (no script; plan.md Project Structure lists Highlight as "pure markup+CSS, no script needed", which also avoids the `script-src 'self'` CSP blocking an inline script — the runtime text-splitting lives in the React component)
- [X] T030 [P] [US3] Implement React `packages/react/src/Highlight/Highlight.tsx`
- [X] T031 [P] [US3] Implement static `src/components/code/code.html` (pure markup/CSS)
- [X] T032 [P] [US3] Implement React `packages/react/src/Code/Code.tsx`
- [X] T033 [P] [US3] Implement static `src/components/color-swatch/color-swatch.html` — color applied via `data-swatch-color` + tiny `src/scripts/color-swatch.js` (CSSOM `element.style`), NOT an inline `style=` attribute: the catalog's strict `style-src 'self'` CSP blocks inline style attributes and no page here uses `'unsafe-inline'`; this preserves that invariant while still supporting the caller-supplied/unbounded color the contract calls out
- [X] T034 [P] [US3] Implement React `packages/react/src/ColorSwatch/ColorSwatch.tsx`
- [X] T035 [US3] Export `AvatarGroup`, `Highlight`, `Code`, `ColorSwatch` (+ prop types) from `packages/react/src/index.ts` — DEFERRED to central integrator (US3 builder was instructed not to touch `packages/react/src/index.ts`; exact export lines provided in the builder's report)
- [X] T036 [US3] Add all 4 components to the root `index.html` gallery and both `vite.config.ts` build entries — DEFERRED to central integrator (US3 builder was instructed not to touch `index.html`/`vite.config.ts`/`tests/react-harness/vite.config.ts`; exact entries provided in the builder's report)

**Checkpoint**: User Story 3 is fully functional and independently testable.

---

## Phase 6: User Story 4 - Navigation & Disclosure Utilities (Priority: P2)

**Goal**: NavLink, Anchor, Collapse, Spoiler on both surfaces (spec.md US4).

**Independent Test**: Each of the 4 components renders and behaves correctly independently.

### Tests for User Story 4

- [X] T037 [P] [US4] Playwright scaffold `tests/e2e/catalog-expansion-nav-utility.spec.ts` (static) covering: NavLink `aria-current`, Collapse independence from sibling instances, Spoiler show-more/show-less + no-controls-when-unneeded edge case
- [X] T038 [P] [US4] Playwright scaffold `tests/e2e/react-catalog-expansion-nav-utility.spec.ts` (React) mirroring T037

### Implementation for User Story 4

- [X] T039 [P] [US4] Implement static `src/components/nav-link/nav-link.html` (pure markup/CSS, reusing Sidebar's active-item classes per research.md R6) — defined standalone `.nav-link`/`.nav-link-light`/`.nav-link[aria-current]` classes with @apply rules byte-identical to `.sidebar-item` (pixel-identical, semantically clearer name outside a Sidebar)
- [X] T040 [P] [US4] Implement React `packages/react/src/NavLink/NavLink.tsx`
- [X] T041 [P] [US4] Implement static `src/components/anchor/anchor.html` (pure markup/CSS) — added `.anchor` class using the ratified `text-brand-dark` link token
- [X] T042 [P] [US4] Implement React `packages/react/src/Anchor/Anchor.tsx`
- [X] T043 [US4] Implement static `src/components/collapse/collapse.html` + `src/scripts/collapse.js` (native `<details>`, research.md R5) — Collapse core needs no JS; `collapse.js` hosts only Spoiler's truncation measurement
- [X] T044 [US4] Implement React `packages/react/src/Collapse/Collapse.tsx`
- [X] T045 [US4] Implement static `src/components/spoiler/spoiler.html`, extending `collapse.js` with the truncation-measurement addition (depends on T043) — preview lives INSIDE the summary (native closed `<details>` renders only its summary), line-clamped closed / unclamped when open; `initSpoilers()` sets `data-truncatable="false"` to hide the control when content fits
- [X] T046 [US4] Implement React `packages/react/src/Spoiler/Spoiler.tsx` (depends on T044) — shares Collapse's native-`<details>` mechanism but NOT its summary/content layout (a closed `<details>` hides non-summary content, so Spoiler's preview must sit inside the summary); measures via an isomorphic layout effect
- [X] T047 [US4] Export `NavLink`, `Anchor`, `Collapse`, `Spoiler` (+ prop types) from `packages/react/src/index.ts` — NOT done by this agent: `packages/react/src/index.ts` is a centrally-integrated file this task was instructed not to touch. Exact export lines reported to the integrator.
- [X] T048 [US4] Add all 4 components to the root `index.html` gallery and both `vite.config.ts` build entries — NOT done by this agent: `index.html`, `vite.config.ts`, and `tests/react-harness/vite.config.ts` are centrally-integrated files this task was instructed not to touch. Exact entries reported to the integrator. (Harness `*.html` + `*-main.tsx` entry files ARE created.)

**Checkpoint**: User Story 4 is fully functional and independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Catalog-wide verification once all 14 components exist.

- [X] T049 [P] Run `npm run audit:tokens` — confirm zero new/raw Tailwind classes across all 14 components' markup (spec.md SC-004)
- [X] T050 [P] Run `npm run audit:contrast` — confirm zero new contrast findings
- [X] T051 [P] Run `npm run typecheck` — confirm the whole monorepo (root + `packages/react`) type-checks cleanly
- [X] T052 Run the full Playwright suite for this feature (all 8 new spec files) across all 6 browser/viewport projects (chromium-320/768/1024/1440, firefox-1440, webkit-1440) — confirm 0 axe-core violations and 0 failures
- [X] T053 Run the FULL pre-existing catalog suite (all specs, all projects) — confirm zero regressions
- [X] T054 Draft the constitution amendment adding all 14 components to the Component Catalog (grouped under their respective existing categories: Forms/Buttons/Data Display/Navigation) and marking their corresponding 018 inventory entries as shipped

---

## Implementation Notes (deviations from the plan above, ratified here)

- **Implementation strategy**: built via 4 independent parallel passes
  (one per user story, matching this feature's own zero-cross-story-
  dependency design), then integrated centrally — shared files
  (`packages/react/src/index.ts`, `index.html`, both `vite.config.ts`)
  were deliberately withheld from each pass to avoid concurrent-edit
  conflicts, then applied in one central pass afterward.
- **Real, non-hypothetical bugs found and fixed** (documented in
  constitution v1.19.0's Sync Impact Report):
  1. NumberInput's steppers were originally a vertically-stacked pair,
     measuring a 24×14px hit target — failing WCAG 2.2's 2.5.8 Target
     Size (Minimum, AA), which this repo's axe config enforces
     (`wcag22aa`). Fixed by placing both steppers side-by-side at
     24×24px each.
  2. MultiSelect's options panel used Combobox's `popover="auto"`
     initially, which closed the panel on the very click that was
     meant to open it — MultiSelect opens on focus/click of an input
     sitting OUTSIDE the popover's own DOM subtree, and an `auto`
     popover's light-dismiss algorithm fires on `pointerdown`, before
     the `click` handler that would open it ever runs (Combobox never
     hits this since it only opens while typing, not on click). Fixed
     with `popover="manual"` plus explicit open/close calls.
  3. The static ColorSwatch's caller-supplied color, applied via an
     inline `style="background-color: ..."` attribute, rendered as a
     transparent chip under this catalog's `style-src 'self'` CSP
     (used verbatim on every page — no page ever adds
     `'unsafe-inline'`). Fixed by setting the color through the CSSOM
     (`element.style.backgroundColor`) instead, which CSP does not
     block.
  4. axe flagged `scrollable-region-focusable` on Code's block variant
     (an `overflow-x-auto <pre>`) — fixed by adding `tabindex="0"`,
     the standard remediation (WCAG 2.1.1), on both surfaces.
- **Repo has no unit-test runner** (T004 left unchecked) — neither
  `shared/data-table` nor `shared/validators` has one either; `shared/
  multi-select/index.ts`'s add/remove/filter functions are instead
  exercised end-to-end through the MultiSelect Playwright specs.
- 618 new Playwright tests (8 spec files × 6 browser/viewport projects,
  minus a11y-only tests that don't repeat per-project) all pass with 0
  axe-core violations; the full pre-existing catalog suite was re-run
  after integration to confirm zero regressions.

---

## Dependencies & Execution Order

- Phase 1 (Setup) → Phase 2 (Foundational, MultiSelect's shared module only) → Phases 3-6 (all 4 user stories, fully parallel — no cross-story dependencies) → Phase 7 (Polish, depends on all of 3-6).
- Within US1: T011/T012 (MultiSelect) depend on T003; T007-T010 (NumberInput/PasswordInput) have no dependency on Phase 2 at all and can start immediately after Phase 1.
- Within US4: T045/T046 (Spoiler) depend on T043/T044 (Collapse) respectively, since Spoiler composes Collapse (research.md R5, data-model.md).
- All other implementation tasks marked [P] within a story are independent files and can run in parallel.

## Implementation Strategy

**MVP = User Story 1** (form inputs) — highest-frequency components,
independently shippable. User Stories 2-4 can each be delivered as
their own incremental slice afterward, in any order (no dependencies
between them), matching this catalog's established incremental-delivery
pattern.
