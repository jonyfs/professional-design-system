import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DropdownMenu } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

const items = [
  { id: "dropdown-item-edit", label: "Edit", onSelect: () => {} },
  { id: "dropdown-item-duplicate", label: "Duplicate", onSelect: () => {} },
  { id: "dropdown-item-archive", label: "Archive", onSelect: () => {}, disabled: true },
  { id: "dropdown-item-delete", label: "Delete", onSelect: () => {} },
];

function DropdownMenuDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Dropdown Menu</h1>
      {/* flex justify-end: gives the right-aligned panel room to open
          without going off-screen at any viewport width — see
          src/components/dropdown-menu/dropdown-menu.html's identical
          comment for the full rationale. */}
      <div className="mt-8 flex justify-end">
        <DropdownMenu
          trigger="More actions"
          triggerTestId="dropdown-trigger"
          panelTestId="dropdown-menu"
          items={items}
        />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DropdownMenuDemo />
  </StrictMode>,
);
