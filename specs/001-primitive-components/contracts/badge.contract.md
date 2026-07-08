# Component Contract: Badge

## Markup contract (one per variant)

```html
<span class="inline-flex items-center rounded-md bg-success/5 px-2 py-1 text-xs
             font-medium text-success-strong ring-1 ring-inset ring-success/20">
  Success
</span>

<span class="inline-flex items-center rounded-md bg-error/5 px-2 py-1 text-xs
             font-medium text-error-strong ring-1 ring-inset ring-error/10">
  Error
</span>

<span class="inline-flex items-center rounded-md bg-warning/5 px-2 py-1 text-xs
             font-medium text-warning-strong ring-1 ring-inset ring-warning/10">
  Warning
</span>

<span class="inline-flex items-center rounded-md bg-neutral-50 px-2 py-1 text-xs
             font-medium text-neutral-600 ring-1 ring-inset ring-neutral-500/10">
  Neutral
</span>
```

## Required variant → token mapping (FR-003, exactly four variants)

| Variant | Background | Text | Ring |
|---|---|---|---|
| success | `bg-success/5` | `text-success-strong` | `ring-success/20` |
| error | `bg-error/5` | `text-error-strong` | `ring-error/10` |
| warning | `bg-warning/5` | `text-warning-strong` | `ring-warning/10` |
| neutral | `bg-neutral-50` | `text-neutral-600` | `ring-neutral-500/10` |

This mapping matches the constitution's Data Display section (v1.3.1).
Background and ring both use the base status token via Tailwind's opacity
modifier; text uses the AAA-safe `-strong` variant — all three are ratified
tokens, no raw palette classes anywhere.

**AAA note (text, v1.3.0 fix)**: the original mapping used the base
`text-success`/`text-error`/`text-warning` tokens directly as text, which
measured 2.07–3.44:1 against their tint backgrounds — well below the 7:1 AAA
gate. Fixed by adding the `-strong` tokens.

**Token-discipline note (background, v1.3.1 fix)**: the original mapping used
raw Tailwind default-palette classes (`bg-green-50`/`bg-red-50`/`bg-amber-50`)
for the background — never part of the ratified palette, a Principle IV
violation caught by a second `/speckit-analyze` pass. Fixed by switching to
`bg-success/5`/`bg-error/5`/`bg-warning/5` (verified AAA-safe with the
`-strong` text on top: 7.11–8.72:1). `text-neutral-600` on `bg-neutral-50`
was already AAA-compliant (7.23:1) and both are already-ratified neutral-scale
tokens — unchanged.

## Long-label handling (Edge Case)

Badge MUST NOT force a fixed width; long labels wrap via the parent's normal
inline-flow. If a badge sits in a fixed-width container, the container (not
the badge) is responsible for `truncate`/`max-w-*` — badge markup itself
stays width-agnostic to remain reusable.

## Acceptance mapping

- FR-003, FR-005 → this contract
- SC-004 → verified by `scripts/audit-tokens.mjs`
