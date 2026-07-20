import { StrictMode, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { SlideOver, Button } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

function SlideOverDemo() {
  const [mainOpen, setMainOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const mainTriggerRef = useRef<HTMLButtonElement>(null);
  const infoTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Slide-over</h1>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          data-testid="slide-over-trigger"
          ref={mainTriggerRef}
          onClick={() => setMainOpen(true)}
        >
          View details
        </Button>
        <Button
          data-testid="slide-over-info-trigger"
          ref={infoTriggerRef}
          variant="secondary"
          onClick={() => setInfoOpen(true)}
        >
          Show informational panel (no buttons, Edge Case)
        </Button>
      </div>

      <SlideOver
        data-testid="slide-over"
        open={mainOpen}
        onClose={() => setMainOpen(false)}
        title="Order details"
        closeButtonTestId="slide-over-close"
        triggerRef={mainTriggerRef}
      >
        <p className="mt-4 text-sm text-neutral-600">
          Order #1042 — placed 2026-07-08, currently in transit.
        </p>
      </SlideOver>

      <SlideOver
        data-testid="slide-over-info"
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="Syncing…"
        hasFocusableContent={false}
        triggerRef={infoTriggerRef}
      >
        <p className="mt-2 text-sm text-neutral-600">This will only take a moment.</p>
      </SlideOver>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SlideOverDemo />
  </StrictMode>,
);
