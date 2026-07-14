import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { SplitButton } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

function SplitButtonDemo() {
  const [result, setResult] = useState("");

  const menuActions = [
    { id: "split-item-draft", label: "Save as draft", onSelect: () => setResult("Ran: Save as draft") },
    { id: "split-item-template", label: "Save as template", onSelect: () => setResult("Ran: Save as template") },
    { id: "split-item-copy", label: "Save a copy", onSelect: () => setResult("Ran: Save a copy"), disabled: true },
    { id: "split-item-all", label: "Save all", onSelect: () => setResult("Ran: Save all") },
  ];

  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Split Button</h1>
      {/* flex justify-end: gives the right-aligned Dropdown Menu panel room
          to open without going off-screen at any viewport width (same
          rationale as dropdown-menu.html's own comment). */}
      <div className="mt-8 flex justify-end">
        <SplitButton
          primaryLabel="Save"
          ariaLabel="Save"
          toggleAriaLabel="More save options"
          onPrimary={() => setResult("Ran: Save")}
          menuActions={menuActions}
          primaryTestId="split-button-primary"
          triggerTestId="split-button-trigger"
          panelTestId="split-button-menu"
        />
      </div>
      <p data-testid="split-button-result" aria-live="polite" className="mt-6 text-sm text-neutral-600">
        {result}
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SplitButtonDemo />
  </StrictMode>,
);
