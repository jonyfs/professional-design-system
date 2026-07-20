import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NumberInput } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

function NumberInputDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Number Input</h1>
      <div className="mt-8 grid max-w-sm gap-8">
        <section data-testid="number-input-wrapper" className="space-y-1">
          <NumberInput
            data-testid="number-input"
            label="Quantity (0–10)"
            min={0}
            max={10}
            step={1}
            defaultValue={5}
          />
        </section>
        <section data-testid="number-input-disabled-wrapper" className="space-y-1">
          <NumberInput
            data-testid="number-input-disabled"
            label="Disabled"
            defaultValue={3}
            disabled
          />
        </section>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NumberInputDemo />
  </StrictMode>,
);
