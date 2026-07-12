# Component Contract: Tooltip

## Markup contract

```html
<span class="tooltip-wrapper">
  <button type="button" class="btn-secondary" aria-describedby="tt-1" tabindex="0">
    <svg aria-hidden="true" class="h-4 w-4">...</svg>
    <span class="sr-only">Delete</span>
  </button>
  <span role="tooltip" id="tt-1" class="tooltip tooltip-top">
    Delete item
  </span>
</span>
```

```css
.tooltip-wrapper {
  @apply relative inline-block;
}
.tooltip {
  @apply pointer-events-none absolute z-50 whitespace-nowrap rounded-md
    bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 shadow-sm
    transition-opacity duration-150;
  anchor-name: --tooltip-trigger;
}
.tooltip-top {
  position: fixed;
  position-anchor: --tooltip-trigger;
  bottom: anchor(top);
  left: anchor(center);
  translate: -50% -6px;
}
.tooltip-wrapper:hover .tooltip,
.tooltip-wrapper:focus-within .tooltip {
  @apply opacity-100 delay-300;
}
```

**No Popover API, no JavaScript** (R4): visibility is purely `:hover`/
`:focus-within` (the wrapper contains the trigger, so `:focus-within` fires
identically to a hypothetical `:focus-visible` on the trigger itself)
driven; `anchor-name`/`position-anchor`/`anchor()` (confirmed supported in
all three target browser engines per feature 010's `CSS.supports()` check,
R4) handle placement only.

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| hover | `.tooltip-wrapper:hover .tooltip { opacity-100 }` |
| focus-visible (via wrapper `:focus-within`) | `.tooltip-wrapper:focus-within .tooltip { opacity-100 }` |
| trigger's own focus-visible | unchanged — trigger keeps its existing `focus-visible:outline` per its own component contract (Button/icon-button) |

## Required attributes

- `role="tooltip"` on the label element
- `aria-describedby` on the trigger, referencing the tooltip's `id`
- Trigger MUST be natively focusable or carry `tabindex="0"`
- Tooltip content MUST NOT contain any focusable/interactive element (WAI-ARIA tooltip pattern — a tooltip is never itself operable)

## Token allowlist used

`bg-neutral-900`, `text-white`, `rounded-md`. No new tokens.

## Acceptance mapping

- FR-005, SC-001, SC-002 → `tests/e2e/tooltip.spec.ts`
- Edge case (disabled trigger) → wrapper's `:hover`/`:focus-within` fires
  regardless of the trigger's own `disabled` state, since the wrapper — not
  the disabled control — receives the hover/focus-within match
