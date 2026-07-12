# Component Contract: Stat/Metric Card

## Markup contract

```html
<div class="card">
  <p class="text-sm font-medium text-neutral-600">Monthly Revenue</p>
  <p class="mt-1 text-3xl font-bold text-neutral-900">$48,200</p>
  <p class="mt-2 flex items-center gap-1 text-sm">
    <span class="text-success-strong" aria-hidden="true">↑</span>
    <span class="text-success-strong">12%</span>
    <span class="text-neutral-600">vs last month</span>
  </p>
</div>
```

**Compositional pattern, no new CSS class** — composes the existing `.card`
class + already-ratified typography tokens. The trend indicator's text
reuses Badge's `text-success-strong`/`text-error-strong` tokens directly
(no new pairing to verify — identical usage context, text-on-white, as
Badge already established).

## Required classes (Principle V gate)

Non-interactive container — no state suffixes of its own.

## Required attributes

- The trend arrow (if decorative) is `aria-hidden="true"`; the actual
  percentage/direction is conveyed in real text, not the glyph alone

## Token allowlist used

`text-neutral-600`, `text-neutral-900`, `text-success-strong`,
`text-error-strong` — all already-ratified, reused verbatim. No new
tokens.

## Acceptance mapping

- FR-009, SC-001 → `tests/e2e/stat-card.spec.ts`
