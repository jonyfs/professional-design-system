# Component Contract: Combobox

## Markup contract

```html
<div class="relative">
  <label for="combobox-input" class="block text-sm font-medium text-neutral-900 mb-1">Country</label>
  <input
    type="text"
    id="combobox-input"
    role="combobox"
    aria-expanded="false"
    aria-controls="combobox-listbox"
    aria-activedescendant=""
    aria-autocomplete="list"
    autocomplete="off"
    popovertarget="combobox-listbox"
    data-testid="combobox-input"
    class="combobox-input"
    placeholder="Search countries…"
  />
  <ul
    id="combobox-listbox"
    role="listbox"
    popover="auto"
    data-testid="combobox-listbox"
    class="combobox-listbox"
  >
    <li id="combobox-option-0" role="option" data-testid="combobox-option-0" class="combobox-option">Argentina</li>
    <li id="combobox-option-1" role="option" data-testid="combobox-option-1" class="combobox-option">Australia</li>
    <li id="combobox-option-2" role="option" aria-disabled="true" data-testid="combobox-option-2" class="combobox-option">Austria (unavailable)</li>
    <li id="combobox-option-3" role="option" data-testid="combobox-option-3" class="combobox-option">Brazil</li>
  </ul>
</div>
```

"No results" state (rendered in place of the `<li>` options when the
current filter matches zero):

```html
<div class="combobox-empty" data-testid="combobox-empty">No results found.</div>
```

## Behavior wiring (`src/scripts/combobox.js`)

| Interaction | Behavior |
|---|---|
| Input | Filters options via case-insensitive substring match against each `<li>`'s text; wraps matched substrings in `<mark>`; re-renders `combobox-listbox`'s children; shows `.combobox-empty` when zero matches; opens the popover (`showPopover()`) if not already open and the query is non-empty |
| ArrowDown/ArrowUp | Moves `activeIndex` among currently-rendered, non-`aria-disabled` options (wrapping at both ends); updates `aria-activedescendant` on the input and `aria-selected="true"` on the newly-active `<li>` (removed from the previously-active one) |
| Enter | If an option is active (`aria-activedescendant` non-empty) and not disabled: sets the input's value to that option's label, closes the popover (`hidePopover()`), clears `aria-activedescendant` |
| Escape | Closes the popover without changing the input's value |
| Blur (focus leaves the input entirely, not into the popover) | Closes the popover — supplements the Popover API's own light-dismiss for the case focus moves via Tab rather than a click |
| Click on an enabled option | Same commit behavior as Enter |
| Click on a disabled option | No-op |

## Required attributes (Principle II gate, FR-001/FR-002/FR-003)

| Behavior | Mechanism |
|---|---|
| Combobox role/relationship | `role="combobox"` on the input, `aria-controls` pointing at the listbox `id`, `aria-expanded` synced to the popover's open state |
| Active option communicated to AT without moving real focus | `aria-activedescendant` on the input, updated on every arrow-key move |
| Each candidate identifiable | `role="option"` + a stable `id` per `<li>` |
| Filtering feedback | `aria-autocomplete="list"` |
| Disabled option skipped by AT and by keyboard/pointer | `aria-disabled="true"` (never the `disabled` attribute — `<li>` is not a form control) |

## Required states (Principle V gate)

| Element | State | Required utility |
|---|---|---|
| `.combobox-input` | resting | `ring-1 ring-inset ring-neutral-300` |
| `.combobox-input` | focus | `focus:ring-2 focus:ring-inset focus:ring-brand` |
| `.combobox-option` | hover | `hover:bg-neutral-50` |
| `.combobox-option` | active (press) | `active:bg-neutral-100` |
| `.combobox-option[aria-selected="true"]` | keyboard-active | `bg-neutral-100` |
| `.combobox-option[aria-disabled="true"]` | disabled | `cursor-not-allowed opacity-50` |

## Edge cases

- **Zero underlying options** (spec.md Edge Case): the listbox never
  opens — `combobox.js` checks `options.length === 0` before calling
  `showPopover()`, consistent with Dropdown Menu having no open state for
  an empty menu.
- **Disabled option** (spec.md Edge Case): rendered dimmed via
  `aria-disabled="true"` + `.combobox-option[aria-disabled="true"]`,
  skipped during `activeIndex` traversal, and its click handler is a
  no-op.

## Token allowlist used

`text-neutral-900` (input text, option text, match highlight — same
color, `font-semibold` only), `text-neutral-600` ("No results" text),
`text-neutral-400` (placeholder — existing Text Input pattern),
`bg-neutral-50` (hover), `bg-neutral-100` (active/keyboard-active),
`bg-white`, `ring-neutral-300`, `focus:ring-brand`. No raw palette
classes (FR-010).

## Acceptance mapping

- FR-001, FR-002, FR-003, FR-004, FR-005, FR-010, FR-011, FR-012 → this contract
- SC-001, SC-003, SC-004, SC-005 → verified by `tests/e2e/combobox.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
