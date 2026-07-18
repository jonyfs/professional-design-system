export interface RingProgressProps {
  /** 0-100, clamped internally. */
  value: number;
  /** Accessible text equivalent — never conveyed by the arc alone. */
  label: string;
  size?: number;
  color?: "brand" | "success" | "warning" | "error" | "info";
  "data-testid"?: string;
}

// Feedback primitive (contracts/circular-progress.contract.md). The fill
// arc's strokeDashoffset is computed inline here (not CSSOM-assigned via
// an effect) because React's style prop already compiles to a direct DOM
// property assignment, not a literal style="..." attribute — so it isn't
// subject to this project's static-HTML CSP restriction (research.md R2).
export function RingProgress({
  value,
  label,
  size = 80,
  color = "brand",
  "data-testid": testId,
}: RingProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = size / 2 - 4;
  const circumference = 2 * Math.PI * r;
  return (
    <div
      data-testid={testId}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="circular-progress"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="circular-progress-track"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={8}
        />
        <circle
          className={`circular-progress-fill circular-progress-fill-${color}`}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </div>
  );
}
