# Component Contract: Button

## Markup contract

```html
<button
  type="button"
  class="inline-flex items-center justify-center rounded-md bg-brand-dark px-4 py-2
         text-sm font-semibold text-white shadow-sm
         hover:shadow-md
         active:scale-[0.98]
         focus-visible:outline focus-visible:outline-2
         focus-visible:outline-offset-2 focus-visible:outline-brand
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-[box-shadow,transform] duration-150"
>
  Primary action
</button>
```

**AAA note**: the resting fill is `bg-brand-dark` (#004BB3), not `bg-brand`
(#0066FF) — `text-white` on `bg-brand` measures 4.83:1 (fails the 7:1 AAA
gate); `bg-brand-dark` measures 7.90:1 (passes). Found and fixed during
`/speckit-analyze` before implementation. Hover/active feedback is therefore
expressed via elevation (`shadow-md`) and a press-down transform
(`scale-[0.98]`) instead of lightening the fill, so every state keeps the
same AAA-safe text/background pairing. `bg-brand` remains valid for the
focus-visible outline (a non-text UI-boundary use, needs only 3:1 — measures
4.83:1 against the white page background).

Secondary variant swaps `bg-brand-dark`/`text-white` for a neutral-outline
treatment (`border border-neutral-300 bg-white text-neutral-900
hover:bg-neutral-50`) — same state suffix set applies unchanged (already AAA:
`text-neutral-900` on white/neutral-50 measures 17.7:1/17.0:1).

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| hover | `hover:shadow-md` (or variant equivalent — never lighten an AAA-critical fill) |
| active | `active:scale-[0.98]` (or variant equivalent) |
| focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand` |
| disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |

## Required attributes

- `type="button"` (never implicit `submit` unless inside a form that intends it)
- `disabled` native attribute when disabled (no ARIA substitute needed — native
  semantics already communicate this to assistive tech)

## Token allowlist used

`bg-brand-dark` (resting/hover/active fill), `bg-brand` (focus-visible outline
only), `text-white`, `text-neutral-900`, `border-neutral-300`, `bg-neutral-50`,
`rounded-md`. No raw palette classes permitted (FR-005).

## Acceptance mapping

- FR-001, FR-006, FR-007 (partial — native `disabled` suffices) → this contract
- SC-001, SC-002, SC-004 → verified by `tests/e2e/button.spec.ts` and
  `scripts/audit-tokens.mjs`
