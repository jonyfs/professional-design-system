import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Breadcrumbs } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

function BreadcrumbsDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Breadcrumbs</h1>

      <div className="mt-8 space-y-8">
        <Breadcrumbs
          data-testid="breadcrumbs"
          items={[
            { label: "Home", href: "/" },
            { label: "Category", href: "/category" },
          ]}
          currentLabel="Current Page"
        />

        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Single-entry (Edge Case)</h2>
          <Breadcrumbs
            data-testid="breadcrumbs-single"
            className="mt-2"
            items={[]}
            currentLabel="Current Page"
          />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BreadcrumbsDemo />
  </StrictMode>,
);
