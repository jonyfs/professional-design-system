# Component Contract: Badge

## Markup contract (one per variant)

```html
<span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs
             font-medium text-success-strong ring-1 ring-inset ring-success/20">
  Success
</span>

<span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs
             font-medium text-error-strong ring-1 ring-inset ring-error/10">
  Error
</span>

<span class="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs
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
| success | `bg-green-50` | `text-success-strong` | `ring-success/20` |
| error | `bg-red-50` | `text-error-strong` | `ring-error/10` |
| warning | `bg-amber-50` | `text-warning-strong` | `ring-warning/10` |
| neutral | `bg-neutral-50` | `text-neutral-600` | `ring-neutral-500/10` |

This mapping matches the constitution's Data Display section (v1.3.0). The
text color uses the AAA-safe `-strong` status variant and the ring uses the
base status token via Tailwind's opacity modifier — both ratified tokens, no
raw palette classes. **AAA note**: the original mapping (copied from the
pre-v1.3.0 constitution) used the base `text-success`/`text-error`/
`text-warning` tokens directly, which measured 2.07–3.44:1 against their tint
backgrounds — well below the 7:1 AAA gate. Found during `/speckit-analyze`
and fixed by adding the `-strong` tokens (constitution amendment to v1.3.0)
before any component code was written. `text-neutral-600` on `bg-neutral-50`
was already AAA-compliant (7.23:1) and is unchanged.

## Long-label handling (Edge Case)

Badge MUST NOT force a fixed width; long labels wrap via the parent's normal
inline-flow. If a badge sits in a fixed-width container, the container (not
the badge) is responsible for `truncate`/`max-w-*` — badge markup itself
stays width-agnostic to remain reusable.

## Acceptance mapping

- FR-003, FR-005 → this contract
- SC-004 → verified by `scripts/audit-tokens.mjs`
