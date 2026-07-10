import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Tabs } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

const tabs = [
  { id: "details", label: "Details", content: <p>Full product specifications and materials.</p> },
  { id: "reviews", label: "Reviews", content: <p>Customer reviews and ratings.</p> },
  { id: "warranty", label: "Warranty (disabled)", content: <p>Warranty information is unavailable for this item.</p>, disabled: true },
  { id: "shipping", label: "Shipping", content: <p>Shipping options and estimated delivery times.</p> },
];

function TabsDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Tabs</h1>
      <div data-testid="tabs" className="mt-8">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TabsDemo />
  </StrictMode>,
);
