import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Sidebar } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

const lightItems = [
  { id: "dashboard", label: "Dashboard", href: "#", active: true },
  { id: "projects", label: "Projects", href: "#" },
  { id: "team", label: "Team", href: "#" },
  { id: "long-label", label: "Quarterly Financial Reporting and Analytics Dashboard", href: "#" },
  { id: "settings", label: "Settings", href: "#" },
];

const darkItems = [
  { id: "dashboard", label: "Dashboard", href: "#", active: true },
  { id: "projects", label: "Projects", href: "#" },
  { id: "team", label: "Team", href: "#" },
  { id: "settings", label: "Settings", href: "#" },
];

function SidebarDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Sidebar</h1>
      <div className="mt-8 flex flex-wrap gap-6">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Light theme</h2>
          <Sidebar data-testid="sidebar-light" theme="light" items={lightItems} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Dark theme</h2>
          <Sidebar data-testid="sidebar-dark" theme="dark" items={darkItems} />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarDemo />
  </StrictMode>,
);
