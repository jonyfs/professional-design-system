# Phase 1 Data Model: Advanced Data Table

## Data Table Instance

- **rows**: the caller-supplied dataset (an array of records) — this
  feature never fetches or persists it (spec.md Assumptions).
- **columns**: ordered `ColumnDefinition[]` (below).
- **sortState**: `SortEntry[]` (research.md R2) — empty array means
  unsorted/default order.
- **filterState**: `{ globalQuery: string; columnFilters:
  Record<string, string> }` (research.md R3).
- **page**, **pageSize**: current pagination position (research.md R4).
- **selection**: `RowSelection` (below).
- **crud**: which of create/edit/delete are enabled for this instance
  (spec.md FR-010 — each independently on/off) plus the current
  **Record Edit/Create Form** state, if one is open.
- Relationship: exactly one Data Table Instance owns one of each of the
  above — no shared/global table state across instances on the same
  page.

## Column Definition

- **id**: stable identifier matching a key on each row record.
- **label**: display header text.
- **sortable**: boolean — columns with no meaningful sortable value
  (e.g. an actions or avatar column, spec.md FR-015) MUST set this
  `false`, suppressing the sort control entirely for that column.
- **filterable**: boolean — same exemption logic as `sortable`, for
  per-column filter controls and the global-query match set (FR-015).
- **visible**: boolean — toggled by the column-visibility control
  (FR-013) without resetting `sortState`/`filterState`/`page`/`selection`.

## Sort Entry

- **columnId**: which `ColumnDefinition.id` this entry sorts by.
- **direction**: `"asc" | "desc"`.
- Relationship: `sortState` is an ordered list of these — position in
  the array is sort precedence (research.md R2); a column with no entry
  in `sortState` is not currently sorted by.

## Row Selection

- **ids**: the `Set` of currently selected row ids.
- **scope**: `"page" | "all-matching"` — which of the two "select all"
  actions produced the current `ids` set (research.md R5); individual
  per-row toggles do not change `scope`.
- Relationship: exactly one Row Selection per Data Table Instance;
  cleared (empty `ids`) hides the Bulk Action toolbar entirely (FR-008).

## Bulk Action

- **id**: which caller-provided action this is (e.g. `"delete"`,
  `"export"`, `"tag"`).
- **label**: display text shown in the toolbar.
- **requiresConfirmation**: boolean — irreversible actions (e.g. bulk
  delete) MUST set this `true` (FR-009), gating on a Modal confirm step
  before the action's own handler runs.
- Relationship: Bulk Actions are caller-supplied per Data Table
  Instance, applied to the current Row Selection's `ids` when
  triggered.

## Record Edit/Create Form

- **mode**: `"create" | "edit"`.
- **recordId**: the row id being edited, or `undefined` for `"create"`.
- **values**: the current field values being entered/changed.
- **fieldErrors**: `Record<fieldId, string>` — populated on failed
  validation (FR-011), field-scoped so unrelated fields' values are
  never discarded on a partial validation failure.
- **isDirty**: whether `values` differs from the record's original
  values (or is non-empty, for `"create"`) — gates the "discard unsaved
  input" warning (FR-018) when a sort/filter/page-size/column-visibility
  change is attempted while this form is open.
- Relationship: at most one Record Edit/Create Form open per Data Table
  Instance at a time (opening a second implicitly means the first was
  already submitted or discarded — no stacked forms).

## Cross-cutting invariants

- Changing `sortState`, `filterState`, `page`, or `pageSize` never
  clears `selection` implicitly — per spec.md Edge Cases, the system
  must "clearly indicate" whether a prior selection still applies to the
  now-different visible rows, never silently drop or silently keep it
  unexamined (data-model does not prescribe the exact UI treatment here;
  contracts/selection-bulk-actions.contract.md does).
- A Bulk Action MUST NOT run while a Record Edit/Create Form with
  `isDirty === true` targets one of the rows in the current `selection.ids`
  — FR-017's conflict-prevention rule.
- `crud.create`/`crud.edit`/`crud.delete` being `false` means the
  corresponding UI affordance is not rendered at all, not merely
  disabled (spec.md US3 AC5) — a read-only table has zero CRUD DOM
  nodes, not hidden/disabled ones.
