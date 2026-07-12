# Data Model: Feedback & Data Display Primitives

This feature is static markup + Tailwind CSS with one small vanilla JS
module (PinInput); "entities" here describe the shape of the HTML/attribute
data each component's markup carries, not a runtime data layer.

## Spinner

| Field | Type | Notes |
|---|---|---|
| `size` | `sm`\|`lg` | Reuses Avatar's `h-8 w-8`/`h-10 w-10` scale |
| `label` | string | Accessible name, e.g. "Loading" — visually hidden |

## AspectRatio

| Field | Type | Notes |
|---|---|---|
| `ratio` | string (e.g. `16/9`, `1/1`, `4/3`) | Per-instance Tailwind `aspect-[…]` utility, not a ratified token |
| `content` | media element (img/iframe/video) | The constrained child |

## Indicator

| Field | Type | Notes |
|---|---|---|
| `variant` | `dot`\|`count` | Dot = no content, just a colored circle; count = a number |
| `count` | number\|null | `null` → dot variant; a number → capped display at "99+" per spec.md Edge Cases |
| `status` | `success`\|`error`\|`warning`\|`info`\|`neutral` | Reuses Badge's existing severity tokens |

## DataList

| Field | Type | Notes |
|---|---|---|
| `items` | array of `{term, description}` | Real `<dl>`/`<dt>`/`<dd>` semantic pairs |

## Slider

| Field | Type | Notes |
|---|---|---|
| `min` | number | Native `min` attribute |
| `max` | number | Native `max` attribute |
| `value` | number | Native `value` attribute |
| `step` | number | Native `step` attribute |
| `label` | string | Required accessible name |

## Stepper

| Field | Type | Notes |
|---|---|---|
| `steps` | array of `{label, status}` | `status`: `completed`\|`current`\|`upcoming` |
| `currentIndex` | number | Which step is `current` |

## File Input

| Field | Type | Notes |
|---|---|---|
| `accept` | string | Native `accept` attribute (e.g. `.pdf,.png`) |
| `label` | string | Required label |
| `selectedFileName` | string\|null | Displayed once a file is chosen (native `input.files[0].name`) |

## Timeline

| Field | Type | Notes |
|---|---|---|
| `events` | array of `{timestamp, actor, description, avatar?}` | Chronologically ordered; `avatar` reuses the Avatar component |

## Stat/Metric Card

| Field | Type | Notes |
|---|---|---|
| `value` | string | The prominent number/metric |
| `label` | string | What the metric represents |
| `trend` | `{direction: "up"|"down", value: string}`\|null | Optional trend indicator, reuses Badge's success/error tokens for up/down |

## PinInput

| Field | Type | Notes |
|---|---|---|
| `length` | number | How many boxes (e.g. 6 for a 6-digit code) |
| `value` | string | The assembled code across all boxes |

## Relationships

- **Slider** and **Progress** (feature 014) share the identical
  `bg-brand-dark`/`bg-neutral-200` fill/track color pairing (R1) — not a
  shared component, just a shared, already-verified token pairing.
- **Stepper**'s current/completed-step treatment reuses Pagination's
  `bg-brand-dark text-white` active-item pairing verbatim (R7).
- **Timeline**'s per-event actor slot reuses the existing **Avatar**
  component verbatim, the same reuse relationship List and Table already
  have with Avatar.
- **Indicator**'s status variant reuses **Badge**'s existing severity
  color tokens (success/error/warning/info/neutral) rather than inventing
  new ones.
- **Stat/Metric Card** composes the existing **Card** component and its
  optional trend indicator reuses **Badge**'s success/error tokens — the
  same "compose, don't reinvent" precedent as Empty State (feature 014).
- **File Input** reuses **TextInput**'s visual language (border, radius,
  focus ring) for visual consistency, though the underlying element and
  interaction model differ (native file picker vs. text entry).
