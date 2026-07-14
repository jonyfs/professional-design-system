import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DataTable } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

const FIRST_NAMES = ["Jane", "Alex", "Sam", "Priya", "Wei", "Carlos", "Fatima", "Liam", "Noor", "Yuki"];
const LAST_NAMES = ["Cooper", "Morgan", "Silva", "Kim", "Chen", "Santos", "Ali", "Byrne", "Haddad", "Tanaka"];
const ROLES = ["Admin", "Editor", "Viewer"];

const rows = Array.from({ length: 1247 }, (_, i) => ({
  id: `row-${i + 1}`,
  name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 3) % LAST_NAMES.length]}`,
  email: `user${i + 1}@example.com`,
  role: ROLES[i % ROLES.length],
}));

const columns = [
  { id: "name", label: "Name", sortable: true, filterable: true },
  { id: "email", label: "Email", sortable: true, filterable: true },
  { id: "role", label: "Role", sortable: true, filterable: true },
];

function DataTableDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Data Table</h1>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Read-only (1,247 rows)</h2>
      <div className="mt-4" data-testid="data-table-readonly">
        <DataTable columns={columns} rows={rows} ariaLabel="Users, read-only" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Selectable + bulk actions</h2>
      <div className="mt-4" data-testid="data-table-selectable">
        <DataTable
          columns={columns}
          rows={rows.slice(0, 25)}
          ariaLabel="Users, selectable"
          bulkActions={[
            { id: "delete", label: "Delete selected", requiresConfirmation: true },
            { id: "tag", label: "Tag as reviewed" },
          ]}
        />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Full CRUD</h2>
      <div className="mt-4" data-testid="data-table-crud">
        <DataTable
          columns={columns}
          rows={rows.slice(0, 10)}
          ariaLabel="Users, full CRUD"
          crud={{ create: true, edit: true, delete: true }}
          fields={[
            { id: "name", label: "Name", required: true },
            { id: "email", label: "Email", required: true },
            { id: "role", label: "Role" },
          ]}
        />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Empty (no data yet)</h2>
      <div className="mt-4" data-testid="data-table-empty">
        <DataTable columns={columns} rows={[]} ariaLabel="Users, empty" crud={{ create: true }} />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataTableDemo />
  </StrictMode>,
);
