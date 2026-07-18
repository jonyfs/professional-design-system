# Data Model: Data Display Patterns

## OverflowList Item

| Field | Type | Notes |
|---|---|---|
| `label` | string | Chip content |
| `visible` | boolean | Derived from the ResizeObserver measurement pass, not stored |

## RollingNumber Value

| Field | Type | Notes |
|---|---|---|
| `value` | number | Target value, caller-supplied |
| `displayValue` | number | Currently-animating/settled value, internal only |

## PickList Item

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable identity across panel moves |
| `label` | string | Display text |
| `panel` | `"source" \| "destination"` | Which side currently holds it |
| `selected` | boolean | Multi-select checkbox state, per-item |

## Gallery Image

| Field | Type | Notes |
|---|---|---|
| `src` | string | Full-size image URL |
| `thumbnailSrc` | string (optional) | Defaults to `src` if omitted |
| `alt` | string | Required accessible text |

## Compare State

| Field | Type | Notes |
|---|---|---|
| `position` | number (0-100) | Divider position, clamped natively by `<input type="range">` |
| `beforeSrc` / `afterSrc` | string | The two images being compared |
