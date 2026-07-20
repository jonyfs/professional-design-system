import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CopyButton } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

function CopyButtonDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Copy Button</h1>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Default</h2>
        <div className="flex flex-wrap items-center gap-4">
          <CopyButton data-testid="copy-button" textToCopy="https://example.com/share/abc123" />
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Edge case — forced failure</h2>
        <div className="flex flex-wrap items-center gap-4">
          <CopyButton data-testid="copy-button-failing" textToCopy="never-copied" forceFailure />
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CopyButtonDemo />
  </StrictMode>,
);
