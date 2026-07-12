# Component Contract: Button Group / Segmented Control

## Markup contract

```html
<div class="button-group" role="group" aria-label="View mode">
  <input type="radio" name="view-mode" id="vm-list" value="list" class="sr-only" checked />
  <label for="vm-list" class="button-group-segment">List</label>

  <input type="radio" name="view-mode" id="vm-grid" value="grid" class="sr-only" />
  <label for="vm-grid" class="button-group-segment">Grid</label>

  <input type="radio" name="view-mode" id="vm-table" value="table" class="sr-only" disabled />
  <label for="vm-table" class="button-group-segment">Table</label>
</div>
```

```css
.button-group {
  @apply inline-flex rounded-md shadow-sm;
}
.button-group-segment {
  @apply relative -ml-px inline-flex cursor-pointer items-center px-3 py-2
    text-sm font-semibold text-neutral-700 ring-1 ring-inset ring-neutral-300
    first:ml-0 first:rounded-l-md last:rounded-r-md hover:bg-neutral-50;
}
/* Plain adjacent-sibling selector — the label immediately follows its own
   radio input in source order, so no :has()/:checked-scoping trick is
   needed (unlike Toggle's peer-based pattern, which needs peer-* because
   its label isn't a sibling in the same way). */
input:checked + .button-group-segment {
  @apply z-10 bg-brand-dark text-white ring-brand-dark;
}
input:focus-visible + .button-group-segment {
  @apply outline outline-2 outline-offset-2 outline-brand;
}
input:disabled + .button-group-segment {
  @apply cursor-not-allowed opacity-50;
}
```

**Zero JavaScript** (R2): native `<input type="radio">` sharing one `name`
provides exclusivity, arrow-key-moves-selection, and single-Tab-stop-for-
the-group behavior for free — the same mechanism this catalog already
established for Accordion's exclusive group, applied to a new component
rather than porting Tabs' custom roving-tabindex widget.

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| hover (unchecked segment) | `hover:bg-neutral-50` |
| checked/active | `input:checked + .button-group-segment { bg-brand-dark text-white }` |
| focus-visible | `input:focus-visible + .button-group-segment { outline ... }` |
| disabled | `input:disabled + .button-group-segment { opacity-50 cursor-not-allowed }` |

## Required attributes

- `role="group"` + `aria-label` on the container
- Shared `name` attribute across all radios in one group
- Radio inputs visually hidden via `sr-only`, never `display: none` /
  `visibility: hidden` (both remove focusability)

## Token allowlist used

`bg-brand-dark`, `text-white`, `ring-neutral-300`, `text-neutral-700` — the
`bg-brand-dark`/`text-white` pairing re-verified at 7.90:1 (R2, identical to
Sidebar's prior finding since it's the same two colors). No new tokens.

## Acceptance mapping

- FR-007, SC-001, SC-002 → `tests/e2e/button-group.spec.ts` (native
  radio-group keyboard behavior asserted directly, not assumed, per R9)

## Cross-engine note (found via real CI failure, not planning)

What happens on an ArrowRight/ArrowDown press past the LAST enabled
option in a group containing a disabled option genuinely differs by
engine — confirmed empirically after a CI-only WebKit failure that never
reproduced locally on Chromium: Chromium/Firefox wrap the selection back
to the first enabled option; WebKit's native radio-group navigation
instead stays on the last enabled option, never wrapping past the
disabled one. Both are legitimate native behaviors for a `disabled`
sibling radio — this component has zero JavaScript by design (R2), so
neither is "fixed"; the test asserts only the one guarantee that holds
across all three engines (the disabled option itself is never reachable
via keyboard), not the wrap-around endpoint.
