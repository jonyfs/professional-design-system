# Data Model: Flagship App Showcase

All entities are static, bundled, fictional sample data (spec.md
FR-009) — no persistence, no network fetch.

## Team Member

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable identity |
| `name` | string | Fictional |
| `initials` | string | For `Avatar`/`AvatarGroup` fallback |
| `role` | string | e.g. "Admin", "Member" |

## Organization (for ContextSwitcher)

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `name` | string | Fictional company name |
| `avatarInitials` | string | |

## Table Row (DataTable)

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `name` | string | Fictional customer/project name |
| `status` | `"active" \| "pending" \| "churned"` | Drives a `Badge` variant |
| `value` | number | A plausible currency-like metric |
| `updatedAt` | string (ISO date) | Fictional, recent |

## Chart Series Point

| Field | Type | Notes |
|---|---|---|
| `label` | string | e.g. month name |
| `value` | number | Fictional trend value |

## Notification

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `message` | string | Fictional, plausible product event |
| `timestamp` | string | Fictional, relative-friendly |
| `read` | boolean | For `NotificationCenter`'s unread state |

## Metric (stat card)

| Field | Type | Notes |
|---|---|---|
| `label` | string | e.g. "Monthly Recurring Revenue" |
| `value` | string | Pre-formatted display value |
| `trend` | `"up" \| "down" \| "flat"` | Drives `RingProgress`/badge color semantics |
