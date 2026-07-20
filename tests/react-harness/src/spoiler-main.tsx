import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Spoiler } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

function SpoilerDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Spoiler</h1>

      <div className="mt-8 max-w-md space-y-10">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">
            Long content (truncates)
          </h2>
          <div className="mt-2">
            <Spoiler data-testid="spoiler-long">
              The quick brown fox jumps over the lazy dog. Pack my box with five
              dozen liquor jugs. How vexingly quick daft zebras jump! The five
              boxing wizards jump quickly. Sphinx of black quartz, judge my vow.
              Jackdaws love my big sphinx of quartz. The job requires extra
              pluck and zeal from every young wage earner. Bright vixens jump;
              dozy fowl quack. This paragraph is deliberately long so that it
              clearly exceeds the three-line clamp threshold and triggers the
              Show more control.
            </Spoiler>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-neutral-900">
            Short content (no control)
          </h2>
          <div className="mt-2">
            <Spoiler data-testid="spoiler-short">
              This line fits well within the clamp.
            </Spoiler>
          </div>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SpoilerDemo />
  </StrictMode>,
);
