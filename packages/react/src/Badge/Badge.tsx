import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status variant — see contracts/001-primitive-components/badge.contract.md */
  variant: "success" | "error" | "warning" | "neutral";
}

// A literal per-variant map, not `` `badge-${variant}` `` template
// interpolation: Tailwind's content scanner does static text analysis, not
// runtime evaluation — an interpolated class name is invisible to it and
// silently never gets generated at all (found by inspecting the actual
// compiled dist/styles.css, which had no .badge-success/.badge-error/etc.
// rules despite Badge.tsx "using" them).
const VARIANT_CLASSES: Record<BadgeProps["variant"], string> = {
  success: "badge-success",
  error: "badge-error",
  warning: "badge-warning",
  neutral: "badge-neutral",
};

export function Badge({ variant, className, ...rest }: BadgeProps) {
  const classes = [VARIANT_CLASSES[variant], className].filter(Boolean).join(" ");
  return <span className={classes} {...rest} />;
}
