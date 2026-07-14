# Component Contract: Row Selection & Bulk Actions (User Story 2)

## Shared state module: `shared/data-table/selection.ts`

- `toggleRow(selection, rowId): RowSelection`
- `selectPage(selection, pageRowIds): RowSelection` — sets `scope: "page"`
- `selectAllMatching(selection, allFilteredRowIds): RowSelection` —
  sets `scope: "all-matching"`
- `clearSelection(): RowSelection` — `{ ids: new Set(), scope: "page" }`

## Markup contract

- Each row: a leading `<input type="checkbox">` cell, reusing this
  catalog's existing checkbox styling (`.checkbox-input` React class /
  static equivalent utility string) verbatim — never a custom checkbox
  visual.
- Header selection control: a `<button>` (not a checkbox) when more rows
  exist than the current page, opening a small choice between "Select
  this page (N)" and "Select all matching (M)" — a plain checkbox alone
  cannot express research.md R5's two-scope distinction; when the
  filtered set fits on one page, it degrades to a single checkbox
  (page-scope and all-matching-scope are identical in that case).
- Bulk-action toolbar: an in-flow `<div role="region"
  aria-label="Bulk actions">` rendered directly above the table
  (research.md R6), containing a "N selected" count and one `<button>`
  per available Bulk Action — rendered only when `selection.ids.size > 0`.

## Required behavior (FR mapping)

- Checking two or more rows shows the toolbar with the correct count and
  available actions (FR-008); unchecking back to zero hides it.
- The header selection control's two-scope choice is only offered when
  the filtered row count exceeds the current page size — otherwise a
  single "select all" checkbox is sufficient and unambiguous (FR-007).
- Changing `sortState`/`filterState` while a selection exists MUST
  surface (not silently resolve) whether the selection still applies —
  minimum acceptable implementation: the toolbar's "N selected" count is
  always the true, current count of `selection.ids` members still present
  in the (possibly new) filtered/sorted row set, making any change
  immediately visible rather than stale (spec.md Edge Cases, FR-007).
- Triggering a Bulk Action with `requiresConfirmation: true` opens a
  Modal-based confirm step (research.md R7) before the action's handler
  runs against `selection.ids` (FR-009).
- Triggering a Bulk Action while any row in `selection.ids` has an open,
  `isDirty` Record Edit/Create Form MUST block the action and surface the
  conflict to the user rather than silently overwriting or silently
  ignoring the in-progress edit (FR-017).
- Every checkbox, the header selection control, and every bulk-action
  button declares the full hover/active/focus-visible/disabled state set
  (FR-019).

## Acceptance mapping

- Spec.md US2 AC1–AC4 → this contract.
- FR-007, FR-008, FR-009, FR-017, FR-019 → this contract.
