import type { HTMLAttributes } from "react";

export interface StatCardTrend {
  /** "up" renders the success-strong ↑ treatment, "down" the error-strong ↓. */
  direction: "up" | "down";
  /** The change magnitude, e.g. "12%" or "0.6%". */
  value: string;
  /** Optional trailing caption, e.g. "vs last month". */
  caption?: string;
}

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Metric label, e.g. "Monthly Revenue". */
  label: string;
  /** The headline metric value, e.g. "$48,200". */
  value: string;
  /** Optional directional trend row. */
  trend?: StatCardTrend;
}

// Direct port of src/components/stat-card/stat-card.html (feature 015) —
// pure composition of the existing .card class + typography tokens, no new
// CSS. Trend direction maps to the -strong severity text tokens.
const TREND_CLASSES: Record<StatCardTrend["direction"], string> = {
  up: "text-success-strong",
  down: "text-error-strong",
};

const TREND_ARROWS: Record<StatCardTrend["direction"], string> = {
  up: "↑",
  down: "↓",
};

export function StatCard({ label, value, trend, className, ...rest }: StatCardProps) {
  const classes = ["card", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      <p className="text-sm font-medium text-neutral-600">{label}</p>
      <p className="mt-1 text-3xl font-bold text-neutral-900">{value}</p>
      {trend ? (
        <p className="mt-2 flex items-center gap-1 text-sm">
          <span className={TREND_CLASSES[trend.direction]} aria-hidden="true">
            {TREND_ARROWS[trend.direction]}
          </span>
          <span className={TREND_CLASSES[trend.direction]}>{trend.value}</span>
          {trend.caption ? <span className="text-neutral-600">{trend.caption}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
