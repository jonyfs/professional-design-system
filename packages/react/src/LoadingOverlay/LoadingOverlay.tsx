import type { ReactNode } from "react";

export interface LoadingOverlayProps {
  children: ReactNode;
  isLoading: boolean;
  "data-testid"?: string;
}

// Feature 032 (contracts/loading-overlay.contract.md) — reuses
// Spinner's exact markup inside a container-scoped overlay. The
// visual block comes from DOM stacking; aria-busy is the explicit
// accessible signal for the non-interactive state.
export function LoadingOverlay({
  children,
  isLoading,
  "data-testid": testId,
}: LoadingOverlayProps) {
  return (
    <div className="loading-overlay-container" aria-busy={isLoading} data-testid={testId}>
      {children}
      {isLoading && (
        <div role="status" className="loading-overlay">
          <span className="sr-only">Loading</span>
          <svg
            className="spinner spinner-lg motion-reduce:animate-none"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
