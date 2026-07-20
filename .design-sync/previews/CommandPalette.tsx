import { useEffect } from "react";
import { CommandPalette } from "@jonyfs/react";

// CommandPalette (⌘K-style) has no open/onClose prop — its `open` state
// is internal (useState), only reachable via a document-level Cmd/Ctrl+K
// keydown listener (see packages/react/src/hooks/useCommandPalette.ts).
// Rather than settle for the closed state, this preview exercises the
// component's own real, documented interaction contract: it dispatches
// the same Cmd+K keydown event a real user would send, which the
// component's own listener picks up and uses to call dialog.showModal().
// This is not reaching into internals — it is driving the public
// keyboard affordance the component ships with.
function useAutoOpenViaShortcut() {
  useEffect(() => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  }, []);
}

const actions = [
  { id: "new-doc", label: "Create new document", onExecute: () => {} },
  { id: "invite", label: "Invite team member", onExecute: () => {} },
  { id: "search", label: "Search all projects", onExecute: () => {} },
  { id: "settings", label: "Open workspace settings", onExecute: () => {}, disabled: true },
  { id: "logout", label: "Log out", onExecute: () => {} },
];

export function Default() {
  useAutoOpenViaShortcut();
  return (
    <div style={{ maxWidth: 480 }}>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
        Triggered via <kbd>⌘K</kbd> — command palette open with a filtered action list.
      </p>
      <CommandPalette actions={actions} data-testid="command-palette" />
    </div>
  );
}

const projectActions = [
  { id: "deploy", label: "Deploy to production", onExecute: () => {} },
  { id: "rollback", label: "Rollback last deployment", onExecute: () => {} },
  { id: "view-logs", label: "View build logs", onExecute: () => {} },
];

export function InContext() {
  useAutoOpenViaShortcut();
  return (
    <div style={{ maxWidth: 480 }}>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
        Global command surface mounted alongside the project dashboard.
      </p>
      <CommandPalette actions={projectActions} data-testid="project-command-palette" />
    </div>
  );
}
