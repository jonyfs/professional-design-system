import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ActionIcon } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

const PlusIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path d="M10 3a.75.75 0 0 1 .75.75v5.5h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5h-5.5a.75.75 0 0 1 0-1.5h5.5v-5.5A.75.75 0 0 1 10 3Z" />
  </svg>
);

const MoreIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path d="M6 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm5.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm4 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
  </svg>
);

function ActionIconDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Action Icon</h1>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Primary</h2>
        <div className="flex flex-wrap items-center gap-4">
          <ActionIcon data-testid="action-icon-primary" variant="primary" ariaLabel="Add item" icon={PlusIcon} />
          <ActionIcon
            data-testid="action-icon-primary-disabled"
            variant="primary"
            ariaLabel="Add item (disabled)"
            icon={PlusIcon}
            disabled
          />
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Secondary</h2>
        <div className="flex flex-wrap items-center gap-4">
          <ActionIcon data-testid="action-icon-secondary" variant="secondary" ariaLabel="More actions" icon={MoreIcon} />
          <ActionIcon
            data-testid="action-icon-secondary-disabled"
            variant="secondary"
            ariaLabel="More actions (disabled)"
            icon={MoreIcon}
            disabled
          />
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ActionIconDemo />
  </StrictMode>,
);
