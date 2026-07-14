export interface DataTableEmptyStateProps {
  /** Whether any filter/global-query is currently active (FR-006, research.md R10) */
  isFiltered: boolean;
}

// Reuses the catalog's existing empty-state recipe (feature 014,
// contracts/empty-state.contract.md) — distinguishes a genuinely empty
// dataset from a filter matching zero rows, never one generic message.
export function DataTableEmptyState({ isFiltered }: DataTableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <svg aria-hidden="true" className="h-10 w-10 text-neutral-400" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 3v18h18M7 15l4-4 3 3 5-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-sm font-semibold text-neutral-900">
        {isFiltered ? "No results match your filters" : "No data yet"}
      </p>
    </div>
  );
}
