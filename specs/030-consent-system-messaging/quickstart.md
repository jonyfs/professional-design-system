# Quickstart: Consent & System Messaging Primitives

## Prerequisites

- Repo installed (`npm install`), dev server available via `npm run dev` (static site, port 5173) and `npm run dev --workspace=tests/react-harness` (React harness, port 5174).

## Validate Session Timeout Modal

1. Open `/src/components/session-timeout-modal/session-timeout-modal.html`.
2. Click "Simulate session timeout warning" — the modal opens showing `30s` counting down.
3. Wait for it to reach `0s` — confirm the "You have been signed out." text replaces the countdown.
4. Re-trigger, then click "Stay signed in" before it reaches zero — confirm the modal closes and the countdown stops (no console errors from a stray interval).

## Validate Offline Banner

1. Open `/src/components/offline-banner/offline-banner.html`.
2. Via DevTools (Network tab → Offline) or Playwright's `context.setOffline(true)`, go offline — confirm the banner appears automatically, no manual action.
3. Go back online — confirm it disappears automatically.

## Validate 2FA reminder / Maintenance Bar

1. Open `/src/components/two-factor-reminder-banner/two-factor-reminder-banner.html` and `/src/components/maintenance-banner/maintenance-banner.html`.
2. Confirm both render with Alert's existing severity coloring, no dismiss button, and (Maintenance Bar only) full page width.

## Validate Dark Mode Toggle

1. Open `/src/components/dark-mode-toggle/dark-mode-toggle.html`.
2. Toggle it on — confirm `document.documentElement.dataset.theme === "dim"` and the page visibly re-themes.
3. Reload the page — confirm the `dim` theme persisted (localStorage-backed, per feature 017).
4. Change the page's "Preview theme" `<select>` to any 3rd theme (e.g. `synthwave`) — confirm the toggle shows "off", not a stale "on".

## Full regression

`npx playwright test` — confirm zero regressions against the pre-existing catalog, per `tests/e2e/consent-system-messaging.spec.ts`'s own dedicated suite passing across all 6 browser/viewport projects first.
