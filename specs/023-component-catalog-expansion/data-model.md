# Phase 1 Data Model: Component Catalog Expansion (Batch 1)

Each of the 14 components is largely independent; entities are grouped
by the user story they belong to.

## User Story 1 — Form Inputs

### NumberInput
- **value**: current numeric value (or empty).
- **min**, **max**, **step**: bounds and increment size; clamped on
  blur if the typed value falls outside `[min, max]` (spec.md Edge
  Cases).
- **disabled**: suppresses both stepper buttons and direct typing.

### PasswordInput
- **value**: current text value (masked or plain, depending on
  visibility state).
- **visible**: boolean — whether the field currently renders as
  `type="text"` (shown) or `type="password"` (hidden); toggling MUST
  NOT reset `value`, selection range, or scroll position.

### MultiSelect
- **options**: the full candidate list (`{id, label}[]`).
- **selectedIds**: `Set<string>` of currently chosen option ids,
  rendered as removable chips.
- **query**: current filter text narrowing `options` (reuses Combobox's
  existing filter-matching logic, research.md R3).
- Relationship: removing a chip removes its id from `selectedIds`
  without touching `query` or the open/closed state of the options
  panel.

## User Story 2 — Button Variants

### ActionIcon
- **icon**: the rendered icon (caller-supplied).
- **ariaLabel**: mandatory accessible name (spec.md FR-004 — no visible
  text label exists, so this is not optional).

### CopyButton
- **textToCopy**: the value written to the clipboard on click.
- **status**: `"idle" | "copied" | "failed"` — transient states shown
  after a click, reverting to `"idle"` after a fixed delay (research.md
  R7).

### SplitButton
- **primaryAction**: the default action fired by the main segment.
- **menuActions**: `{id, label, onTrigger}[]` shown in the attached
  dropdown segment (reuses Dropdown Menu's existing panel, research.md
  R4).

## User Story 3 — Data-Display Micro-Components

### AvatarGroup
- **members**: the full list of avatars to display.
- **limit**: maximum avatars shown before collapsing into a "+N"
  overflow indicator (spec.md Edge Cases: if `members.length <= limit`,
  no overflow indicator renders at all).

### Highlight
- **text**: the full text to render.
- **query**: substring(s) to visually highlight, matched case-
  insensitively (spec.md FR-008).

### Code
- **variant**: `"inline" | "block"`.
- **content**: the code text, rendered in this catalog's existing
  monospace token (research.md: shares Kbd's `font-mono`).

### ColorSwatch
- **value**: the color to display (any valid CSS color).
- **label**: required accessible text alternative naming/describing the
  color (spec.md FR-010, research.md R8) — never color alone.

## User Story 4 — Navigation & Disclosure Utilities

### NavLink
- **href**: the link target.
- **current**: boolean — sets `aria-current="page"` and Sidebar's
  existing active-item visual treatment (research.md R6) when true.

### Anchor
- **href**, **children**: a styled inline link; no additional state.

### Collapse
- **open**: boolean — current expanded/collapsed state, backed by a
  native `<details>` element (research.md R5) — no group/sibling
  relationship (distinct from Accordion).

### Spoiler
- **open**: same shape as Collapse's `open`.
- **maxLines** (or **maxHeight**): the truncation threshold before the
  "Show more" control appears; only relevant while `open` is false.
- Relationship: Spoiler IS a Collapse with an added pre-open truncation
  measurement — not a separate mechanism.
