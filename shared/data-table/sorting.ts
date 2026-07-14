import type { ColumnDefinition, DataTableRow, SortEntry } from "./types";

// Cycles a column through asc -> desc -> removed (research.md R2). Other
// columns' entries are left untouched, so multi-column sort is simply
// "more than one entry in the array" — no separate code path.
export function toggleSort(sortState: SortEntry[], columnId: string): SortEntry[] {
  const existing = sortState.find((entry) => entry.columnId === columnId);
  if (!existing) {
    return [...sortState, { columnId, direction: "asc" }];
  }
  if (existing.direction === "asc") {
    return sortState.map((entry) => (entry.columnId === columnId ? { ...entry, direction: "desc" } : entry));
  }
  return sortState.filter((entry) => entry.columnId !== columnId);
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

export function applySort<T extends DataTableRow>(
  rows: T[],
  sortState: SortEntry[],
  columns: ColumnDefinition[],
): T[] {
  const sortableIds = new Set(columns.filter((c) => c.sortable !== false).map((c) => c.id));
  const activeSort = sortState.filter((entry) => sortableIds.has(entry.columnId));
  if (activeSort.length === 0) return rows;

  return [...rows].sort((a, b) => {
    for (const { columnId, direction } of activeSort) {
      const result = compareValues(a[columnId], b[columnId]);
      if (result !== 0) return direction === "asc" ? result : -result;
    }
    return 0;
  });
}
