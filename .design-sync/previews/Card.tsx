import { Card, Badge } from "@jonyfs/react";

export function Simple() {
  return (
    <div style={{ maxWidth: 360 }}>
      <Card>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>Weekly summary</h3>
        <p style={{ marginTop: 8, fontSize: 14, color: "#6b7280" }}>
          Your team closed 14 tickets and shipped 3 releases this week.
        </p>
      </Card>
    </div>
  );
}

export function Elevated() {
  return (
    <div style={{ maxWidth: 360 }}>
      <Card elevated>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>Upgrade to Pro</h3>
        <p style={{ marginTop: 8, fontSize: 14, color: "#6b7280" }}>
          Unlock advanced analytics, unlimited seats, and priority support.
        </p>
      </Card>
    </div>
  );
}

export function ProjectCard() {
  return (
    <div style={{ maxWidth: 360 }}>
      <Card elevated>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>Checkout redesign</h3>
          <Badge variant="success">On track</Badge>
        </div>
        <p style={{ marginTop: 8, fontSize: 14, color: "#6b7280" }}>
          Redesigning the checkout flow to reduce cart abandonment.
        </p>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#9ca3af",
          }}
        >
          <span>Due Aug 14</span>
          <span>6 of 9 tasks done</span>
        </div>
      </Card>
    </div>
  );
}
