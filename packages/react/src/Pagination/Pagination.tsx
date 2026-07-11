export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  "data-testid"?: string;
}

type PageEntry = number | "ellipsis";

// The static reference (src/components/pagination/pagination.html) has
// zero JavaScript — every demo page-state is hand-authored HTML, not the
// output of a computed algorithm. There is no truncation *logic* to port
// verbatim (data-model.md); this is a straightforward, generic page-window
// function matching the ratified contract (genuinely-disabled boundaries +
// aria-current), not one specific hardcoded ellipsis layout.
function getPageWindow(current: number, total: number): PageEntry[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const shown = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...shown].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: PageEntry[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
      clipRule="evenodd"
    />
  </svg>
);

// Direct port of pagination.html (feature 007) — genuinely-disabled
// Previous/Next at the boundaries (a real <button disabled>, not a
// dimmed <a>), truncated page numbers for large ranges.
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  "data-testid": testId,
}: PaginationProps) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;
  const pages = getPageWindow(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" data-testid={testId} className="pagination-nav">
      {isFirst ? (
        <button type="button" className="pagination-control" disabled data-testid={testId && `${testId}-prev`}>
          <ChevronLeftIcon />
          Previous
        </button>
      ) : (
        <button
          type="button"
          className="pagination-control"
          onClick={() => onPageChange(currentPage - 1)}
          data-testid={testId && `${testId}-prev`}
        >
          <ChevronLeftIcon />
          Previous
        </button>
      )}
      <div className="flex items-center gap-1">
        {pages.map((entry, i) =>
          entry === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="pagination-ellipsis" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-current={entry === currentPage ? "page" : undefined}
              className="pagination-link"
              data-testid={testId && `${testId}-page-${entry}`}
            >
              {entry}
            </button>
          ),
        )}
      </div>
      {isLast ? (
        <button type="button" className="pagination-control" disabled data-testid={testId && `${testId}-next`}>
          Next
          <ChevronRightIcon />
        </button>
      ) : (
        <button
          type="button"
          className="pagination-control"
          onClick={() => onPageChange(currentPage + 1)}
          data-testid={testId && `${testId}-next`}
        >
          Next
          <ChevronRightIcon />
        </button>
      )}
    </nav>
  );
}
