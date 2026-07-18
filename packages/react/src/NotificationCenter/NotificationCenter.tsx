import { useId } from "react";
import { useNotificationPanel } from "../hooks/useNotificationPanel";

export interface NotificationCenterItem {
  message: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationCenterProps {
  items: NotificationCenterItem[];
  triggerTestId?: string;
  panelTestId?: string;
}

// Feedback primitive (contracts/notification-center.contract.md) — a bell
// trigger with an unread-count badge (Indicator's classes composed
// directly here; this catalog has no dedicated React Indicator
// component to import), opening a panel of past notifications via the
// native Popover API (Dropdown Menu's existing mechanism, reused).
export function NotificationCenter({
  items,
  triggerTestId,
  panelTestId,
}: NotificationCenterProps) {
  const { panelRef, triggerRef } = useNotificationPanel();
  const panelId = useId();
  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <>
      <span className="indicator-wrapper">
        <button
          ref={triggerRef}
          type="button"
          data-testid={triggerTestId}
          className="notification-center-trigger"
          aria-label="Notifications"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
        {unreadCount > 0 && (
          <span className="indicator indicator-error" aria-hidden="true">
            {unreadCount}
          </span>
        )}
      </span>

      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-label="Notifications"
        data-testid={panelTestId}
        className="notification-center-panel"
      >
        {items.length === 0 ? (
          <div className="notification-center-empty">No notifications yet.</div>
        ) : (
          items.map((item, i) => (
            <div
              key={i}
              className={
                item.read
                  ? "notification-center-item"
                  : "notification-center-item notification-center-item-unread"
              }
            >
              <p className="font-medium text-neutral-900">{item.message}</p>
              <p className="text-xs text-neutral-600">{item.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
