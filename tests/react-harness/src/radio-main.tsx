import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Radio } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

function RadioDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Radio</h1>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-600">Shipping method</h2>
        <fieldset data-testid="radio-group" className="mt-2 space-y-2 p-1">
          <legend className="sr-only">Shipping method</legend>
          <Radio
            data-testid="radio-standard"
            name="shipping-method"
            label="Standard (5-7 days)"
            defaultChecked
          />
          <Radio data-testid="radio-express" name="shipping-method" label="Express (1-2 days)" />
          <Radio
            data-testid="radio-disabled"
            name="shipping-method"
            label="Same-day (unavailable)"
            disabled
          />
        </fieldset>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-600">Edge case — long label</h2>
        <div data-testid="radio-long-label-wrapper" className="mt-2 max-w-xs">
          <Radio
            data-testid="radio-long-label-input"
            name="long-label-demo"
            label="This is a significantly longer option label than usual, long enough to wrap across multiple lines in a narrow container"
            className="mt-0.5 shrink-0"
            wrapperClassName="flex items-start gap-2"
          />
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RadioDemo />
  </StrictMode>,
);
