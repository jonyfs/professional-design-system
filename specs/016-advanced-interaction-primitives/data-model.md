# Data Model: Advanced Interaction Primitives

## TreeView

- **Node**: a labeled entry, optionally containing child Nodes.
  - `label`: string, the visible/accessible text.
  - `children`: ordered list of Node, empty/absent for a leaf.
  - `expanded`: boolean, tracked natively by the browser via each
    corresponding `<details>` element's own `open` attribute — not
    modeled as application state, since the browser owns it.
- Relationship: recursive (a Node's `children` are themselves Nodes).
  Rendered as `<li>` → (`<details><summary>label</summary><ul>children
  </ul></details>` for a branch, or plain text for a leaf) → repeat.

## Rating

- **Rating**: a single subject's score.
  - `value`: number, 0–5 (or whatever `max` is configured to), the real,
    displayed source of truth.
  - `max`: number, the upper bound (defaults to 5, matching the
    conventional 5-star convention).
  - `label`: string, the visible text rendering of `value`/`max` (e.g.
    "4.2 out of 5") — always present, never solely implied by the star
    count.
- No relationships; a purely presentational, self-contained composition
  (reuses Card/typography, no new entity beyond the value itself).

## Menubar

- **Menubar**: an ordered collection of top-level MenuTrigger items, of
  which at most one may have its associated panel open at a time.
- **MenuTrigger**: one top-level item.
  - `label`: string, e.g. "File".
  - `items`: ordered list of MenuItem, rendered in this trigger's panel.
  - Reuses Dropdown Menu's own established Trigger/Panel/MenuItem shape
    verbatim (feature 005's `data-model.md`) — Menubar adds no new fields
    to that shape, only a new *sibling relationship* (roving tabindex
    among multiple Triggers on one row) that Dropdown Menu's own
    single-trigger model never needed.
- **MenuItem**: identical to Dropdown Menu's existing MenuItem entity
  (label, optional disabled flag) — not redefined here.

## ColorPicker/ColorInput

- **ColorInput**: a single color value.
  - `value`: a 7-character hex string (`#RRGGBB`), the native `<input
    type="color">` element's own `value` property — no separate
    application-level representation needed.
  - `disabled`: boolean, native `disabled` attribute.
- No relationships; a single native form control, styled only.
