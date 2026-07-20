import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Combobox } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

const countries = [
  "Argentina",
  "Australia",
  "Austria (unavailable)",
  "Belgium",
  "Brazil",
  "Bulgaria",
  "Canada",
].map((label) => ({
  value: label.replace(" (unavailable)", ""),
  label,
  disabled: label.includes("(unavailable)"),
}));

function ComboboxDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Combobox</h1>
      <div className="mt-8 max-w-sm">
        <Combobox data-testid="combobox-input" label="Country" options={countries} onCommit={() => {}} />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ComboboxDemo />
  </StrictMode>,
);
