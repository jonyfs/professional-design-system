import type { ReactNode } from "react";

export interface ThemeIconProps {
  icon: ReactNode;
  color: "brand" | "success" | "warning" | "error" | "info";
  size?: "sm" | "lg";
  label: string;
  "data-testid"?: string;
}

// Feature 033 (contracts/theme-icon-blockquote.contract.md) — Badge's
// exact per-color opacity/ring values in a rounded-full circle,
// Avatar's exact sm/lg dimensions. The icon itself is caller-supplied,
// not bundled (spec.md Assumptions).
export function ThemeIcon({
  icon,
  color,
  size = "lg",
  label,
  "data-testid": testId,
}: ThemeIconProps) {
  return (
    <span
      data-testid={testId}
      role="img"
      aria-label={label}
      className={`theme-icon theme-icon-${size} theme-icon-${color}`}
    >
      {icon}
    </span>
  );
}
