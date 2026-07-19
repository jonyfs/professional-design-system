import type { ReactNode } from "react";

export interface TwoFactorReminderBannerProps {
  /** Notice text. Defaults to the reference's 2FA prompt copy. */
  message?: ReactNode;
  /** Optional leading icon. Defaults to the reference's warning glyph. */
  icon?: ReactNode;
  /** Call-to-action label. Rendered as an anchor, never a dismiss button. */
  actionLabel?: string;
  /** Call-to-action href. */
  actionHref?: string;
  "data-testid"?: string;
  /** Test id applied to the action anchor. */
  actionTestId?: string;
}

const defaultIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5 shrink-0 text-warning-strong"
  >
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      clipRule="evenodd"
    />
  </svg>
);

// Feature 042 (audit backfill) — persistent, non-dismissible security
// reminder. A content variant of Alert (warning) with an action, NOT a
// new primitive. The action is deliberately an <a>, never a <button>:
// the "renders a persistent notice with an action, no dismiss control"
// E2E asserts the action is visible AND that the banner contains zero
// <button> descendants, so an anchor is load-bearing, not stylistic.
export function TwoFactorReminderBanner({
  message = "Add two-factor authentication to secure your account.",
  icon = defaultIcon,
  actionLabel = "Complete setup",
  actionHref = "#",
  "data-testid": testId,
  actionTestId,
}: TwoFactorReminderBannerProps) {
  return (
    <div data-testid={testId} role="status" className="alert alert-warning">
      {icon}
      <p className="flex-1 text-sm font-medium text-neutral-900">{message}</p>
      <a
        href={actionHref}
        data-testid={actionTestId}
        className="btn-secondary shrink-0"
      >
        {actionLabel}
      </a>
    </div>
  );
}
