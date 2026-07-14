// Shared, surface-agnostic MultiSelect logic (spec.md FR-003,
// contracts/form-inputs.contract.md). The one genuinely cross-surface
// piece of state in feature 023's US1 batch: chip add/remove plus the
// option-filter reused verbatim by BOTH src/scripts/multi-select.js and
// packages/react/src/MultiSelect/MultiSelect.tsx, so the two surfaces can
// never drift. All functions are pure and immutable — a fresh Set/array
// is always returned, never a mutation of the caller's input (matches
// shared/data-table/selection.ts's same discipline).

export interface MultiSelectOption {
  id: string;
  label: string;
}

/** Returns a new Set with `id` added — never mutates `selectedIds`. */
export function addSelection(selectedIds: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(selectedIds);
  next.add(id);
  return next;
}

/** Returns a new Set with `id` removed — never mutates `selectedIds`. */
export function removeSelection(selectedIds: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(selectedIds);
  next.delete(id);
  return next;
}

/**
 * Case-insensitive substring filter over the option list, mirroring
 * Combobox's existing `label.toLowerCase().includes(query.toLowerCase())`
 * match (combobox.js / useCombobox.ts). An empty/whitespace-only query
 * returns a copy of the full list.
 */
export function filterOptions(
  options: readonly MultiSelectOption[],
  query: string,
): MultiSelectOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...options];
  return options.filter((option) => option.label.toLowerCase().includes(q));
}
