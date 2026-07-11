import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { List } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

const readonlyItems = [
  { id: "jane", avatar: { initials: "JC", alt: "Jane Cooper" }, title: "Jane Cooper", metadata: "jane.cooper@example.com" },
  { id: "alex", avatar: { initials: "AM", alt: "Alex Morgan" }, title: "Alex Morgan", metadata: "alex.morgan@example.com" },
];

const interactiveItems = [
  { id: "jane", avatar: { initials: "JC", alt: "Jane Cooper" }, title: "Jane Cooper", metadata: "Product Designer", href: "#" },
  { id: "alex", avatar: { initials: "AM", alt: "Alex Morgan" }, title: "Alex Morgan", metadata: "Engineering Manager", href: "#" },
];

function ListDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Lists</h1>
      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Read-only</h2>
      <div className="mt-4 max-w-md">
        <List data-testid="list-readonly" items={readonlyItems} />
      </div>
      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Interactive</h2>
      <div className="mt-4 max-w-md">
        <List data-testid="list-interactive" items={interactiveItems} interactive />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ListDemo />
  </StrictMode>,
);
