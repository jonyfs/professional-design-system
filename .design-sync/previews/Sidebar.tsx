import { Sidebar } from "professional-design-system";

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "#dashboard" },
  { id: "projects", label: "Projects", href: "#projects", active: true },
  { id: "team", label: "Team", href: "#team" },
  { id: "analytics", label: "Analytics", href: "#analytics" },
  { id: "billing", label: "Billing", href: "#billing" },
  { id: "settings", label: "Settings", href: "#settings" },
  { id: "help", label: "Help & support", href: "#help" },
];

export function LightTheme() {
  return (
    <div style={{ height: 480, display: "flex" }}>
      <Sidebar theme="light" items={navItems} />
    </div>
  );
}

export function DarkTheme() {
  return (
    <div style={{ height: 480, display: "flex" }}>
      <Sidebar theme="dark" items={navItems} />
    </div>
  );
}

export function InContext() {
  return (
    <div
      style={{
        height: 480,
        display: "flex",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <Sidebar theme="light" items={navItems} />
      <div style={{ flex: 1, padding: 24, background: "#fafafa" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#111827" }}>Projects</h2>
        <p style={{ marginTop: 8, fontSize: 14, color: "#6b7280" }}>
          12 active projects across 3 teams. Checkout redesign is due Aug 14.
        </p>
      </div>
    </div>
  );
}
