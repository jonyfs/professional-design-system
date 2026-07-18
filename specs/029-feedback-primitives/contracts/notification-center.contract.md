# Contract: Notification Center

## `src/styles/tailwind.css` additions

```css
@layer components {
  .notification-center-trigger {
    @apply relative inline-flex h-10 w-10 items-center justify-center
      rounded-md text-neutral-600 hover:bg-neutral-100
      focus-visible:outline focus-visible:outline-2
      focus-visible:outline-offset-2 focus-visible:outline-brand;
  }
  .notification-center-panel {
    @apply w-80 rounded-lg border border-neutral-200 bg-neutral-50 p-2 shadow-lg;
  }
  .notification-center-item {
    @apply flex flex-col gap-1 rounded-md p-3 text-sm;
  }
  .notification-center-item-unread {
    @apply bg-brand-light/20;
  }
  .notification-center-empty {
    @apply p-6 text-center text-sm text-neutral-600;
  }
}
```

## Static HTML usage

Reuses Indicator's existing badge (`.indicator-wrapper`/`.indicator`)
and Dropdown Menu's existing native Popover API mechanics verbatim:

```html
<span class="indicator-wrapper">
  <button
    type="button"
    id="notification-trigger"
    popovertarget="notification-panel"
    data-testid="notification-trigger"
    class="notification-center-trigger"
    aria-label="Notifications"
  >
    <svg aria-hidden="true" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  </button>
  <span class="indicator indicator-error" data-testid="notification-badge" aria-hidden="true">3</span>
</span>

<div
  id="notification-panel"
  popover="auto"
  role="region"
  aria-label="Notifications"
  data-testid="notification-panel"
  class="notification-center-panel"
>
  <div class="notification-center-item notification-center-item-unread" data-testid="notification-item-1">
    <p class="font-medium text-neutral-900">New comment on your post</p>
    <p class="text-xs text-neutral-600">2 minutes ago</p>
  </div>
  <div class="notification-center-item" data-testid="notification-item-2">
    <p class="font-medium text-neutral-900">Weekly report ready</p>
    <p class="text-xs text-neutral-600">1 day ago</p>
  </div>
</div>
```

Empty state (spec.md Edge Cases):

```html
<div class="notification-center-empty" data-testid="notification-empty">No notifications yet.</div>
```

## React wrapper shape

```tsx
interface NotificationCenterItem {
  message: string;
  timestamp: string;
  read: boolean;
}
interface NotificationCenterProps {
  items: NotificationCenterItem[];
}
export function NotificationCenter({ items }: NotificationCenterProps) {
  const unreadCount = items.filter((i) => !i.read).length;
  // Reuses the SAME popoverTargetElement/popoverTargetAction imperative
  // wiring DropdownMenu's own useDropdownMenu hook already establishes
  // (verified against packages/react/src/DropdownMenu/DropdownMenu.tsx)
  // — a manual onClick togglePopover() has a documented real bug there
  // (re-opens instead of closing). A thin, purpose-built hook mirrors
  // that same wiring rather than a fresh reimplementation.
}
```

## Acceptance mapping

- FR-002, spec.md US2 Acceptance Scenarios 1-2 → the markup above
- spec.md Edge Case (zero notifications) → `.notification-center-empty`
