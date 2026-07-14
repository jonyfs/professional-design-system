# Component Contract: Data-Display Micro-Components — Avatar Group, Highlight, Code, ColorSwatch (User Story 3)

## Avatar Group

- Markup: a row of `.avatar-img`/`.avatar-fallback` elements (reused
  verbatim from the existing Avatar component) with negative-margin
  overlap; when `members.length > limit`, the last visible slot is
  replaced with a `.avatar-fallback`-styled "+N" chip instead of an
  avatar.
- Behavior: purely presentational — no interaction state beyond
  whatever the individual Avatar images already have (e.g. broken-image
  fallback).
- Edge case: `members.length <= limit` → no "+N" indicator renders at
  all (spec.md Edge Cases).

## Highlight

- Markup: the source text split into plain and `<mark>`-wrapped
  segments wherever `query` matches, case-insensitively (spec.md
  FR-008); reuses this catalog's existing `mark`/typography token
  (research.md, feature 018 entry #59).
- Behavior: purely presentational, re-computed whenever `text` or
  `query` changes; no matches → renders `text` unchanged with no `<mark>`
  elements.

## Code

- Markup: `inline` variant is a `<code>` element sharing Kbd's
  `font-mono` token inline within running text; `block` variant is a
  `<pre><code>` block with the same monospace token, in its own
  full-width surface (background reuses an already-ratified neutral
  surface token, no new background color).
- Behavior: purely presentational, no interaction state.

## ColorSwatch

- Markup: a small square/circle chip whose `background-color` is set to
  `value` (inline style, since the value is caller-supplied and
  unbounded — the one component in this batch where an inline style is
  necessary rather than a Tailwind class, consistent with how this
  catalog's Chart components already set data-driven colors inline)
  plus a visually-hidden (`.sr-only`) text node stating `label`
  (research.md R8) — never conveying the color by hue alone.
- Behavior: purely presentational, no interaction state.

## Acceptance mapping

- Spec.md US3 AC1–AC4 → this contract.
- FR-007, FR-008, FR-009, FR-010, FR-016 → this contract.
