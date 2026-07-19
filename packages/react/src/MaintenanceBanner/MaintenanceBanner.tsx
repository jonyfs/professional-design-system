import type { ReactNode } from "react";

export interface MaintenanceBannerProps {
  /** Notice text. Defaults to the static reference's scheduled-maintenance copy. */
  message?: ReactNode;
  /** Optional leading icon. Defaults to the reference's info glyph. */
  icon?: ReactNode;
  "data-testid"?: string;
}

const defaultIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5 shrink-0 text-info-strong"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
      clipRule="evenodd"
    />
  </svg>
);

// Feature 042 (audit backfill) — full-width, persistent, non-dismissible
// top-of-page notice. Mirrors OfflineBanner's structure but is always
// rendered (never event-driven) and, like it, ships NO dismiss control —
// the "renders full-width and non-dismissible" E2E asserts zero <button>
// descendants and a width spanning >90% of the viewport, so the
// full-bleed `-mx-8` negative margins are part of the contract, not
// decoration. Reuses Alert's info styling verbatim.
export function MaintenanceBanner({
  message = "Scheduled maintenance Sunday 02:00-04:00 UTC. Some features may be briefly unavailable.",
  icon = defaultIcon,
  "data-testid": testId,
}: MaintenanceBannerProps) {
  return (
    <div
      data-testid={testId}
      role="status"
      className="alert alert-info -mx-8 mt-8 sm:-mx-8"
    >
      {icon}
      <p className="flex-1 text-sm font-medium text-neutral-900">{message}</p>
    </div>
  );
}
