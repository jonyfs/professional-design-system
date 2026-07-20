import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CommandPalette } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

const actions = [
  { id: "new-project", label: "New Project", onExecute: () => {} },
  { id: "open-settings", label: "Open Settings", onExecute: () => {} },
  { id: "invite-teammate", label: "Invite Teammate (requires admin)", disabled: true, onExecute: () => {} },
  { id: "sign-out", label: "Sign Out", onExecute: () => {} },
];

function CommandPaletteDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Command Palette</h1>
      <p className="mt-4 text-sm text-neutral-600">
        Press <strong>⌘K</strong> / <strong>Ctrl+K</strong> from anywhere on this page to open it.
      </p>
      <a href="#" className="mt-8 inline-block" data-testid="unrelated-focus-target">
        An unrelated link, for focus-state testing
      </a>
      <CommandPalette data-testid="command-palette" actions={actions} />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CommandPaletteDemo />
  </StrictMode>,
);
