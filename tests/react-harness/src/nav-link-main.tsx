import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NavLink } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

function NavLinkDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">NavLink</h1>

      <nav
        aria-label="Documentation"
        data-testid="nav-link-group"
        className="mt-8 flex max-w-xs flex-col gap-1"
      >
        <NavLink href="#" current data-testid="nav-link-overview">
          Overview
        </NavLink>
        <NavLink href="#" data-testid="nav-link-installation">
          Installation
        </NavLink>
        <NavLink href="#" data-testid="nav-link-usage">
          Usage
        </NavLink>
        <NavLink href="#" data-testid="nav-link-api">
          API reference
        </NavLink>
      </nav>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NavLinkDemo />
  </StrictMode>,
);
