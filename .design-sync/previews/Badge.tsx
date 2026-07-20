import { Badge } from "professional-design-system";

export function AllVariants() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Badge variant="success">Active</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="neutral">Archived</Badge>
    </div>
  );
}

export function InContext() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Deployment #482</span>
        <Badge variant="success">Success</Badge>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Deployment #481</span>
        <Badge variant="error">Failed</Badge>
      </div>
    </div>
  );
}
