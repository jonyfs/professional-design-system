import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PasswordInput } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

function PasswordInputDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Password Input</h1>
      <div className="mt-8 grid max-w-sm gap-8">
        <section data-testid="password-input-wrapper" className="space-y-1">
          <PasswordInput
            data-testid="password-input"
            label="Password"
            autoComplete="current-password"
            defaultValue="s3cret-value"
          />
        </section>
        <section data-testid="password-input-disabled-wrapper" className="space-y-1">
          <PasswordInput
            data-testid="password-input-disabled"
            label="Disabled"
            defaultValue="s3cret-value"
            disabled
          />
        </section>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PasswordInputDemo />
  </StrictMode>,
);
