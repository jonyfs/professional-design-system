# Contract: Onboarding Tour / Coachmark

Reuses Popover's exact positioning mechanism (`.popover-panel`,
per-instance `anchor-name`/`position-anchor`, the same pattern
`popover.js` already establishes) for each step's panel. The NEW logic
is a step-sequencing controller — this catalog's first multi-step
sequencing UI (research.md R4).

## `src/scripts/onboarding-tour.js`

```js
// Feature 031 (research.md R4) — reuses Popover's positioning
// mechanism per step; the sequencing (exactly one step open at a time,
// Next/Previous/Skip, step indicator) is the only genuinely new logic.
let anchorCounter = 0;

export function initOnboardingTour() {
  const steps = Array.from(document.querySelectorAll("[data-tour-step]"));
  const startButton = document.getElementById("tour-start");
  if (!steps.length || !startButton) return;

  steps.forEach((panel) => {
    const target = document.getElementById(panel.dataset.tourTarget);
    if (!target) return;
    const anchorName = `--tour-anchor-${anchorCounter++}`;
    target.style.anchorName = anchorName;
    panel.style.positionAnchor = anchorName;
  });

  let currentIndex = -1;

  function showStep(index) {
    steps.forEach((panel) => panel.hidePopover());
    if (index < 0 || index >= steps.length) {
      currentIndex = -1;
      return;
    }
    currentIndex = index;
    const panel = steps[index];
    const indicator = panel.querySelector("[data-tour-indicator]");
    if (indicator) indicator.textContent = `${index + 1} of ${steps.length}`;
    panel.showPopover();
    panel.querySelector("[data-tour-next], [data-tour-finish]")?.focus();
  }

  startButton.addEventListener("click", () => showStep(0));

  steps.forEach((panel, index) => {
    panel.querySelector("[data-tour-next]")?.addEventListener("click", () => showStep(index + 1));
    panel.querySelector("[data-tour-prev]")?.addEventListener("click", () => showStep(index - 1));
    panel.querySelector("[data-tour-skip], [data-tour-finish]")?.addEventListener("click", () => showStep(-1));
  });
}
```

## Static HTML usage

```html
<button type="button" id="tour-start" data-testid="tour-start" class="btn-primary">Start tour</button>

<div id="tour-target-1" class="rounded-md border border-neutral-200 p-4" data-testid="tour-target-1">Dashboard</div>
<div id="tour-panel-1" data-tour-step data-tour-target="tour-target-1" popover="auto" role="dialog" aria-labelledby="tour-title-1" class="popover-panel" data-testid="tour-panel-1">
  <p class="text-xs text-neutral-600" data-tour-indicator data-testid="tour-indicator-1">1 of 3</p>
  <h2 id="tour-title-1" class="mt-1 text-sm font-semibold text-neutral-900">Your dashboard</h2>
  <p class="mt-1 text-sm text-neutral-600">See an overview of your account here.</p>
  <div class="mt-3 flex justify-between gap-2">
    <button type="button" data-tour-skip data-testid="tour-skip-1" class="btn-secondary">Skip</button>
    <button type="button" data-tour-next data-testid="tour-next-1" class="btn-primary">Next</button>
  </div>
</div>

<!-- Middle steps additionally render a data-tour-prev button; the
     final step renders data-tour-finish instead of data-tour-next. -->
```

## React wrapper shape

```tsx
import { useState } from "react";

export interface TourStep {
  target: string; // element id
  title: string;
  description: string;
}
export interface OnboardingTourProps {
  steps: TourStep[];
  "data-testid"?: string;
}
export function OnboardingTour({ steps, "data-testid": testId }: OnboardingTourProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  if (currentIndex < 0) {
    return (
      <button type="button" data-testid={testId} className="btn-primary" onClick={() => setCurrentIndex(0)}>
        Start tour
      </button>
    );
  }
  const step = steps[currentIndex];
  const isLast = currentIndex === steps.length - 1;
  return (
    <div role="dialog" aria-labelledby="tour-title" className="popover-panel fixed" data-testid={`${testId}-panel`}>
      <p className="text-xs text-neutral-600">{currentIndex + 1} of {steps.length}</p>
      <h2 id="tour-title" className="mt-1 text-sm font-semibold text-neutral-900">{step.title}</h2>
      <p className="mt-1 text-sm text-neutral-600">{step.description}</p>
      <div className="mt-3 flex justify-between gap-2">
        {currentIndex === 0 ? (
          <button type="button" className="btn-secondary" onClick={() => setCurrentIndex(-1)}>Skip</button>
        ) : (
          <button type="button" className="btn-secondary" onClick={() => setCurrentIndex((i) => i - 1)}>Previous</button>
        )}
        <button type="button" className="btn-primary" onClick={() => setCurrentIndex(isLast ? -1 : currentIndex + 1)}>
          {isLast ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
```

Note: the React port renders one fixed-position panel that swaps
content per step rather than one DOM node per step (the static HTML
approach, matching Popover's own per-instance-anchor convention) —
simpler state, no need to manage N popover elements' visibility, since
React already owns "what's currently shown" via `currentIndex`.
Positioning against each step's real target element (anchor
positioning per step) is a further enhancement a consuming app can add
via a `ref`-based measurement effect; this contract's minimum bar is
the sequencing behavior itself (FR-004), not per-step live anchor
positioning in the React surface specifically.

## Acceptance mapping

- FR-004, spec.md US3 Acceptance Scenarios 1-3 → the markup/scripts above
- spec.md Edge Case (no persistence across reload) → `currentIndex`/`showStep(-1)` reset entirely on fresh load, nothing stored
