// Feature 042 — all data below is static, bundled, and clearly
// fictional (spec.md FR-009): no real backend, no real user data.

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
}

export const teamMembers: TeamMember[] = [
  { id: "jane", name: "Jane Ito", initials: "JI", role: "Admin" },
  { id: "marco", name: "Marco Reyes", initials: "MR", role: "Member" },
  { id: "priya", name: "Priya Nair", initials: "PN", role: "Member" },
  { id: "sam", name: "Sam Okafor", initials: "SO", role: "Viewer" },
];

export interface Organization {
  id: string;
  name: string;
  avatarInitials: string;
}

export const organizations: Organization[] = [
  { id: "acme", name: "Acme Inc", avatarInitials: "AC" },
  { id: "globex", name: "Globex Corp", avatarInitials: "GC" },
  { id: "initech", name: "Initech", avatarInitials: "IN" },
];

export interface TableRow {
  id: string;
  name: string;
  status: "active" | "pending" | "churned";
  value: string;
  updatedAt: string;
}

export const tableRows: TableRow[] = [
  { id: "1", name: "Northwind Traders", status: "active", value: "$12,400", updatedAt: "2026-07-16" },
  { id: "2", name: "Contoso Ltd", status: "active", value: "$8,900", updatedAt: "2026-07-15" },
  { id: "3", name: "Fabrikam Inc", status: "pending", value: "$3,200", updatedAt: "2026-07-14" },
  { id: "4", name: "Tailspin Toys", status: "active", value: "$15,750", updatedAt: "2026-07-14" },
  { id: "5", name: "Wingtip Systems", status: "churned", value: "$0", updatedAt: "2026-07-10" },
  { id: "6", name: "Adatum Corp", status: "active", value: "$6,100", updatedAt: "2026-07-09" },
  { id: "7", name: "Proseware Inc", status: "pending", value: "$2,050", updatedAt: "2026-07-08" },
  { id: "8", name: "Relecloud", status: "active", value: "$9,875", updatedAt: "2026-07-07" },
];

export interface ChartPoint {
  label: string;
  value: number;
}

export const chartSeries: ChartPoint[] = [
  { label: "Jan", value: 42 },
  { label: "Feb", value: 48 },
  { label: "Mar", value: 51 },
  { label: "Apr", value: 47 },
  { label: "May", value: 58 },
  { label: "Jun", value: 63 },
  { label: "Jul", value: 71 },
];

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const notifications: Notification[] = [
  { id: "n1", message: "Northwind Traders upgraded to the Pro plan", timestamp: "2 hours ago", read: false },
  { id: "n2", message: "Weekly usage report is ready", timestamp: "5 hours ago", read: false },
  { id: "n3", message: "Priya Nair joined the workspace", timestamp: "1 day ago", read: true },
];

export interface Metric {
  label: string;
  value: string;
  trend: "up" | "down" | "flat";
}

export const metrics: Metric[] = [
  { label: "Monthly Recurring Revenue", value: "$58,240", trend: "up" },
  { label: "Active Accounts", value: "1,204", trend: "up" },
  { label: "Churn Rate", value: "2.1%", trend: "down" },
];
