import type { ReactNode } from "react";

export type IndicatorColor = "error" | "success" | "warning" | "info" | "neutral";

export interface IndicatorProps {
  /** The host element the badge is positioned over (icon, avatar, etc.). */
  children: ReactNode;
  /**
   * Full accessible text announced for the host, e.g.
   * "3 unread notifications" — rendered in a visually-hidden .sr-only span.
   */
  label: string;
  /** "count" shows a number; "dot" shows a bare status dot. */
  variant?: "count" | "dot";
  /** Numeric count for the "count" variant. */
  count?: number;
  /** Overflow ceiling; counts above render as `${max}+`. Default 99. */
  max?: number;
  /** Severity color. Uses the -strong-calibrated .indicator-* tokens. */
  color?: IndicatorColor;
  "data-testid"?: string;
}

// Direct port of src/components/indicator/indicator.html (feature 015) — a
// positioned overlay badge distinct from Badge. The badge itself is
// aria-hidden; the accessible name lives in the .sr-only span so screen
// readers get the real count, not a decorative "99+".
const COLOR_CLASSES: Record<IndicatorColor, string> = {
  error: "indicator-error",
  success: "indicator-success",
  warning: "indicator-warning",
  info: "indicator-info",
  neutral: "indicator-neutral",
};

export function Indicator({
  children,
  label,
  variant = "count",
  count,
  max = 99,
  color = "error",
  "data-testid": testId,
}: IndicatorProps) {
  const isDot = variant === "dot";
  const badgeClasses = [
    "indicator",
    COLOR_CLASSES[color],
    isDot && "indicator-dot",
  ]
    .filter(Boolean)
    .join(" ");

  const displayCount =
    typeof count === "number" ? (count > max ? `${max}+` : String(count)) : null;

  return (
    <span className="indicator-wrapper" data-testid={testId}>
      {children}
      <span className="sr-only">{label}</span>
      <span className={badgeClasses} aria-hidden="true">
        {isDot ? null : displayCount}
      </span>
    </span>
  );
}
