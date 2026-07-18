# Data Model: Advanced Form Inputs Batch

## Tag (TagsInput)

| Field | Type | Notes |
|---|---|---|
| `value` | string | Freeform text, no fixed option list |
| `id` | string | Stable key for the removable-tag list (derived from insertion order + value) |

## Autocomplete Option

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable identity |
| `label` | string | Display text, matched via `filterOptions` |

## Mention Token

| Field | Type | Notes |
|---|---|---|
| `id` | string | The mentioned entity's stable identity |
| `label` | string | Display text rendered inside the token (e.g. `@jane`) |
| `startOffset` / `endOffset` | number | Character range within the host text field's value the token occupies, so it can be selected/deleted as one unit |

## Cascade Level Option

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable identity within its level |
| `label` | string | Display text |
| `children` | `CascadeLevelOption[]` (optional) | Present on non-leaf nodes; absence marks a leaf |

## Cascade Path

| Field | Type | Notes |
|---|---|---|
| `path` | `string[]` | Ordered array of selected ids, root to committed leaf/level |

## Tree Node (TreeSelect)

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable identity |
| `label` | string | Display text |
| `children` | `TreeNode[]` (optional) | Reuses TreeView's existing nesting shape |
| `selectable` | boolean | Whether this specific node (leaf or intermediate) may be committed as the value |

## Mask Pattern (InputMask)

| Field | Type | Notes |
|---|---|---|
| `pattern` | string | e.g. `"(999) 999-9999"` — `9` = digit placeholder, other characters are literal |
| `preset` | `"phone" \| "date" \| "currency" \| "custom"` | Selects a built-in pattern or signals a caller-supplied one |

## JsonInput State

| Field | Type | Notes |
|---|---|---|
| `rawValue` | string | The textarea's current raw text |
| `isValid` | boolean | Result of the last `JSON.parse` attempt, derived not stored separately from `rawValue` |
| `errorMessage` | string (optional) | Present only when `isValid` is false |

## Range Value (RangeSlider)

| Field | Type | Notes |
|---|---|---|
| `low` | number | Always constrained `low <= high` |
| `high` | number | Always constrained `high >= low` |
| `min` / `max` | number | Shared bounds for both handles |

## FloatLabel State

| Field | Type | Notes |
|---|---|---|
| `floated` | boolean | Derived from `:focus` OR non-empty value — never stored as separate component state, purely CSS-derived |

## Rating Value (Interactive Rating)

| Field | Type | Notes |
|---|---|---|
| `value` | number | Current selected rating, 1 to `max` |
| `max` | number | Caller-configured star count, matches the existing read-only Rating's `max` |
| `interactive` | boolean | New prop; `false` preserves the exact pre-existing read-only/decorative behavior |
