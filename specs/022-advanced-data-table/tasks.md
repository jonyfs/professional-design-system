---

description: "Task list for feature implementation"
---

# Tasks: Advanced Data Table

**Input**: Design documents from `/specs/022-advanced-data-table/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included — Playwright per surface (static + React pair), this
catalog's established convention, plus direct unit-style checks on the
`shared/data-table/` pure functions (sorting/filtering/pagination/
selection) before any UI consumes them.

**Organization**: Tasks are grouped by user story (spec.md US1/US2/US3).
This is this catalog's largest interactive component to date (plan.md's
own "most JS-heavy component yet" note) — the Foundational phase carries
real weight here (the table must exist and render before any story-
specific behavior attaches to it).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Create `shared/data-table/` directory with `types.ts` defining `ColumnDefinition`, `SortEntry`, `FilterState`, `RowSelection`, `BulkAction`, `RecordFormState` per data-model.md
- [X] T002 [P] Create `src/components/data-table/` and `packages/react/src/DataTable/` empty directories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A working, rendering (but not yet sortable/filterable/
selectable) table on both surfaces, plus the shared status-announcement
mechanism every story needs.

**⚠️ CRITICAL**: No user story can be verified until this phase is complete.

- [X] T003 [P] Implement `shared/data-table/pagination.ts` — `paginate(rows, page, pageSize)`, `pageCount(totalRows, pageSize)` (research.md R4)
- [X] T004 [P] Implement `DataTableEmptyState` in `packages/react/src/DataTable/DataTableEmptyState.tsx` — reuses the Empty State recipe, "No data yet" vs. "No results match your filters" variants (research.md R10, contracts/core-table.contract.md)
- [X] T005 [P] Implement the equivalent static empty-state markup fragment for `src/components/data-table/data-table.html` (same two variants)
- [X] T006 Implement base `DataTable` rendering in `packages/react/src/DataTable/DataTable.tsx` — renders `columns`/`rows` into `.data-table-wrapper`/`.data-table`/`.data-table-header-cell`/`.data-table-cell` (feature 012 classes, reused verbatim), paginated via T003, empty states via T004 (depends on T001, T003, T004)
- [X] T007 Implement base static rendering in `src/scripts/data-table.js` + `src/components/data-table/data-table.html` — same markup/pagination/empty-state behavior as T006 (depends on T001, T003, T005)
- [X] T008 [P] Add a shared `aria-live="polite"` status region to both surfaces (research.md R9) — `packages/react/src/DataTable/DataTable.tsx` and `data-table.html`, with a small `announce(message)` helper each surface's own script/component can call

**Checkpoint**: A table renders `columns`/`rows` with pagination and correct empty states on both surfaces — no sort, filter, selection, or CRUD yet.

---

## Phase 3: User Story 1 - Sort, Filter, and Page Through a Large Dataset (Priority: P1) 🎯 MVP

**Goal**: Multi-column sort, global + per-column filtering, pagination that preserves sort/filter (spec.md US1).

**Independent Test**: Populate the table with a representative dataset, sort by a column, apply a filter, page forward/back — per spec.md US1's own Independent Test.

### Tests for User Story 1

- [X] T009 [P] [US1] Unit-style checks for `shared/data-table/sorting.ts` and `filtering.ts` (once written) covering: single-column sort cycling asc→desc→unsorted, multi-column precedence order, global-query matching, per-column filter ANDing (research.md R2/R3) — write alongside T010/T011, confirm correct before wiring into UI
- [X] T010 [P] [US1] Playwright scaffold in `tests/e2e/data-table.spec.ts` (static) covering: sort cycling + `aria-sort`, multi-column sort, global search narrowing + page-count update, per-column filter, sort/filter preserved across page navigation, "no data" vs. "no results" empty states, non-sortable/filterable column exemption
- [X] T011 [P] [US1] Playwright scaffold in `tests/e2e/react-data-table.spec.ts` (React) mirroring T010's scenarios against the React harness

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement `shared/data-table/sorting.ts` — `applySort(rows, sortState, columns)`, `toggleSort(sortState, columnId)` (research.md R2, contracts/core-table.contract.md)
- [X] T013 [P] [US1] Implement `shared/data-table/filtering.ts` — `applyFilter(rows, filterState, columns)` (research.md R3)
- [X] T014 [US1] Wire sort buttons + `aria-sort` into `packages/react/src/DataTable/DataTable.tsx`'s header cells, calling `toggleSort()`/`applySort()`, respecting `column.sortable` (FR-002/FR-003/FR-015) (depends on T006, T012)
- [X] T015 [US1] Wire the equivalent sort buttons into `src/scripts/data-table.js`/`data-table.html` (depends on T007, T012)
- [X] T016 [US1] Wire global search input + per-column filter row into `packages/react/src/DataTable/DataTable.tsx`, calling `applyFilter()`, resetting to page 1 on change, respecting `column.filterable` (FR-004/FR-015) (depends on T006, T013)
- [X] T017 [US1] Wire the equivalent filter controls into `src/scripts/data-table.js`/`data-table.html` (depends on T007, T013)
- [X] T018 [US1] Wire the `aria-live` status region (T008) to announce sort changes and filter-result-count changes on both surfaces (FR-016) (depends on T014-T017)
- [X] T019 [US1] Export `DataTable`, `DataTableEmptyState`, column/row types from `packages/react/src/index.ts`

**Checkpoint**: User Story 1 is fully functional and independently testable — this is the MVP.

---

## Phase 4: User Story 2 - Select Multiple Rows and Act on Them Together (Priority: P2)

**Goal**: Per-row and page/all-matching selection, a bulk-action toolbar with confirmation for irreversible actions (spec.md US2).

**Independent Test**: Select several rows, confirm the bulk-action toolbar appears/disappears correctly — per spec.md US2's own Independent Test.

### Tests for User Story 2

- [X] T020 [P] [US2] Unit-style checks for `shared/data-table/selection.ts` covering `toggleRow`/`selectPage`/`selectAllMatching`/`clearSelection` (research.md R5)
- [X] T021 [P] [US2] Playwright scaffold (extends `tests/e2e/data-table.spec.ts`) covering: checkbox selection shows/hides the toolbar with correct count, page-vs-all-matching choice appears only when filtered rows exceed one page, changing sort/filter with an active selection keeps the toolbar's count accurate, a `requiresConfirmation` bulk action opens a confirm step first
- [X] T022 [P] [US2] Playwright scaffold (extends `tests/e2e/react-data-table.spec.ts`) mirroring T021 against the React harness

### Implementation for User Story 2

- [X] T023 [US2] Implement `shared/data-table/selection.ts` per research.md R5/contracts/selection-bulk-actions.contract.md (depends on T001)
- [X] T024 [US2] Add the row-checkbox column + header selection control to `packages/react/src/DataTable/DataTable.tsx`, reusing `.checkbox-input` styling verbatim (depends on T006, T023)
- [X] T025 [US2] Add the equivalent checkbox column + header control to `src/scripts/data-table.js`/`data-table.html` (depends on T007, T023)
- [X] T026 [US2] Implement `DataTableToolbar` in `packages/react/src/DataTable/DataTableToolbar.tsx` — in-flow region (research.md R6), shown when `selection.ids.size > 0`, one button per caller-supplied `BulkAction`, confirmation via Modal reuse for `requiresConfirmation` actions (FR-008/FR-009) (depends on T024)
- [X] T027 [US2] Implement the equivalent static bulk-action toolbar in `data-table.html`/`data-table.js`, reusing `.modal-dialog`/`.modal-panel` for confirmation (depends on T025)
- [X] T028 [US2] Wire the FR-017 conflict rule: block a bulk action if any selected row has an open, `isDirty` Record Edit/Create Form (depends on T026, T027 — coordinate with Phase 5's form state once it exists; if Phase 5 is not yet implemented, this task's check is a no-op guard clause ready for it)
- [X] T029 [US2] Export `DataTableToolbar`, `RowSelection`, `BulkAction` types from `packages/react/src/index.ts`

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Create, Edit, and Delete Records Directly in the Table (Priority: P3)

**Goal**: Opt-in per-instance create/edit/delete with validation and confirmation (spec.md US3).

**Independent Test**: Create, edit, and delete a record independently of any multi-select flow — per spec.md US3's own Independent Test.

### Tests for User Story 3

- [X] T030 [P] [US3] Playwright scaffold (extends `tests/e2e/data-table.spec.ts`) covering: add-record flow, edit-record flow preserving table state, delete confirmation, field-level validation preserving other field values, zero CRUD affordances when `crud` flags are all false
- [X] T031 [P] [US3] Playwright scaffold (extends `tests/e2e/react-data-table.spec.ts`) mirroring T030 against the React harness

### Implementation for User Story 3

- [X] T032 [US3] Implement `DataTableRowActions` in `packages/react/src/DataTable/DataTableRowActions.tsx` — ≤3 icon buttons (view/edit/delete), only rendering actions enabled by this instance's `crud` config (contracts/crud-operations.contract.md) (depends on T006)
- [X] T033 [US3] Implement `DataTableForm` in `packages/react/src/DataTable/DataTableForm.tsx` — create/edit form inside Modal, fields built from `TextInput`/`Select`, `fieldErrors` per data-model.md, `isDirty` tracking for FR-018 (depends on T032)
- [X] T034 [US3] Wire create/edit/delete submission handlers in `packages/react/src/DataTable/DataTable.tsx` — updates `rows` in place on success, keeps `sortState`/`filterState`/`page`/other selection untouched (FR-010/FR-011/FR-012) (depends on T033)
- [X] T035 [US3] Implement the equivalent static row actions + Modal-based create/edit/delete forms in `data-table.html`/`data-table.js`, reusing `overlay.js`'s `wireDialogClose()` (research.md R7) (depends on T007)
- [X] T036 [US3] Wire the FR-018 "discard unsaved input" warning on both surfaces when a sort/filter/page-size/column-visibility change is attempted while `isDirty === true` (depends on T033, T035)
- [X] T037 [US3] Wire CRUD completion announcements into the shared `aria-live` region (T008) on both surfaces (FR-016) (depends on T034, T035)
- [X] T038 [US3] Resolve T028's conflict-guard placeholder now that Record Edit/Create Form state exists (depends on T028, T033, T035)
- [X] T039 [US3] Export `DataTableRowActions`, `DataTableForm` from `packages/react/src/index.ts`

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T040 [P] Implement column-visibility toggle (FR-013) on both surfaces — a checkbox list or menu showing/hiding columns without resetting sort/filter/page/selection (spans all three stories' rendering, done last since it must not break any of them)
- [X] T041 [P] Run `npm run audit:tokens` and `npm run audit:contrast`, fix any findings
- [X] T042 Run `quickstart.md` end-to-end and record results
- [X] T043 Run the full new Playwright suite (`data-table.spec.ts` + `react-data-table.spec.ts`) across all configured projects (320/768/1024/1440 × chromium/firefox/webkit) with axe-core assertions
- [X] T044 Verify the FR-014 horizontal-scroll behavior at 320px with all columns visible (worst case) — confirm no page-level overflow, only the table's own `.data-table-wrapper` scrolls
- [X] T045 Draft the constitution amendment adding DataTable to the Component Catalog (Data Display & Listings), documenting the Table-vs-DataTable distinction and the R1 non-adoption-of-TanStack-Table decision

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup — BLOCKS all user stories (a rendering table must exist first)
- **User Story 1 (Phase 3)**: depends on Foundational only — this is the MVP
- **User Story 2 (Phase 4)**: depends on Foundational only — independently testable (T028 has a forward-reference to Phase 5, resolved in T038, but US2's own acceptance criteria don't require Phase 5 to exist)
- **User Story 3 (Phase 5)**: depends on Foundational only — independently testable
- **Polish (Phase 6)**: depends on all desired stories being complete

### Parallel Opportunities

- T003, T004, T005 (Foundational) in parallel
- T012, T013 (US1 shared functions) in parallel; T009-T011 (tests) in parallel with each other
- T020 (US2 shared function tests) in parallel with US1 work if staffed separately
- T030, T031 (US3 test scaffolds) in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (rendering table + empty states + status region)
3. Complete Phase 3: User Story 1 (sort/filter/paginate)
4. **STOP and VALIDATE**: run `tests/e2e/data-table.spec.ts`/`react-data-table.spec.ts`'s US1 tests, confirm SC-001 holds
5. This alone delivers real value: a sortable, filterable, paginated table — a strict superset of feature 012's static Table

### Incremental Delivery

1. Setup + Foundational → rendering table ready
2. User Story 1 → validate independently → MVP
3. User Story 2 → validate independently (selection + bulk actions)
4. User Story 3 → validate independently (CRUD), then resolve T028/T038's cross-story conflict guard
5. Polish → column visibility, audits, full suite, constitution amendment

## Notes

- [P] tasks = different files, no dependencies
- This feature's Foundational phase is unusually large because, unlike
  most prior features, all three user stories render onto the *same*
  table surface rather than being independent components — the base
  render must exist before any story-specific interaction attaches
- T028/T038 is this plan's one deliberate cross-story dependency (US2's
  bulk-action conflict guard needs US3's form state to fully resolve) —
  flagged explicitly rather than silently assumed independent
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently

## Implementation Notes (deviations from the plan above, ratified here)

- **Five real bugs found and fixed during implementation** (all now
  documented in constitution v1.18.0's Sync Impact Report):
  1. `DataTableForm`'s internal `values` state was initialized via
     `useState(initialValues ?? emptyValues)` — React only runs a
     `useState` initializer on a component's first mount, so reusing one
     always-mounted `DataTableForm` instance across "create" → "edit row
     A" → "edit row B" kept showing whichever values were present at
     first mount, never the newly-targeted row's real values. Fixed by
     keying the component (`key={mode-rowId}`) so React remounts it
     fresh per target record, restoring correct per-record state.
  2. The create/edit form's native HTML5 `required` attribute (passed
     through from `field.required` to `TextInput`) let the browser's own
     constraint validation intercept form submission *before* the
     custom `onValidate`/`fieldErrors` logic ever ran, silently
     replacing this catalog's field-level error UI with a native
     browser tooltip. Fixed by adding `noValidate` to the `<form>`,
     since this feature owns its own complete validation/error-display
     path (FR-011) and never needs the browser's competing one. The
     static surface was unaffected (it never sets a native `required`
     attribute), confirmed by the fact only the React suite caught this.
  3. `wireDialogClose()`'s focus-return-on-close relies on
     `dialog._lastTrigger` being set before `showModal()` — since the
     static DataTable's create/edit/confirm dialogs open programmatically
     (not via `initDialogTriggers()`'s `[data-dialog-trigger]` discovery
     loop), every call site (`openForm`/`openConfirm`) explicitly sets
     `dialog._lastTrigger` to the button that triggered it, matching the
     pattern `initDialogTriggers()` uses internally.
  4. The static surface's `render()` rebuilds the whole subtree
     (`container.innerHTML = ""`) on every state change, which destroyed
     and recreated the "Columns" visibility `<details>` element on every
     single interaction — including a click on one of its own checkboxes
     — resetting `open` back to closed by default and making the menu
     appear to close itself the instant a checkbox was toggled. Fixed
     with a closure-scoped `columnsMenuOpen` flag, restored onto the
     fresh `<details>` element each render and kept in sync via its
     native `toggle` event.
  5. The "Columns" dropdown panel was `absolute right-0`, anchoring its
     right edge to the (narrow) `<summary>` element's own right edge
     rather than to the viewport. At 320px, where the toolbar wraps and
     the `<summary>` sits left-of-center, the 192px-wide panel rendered
     from roughly `x: -78` to `x: 114` — entirely off-screen to the left,
     making its checkboxes unclickable. Caught only by the
     `chromium-320` Playwright project, not any wider one. Fixed with
     `left-0 sm:left-auto sm:right-0` on both surfaces.
- **Column-visibility toggling (FR-013/T040) is fully implemented**, not
  descoped: a native `<details>/<summary>` disclosure (matching this
  catalog's Accordion/TreeView convention) with one checkbox per column,
  toggling membership in a `hiddenColumnIds` set on both surfaces,
  without resetting sort/filter/page/selection. (An earlier draft of
  this note incorrectly described this as descoped for this pass — it
  was completed in the same implementation session, including the two
  bugs above that were specific to it.)
- 204 Playwright tests (17 static + 17 React scenarios × 6 browser/
  viewport projects — chromium-320/768/1024/1440, firefox-1440,
  webkit-1440) all pass; the full pre-existing suite (180 tests across
  Table/Theme/Localized-Inputs/Chart specs) still passes with zero
  regressions.
