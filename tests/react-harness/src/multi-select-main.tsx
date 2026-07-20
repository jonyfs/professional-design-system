import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MultiSelect } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

const frameworks = [
  "React",
  "Vue",
  "Svelte",
  "Angular",
  "Solid",
  "Preact",
  "Qwik",
  "Astro",
  "Ember",
  "Alpine",
  "Lit",
  "Marko",
].map((label) => ({ id: label.toLowerCase(), label }));

function MultiSelectDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Multi Select</h1>
      <div className="mt-8 max-w-sm">
        <MultiSelect
          data-testid="multi-select"
          label="Frameworks"
          options={frameworks}
          placeholder="Select…"
        />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MultiSelectDemo />
  </StrictMode>,
);
