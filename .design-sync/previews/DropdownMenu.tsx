import { DropdownMenu } from "@professional-design-system/react";

// A synthetic click on the trigger (via the native invoker mechanism) does
// force the panel open in the real Playwright capture page, but the popover
// then renders anchor-positioned partly outside this narrow review-sheet
// column and gets clipped — worse than the closed state, since a cropped
// panel reads as a rendering bug rather than a demonstration. Reverted to
// the closed trigger, which is styled/complete/plausible on its own; see
// .design-sync/learnings/batch-b.md and NOTES.md for the full rationale.
export function Default() {
  return (
    <DropdownMenu
      trigger="Account"
      items={[
        { id: "profile", label: "Your profile", onSelect: () => {} },
        { id: "settings", label: "Settings", onSelect: () => {} },
        { id: "signout", label: "Sign out", onSelect: () => {} },
      ]}
    />
  );
}

export function WithDisabledItem() {
  return (
    <DropdownMenu
      trigger="Actions"
      items={[
        { id: "duplicate", label: "Duplicate", onSelect: () => {} },
        { id: "archive", label: "Archive", onSelect: () => {} },
        { id: "delete", label: "Delete (restricted)", onSelect: () => {}, disabled: true },
      ]}
    />
  );
}

export function InTableRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 360,
        padding: "10px 12px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>Q3 marketing budget.xlsx</span>
        <span style={{ fontSize: 12, color: "#6b7280" }}>Edited 2 hours ago</span>
      </div>
      <DropdownMenu
        trigger="•••"
        items={[
          { id: "open", label: "Open", onSelect: () => {} },
          { id: "rename", label: "Rename", onSelect: () => {} },
          { id: "delete", label: "Delete", onSelect: () => {} },
        ]}
      />
    </div>
  );
}
