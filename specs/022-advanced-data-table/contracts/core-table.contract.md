# Component Contract: Core Table — Sort, Filter, Paginate (User Story 1)

## Shared state module: `shared/data-table/`

- `sorting.ts`: `applySort(rows, sortState, columns)`, `toggleSort(sortState, columnId): SortEntry[]` (cycles asc → desc → removed per research.md R2)
- `filtering.ts`: `applyFilter(rows, filterState, columns)`
- `pagination.ts`: `paginate(rows, page, pageSize)`, `pageCount(totalRows, pageSize)`

All three are pure functions operating on plain arrays/objects — no DOM,
no framework dependency, consumed identically by `src/scripts/
data-table.js` and `packages/react/src/hooks/useDataTable.ts`.

## Markup contract (both surfaces)

- Column header for a `sortable` column: a real `<button>` inside the
  `<th>` (not the `<th>` itself made clickable — keeps the header cell's
  own `scope="col"` semantics intact), with `aria-sort` set on the parent
  `<th>` (`"ascending" | "descending" | "none"`) reflecting that column's
  current `SortEntry`, if any.
- Global filter: a single `<input type="search">` above the table,
  labeled "Search".
- Per-column filter (when `filterable`): an `<input>` in a filter row
  immediately below the header row, one per filterable column.
- Pagination: reuses `.pagination-nav`/`.pagination-link`/
  `.pagination-control` verbatim (research.md R4) — no new pagination
  markup.
- Empty state: `ChartEmptyState`-equivalent recipe (research.md R10)
  replaces the `<tbody>` content — never a `<tbody>` with zero `<tr>`s
  and no explanatory content.
- Live region: one `<p aria-live="polite" class="sr-only">` per table
  instance (research.md R9), updated with a short status string on sort/
  filter/page changes.

## Required behavior (FR mapping)

- Activating a sort button cycles that column asc → desc → unsorted
  (FR-002); Shift-click (or an equivalent documented modifier) adds a
  second column to `sortState` without clearing the first (FR-003).
- Typing in the global search or a per-column filter re-applies
  `applyFilter()` and resets to page 1 (a filter changing the result set
  makes the previous page position meaningless) — sort remains applied
  (FR-004/FR-005).
- Navigating pages preserves `sortState`/`filterState` untouched
  (FR-005).
- Zero rows ever existing → "No data yet"; a filter matching zero rows →
  "No results match your filters" (FR-006, research.md R10) — determined
  by whether `filterState` is currently non-empty.
- A `sortable: false`/`filterable: false` column renders no sort
  button/filter input for that column (FR-015).
- Every sort button, filter input, and pagination control declares the
  full hover/active/focus-visible/disabled state set (FR-019).

## Acceptance mapping

- Spec.md US1 AC1–AC4 → this contract.
- FR-001–FR-006, FR-013, FR-015, FR-016 (sort/filter/page portion),
  FR-019 → this contract.
