import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Pagination } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

function PaginationDemo() {
  const [middlePage, setMiddlePage] = useState(3);
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Pagination</h1>

      <div className="mt-8 max-w-lg space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Middle page</h2>
          <Pagination
            data-testid="pagination"
            currentPage={middlePage}
            totalPages={10}
            onPageChange={setMiddlePage}
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">First page (Previous disabled)</h2>
          <Pagination data-testid="pagination-first" currentPage={1} totalPages={3} onPageChange={() => {}} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Last page (Next disabled)</h2>
          <Pagination data-testid="pagination-last" currentPage={3} totalPages={3} onPageChange={() => {}} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Single page (Edge Case)</h2>
          <Pagination data-testid="pagination-single" currentPage={1} totalPages={1} onPageChange={() => {}} />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PaginationDemo />
  </StrictMode>,
);
