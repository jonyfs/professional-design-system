import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TextInput } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

function TextInputDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Text Input</h1>

      <div className="mt-8 grid max-w-sm gap-8">
        <section data-testid="input-default-wrapper" className="space-y-1">
          <h2 className="text-sm font-semibold text-neutral-600">Default / focus</h2>
          <TextInput
            data-testid="input-default"
            label="Email address"
            placeholder="you@example.com"
          />
        </section>

        <section data-testid="input-error-wrapper" className="space-y-1">
          <h2 className="text-sm font-semibold text-neutral-600">Error</h2>
          <TextInput
            data-testid="input-error"
            label="Email address"
            error="Enter a valid email address."
            defaultValue="not-an-email"
          />
        </section>

        <section data-testid="input-error-placeholder-wrapper" className="space-y-1">
          <h2 className="text-sm font-semibold text-neutral-600">
            Error + placeholder together (Edge Case)
          </h2>
          <TextInput
            data-testid="input-error-with-placeholder"
            label="Email address"
            error="Enter a valid email address."
            placeholder="you@example.com"
          />
        </section>

        <section data-testid="input-disabled-wrapper" className="space-y-1">
          <h2 className="text-sm font-semibold text-neutral-600">Disabled</h2>
          <TextInput
            data-testid="input-disabled"
            label="Email address"
            disabled
            defaultValue="you@example.com"
          />
        </section>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TextInputDemo />
  </StrictMode>,
);
