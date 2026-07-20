import { Select } from "@jonyfs/react";

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "br", label: "Brazil" },
  { value: "de", label: "Germany" },
];

const roles = [
  { value: "viewer", label: "Viewer" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
];

export function Default() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Select label="Country" options={countries} defaultValue="us" />
    </div>
  );
}

export function WithError() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Select
        label="Team role"
        options={[{ value: "", label: "Select a role" }, ...roles]}
        defaultValue=""
        error="Please choose a role before continuing."
      />
    </div>
  );
}

export function FormComposition() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 }}>
      <Select label="Country" options={countries} defaultValue="us" />
      <Select label="Team role" options={roles} defaultValue="editor" />
    </div>
  );
}
