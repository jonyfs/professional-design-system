import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

function ButtonDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Button</h1>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Primary</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button data-testid="button-primary" variant="primary">
            Primary action
          </Button>
          <Button data-testid="button-primary-disabled" variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Secondary</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button data-testid="button-secondary" variant="secondary">
            Secondary action
          </Button>
          <Button data-testid="button-secondary-disabled" variant="secondary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Edge case — long label</h2>
        <div data-testid="button-long-label-wrapper" className="max-w-xs">
          <Button data-testid="button-long-label" variant="primary" className="w-full">
            This is a significantly longer status label than usual
          </Button>
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ButtonDemo />
  </StrictMode>,
);
