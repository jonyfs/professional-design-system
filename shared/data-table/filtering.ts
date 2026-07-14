import type { ColumnDefinition, DataTableRow, FilterState } from "./types";

// Global query OR-matches across every filterable column; per-column
// filters AND together with the global query and with each other —
// filtering only ever narrows the visible set (research.md R3).
export function applyFilter<T extends DataTableRow>(
  rows: T[],
  filterState: FilterState,
  columns: ColumnDefinition[],
): T[] {
  const filterableColumns = columns.filter((c) => c.filterable !== false);
  const query = filterState.globalQuery.trim().toLowerCase();
  const activeColumnFilters = Object.entries(filterState.columnFilters).filter(([, value]) => value.trim() !== "");

  return rows.filter((row) => {
    if (query) {
      const matchesGlobal = filterableColumns.some((column) =>
        String(row[column.id] ?? "")
          .toLowerCase()
          .includes(query),
      );
      if (!matchesGlobal) return false;
    }

    for (const [columnId, filterValue] of activeColumnFilters) {
      const column = filterableColumns.find((c) => c.id === columnId);
      if (!column) continue;
      const cellValue = String(row[columnId] ?? "").toLowerCase();
      if (!cellValue.includes(filterValue.trim().toLowerCase())) return false;
    }

    return true;
  });
}

export function isFilterActive(filterState: FilterState): boolean {
  return (
    filterState.globalQuery.trim() !== "" ||
    Object.values(filterState.columnFilters).some((value) => value.trim() !== "")
  );
}
