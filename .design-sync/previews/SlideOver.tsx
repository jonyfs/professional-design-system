import { SlideOver } from "@professional-design-system/react";

export function Default() {
  return (
    <SlideOver open title="Order details" onClose={() => {}}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: 14, color: "#4b5563" }}>
          Order #10482 · Placed July 3, 2026
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <span style={{ color: "#6b7280" }}>Subtotal</span>
          <span style={{ color: "#111827" }}>$248.00</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <span style={{ color: "#6b7280" }}>Shipping</span>
          <span style={{ color: "#111827" }}>$12.00</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600 }}>
          <span style={{ color: "#111827" }}>Total</span>
          <span style={{ color: "#111827" }}>$260.00</span>
        </div>
      </div>
    </SlideOver>
  );
}

export function AccountSettingsPanel() {
  return (
    <SlideOver open title="Edit profile" onClose={() => {}}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 280 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Display name</label>
          <input
            defaultValue="Jane Cooper"
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 14,
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Email</label>
          <input
            defaultValue="jane.cooper@example.com"
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 14,
            }}
          />
        </div>
        <button
          type="button"
          style={{
            marginTop: 8,
            padding: "8px 14px",
            borderRadius: 6,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            alignSelf: "flex-start",
          }}
        >
          Save changes
        </button>
      </div>
    </SlideOver>
  );
}
