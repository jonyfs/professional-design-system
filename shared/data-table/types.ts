export type DataTableRow = Record<string, unknown> & { id: string };

export interface ColumnDefinition {
  id: string;
  label: string;
  /** Columns with no meaningful sortable value (e.g. actions, avatar) MUST set this false (FR-015). */
  sortable?: boolean;
  /** Same exemption logic as sortable, for filter controls (FR-015). */
  filterable?: boolean;
  visible?: boolean;
}

export interface SortEntry {
  columnId: string;
  direction: "asc" | "desc";
}

export interface FilterState {
  globalQuery: string;
  columnFilters: Record<string, string>;
}

export type SelectionScope = "page" | "all-matching";

export interface RowSelection {
  ids: Set<string>;
  scope: SelectionScope;
}

export interface BulkAction {
  id: string;
  label: string;
  requiresConfirmation?: boolean;
  onTrigger: (selectedIds: string[]) => void;
}

export type CrudConfig = {
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
};

export interface RecordFormState {
  mode: "create" | "edit";
  recordId?: string;
  values: Record<string, string>;
  fieldErrors: Record<string, string>;
  isDirty: boolean;
}
