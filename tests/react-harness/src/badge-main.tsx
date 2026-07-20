import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Badge } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

function BadgeDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Badge</h1>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-600">Variants</h2>
        <div data-testid="badge-variants-row" className="mt-2 flex flex-wrap items-center gap-3 p-2">
          <Badge data-testid="badge-success" variant="success">
            Success
          </Badge>
          <Badge data-testid="badge-error" variant="error">
            Error
          </Badge>
          <Badge data-testid="badge-warning" variant="warning">
            Warning
          </Badge>
          <Badge data-testid="badge-neutral" variant="neutral">
            Neutral
          </Badge>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-600">Edge case — long label</h2>
        <div data-testid="badge-long-label-wrapper" className="mt-2 max-w-[10rem]">
          <Badge data-testid="badge-long-label" variant="neutral" className="max-w-full">
            <span className="truncate">A significantly longer status label than usual</span>
          </Badge>
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BadgeDemo />
  </StrictMode>,
);
