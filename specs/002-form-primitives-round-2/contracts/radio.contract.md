# Component Contract: Radio

## Markup contract (group of 3)

```html
<fieldset class="space-y-2">
  <legend class="text-sm font-medium text-neutral-900">Shipping method</legend>

  <div class="flex items-center gap-2">
    <input
      id="radio-standard"
      type="radio"
      name="shipping-method"
      checked
      class="h-4 w-4 border-neutral-300 text-brand
             focus-visible:outline focus-visible:outline-2
             focus-visible:outline-offset-2 focus-visible:outline-brand
             disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <label for="radio-standard" class="text-sm text-neutral-900 cursor-pointer">
      Standard (5-7 days)
    </label>
  </div>

  <div class="flex items-center gap-2">
    <input
      id="radio-express"
      type="radio"
      name="shipping-method"
      class="h-4 w-4 border-neutral-300 text-brand
             focus-visible:outline focus-visible:outline-2
             focus-visible:outline-offset-2 focus-visible:outline-brand
             disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <label for="radio-express" class="text-sm text-neutral-900 cursor-pointer">
      Express (1-2 days)
    </label>
  </div>

  <div class="flex items-center gap-2">
    <input
      id="radio-disabled"
      type="radio"
      name="shipping-method"
      disabled
      class="peer h-4 w-4 border-neutral-300 text-brand
             focus-visible:outline focus-visible:outline-2
             focus-visible:outline-offset-2 focus-visible:outline-brand
             disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <label for="radio-disabled" class="text-sm text-neutral-900 peer-disabled:opacity-50">
      Same-day (unavailable)
    </label>
  </div>
</fieldset>
```

The disabled option's input carries `peer` and its label carries
`peer-disabled:opacity-50`, dimming the label in lockstep with the input —
same fix applied to Checkbox's disabled label in feature 001 (code review
finding), applied here from the start rather than found later.

Note: radio inputs render as circles by their native `type="radio"` UA
styling combined with Tailwind's form-friendly reset — no `rounded-full`
class is needed or added (the shape is intrinsic to the input type, not a
border-radius utility, so it is not subject to the Principle IV radius
allowlist).

## Required attributes (Principle II + V gates, FR-001)

| State | Required attribute/class |
|---|---|
| grouping | shared `name` attribute across all options in the group (native mutual exclusivity) |
| checked | native `checked` attribute/property; `text-brand` renders the selected-dot color via native `accent`/`text-*` mapping (non-text use) |
| focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand` |
| disabled | native `disabled` attribute + `disabled:opacity-50 disabled:cursor-not-allowed`, combinable with `checked` |

## Keyboard behavior (FR-005)

Native `<input type="radio">` sharing a `name` already provides Tab-to-group,
arrow-key navigation within the group, and Space/click selection — no
custom JS required, same precedent as feature 001's Checkbox.

## Token allowlist used

`border-neutral-300`, `text-brand`, `text-neutral-900`. No raw palette
classes permitted (FR-004). No new tokens (research.md verified).

## Acceptance mapping

- FR-001, FR-004, FR-005, FR-006 → this contract
- SC-002, SC-004 → verified by `tests/e2e/radio.spec.ts`,
  `scripts/audit-tokens.mjs`
