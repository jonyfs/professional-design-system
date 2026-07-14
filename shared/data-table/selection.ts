import type { RowSelection } from "./types";

export function emptySelection(): RowSelection {
  return { ids: new Set(), scope: "page" };
}

export function toggleRow(selection: RowSelection, rowId: string): RowSelection {
  const next = new Set(selection.ids);
  next.has(rowId) ? next.delete(rowId) : next.add(rowId);
  return { ids: next, scope: selection.scope };
}

export function selectPage(selection: RowSelection, pageRowIds: string[]): RowSelection {
  return { ids: new Set(pageRowIds), scope: "page" };
}

export function selectAllMatching(selection: RowSelection, allFilteredRowIds: string[]): RowSelection {
  return { ids: new Set(allFilteredRowIds), scope: "all-matching" };
}

export function clearSelection(): RowSelection {
  return emptySelection();
}
