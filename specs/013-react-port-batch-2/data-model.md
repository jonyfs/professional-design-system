# Data Model: React Port — Batch 2

Each entity below is the React prop shape for its component, derived
directly from its static reference's demonstrated variants (spec
FR-001/FR-008 — no invented supersets).

## Pagination

| Prop | Type | Notes |
|---|---|---|
| currentPage | number | 1-indexed |
| totalPages | number | |
| onPageChange | (page: number) => void | Called for Previous/Next/page-number activation |
| pageTestId | (page: number) => string \| undefined | Optional, for per-page `data-testid` |

Previous/Next render as `<button disabled>` at boundaries (matching the
static reference's genuinely-disabled controls), `<a>`-equivalent
(`<button>`, since there's no real navigation target in the harness)
otherwise. The static reference has zero JavaScript, so each of its
demo page-states (`pagination.html`'s "middle page"/"first page"/"last
page"/"single page" sections) is hand-authored HTML, not the output of
a computed algorithm — there is no real truncation *logic* to port
verbatim. This feature's React port implements a straightforward,
generic page-window function (always show page 1 and `totalPages`,
show `currentPage - 1`/`currentPage`/`currentPage + 1`, ellipsis for
any gap) rather than reverse-engineering the static demo's exact
hardcoded ellipsis placement — the ratified *contract* is genuinely-
disabled boundaries + `aria-current`, not one specific truncation
layout.

## Sidebar

| Prop | Type | Notes |
|---|---|---|
| theme | "light" \| "dark" | |
| items | { id: string; label: string; href: string; active?: boolean }[] | |
| onItemClick | ((id: string) => void) \| undefined | Optional; does not replace `href` |

Items render as real `<a href>` elements, not `<button>` — the static
reference (`sidebar.html`) uses `<a href="#">` for every item, and the
constitution's own catalog explicitly warns against a button standing
in for a real anchor when navigation is the actual semantic (a
feature-007 code-review lesson). `href` is therefore required, not
optional, preserving native link affordances (ctrl/cmd-click, "open in
new tab", status-bar href preview) that a callback-only API would lose
— unlike Pagination, whose harness genuinely has no navigation target
and documents that tradeoff explicitly rather than silently.

## Navbar

| Prop | Type | Notes |
|---|---|---|
| brand | ReactNode | |
| links | { label: string; href: string }[] | |

Mobile menu is a native `<details>`/`<summary>` (research.md R1) — no
open/close prop needed, the browser owns the state.

## Avatar

| Prop | Type | Notes |
|---|---|---|
| src | string \| undefined | Image variant when present |
| alt | string | Required for the image variant; used as the fallback's `aria-label` |
| initials | string \| undefined | Fallback variant when `src` is absent |
| size | "sm" \| "lg" | |

## Card

| Prop | Type | Notes |
|---|---|---|
| elevated | boolean | Applies `.card-elevated` |
| children | ReactNode | |

## List

| Prop | Type | Notes |
|---|---|---|
| items | ListItemData[] | |
| interactive | boolean | Whole-row `<a>` when true (feature 011) |

**ListItemData**: `{ id, avatar: { src?, alt, initials? }, title, metadata?, href?, trailing?: ReactNode }`

`href` is required per-item when the list's `interactive` prop is
`true` (every row becomes a real `<a tabindex="0" href={href}>`); it is
ignored (rows render as plain, non-interactive `<div>`s) when
`interactive` is `false`. A `List` with `interactive` set and an item
missing `href` is a caller error, not a supported "callback-only" mode
— this feature doesn't add one, matching FR-008.

## Table

| Prop | Type | Notes |
|---|---|---|
| columns | string[] | Header labels |
| rows | { cells: ReactNode[] }[] | |
| zebra | boolean | Applies `.data-table-row-zebra` |
| ariaLabel | string | Required — the wrapper's `aria-label` (feature 012's `scrollable-region-focusable` fix); each static demo instance uses a distinct, contextual label, not one generic string reused across every table on a page |

## Alert

| Prop | Type | Notes |
|---|---|---|
| variant | "success" \| "error" \| "warning" \| "info" | |
| message | string | |
| onDismiss | (() => void) \| undefined | Dismiss control renders only when provided (research.md R6) |

## Combobox

| Prop | Type | Notes |
|---|---|---|
| label | string | |
| options | { value: string; label: string; disabled?: boolean }[] | |
| onCommit | (value: string) => void | Called when an option is committed (Enter or click) |

**Internal hook state** (`useCombobox`): `query: string`, `filtered: Option[]`, `activeIndex: number`, `isOpen: boolean` — mirrors `combobox.js`'s exact state shape (research.md R3).

## Command Palette

| Prop | Type | Notes |
|---|---|---|
| actions | { id: string; label: string; disabled?: boolean; onExecute: () => void }[] | |

Opens globally via Cmd/Ctrl+K (research.md R4); no `open`/`onClose` prop
exposed to the consumer — the component owns its own visibility
entirely, matching the static reference's self-contained global-shortcut
behavior (unlike Modal, which is consumer-controlled).
