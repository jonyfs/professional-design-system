import { Radio } from "@jonyfs/react";

export function Group() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Shipping speed</span>
      <Radio label="Standard (5-7 days)" name="shipping" value="standard" defaultChecked />
      <Radio label="Express (2-3 days)" name="shipping" value="express" />
      <Radio label="Overnight" name="shipping" value="overnight" />
    </div>
  );
}

export function DisabledOption() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Radio label="Available plan" name="plan" value="available" defaultChecked />
      <Radio label="Enterprise (contact sales)" name="plan" value="enterprise" disabled />
    </div>
  );
}
