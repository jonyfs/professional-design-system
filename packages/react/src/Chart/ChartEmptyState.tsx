export interface ChartEmptyStateProps {
  message?: string;
}

// Reuses the catalog's existing empty-state recipe (feature 014,
// contracts/empty-state.contract.md) — a compositional pattern of
// already-ratified classes, no new component/token (FR-012).
export function ChartEmptyState({ message = "No data to display" }: ChartEmptyStateProps) {
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
      <p className="text-sm font-semibold text-neutral-900">{message}</p>
    </div>
  );
}
