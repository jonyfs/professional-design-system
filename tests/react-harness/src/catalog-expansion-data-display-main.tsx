import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  AvatarGroup,
  Highlight,
  Code,
  ColorSwatch,
} from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

const MEMBERS = [
  { initials: "JC", alt: "Jane Cooper" },
  { initials: "AM", alt: "Alex Morgan" },
  { initials: "SR", alt: "Sam Rivera" },
  { initials: "PS", alt: "Priya Singh" },
  { initials: "LK", alt: "Liam Khan" },
  { initials: "NB", alt: "Nina Bauer" },
];

function DataDisplayDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">
        Catalog Expansion — Data Display
      </h1>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">
        Avatar Group — exceeds limit (+N)
      </h2>
      <AvatarGroup
        members={MEMBERS}
        limit={4}
        aria-label="6 team members"
        data-testid="avatar-group-overflow"
      />

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">
        Avatar Group — within limit (no +N)
      </h2>
      <AvatarGroup
        members={MEMBERS.slice(0, 3)}
        limit={4}
        aria-label="3 team members"
        data-testid="avatar-group-within"
      />

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Highlight</h2>
      <p className="mt-3 max-w-md text-sm text-neutral-900">
        <Highlight
          text="Jane Cooper from Acme Corp"
          query="co"
          data-testid="highlight-match"
        />
      </p>
      <p className="mt-3 max-w-md text-sm text-neutral-900">
        <Highlight
          text="Jane Cooper from Acme Corp"
          query="zz"
          data-testid="highlight-no-match"
        />
      </p>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Code</h2>
      <p className="mt-3 max-w-md text-sm text-neutral-900">
        Install with{" "}
        <Code data-testid="code-inline">npm install professional-design-system</Code>.
      </p>
      <div className="mt-3 max-w-md">
        <Code variant="block" data-testid="code-block">{`import { Code } from "professional-design-system";

function Example() {
  return <Code variant="block">{source}</Code>;
}`}</Code>
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Color Swatch</h2>
      <ul className="mt-3 flex flex-wrap items-center gap-4">
        <li>
          <ColorSwatch value="#2563eb" label="Brand blue, #2563eb" showLabel data-testid="color-swatch-brand" />
        </li>
        <li>
          <ColorSwatch value="#16a34a" label="Success green, #16a34a" showLabel data-testid="color-swatch-success" />
        </li>
        <li>
          <ColorSwatch value="#ffffff" label="White, #ffffff" showLabel data-testid="color-swatch-white" />
        </li>
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataDisplayDemo />
  </StrictMode>,
);
