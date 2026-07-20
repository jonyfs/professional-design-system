import { TextInput } from "@jonyfs/react";

export function Default() {
  return (
    <div style={{ maxWidth: 320 }}>
      <TextInput label="Email address" placeholder="jane.cooper@example.com" />
    </div>
  );
}

export function WithError() {
  return (
    <div style={{ maxWidth: 320 }}>
      <TextInput
        label="Password"
        type="password"
        defaultValue="short"
        error="Password must be at least 8 characters."
      />
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ maxWidth: 320 }}>
      <TextInput label="Account ID" defaultValue="acct_9f21a" disabled />
    </div>
  );
}

export function FormComposition() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 }}>
      <TextInput label="Full name" placeholder="Jane Cooper" />
      <TextInput label="Email address" placeholder="jane.cooper@example.com" />
      <TextInput label="Company (optional)" placeholder="Acme Inc." />
    </div>
  );
}
