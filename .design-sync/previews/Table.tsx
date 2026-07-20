import { Table } from "professional-design-system";

const columns = ["Name", "Role", "Status", "Last Active"];

const rows = [
  {
    cells: ["Elena Vasquez", "Design Lead", "Active", "Jul 11, 2026"],
  },
  {
    cells: ["Marcus Chen", "Senior Engineer", "Active", "Jul 10, 2026"],
  },
  {
    cells: ["Priya Nair", "Product Manager", "Away", "Jul 8, 2026"],
  },
  {
    cells: ["Sofia Torres", "Engineer", "Active", "Jul 11, 2026"],
  },
  {
    cells: ["Daniel Ortiz", "QA Engineer", "Offline", "Jul 2, 2026"],
  },
];

export function Default() {
  return (
    <div style={{ maxWidth: 640 }}>
      <Table columns={columns} rows={rows} ariaLabel="Team members" data-testid="team-table" />
    </div>
  );
}

export function ZebraStriped() {
  return (
    <div style={{ maxWidth: 640 }}>
      <Table columns={columns} rows={rows} zebra ariaLabel="Team members" data-testid="team-table-zebra" />
    </div>
  );
}

const invoiceColumns = ["Invoice", "Customer", "Amount", "Status"];

const invoiceRows = [
  {
    cells: [
      "INV-1042",
      "Northwind Traders",
      "$1,240.00",
      <span key="s" style={{ color: "#16a34a", fontWeight: 600 }}>
        Paid
      </span>,
    ],
  },
  {
    cells: [
      "INV-1041",
      "Contoso Ltd.",
      "$860.50",
      <span key="s" style={{ color: "#d97706", fontWeight: 600 }}>
        Pending
      </span>,
    ],
  },
  {
    cells: [
      "INV-1039",
      "Fabrikam Inc.",
      "$3,120.00",
      <span key="s" style={{ color: "#dc2626", fontWeight: 600 }}>
        Overdue
      </span>,
    ],
  },
  {
    cells: [
      "INV-1035",
      "Globex Corporation",
      "$540.00",
      <span key="s" style={{ color: "#16a34a", fontWeight: 600 }}>
        Paid
      </span>,
    ],
  },
];

export function InvoicesInContext() {
  return (
    <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Recent invoices</span>
      <Table
        columns={invoiceColumns}
        rows={invoiceRows}
        zebra
        ariaLabel="Recent invoices"
        data-testid="invoices-table"
      />
    </div>
  );
}
