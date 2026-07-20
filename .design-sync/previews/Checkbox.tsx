import { Checkbox } from "@jonyfs/react";

export function Default() {
  return <Checkbox label="Remember me" />;
}

export function CheckedAndDisabled() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Checked and disabled" defaultChecked disabled />
    </div>
  );
}

export function OptionsList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Notify me about</span>
      <Checkbox label="Comments" defaultChecked />
      <Checkbox label="Mentions" defaultChecked />
      <Checkbox label="Weekly digest" />
    </div>
  );
}
