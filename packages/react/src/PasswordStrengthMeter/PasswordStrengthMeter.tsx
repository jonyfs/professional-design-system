export interface PasswordStrengthMeterProps {
  value: string;
  "data-testid"?: string;
}

type Level = "empty" | "weak" | "fair" | "strong";

const LEVEL_LABEL: Record<Level, string> = {
  empty: "",
  weak: "Weak",
  fair: "Fair",
  strong: "Strong",
};

// Ported from src/scripts/password-strength-meter.js (research.md R5) —
// a transparent, presentation-layer heuristic, not a production password
// policy. Length + character-class diversity, mapped to 4 levels driving
// Progress's existing fill mechanism (reused verbatim).
export function scorePassword(value: string): { level: Level; score: number } {
  if (!value) return { level: "empty", score: 0 };
  let classes = 0;
  if (/[a-z]/.test(value)) classes++;
  if (/[A-Z]/.test(value)) classes++;
  if (/[0-9]/.test(value)) classes++;
  if (/[^a-zA-Z0-9]/.test(value)) classes++;

  const lengthScore = Math.min(value.length / 12, 1);
  const classScore = classes / 4;
  const score = Math.round(((lengthScore + classScore) / 2) * 100);

  const level: Level = score < 34 ? "weak" : score < 67 ? "fair" : "strong";
  return { level, score };
}

// React's style prop compiles to a direct DOM property assignment, not a
// literal style="..." HTML attribute — so it isn't subject to this
// project's static-HTML CSP restriction (research.md R2), unlike the
// vanilla script's CSSOM workaround.
export function PasswordStrengthMeter({
  value,
  "data-testid": testId,
}: PasswordStrengthMeterProps) {
  const { level, score } = scorePassword(value);
  return (
    <div data-testid={testId}>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Password strength"
      >
        <div
          className="progress-fill password-strength-meter-fill"
          data-level={level}
          style={{ width: `${score}%` }}
        />
      </div>
      {/* Separate from the progressbar's accessible name above (always
          non-empty): aria-live announces the level as it changes. */}
      <span aria-live="polite" className="mt-1 inline-block text-xs text-neutral-600">
        {LEVEL_LABEL[level]}
      </span>
    </div>
  );
}
