import type { ReactNode } from "react";

export interface SystemBannerAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface SystemBannerProps {
  severity: "info" | "warning";
  message: ReactNode;
  action?: SystemBannerAction;
  /** Stretches to the width of its container (`w-full`) instead of the
   * default inline-sized alert — the Maintenance/Announcement Bar
   * variant. Corner rounding is unchanged (this catalog's radius
   * allowlist has no "none" value; see research.md R4) — a full-bleed,
   * truly edge-to-edge look is a consuming app's own layout choice
   * (e.g. rendering this outside any padded container), not something
   * this component can force from the inside. */
  fullWidth?: boolean;
  "data-testid"?: string;
}

// Feature 030 (contracts/system-banners.contract.md) — a single
// parametrized component covering both the 2FA/Verification reminder
// and Maintenance/Announcement Bar inventory items, since both are
// pure content/layout variants of the same Alert reuse (plan.md's
// Structure Decision), not two near-identical hand-copied components.
// Persistent and non-dismissible by design — neither variant has a
// close control.
export function SystemBanner({
  severity,
  message,
  action,
  fullWidth,
  "data-testid": testId,
}: SystemBannerProps) {
  const classes = ["alert", `alert-${severity}`, fullWidth ? "w-full" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div data-testid={testId} className={classes}>
      <p className="flex-1 text-sm font-medium text-neutral-900">{message}</p>
      {action && (
        <a href={action.href ?? "#"} onClick={action.onClick} className="btn-secondary shrink-0">
          {action.label}
        </a>
      )}
    </div>
  );
}
