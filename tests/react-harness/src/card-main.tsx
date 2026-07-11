import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Card } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

function CardDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Card</h1>
      <div className="mt-8 flex flex-wrap gap-6">
        <Card data-testid="card-default" className="max-w-sm">
          <h3 className="text-lg font-semibold text-neutral-900">Team standup notes</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Weekly summary of blockers, wins, and next steps from the engineering team.
          </p>
        </Card>
        <Card data-testid="card-elevated" elevated className="max-w-sm">
          <h3 className="text-lg font-semibold text-neutral-900">Hover to elevate</h3>
          <p className="mt-2 text-sm text-neutral-600">
            This card's shadow deepens on hover, signaling that it is interactive.
          </p>
        </Card>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CardDemo />
  </StrictMode>,
);
