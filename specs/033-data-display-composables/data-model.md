# Data Model: Data Display Composables

## ThemeIcon

| Field | Type | Notes |
|---|---|---|
| `icon` | ReactNode / SVG markup | Caller-supplied, not bundled (spec.md Assumptions) |
| `color` | `"brand" \| "success" \| "warning" \| "error" \| "info"` | Maps to `.theme-icon-{color}` |
| `size` | `"sm" \| "lg"` | Matches Avatar's existing scale |

## Blockquote

| Field | Type | Notes |
|---|---|---|
| `children` | ReactNode | The quoted content |
| `cite` | string (optional) | Attribution, rendered as `<cite>` |

## BackgroundImage

| Field | Type | Notes |
|---|---|---|
| `src` | string | Image URL |
| `children` | ReactNode | Overlaid content |

No caller-configurable scrim opacity in this batch — one consistent,
already-verified-for-contrast scrim value (spec.md Assumptions keep
scope minimal).

## Watermark

| Field | Type | Notes |
|---|---|---|
| `text` | string | The repeating watermark text |
| `children` | ReactNode | Foreground content |
