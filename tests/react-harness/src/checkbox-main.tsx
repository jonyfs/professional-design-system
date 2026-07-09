import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Checkbox } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

function CheckboxDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Checkbox</h1>

      <div className="mt-8 grid max-w-sm gap-6">
        <div data-testid="checkbox-unchecked-wrapper" className="p-1">
          <Checkbox data-testid="checkbox-unchecked" label="Unchecked" />
        </div>

        <div data-testid="checkbox-checked-wrapper" className="p-1">
          <Checkbox data-testid="checkbox-checked" label="Checked" defaultChecked />
        </div>

        <div data-testid="checkbox-disabled-wrapper" className="flex flex-col gap-3 p-1">
          <Checkbox data-testid="checkbox-disabled" label="Disabled" disabled />
          <Checkbox
            data-testid="checkbox-disabled-checked"
            label="Disabled + checked (Edge Case)"
            disabled
            defaultChecked
          />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CheckboxDemo />
  </StrictMode>,
);
