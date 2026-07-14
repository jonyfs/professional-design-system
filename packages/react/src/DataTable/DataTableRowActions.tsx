import type { CrudConfig } from "../../../../shared/data-table/types";

export interface DataTableRowActionsProps {
  crud: CrudConfig;
  onEdit?: () => void;
  onDelete?: () => void;
}

// contracts/crud-operations.contract.md — up to 3 icon buttons, only the
// ones this instance's `crud` config enables (never present-but-disabled,
// spec.md US3 AC5). "View" is intentionally not modeled here: opening a
// row for view-only is the same edit-form UI without a submit action,
// left to the consumer to compose from `onEdit` if needed.
export function DataTableRowActions({ crud, onEdit, onDelete }: DataTableRowActionsProps) {
  if (!crud.edit && !crud.delete) return null;

  return (
    <div className="flex items-center justify-end gap-1">
      {crud.edit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit row"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-neutral-600
            hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      {crud.delete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete row"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-neutral-600
            hover:bg-error/5 hover:text-error-strong active:bg-error/10
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
