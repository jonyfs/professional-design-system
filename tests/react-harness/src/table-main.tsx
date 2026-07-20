import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Table } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

const columns = ["Name", "Email", "Role"];
const rows = [
  { cells: ["Jane Cooper", "jane.cooper@example.com", "Admin"] },
  { cells: ["Alex Morgan", "alex.morgan@example.com", "Engineering Manager"] },
];

function TableDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Table</h1>
      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Baseline</h2>
      <div className="mt-4">
        <Table
          data-testid="table-baseline"
          columns={columns}
          rows={rows}
          ariaLabel="Baseline table, scrollable horizontally"
        />
      </div>
      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Zebra-striped</h2>
      <div className="mt-4">
        <Table
          data-testid="table-zebra"
          columns={columns}
          rows={rows}
          zebra
          ariaLabel="Zebra-striped table, scrollable horizontally"
        />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TableDemo />
  </StrictMode>,
);
