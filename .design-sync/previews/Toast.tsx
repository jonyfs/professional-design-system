import { Toast } from "@professional-design-system/react";

export function Variants() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
      <Toast variant="success" message="Changes saved successfully." onDismiss={() => {}} />
      <Toast variant="error" message="Failed to save changes. Please try again." onDismiss={() => {}} />
      <Toast variant="info" message="A new version is available." onDismiss={() => {}} />
    </div>
  );
}

export function InContext() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: 220,
        maxWidth: 480,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#f9fafb",
        padding: 16,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Dashboard</span>
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: 320,
        }}
      >
        <Toast variant="success" message="Deployment #482 completed." onDismiss={() => {}} />
      </div>
    </div>
  );
}
