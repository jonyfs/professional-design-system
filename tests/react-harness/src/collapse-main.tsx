import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Collapse } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

function CollapseDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Collapse</h1>

      <div className="mt-8 max-w-lg space-y-4">
        <Collapse label="Shipping details" data-testid="collapse-0">
          Standard shipping takes 3-5 business days within the continental US.
          Opening this panel does not close the one below it — the two are
          completely independent.
        </Collapse>

        <Collapse label="Return policy" data-testid="collapse-1">
          Items can be returned within 30 days of delivery for a full refund.
        </Collapse>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CollapseDemo />
  </StrictMode>,
);
