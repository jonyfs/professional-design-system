# Data Model: Micro-Interaction & Utility Primitives

This feature is static markup + Tailwind CSS with minimal vanilla JS; "entities"
here describe the shape of the HTML/attribute data each component's markup
carries, not a runtime data layer.

## Tooltip

| Field | Type | Notes |
|---|---|---|
| `trigger` | element (any) | The element the tooltip is associated with; must be natively focusable or given `tabindex="0"` |
| `label` | string | Short text content of the tooltip; no interactive/focusable content permitted (WAI-ARIA tooltip pattern) |
| `placement` | `top`\|`right`\|`bottom`\|`left` | Drives which `anchor()` offset is used; `top` is the default |
| visible state | boolean, derived | Never stored — purely `:hover`/`:focus-visible` driven, no JS state |

## Textarea

| Field | Type | Notes |
|---|---|---|
| `label` | string | Required, same as TextInput |
| `value` | string | Current content |
| `rows` | integer | Default `4` |
| `error` | string\|null | Same treatment as TextInput's inline error |
| `disabled` | boolean | Same treatment as TextInput |

## Popover

| Field | Type | Notes |
|---|---|---|
| `trigger` | button element | Real `<button>`, `aria-expanded` synced to open state |
| `content` | arbitrary markup | Unlike Dropdown Menu, not constrained to a menu-item list |
| `open` state | boolean | Driven by the Popover API (`popover="auto"`), not a custom flag |

## Progress

| Field | Type | Notes |
|---|---|---|
| `value` | number\|null | `null` → indeterminate state (edge case from spec) |
| `min` | number | Default `0` |
| `max` | number | Default `100` |
| `label` | string | Accessible name, e.g. "Upload progress" |

## Divider

| Field | Type | Notes |
|---|---|---|
| `orientation` | `horizontal`\|`vertical` | Drives `<hr>` vs `role="separator"` `<div>` and border side |
| `semantic` | boolean | `true` → real `<hr>`; `false` → `role="separator"` div (non-semantic, layout-only break) |

## Button Group

| Field | Type | Notes |
|---|---|---|
| `name` | string | Shared `name` attribute across all radio inputs in the group — the native exclusivity mechanism (R2) |
| `options` | array of `{value, label, disabled?}` | Each renders as one visually-hidden `<input type="radio">` + styled `<label>` segment |
| `activeValue` | string | Which option's radio is `checked` by default |

## Skeleton

| Field | Type | Notes |
|---|---|---|
| `shape` | `text`\|`avatar-sm`\|`avatar-lg`\|`card` | Selects which preset dimensions/radius apply |
| (no data fields) | — | Purely decorative; carries no real content |

## Context Menu

| Field | Type | Notes |
|---|---|---|
| `target` | element | The element `contextmenu` is bound to |
| `items` | array of `{id, label, onSelect, disabled?}` | Same shape as Dropdown Menu's `DropdownMenuItemData` |
| `panelPosition` | `{x, y}`, derived | Set imperatively from `event.clientX/clientY`, clamped to viewport (R5) — not stored as persistent state |

## Empty State

| Field | Type | Notes |
|---|---|---|
| `icon` | slot (optional) | Any existing icon markup |
| `heading` | string | Short explanation |
| `description` | string | Optional longer explanation |
| `action` | Button (optional) | Reuses the existing Button component verbatim (R6) |

## Kbd

| Field | Type | Notes |
|---|---|---|
| `keys` | string or string[] | One or more key labels, e.g. `["⌘", "K"]` |

## Relationships

- **Button Group** reuses the same native `name`-attribute exclusivity
  mechanism already established for Accordion's exclusive group (R2) — no
  new relationship type, same pattern applied to a new component.
- **Context Menu** and **Dropdown Menu** share `items` shape and roving-focus
  behavior but diverge in positioning (R5); they are not a shared component,
  just a shared JS pattern partially forked.
- **Popover** and **Dropdown Menu** share the identical open/close/Anchor-
  Positioning mechanism; Popover is a strict content-generalization of
  Dropdown Menu's wiring.
- **Empty State** composes **Button** (optional action) and existing
  typography classes; it introduces no new entity of its own beyond a
  markup recipe (R6).
- **Skeleton**'s `avatar-sm`/`avatar-lg` shapes reuse **Avatar**'s exact
  `h-8 w-8`/`h-10 w-10` dimensions so a skeleton-to-real swap never shifts
  layout (spec FR-004).
