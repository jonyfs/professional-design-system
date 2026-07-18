import { StrictMode, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Affix, LoadingOverlay, BottomSheet } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

function LoadingOverlayDemo() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <button
        type="button"
        data-testid="loading-overlay-toggle"
        className="btn-secondary"
        onClick={() => setIsLoading((v) => !v)}
      >
        Toggle loading
      </button>
      <LoadingOverlay
        isLoading={isLoading}
        data-testid="loading-overlay-container"
      >
        <div className="mt-4 max-w-md rounded-lg border border-neutral-200 p-6">
          <p className="text-sm text-neutral-900">Table content goes here.</p>
          <button type="button" data-testid="loading-overlay-inner-button" className="btn-primary mt-3">
            Save
          </button>
        </div>
      </LoadingOverlay>
    </>
  );
}

function BottomSheetDemo() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        data-testid="bottom-sheet-trigger"
        className="btn-primary"
        onClick={() => setOpen(true)}
      >
        Open bottom sheet
      </button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Order details"
        triggerRef={triggerRef}
        closeButtonTestId="bottom-sheet-close"
      >
        <p className="mt-4 text-sm text-neutral-600">
          Order #1042 — placed 2026-07-08, currently in transit.
        </p>
      </BottomSheet>
    </>
  );
}

function OverlaysDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Overlays</h1>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Affix</h2>
      <div className="mt-3">
        <Affix data-testid="affix-demo">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
            <p className="text-sm font-medium text-neutral-900">I pin to the top once scrolled past.</p>
          </div>
        </Affix>
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">LoadingOverlay</h2>
      <div className="mt-3">
        <LoadingOverlayDemo />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Bottom Sheet</h2>
      <div className="mt-3">
        <BottomSheetDemo />
      </div>

      <div style={{ height: "1500px" }} className="mt-8">
        <p className="text-sm text-neutral-600">Scroll to see Affix pin.</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OverlaysDemo />
  </StrictMode>,
);
