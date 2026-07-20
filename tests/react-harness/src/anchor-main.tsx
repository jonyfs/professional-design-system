import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Anchor } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

function AnchorDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Anchor</h1>

      <div className="mt-8 max-w-md space-y-6">
        <p className="text-sm text-neutral-900">
          Read the{" "}
          <Anchor href="#" data-testid="anchor-inline">
            component guidelines
          </Anchor>{" "}
          before shipping, and consult the{" "}
          <Anchor href="#" data-testid="anchor-inline-2">
            accessibility checklist
          </Anchor>{" "}
          for every new surface.
        </p>

        <p className="text-sm text-neutral-900">
          External resources open in a new tab:{" "}
          <Anchor
            href="#"
            data-testid="anchor-external"
            target="_blank"
            rel="noopener noreferrer"
          >
            WCAG 2.2 reference
          </Anchor>
          .
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AnchorDemo />
  </StrictMode>,
);
