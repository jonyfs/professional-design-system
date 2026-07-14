import { useId, useMemo, useState } from "react";
import {
  applyFilter,
  applySort,
  clearSelection,
  emptySelection,
  isFilterActive,
  pageCount,
  paginate,
  selectAllMatching,
  selectPage,
  toggleRow,
  toggleSort,
  type BulkAction,
  type ColumnDefinition,
  type CrudConfig,
  type DataTableRow,
  type FilterState,
  type SortEntry,
} from "../../../../shared/data-table";
import { DataTableEmptyState } from "./DataTableEmptyState";
import { DataTableForm, type DataTableFieldDefinition } from "./DataTableForm";
import { DataTableRowActions } from "./DataTableRowActions";
import { DataTableToolbar } from "./DataTableToolbar";
import { Modal } from "../Modal/Modal";

export interface DataTableProps {
  columns: ColumnDefinition[];
  rows: DataTableRow[];
  ariaLabel: string;
  pageSize?: number;
  bulkActions?: Array<Pick<BulkAction, "id" | "label" | "requiresConfirmation">>;
  crud?: CrudConfig;
  fields?: DataTableFieldDefinition[];
  onCreate?: (values: Record<string, string>) => void;
  onEdit?: (id: string, values: Record<string, string>) => void;
  onDelete?: (id: string) => void;
  onBulkAction?: (actionId: string, selectedIds: string[]) => void;
}

function sortIcon(direction: SortEntry["direction"] | undefined) {
  if (direction === "asc") return "▲";
  if (direction === "desc") return "▼";
  return "↕";
}

