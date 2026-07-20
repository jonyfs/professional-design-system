import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Select } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

const countryOptions = [
  { value: "", label: "Select a country…" },
  { value: "br", label: "Brazil" },
  { value: "us", label: "United States" },
  { value: "pt", label: "Portugal" },
];

function SelectDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Select</h1>

      <div className="mt-8 grid max-w-sm gap-8">
        <section data-testid="select-default-wrapper" className="space-y-1">
          <h2 className="text-sm font-semibold text-neutral-600">Default / focus</h2>
          <Select data-testid="select-default" label="Country" options={countryOptions} />
        </section>

        <section data-testid="select-error-wrapper" className="space-y-1">
          <h2 className="text-sm font-semibold text-neutral-600">Error</h2>
          <Select
            data-testid="select-error"
            label="Country"
            options={countryOptions}
            error="Please select a country."
          />
        </section>

        <section data-testid="select-disabled-wrapper" className="space-y-1">
          <h2 className="text-sm font-semibold text-neutral-600">Disabled</h2>
          <Select
            data-testid="select-disabled"
            label="Country"
            disabled
            defaultValue="br"
            options={[
              { value: "br", label: "Brazil" },
              { value: "us", label: "United States" },
            ]}
          />
        </section>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SelectDemo />
  </StrictMode>,
);
