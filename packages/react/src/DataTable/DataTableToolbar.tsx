import { useState } from "react";
import { Modal } from "../Modal/Modal";
import type { BulkAction } from "../../../../shared/data-table/types";

export interface DataTableToolbarProps {
  selectedCount: number;
  actions: BulkAction[];
  selectedIds: string[];
}

// contracts/selection-bulk-actions.contract.md — an in-flow region
// (research.md R6), rendered only when selectedCount > 0, one button per
// caller-supplied BulkAction, Modal-based confirmation for actions with
// requiresConfirmation (FR-008/FR-009).
export function DataTableToolbar({ selectedCount, actions, selectedIds }: DataTableToolbarProps) {
  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);

  if (selectedCount === 0) return null;

  const trigger = (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setPendingAction(action);
    } else {
      action.onTrigger(selectedIds);
    }
  };

  return (
    <div
      role="region"
      aria-label="Bulk actions"
      className="mb-2 flex items-center gap-3 rounded-md border border-neutral-200 bg-neutral-100 px-4 py-2"
    >
      <span className="text-sm font-medium text-neutral-900">{selectedCount} selected</span>
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => trigger(action)}
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700
              hover:bg-neutral-200 active:bg-neutral-300
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action.label}
          </button>
        ))}
      </div>

      <Modal
        open={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        title={`Confirm ${pendingAction?.label ?? ""}`}
      >
        <p className="text-sm text-neutral-600">
          Apply "{pendingAction?.label}" to {selectedCount} selected row{selectedCount === 1 ? "" : "s"}? This cannot
          be undone.
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={() => setPendingAction(null)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              pendingAction?.onTrigger(selectedIds);
              setPendingAction(null);
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}
