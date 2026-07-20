import { useState } from "react";
import { Pagination } from "professional-design-system";

export function Default() {
  const [page, setPage] = useState(1);
  return (
    <div style={{ maxWidth: 480 }}>
      <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
    </div>
  );
}

export function MiddleOfRange() {
  const [page, setPage] = useState(6);
  return (
    <div style={{ maxWidth: 480 }}>
      <Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
    </div>
  );
}

export function InContext() {
  const [page, setPage] = useState(9);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>
        Showing 81–90 of 90 invoices
      </div>
      <Pagination currentPage={page} totalPages={9} onPageChange={setPage} />
    </div>
  );
}
