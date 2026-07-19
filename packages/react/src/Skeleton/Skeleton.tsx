import type { HTMLAttributes } from "react";

export type SkeletonVariant = "text" | "avatar-sm" | "avatar-lg" | "card";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Preset shape. Default "text". */
  variant?: SkeletonVariant;
}

// Direct port of src/components/skeleton/skeleton.html (feature 014). The
// .skeleton base class bundles animate-pulse + motion-reduce:animate-none;
// every preset is decorative, so the placeholder is always aria-hidden.
const VARIANT_CLASSES: Record<SkeletonVariant, string> = {
  text: "skeleton-text",
  "avatar-sm": "skeleton-avatar-sm",
  "avatar-lg": "skeleton-avatar-lg",
  card: "skeleton-card",
};

export function Skeleton({ variant = "text", className, ...rest }: SkeletonProps) {
  const classes = ["skeleton", VARIANT_CLASSES[variant], className]
    .filter(Boolean)
    .join(" ");
  return <div aria-hidden="true" className={classes} {...rest} />;
}
