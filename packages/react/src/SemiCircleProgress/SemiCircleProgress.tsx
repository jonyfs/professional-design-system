export interface SemiCircleProgressProps {
  /** 0-100, clamped internally. */
  value: number;
  /** Accessible text equivalent — never conveyed by the arc alone. */
  label: string;
  size?: number;
  color?: "brand" | "success" | "warning" | "error" | "info";
  "data-testid"?: string;
}

// Shares RingProgress's underlying stroke-dashoffset mechanism
// (contracts/circular-progress.contract.md), constrained to a half-circle
// SVG path instead of a full circle.
export function SemiCircleProgress({
  value,
  label,
  size = 80,
  color = "brand",
  "data-testid": testId,
}: SemiCircleProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = size / 2 - 4;
  const cy = size / 2 + 4;
  const d = `M 4 ${cy} A ${r} ${r} 0 0 1 ${size - 4} ${cy}`;
  const circumference = Math.PI * r;
  return (
    <div
      data-testid={testId}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="semi-circle-progress"
    >
      <svg width={size} height={size / 2 + 4} viewBox={`0 0 ${size} ${size / 2 + 4}`}>
        <path className="circular-progress-track" d={d} strokeWidth={8} />
        <path
          className={`circular-progress-fill circular-progress-fill-${color}`}
          d={d}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
        />
      </svg>
    </div>
  );
}
