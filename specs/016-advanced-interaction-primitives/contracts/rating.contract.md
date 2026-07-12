# Component Contract: Rating

## Markup contract

```html
<div class="rating" data-testid="rating">
  <span class="rating-stars" aria-hidden="true">
    <svg class="rating-star-filled" viewBox="0 0 20 20" fill="currentColor">...</svg>
    <svg class="rating-star-filled" viewBox="0 0 20 20" fill="currentColor">...</svg>
    <svg class="rating-star-filled" viewBox="0 0 20 20" fill="currentColor">...</svg>
    <svg class="rating-star-filled" viewBox="0 0 20 20" fill="currentColor">...</svg>
    <svg class="rating-star-empty" viewBox="0 0 20 20" fill="currentColor">...</svg>
  </span>
  <span class="rating-value">4.2 out of 5</span>
</div>
```

```css
.rating {
  @apply flex items-center gap-2;
}
.rating-stars {
  @apply flex items-center gap-0.5;
}
.rating-star-filled {
  @apply h-4 w-4 text-warning;
}
.rating-star-empty {
  @apply h-4 w-4 text-neutral-300;
}
.rating-value {
  @apply text-sm text-neutral-600;
}
```

Whole/empty star technique (research.md R2) — a fractional value (4.2)
rounds to the nearest whole star for the VISUAL only (4 filled + 1 empty);
the real value is always the separately-rendered `.rating-value` text,
never implied by star count alone. No SVG `clip-path`/gradient partial-fill
hack (would risk Principle III's Tailwind-only architecture for a
precision the spec doesn't actually require). Star glyphs are wrapped
`aria-hidden="true"` — they carry zero unique information, matching the
project's existing decorative-icon pattern (e.g. Stat Card's trend arrow).

**Contrast note (decorative-only exception, not a new gap)**: `text-warning`
(2.15:1) and `text-neutral-300` (1.47:1) both fail even AA's 3:1 non-text
floor as raw figures — but since both are `aria-hidden` and the real value
is always present as separate visible text (FR-003), this is the same
class of already-accepted decorative-element exception this catalog uses
for Stepper's/Timeline's connector lines (research.md R7, feature 015).
No new token introduced; `warning`/`neutral-300` are both already ratified
for other uses.

## Required classes (Principle V gate)

Non-interactive/decorative — no state suffixes apply (read-only display
only in this feature; a clickable/settable rating input is explicitly
deferred, per spec.md Assumptions).

## Required attributes

- `aria-hidden="true"` on `.rating-stars` — the numeric value is the real,
  always-present information carrier
- Real visible text for `.rating-value` (e.g. "4.2 out of 5"), never
  omitted even when a review/vote count is zero (spec.md Edge Cases: no
  rating value is displayed with no real backing data implied — omit the
  whole component rather than show a value with nothing behind it)

## Token allowlist used

`text-warning`, `text-neutral-300`, `text-neutral-600` — all
already-ratified, reused verbatim. No new tokens.

## Acceptance mapping

- FR-003, FR-004, SC-001 → `tests/e2e/rating.spec.ts`
