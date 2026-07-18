# Data Model: Consent & System Messaging Primitives

## Session Timeout Modal

| Field | Type | Notes |
|---|---|---|
| `remainingSeconds` | number | Ticks down via `setInterval`; demo starts at a fixed value (e.g. 30s) |
| `isExpired` | boolean | Derived: `remainingSeconds <= 0` |

No persistence — a fresh page load always starts from the demo's
initial countdown value. Not tied to any real session/auth API
(spec.md Assumptions).

## Connectivity State (Offline Banner)

| Field | Type | Notes |
|---|---|---|
| `isOnline` | boolean | Sourced from `navigator.onLine`, kept live via `online`/`offline` window events |

No persistence — always reflects the browser's current live state,
never cached across reloads.

## System Banner Content (2FA reminder, Maintenance Bar)

Reuses Alert's existing shape (no new type):

| Field | Type | Notes |
|---|---|---|
| `severity` | `"info" \| "warning"` | Maps to `.alert-info`/`.alert-warning` |
| `message` | string | Static demo copy |
| `action` | `{ label: string, href?: string }` (optional) | 2FA reminder's "Complete setup" action; Maintenance Bar may omit |

## Dark Mode Toggle State

| Field | Type | Notes |
|---|---|---|
| `isDark` | boolean | **Derived**, not stored: `document.documentElement.dataset.theme === "dim"` |

No new persistence key — writes go through the existing
`selectTheme("dim" \| "light", KNOWN_THEME_IDS)` (feature 017), so the
existing `pds-theme` `localStorage` key remains the single source of
truth for every theme control in this catalog, toggle included.
