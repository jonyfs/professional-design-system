import { StrictMode, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Modal, Button } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

function ModalDemo() {
  const [mainOpen, setMainOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const mainTriggerRef = useRef<HTMLButtonElement>(null);
  const infoTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Modal</h1>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button data-testid="modal-trigger" ref={mainTriggerRef} onClick={() => setMainOpen(true)}>
          Delete item
        </Button>
        <Button
          data-testid="modal-info-trigger"
          ref={infoTriggerRef}
          variant="secondary"
          onClick={() => setInfoOpen(true)}
        >
          Show informational modal (no buttons, Edge Case)
        </Button>
      </div>

      <Modal
        data-testid="modal"
        open={mainOpen}
        onClose={() => setMainOpen(false)}
        title="Delete item?"
        closeButtonTestId="modal-close"
        triggerRef={mainTriggerRef}
      >
        <p className="mt-2 text-sm text-neutral-600">
          This action cannot be undone. The item will be permanently removed.
        </p>
        <form method="dialog" className="mt-6 flex justify-end gap-3">
          <Button data-testid="modal-cancel" variant="secondary" type="submit">
            Cancel
          </Button>
          <Button data-testid="modal-confirm" type="submit">
            Delete
          </Button>
        </form>
      </Modal>

      <Modal
        data-testid="modal-info"
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="Processing…"
        hasFocusableContent={false}
        triggerRef={infoTriggerRef}
      >
        <p className="mt-2 text-sm text-neutral-600">This will only take a moment.</p>
      </Modal>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModalDemo />
  </StrictMode>,
);
