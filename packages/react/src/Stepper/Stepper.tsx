export interface StepperStep {
  label: string;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Zero-based index of the current step. Steps before it are completed,
   *  steps after it are upcoming. */
  current: number;
  "aria-label"?: string;
  "data-testid"?: string;
}

type StepStatus = "completed" | "current" | "upcoming";

function statusFor(index: number, current: number): StepStatus {
  if (index < current) return "completed";
  if (index === current) return "current";
  return "upcoming";
}

// Feature 042 (audit backfill) — presentational multi-step progress
// indicator reusing Pagination's active-item color pairing. Purely
// derived from `current`: the E2E's three boundary examples (mid /
// first-step / last-step) are all reproduced by moving `current`, and it
// asserts aria-current="step" sits on the current step ONLY, so exactly
// one <li> carries it. Completed circles show a check and are
// aria-hidden; the current circle shows its number and stays in the
// accessibility tree; upcoming circles show their number, aria-hidden.
export function Stepper({
  steps,
  current,
  "aria-label": ariaLabel,
  "data-testid": testId,
}: StepperProps) {
  return (
    <ol className="stepper" aria-label={ariaLabel} data-testid={testId}>
      {steps.map((step, index) => {
        const status = statusFor(index, current);
        const isCurrent = status === "current";
        const labelClass = isCurrent
          ? "text-sm font-semibold text-neutral-900"
          : status === "completed"
            ? "text-sm font-medium text-neutral-900"
            : "text-sm font-medium text-neutral-600";
        return (
          <li
            key={index}
            className={`stepper-step stepper-step-${status}`}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span className="stepper-circle" aria-hidden={isCurrent ? undefined : true}>
              {status === "completed" ? "✓" : index + 1}
            </span>
            <span className={labelClass}>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
