import { Button } from "@professional-design-system/react";

export function Variants() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button variant="primary">Save changes</Button>
      <Button variant="secondary">Cancel</Button>
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button variant="primary" disabled>
        Processing…
      </Button>
      <Button variant="secondary" disabled>
        Cancel
      </Button>
    </div>
  );
}

export function DialogFooter() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 360,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
      }}
    >
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Delete project</span>
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          This action cannot be undone. All associated data will be permanently removed.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          padding: 16,
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Delete</Button>
      </div>
    </div>
  );
}
