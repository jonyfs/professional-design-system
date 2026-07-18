# Contract: Offline Banner, 2FA Reminder, Maintenance Bar

All three reuse `.alert`/`.alert-info`/`.alert-warning` verbatim
(`src/styles/tailwind.css`, research.md R4) — zero new CSS classes.

## `src/scripts/offline-banner.js`

```js
// Feature 030 — this catalog's first use of the native online/offline
// events (research.md R3). No polling, no server ping.
//
// Real bug found by running this against a live browser, not assumed:
// the native `hidden` attribute does NOT reliably hide `.alert` — its
// `@apply flex` gives it an author-origin `display: flex` declaration,
// which the CSS cascade lets win over the browser's UA-origin
// `[hidden] { display: none }` default regardless of selector
// specificity (author styles always outrank UA styles as a cascade
// origin). Every prior use of `.alert`/Toast in this catalog only ever
// permanently removes the element on dismiss (alert.js/toast.js both
// call `.remove()`), so this collision never surfaced before — Offline
// Banner is the first component needing to show/hide the SAME element
// repeatedly. Fixed via direct CSSOM `style.display` assignment (the
// same pattern `src/scripts/progress.js` already uses for this
// project's CSP), which — being inline style — outranks any
// class-based `display` declaration.
export function initOfflineBanner() {
  const banner = document.getElementById("offline-banner");
  if (!banner) return;

  function render() {
    banner.style.display = navigator.onLine ? "none" : "";
  }

  window.addEventListener("online", render);
  window.addEventListener("offline", render);
  render(); // correct initial state on load, not just after the first transition
}
```

## Static HTML usage

### Offline Banner (auto show/hide, no dismiss control)

```html
<div id="offline-banner" data-testid="offline-banner" role="status" class="alert alert-warning">
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 shrink-0 text-warning-strong">...</svg>
  <p class="flex-1 text-sm font-medium text-neutral-900">You're offline. Some features may be unavailable.</p>
</div>
```

### 2FA/Verification reminder banner (persistent, has an action, no dismiss)

```html
<div data-testid="two-factor-reminder-banner" class="alert alert-warning">
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 shrink-0 text-warning-strong">...</svg>
  <p class="flex-1 text-sm font-medium text-neutral-900">Add two-factor authentication to secure your account.</p>
  <a href="#" data-testid="two-factor-reminder-action" class="btn-secondary shrink-0">Complete setup</a>
</div>
```

### Maintenance/Announcement Bar (full-width, persistent, no `max-w-*` wrapper)

Correction, found by the token audit (not assumed clean): `rounded-none`
is not in this catalog's `borderRadius` allowlist
(`shared/design-tokens.ts` only ratifies `sm`/`md`/`lg`/`full`) — the
full-width look comes entirely from the wrapper's negative margin
breaking out of `.page-shell`'s padding, not from removing the
corner radius. `.alert`'s own `rounded-md` is left unchanged.

```html
<div data-testid="maintenance-banner" class="alert alert-info -mx-8 mt-8 sm:-mx-8">
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 shrink-0 text-info-strong">...</svg>
  <p class="flex-1 text-sm font-medium text-neutral-900">Scheduled maintenance Sunday 02:00-04:00 UTC. Some features may be briefly unavailable.</p>
</div>
```

## React wrapper shape

```tsx
export interface SystemBannerProps {
  severity: "info" | "warning";
  message: string;
  action?: { label: string; href?: string; onClick?: () => void };
  /** Stretches to the container's width (`w-full`) — true full-bleed
   * (spanning the viewport) is a consuming app's own layout choice. */
  fullWidth?: boolean;
  "data-testid"?: string;
}
export function SystemBanner({ severity, message, action, fullWidth, "data-testid": testId }: SystemBannerProps) {
  return (
    <div data-testid={testId} className={`alert alert-${severity}${fullWidth ? " w-full" : ""}`}>
      <p className="flex-1 text-sm font-medium text-neutral-900">{message}</p>
      {action && (
        <a href={action.href ?? "#"} onClick={action.onClick} className="btn-secondary shrink-0">
          {action.label}
        </a>
      )}
    </div>
  );
}

export interface OfflineBannerProps {
  "data-testid"?: string;
}
export function OfflineBanner({ "data-testid": testId }: OfflineBannerProps) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (isOnline) return null;
  return (
    <div data-testid={testId} role="status" className="alert alert-warning">
      <p className="flex-1 text-sm font-medium text-neutral-900">You're offline. Some features may be unavailable.</p>
    </div>
  );
}
```

## Acceptance mapping

- FR-002, FR-003, spec.md US2 Acceptance Scenarios 1-3 → the markup/scripts above
- spec.md Edge Case (simultaneous banners) → each renders independently, no stacking logic
