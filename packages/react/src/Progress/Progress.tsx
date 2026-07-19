export interface ProgressProps {
  /** Accessible name for the progress bar. */
  label: string;
  /**
   * Determinate progress value. Omit (or pass undefined) to render the
   * indeterminate variant, which omits aria-valuenow.
   */
  value?: number;
  /** Lower bound. Default 0. */
  min?: number;
  /** Upper bound. Default 100. */
  max?: number;
  "data-testid"?: string;
}

// Direct port of src/components/progress/progress.html (feature 015).
// Determinate = role=progressbar with the full aria-value* triple + a fill
// whose width is the computed percentage. Indeterminate = same role, no
// aria-valuenow, animated .progress-fill-indeterminate bar.
export function Progress({
  label,
  value,
  min = 0,
  max = 100,
  "data-testid": testId,
}: ProgressProps) {
  const isIndeterminate = typeof value !== "number";

  if (isIndeterminate) {
    return (
      <div
        data-testid={testId}
        role="progressbar"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        className="progress-track"
      >
        <div className="progress-fill-indeterminate" />
      </div>
    );
  }

  const clamped = Math.min(Math.max(value, min), max);
  const percent = max === min ? 0 : ((clamped - min) / (max - min)) * 100;

  return (
    <div
      data-testid={testId}
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      className="progress-track"
    >
      <div
        data-progress-fill
        data-value={value}
        className="progress-fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