// contracts/core-table.contract.md, selection-bulk-actions.contract.md,
// crud-operations.contract.md — the top-level DataTable component. Owns
// its own copy of `rows` (spec.md Assumptions: data source is
// caller-supplied, this component reflects CRUD results immediately
// without requiring the parent to manage table-internal state).
export function DataTable({
  columns,
  rows: initialRows,
  ariaLabel,
  pageSize = 10,
  bulkActions = [],
  crud = {},
  fields,
  onCreate,
  onEdit,
  onDelete,
  onBulkAction,
}: DataTableProps) {
  const tableId = useId();
  const [rows, setRows] = useState<DataTableRow[]>(initialRows);
  const [sortState, setSortState] = useState<SortEntry[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({ globalQuery: "", columnFilters: {} });
  const [page, setPage] = useState(1);
  const [hiddenColumnIds, setHiddenColumnIds] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState(emptySelection());
  const [statusMessage, setStatusMessage] = useState("");
  const [formState, setFormState] = useState<{ mode: "create" | "edit"; rowId?: string } | null>(null);
  const [deleteRowId, setDeleteRowId] = useState<string | null>(null);

  const visibleColumns = columns.filter((c) => !hiddenColumnIds.has(c.id));
  const editableFields: DataTableFieldDefinition[] =
    fields ?? columns.filter((c) => c.id !== "actions").map((c) => ({ id: c.id, label: c.label }));

  const filteredRows = useMemo(() => applyFilter(rows, filterState, columns), [rows, filterState, columns]);
  const sortedRows = useMemo(() => applySort(filteredRows, sortState, columns), [filteredRows, sortState, columns]);
  const totalPages = pageCount(sortedRows.length, pageSize);
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(() => paginate(sortedRows, currentPage, pageSize), [sortedRows, currentPage, pageSize]);

  const announce = (message: string) => setStatusMessage(message);

  const handleSort = (columnId: string) => {
    const next = toggleSort(sortState, columnId);
    setSortState(next);
    const entry = next.find((e) => e.columnId === columnId);
    announce(entry ? `Sorted by ${columnId}, ${entry.direction}ending` : `Sort removed for ${columnId}`);
  };

  const handleGlobalFilter = (value: string) => {
    setFilterState((prev) => ({ ...prev, globalQuery: value }));
    setPage(1);
  };

  const handleColumnFilter = (columnId: string, value: string) => {
    setFilterState((prev) => ({ ...prev, columnFilters: { ...prev.columnFilters, [columnId]: value } }));
    setPage(1);
  };

  const pageRowIds = pageRows.map((r) => r.id);
  const allMatchingIds = sortedRows.map((r) => r.id);
  const hasMoreThanOnePage = sortedRows.length > pageSize;

  const bulkActionsResolved: BulkAction[] = bulkActions.map((a) => ({
    id: a.id,
    label: a.label,
    requiresConfirmation: a.requiresConfirmation,
    onTrigger: (ids: string[]) => {
      onBulkAction?.(a.id, ids);
      announce(`${a.label} applied to ${ids.length} row${ids.length === 1 ? "" : "s"}`);
      setSelection(clearSelection());
    },
  }));

  const openCreate = () => setFormState({ mode: "create" });
  const openEdit = (rowId: string) => setFormState({ mode: "edit", rowId });

  const validate = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    for (const field of editableFields) {
      if (field.required && !values[field.id]?.trim()) {
        errors[field.id] = `${field.label} is required.`;
      }
    }
    return errors;
  };

  const handleSubmit = (values: Record<string, string>) => {
    if (formState?.mode === "create") {
      const newRow = { id: `row-${Date.now()}`, ...values } as DataTableRow;
      setRows((prev) => [...prev, newRow]);
      onCreate?.(values);
      announce("Record created");
    } else if (formState?.mode === "edit" && formState.rowId) {
      setRows((prev) => prev.map((r) => (r.id === formState.rowId ? { ...r, ...values } : r)));
      onEdit?.(formState.rowId, values);
      announce("Record updated");
    }
  };

  const confirmDelete = () => {
    if (!deleteRowId) return;
    setRows((prev) => prev.filter((r) => r.id !== deleteRowId));
    onDelete?.(deleteRowId);
    announce("Record deleted");
    setDeleteRowId(null);
  };

  const editingRow = formState?.mode === "edit" ? rows.find((r) => r.id === formState.rowId) : undefined;

  return (
    <div>
      <p id={`${tableId}-status`} aria-live="polite" className="sr-only">
        {statusMessage}
      </p>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          aria-label="Search"
          placeholder="Search…"
          value={filterState.globalQuery}
          onChange={(e) => handleGlobalFilter(e.target.value)}
          className="block w-full max-w-xs rounded-md border-0 py-1.5 text-neutral-900 shadow-sm
            ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-600
            focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
        />
        <div className="flex items-center gap-3">
          {/* Column visibility (FR-013) — native <details>/<summary>
              disclosure, this catalog's zero-JS-friendly convention
              (Accordion), rather than a bespoke dropdown. */}
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              Columns
            </summary>
            <div className="absolute left-0 z-10 mt-1 w-48 rounded-md border border-neutral-200 bg-neutral-50 p-2 shadow-lg sm:left-auto sm:right-0">
              {columns.map((column) => (
                <label key={column.id} className="flex items-center gap-2 rounded-sm px-2 py-1 text-sm text-neutral-900 hover:bg-neutral-100">
                  <input
                    type="checkbox"
                    checked={!hiddenColumnIds.has(column.id)}
                    onChange={() =>
                      setHiddenColumnIds((prev) => {
                        const next = new Set(prev);
                        next.has(column.id) ? next.delete(column.id) : next.add(column.id);
                        return next;
                      })
                    }
                    className="h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  />
                  {column.label}
                </label>
              ))}
            </div>
          </details>
          {crud.create && (
            <button type="button" className="btn-primary" onClick={openCreate}>
              Add record
            </button>
          )}
        </div>
      </div>

      <DataTableToolbar
        selectedCount={selection.ids.size}
        actions={bulkActionsResolved}
        selectedIds={[...selection.ids]}
      />

      {pageRows.length === 0 ? (
        <DataTableEmptyState isFiltered={isFilterActive(filterState)} />
      ) : (
        <div className="data-table-wrapper" tabIndex={0} role="region" aria-label={ariaLabel}>
          <table className="data-table" aria-describedby={`${tableId}-status`}>
            <thead>
              <tr>
                <th className="data-table-header-cell" scope="col">
                  <input
                    type="checkbox"
                    aria-label={hasMoreThanOnePage ? "Select this page" : "Select all"}
                    checked={pageRowIds.every((id) => selection.ids.has(id)) && pageRowIds.length > 0}
                    onChange={() =>
                      setSelection((prev) =>
                        pageRowIds.every((id) => prev.ids.has(id)) ? clearSelection() : selectPage(prev, pageRowIds),
                      )
                    }
                    className="h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  />
                </th>
                {visibleColumns.map((column) => (
                  <th
                    key={column.id}
                    className="data-table-header-cell"
                    scope="col"
                    aria-sort={
                      column.sortable === false
                        ? undefined
                        : (() => {
                            const entry = sortState.find((e) => e.columnId === column.id);
                            return entry ? (entry.direction === "asc" ? "ascending" : "descending") : "none";
                          })()
                    }
                  >
                    {column.sortable === false ? (
                      column.label
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSort(column.id)}
                        className="inline-flex items-center gap-1 hover:text-neutral-900 active:text-neutral-700
                          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                          focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {column.label}
                        <span aria-hidden="true">
                          {sortIcon(sortState.find((e) => e.columnId === column.id)?.direction)}
                        </span>
                      </button>
                    )}
                  </th>
                ))}
                {(crud.edit || crud.delete) && (
                  <th className="data-table-header-cell" scope="col">
                    Actions
                  </th>
                )}
              </tr>
              {visibleColumns.some((c) => c.filterable !== false) && (
                <tr>
                  <td className="data-table-cell" />
                  {visibleColumns.map((column) => (
                    <td key={column.id} className="data-table-cell">
                      {column.filterable !== false && (
                        <input
                          type="text"
                          aria-label={`Filter ${column.label}`}
                          value={filterState.columnFilters[column.id] ?? ""}
                          onChange={(e) => handleColumnFilter(column.id, e.target.value)}
                          className="block w-full rounded-md border-0 py-1 text-xs text-neutral-900 shadow-sm
                            ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-brand"
                        />
                      )}
                    </td>
                  ))}
                  {(crud.edit || crud.delete) && <td className="data-table-cell" />}
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-neutral-50">
              {pageRows.map((row) => (
                <tr key={row.id}>
                  <td className="data-table-cell">
                    <input
                      type="checkbox"
                      aria-label={`Select row ${row.id}`}
                      checked={selection.ids.has(row.id)}
                      onChange={() => setSelection((prev) => toggleRow(prev, row.id))}
                      className="h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    />
                  </td>
                  {visibleColumns.map((column) => (
                    <td key={column.id} className="data-table-cell">
                      {String(row[column.id] ?? "")}
                    </td>
                  ))}
                  {(crud.edit || crud.delete) && (
                    <td className="data-table-cell">
                      <DataTableRowActions
                        crud={crud}
                        onEdit={() => openEdit(row.id)}
                        onDelete={() => setDeleteRowId(row.id)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="pagination-nav mt-4" aria-label="Table pagination">
          <button
            type="button"
            className="pagination-control"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-neutral-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="pagination-control"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </button>
        </nav>
      )}

      {hasMoreThanOnePage && selection.ids.size > 0 && (
        <button
          type="button"
          className="mt-2 text-xs font-medium text-brand hover:text-brand-dark"
          onClick={() =>
            setSelection((prev) =>
              prev.scope === "all-matching" ? selectPage(prev, pageRowIds) : selectAllMatching(prev, allMatchingIds),
            )
          }
        >
          {selection.scope === "all-matching"
            ? `Select this page only (${pageRowIds.length})`
            : `Select all ${allMatchingIds.length} matching rows`}
        </button>
      )}

      {(crud.create || crud.edit) && (
        <DataTableForm
          // Remounts whenever the target record changes — DataTableForm's
          // `values` state is only ever initialized once (React useState's
          // initializer runs on first mount only), so reusing one instance
          // across "create" -> "edit row A" -> "edit row B" would otherwise
          // keep showing whichever values were first mounted with.
          key={formState ? `${formState.mode}-${formState.rowId ?? "new"}` : "closed"}
          open={formState !== null}
          mode={formState?.mode ?? "create"}
          fields={editableFields}
          initialValues={editingRow ? Object.fromEntries(editableFields.map((f) => [f.id, String(editingRow[f.id] ?? "")])) : undefined}
          onValidate={validate}
          onSubmit={handleSubmit}
          onClose={() => setFormState(null)}
        />
      )}

      {crud.delete && (
        <Modal open={deleteRowId !== null} onClose={() => setDeleteRowId(null)} title="Delete record">
          <p className="text-sm text-neutral-600">This action cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setDeleteRowId(null)}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
