# Data Model: Lists Primitive

## List

A vertical container of List Items.

| Field | Type | Notes |
|---|---|---|
| items | List Item[] | Ordered; rendered top to bottom |

**CSS**: `.list` — `divide-y divide-neutral-200 rounded-md border
border-neutral-200 bg-white` (mirrors the constitution's documented
Tables row-divider pattern for visual consistency across "listing"
components — note Table itself has not been implemented as a shipped
component, so this reuses the ratified *token choice*, not existing
Table markup; the bordered container itself is new but composed
entirely from already-ratified tokens).

## List Item

A single row: avatar + title + metadata + optional trailing action.

| Field | Type | Notes |
|---|---|---|
| avatar | Avatar (image or fallback) | Reuses `.avatar-img`/`.avatar-fallback` + `avatar-lg` verbatim (feature 006) — not a new entity |
| title | string | `text-sm font-semibold text-neutral-900`, truncates with ellipsis if it overflows |
| metadata | string (optional) | `text-xs text-neutral-600` — corrected from the previously-ratified `text-neutral-500` (research.md R1); absent metadata does not break avatar vertical centering |
| trailingAction | Badge \| icon \| none | Right-aligned, vertically centered; MUST be non-interactive when the row itself is interactive (FR-007) |
| interactive | boolean | When true, the entire row is wrapped in a single `<a href>`; when false, the row is a plain `<div>`/`<li>` with no click target |

**States** (interactive variant only, Principle V):

- Default: no background change
- Hover: `hover:bg-neutral-50`
- Focus-visible: visible outline ring (existing `focus-visible:outline`
  pattern used by every other interactive component in this project)
- Active: `active:bg-neutral-100` (matching the already-ratified
  `active:` state completeness fix noted elsewhere in the constitution)

**Validation rules**:

- A List Item's `trailingAction`, when present on an `interactive` row,
  MUST NOT itself be a focusable element (no nested `<button>`/`<a>`
  inside the row's own `<a>`) — enforced structurally in the markup, not
  via a runtime check, since this is static HTML with no JS behavior.
