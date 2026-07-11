import { useRef, useState } from "react";
import { Button, Modal, TextInput } from "@professional-design-system/react";

// Modal's `open` is externally controlled, and the capture harness is a
// static mount with no click simulation — so every cell here initializes
// its own `open` state to `true` (rather than defaulting closed and
// waiting for a trigger click) to actually render the dialog content.

export function Default() {
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ minHeight: 320 }}>
      <Button ref={triggerRef} variant="secondary" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete project" triggerRef={triggerRef}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>
            This will permanently delete the project and all of its deployments. This action
            cannot be undone.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function FormContent() {
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ minHeight: 380 }}>
      <Button ref={triggerRef} variant="primary" onClick={() => setOpen(true)}>
        Edit profile
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Edit profile" triggerRef={triggerRef}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
          <TextInput label="Full name" defaultValue="Jane Cooper" />
          <TextInput label="Email address" defaultValue="jane.cooper@example.com" />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Save changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
