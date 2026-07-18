import { useState } from "react";

export interface TourStep {
  title: string;
  description: string;
}

export interface OnboardingTourProps {
  steps: TourStep[];
  "data-testid"?: string;
}

// Feature 031 (contracts/onboarding-tour.contract.md) — the React port
// renders one fixed-position panel that swaps content per step rather
// than one DOM node per step (the static HTML approach) — simpler
// state, since React already owns "what's currently shown" via
// currentIndex. This is this catalog's first multi-step sequencing UI
// (research.md R4); per-step live anchor positioning against a real
// target element is a further enhancement a consuming app can layer on
// top, not this contract's minimum bar (the sequencing behavior itself).
export function OnboardingTour({ steps, "data-testid": testId }: OnboardingTourProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);

  if (currentIndex < 0) {
    return (
      <button
        type="button"
        data-testid={testId}
        className="btn-primary"
        onClick={() => setCurrentIndex(0)}
      >
        Start tour
      </button>
    );
  }

  const step = steps[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  return (
    <div role="dialog" aria-labelledby="tour-title" className="popover-panel" data-testid={`${testId}-panel`}>
      <p className="text-xs text-neutral-600" data-testid={`${testId}-indicator`}>
        {currentIndex + 1} of {steps.length}
      </p>
      <h2 id="tour-title" className="mt-1 text-sm font-semibold text-neutral-900">
        {step.title}
      </h2>
      <p className="mt-1 text-sm text-neutral-600">{step.description}</p>
      <div className="mt-3 flex justify-between gap-2">
        {isFirst ? (
          <button type="button" className="btn-secondary" onClick={() => setCurrentIndex(-1)}>
            Skip
          </button>
        ) : (
          <button type="button" className="btn-secondary" onClick={() => setCurrentIndex((i) => i - 1)}>
            Previous
          </button>
        )}
        <button
          type="button"
          className="btn-primary"
          onClick={() => setCurrentIndex(isLast ? -1 : currentIndex + 1)}
        >
          {isLast ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
