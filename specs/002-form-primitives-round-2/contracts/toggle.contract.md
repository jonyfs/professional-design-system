# Component Contract: Toggle / Switch

## Markup contract

```html
<label class="inline-flex cursor-pointer items-center gap-2">
  <span class="relative inline-flex h-6 w-11 items-center">
    <input
      type="checkbox"
      class="peer sr-only"
    />
    <span
      class="absolute inset-0 rounded-full ring-1 ring-inset ring-neutral-500
             bg-neutral-200 transition-colors duration-200 ease-in-out
             peer-checked:bg-brand
             peer-focus-visible:outline peer-focus-visible:outline-2
             peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand
             peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
    ></span>
    <span
      class="pointer-events-none absolute left-0.5 h-5 w-5 translate-x-0 transform
             rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
             peer-checked:translate-x-5 peer-disabled:opacity-50"
    ></span>
  </span>
  <span class="text-sm text-neutral-900">Enable notifications</span>
</label>
```

**AAA/contrast note**: the ratified Component Catalog pattern for Toggles
(`bg-neutral-200`/`bg-brand` track, shadow-only dot) measures 1.24:1 for
the off-state track against a white page — below the 3:1 non-text UI
component threshold (WCAG 1.4.11). Not a Principle II violation (that
principle only mandates AAA for text), but a real perceivability gap for a
brand-new component. Fixed here with `ring-1 ring-inset ring-neutral-500`
(4.83:1 against white) on the track, in both off and on states — an
already-ratified token, no constitution amendment required. See
research.md for the full analysis and the deliberate decision to leave
feature 001's existing `ring-neutral-300` boundaries (Text Input,
Checkbox, Badge) unchanged and out of scope.

**Verification note**: `ring-neutral-500`'s job is done entirely in the
off state, where the track fill (`neutral-200`) is otherwise nearly
invisible (1.24:1). In the on state, `bg-brand` alone already clears 3:1
against white (≈4.83:1), and the ring's *inner* edge against `bg-brand`
computes to ≈1.0:1 (their luminances are nearly identical) — effectively
invisible at that internal boundary. The ring is still correct to keep
state-invariant (its *outer* edge against the white page is what matters,
and that's consistently 4.83:1 regardless of on/off), but it is not doing
independent perceptual work in the on state. Worth re-checking if a future
feature ever places the track against a non-white surface.

## Required classes (state coverage, FR-003)

| State | Required utility |
|---|---|
| off | `bg-neutral-200` (track); `ring-1 ring-inset ring-neutral-500` is state-invariant — present on the track in every state, not just off (see contrast note above) |
| on | `peer-checked:bg-brand` (track); `peer-checked:translate-x-5` (dot) |
| focus-visible | `peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand` |
| disabled | `peer-disabled:opacity-50 peer-disabled:cursor-not-allowed` on the track AND `peer-disabled:opacity-50` on the dot (both must dim together — a sibling-only fix on the track alone leaves the dot full-opacity), combinable with either off or on |

## Required attributes

The underlying control is a native `<input type="checkbox" class="peer sr-only">`
— visually hidden (`sr-only`) but present in the accessibility tree and
keyboard-operable exactly like Checkbox. Its `checked` state is exposed to
assistive technology natively; no `role="switch"` or `aria-checked` is
added, consistent with feature 001's "native semantics first, no redundant
ARIA" precedent (FR-006).

## Keyboard behavior (FR-005)

Native `<input type="checkbox">` toggles on Space when focused, and the
visually-hidden input still receives Tab focus and click activation via its
wrapping `<label>` — no custom JS required.

## Token allowlist used

`bg-neutral-200`, `bg-brand`, `ring-neutral-500`, `bg-white`,
`text-neutral-900`. No raw palette classes permitted (FR-004). No new
tokens — `neutral-500` and `brand` are both part of the existing ratified
palette.

## Acceptance mapping

- FR-003, FR-004, FR-005, FR-006 → this contract
- SC-002, SC-004 → verified by `tests/e2e/toggle.spec.ts`,
  `scripts/audit-tokens.mjs`
