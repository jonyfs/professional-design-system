import { Toggle } from "@professional-design-system/react";

export function Default() {
  return <Toggle label="Enable notifications" />;
}

export function CheckedAndDisabled() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Toggle label="Checked" defaultChecked />
      <Toggle label="Disabled" disabled />
      <Toggle label="Checked and disabled" defaultChecked disabled />
    </div>
  );
}

export function SettingsList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Privacy</span>
      <Toggle label="Make profile public" defaultChecked />
      <Toggle label="Show email on profile" />
      <Toggle label="Allow search engines to index my profile" defaultChecked />
    </div>
  );
}
