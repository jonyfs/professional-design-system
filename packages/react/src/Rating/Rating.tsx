// Feature 039 real finding: Rating never had a React port before this
// feature (static-only since feature 016) — this is a NEW file, not a
// modification of a pre-existing one. Ships both the pre-existing
// read-only/decorative rendering (default, `interactive: false`) AND
// the new interactive mode in the same component, per FR-010/FR-011's
// dual-surface parity requirement (contracts/interactive-rating.contract.md).

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      className={filled ? "rating-star-filled" : "rating-star-empty"}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
    </svg>
  );
}

export interface RatingProps {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  "data-testid"?: string;
}
export function Rating({ value, max = 5, interactive = false, onChange, "data-testid": testId }: RatingProps) {
  if (!interactive) {
    return (
      <div className="rating" data-testid={testId}>
        <span className="rating-stars" aria-hidden="true">
          {Array.from({ length: max }, (_, i) => (
            <Star key={i} filled={i < Math.round(value)} />
          ))}
        </span>
        <span className="rating-value">
          {value} out of {max}
        </span>
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={`Rate this out of ${max} stars`}
      className="rating-interactive"
      data-testid={testId}
    >
      {Array.from({ length: max }, (_, i) => max - i).map((star) => (
        <label key={star} className="rating-interactive-star">
          <input
            type="radio"
            name={`rating-${testId ?? "default"}`}
            className="rating-interactive-input peer"
            checked={value === star}
            onChange={() => onChange?.(star)}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
          />
          ★
        </label>
      ))}
    </div>
  );
}
