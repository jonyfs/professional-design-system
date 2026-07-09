import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toggle } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

function ToggleDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Toggle</h1>

      <div className="mt-8 grid max-w-sm gap-8">
        <div data-testid="toggle-off-wrapper" className="p-1">
          <Toggle data-testid="toggle-off-input" label="Enable notifications" />
        </div>

        <div data-testid="toggle-on-wrapper" className="p-1">
          <Toggle label="Enable notifications" defaultChecked />
        </div>

        <div data-testid="toggle-disabled-on-wrapper" className="p-1">
          <Toggle
            data-testid="toggle-disabled-on-input"
            label="Enable notifications (disabled + on, Edge Case)"
            defaultChecked
            disabled
          />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToggleDemo />
  </StrictMode>,
);
