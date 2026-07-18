# Research: Data Display Composables

## R1: Batch scoping — trivial composables split from genuinely-new-pattern candidates

**Decision**: This feature ships only the 4 Data Display candidates
the inventory itself flags as "trivial CSS composition"/"reuses
existing tokens verbatim" (ThemeIcon, BackgroundImage, Blockquote,
Watermark). The other 5 remaining candidates (OverflowList,
RollingNumber, PickList/Transfer, Gallery, Compare) each carry a "new
pattern" buildability signal requiring genuine new JS/interaction
logic — deliberately deferred to a future feature rather than
combined into one oversized batch (this session's established
4-5-item batch-size precedent, e.g. features 029-032).

**Rationale**: Mixing trivial composables with genuinely new
interaction patterns in one feature would either under-scope the
planning/testing rigor the complex items need, or over-scope the
trivial items with unnecessary process — splitting by implementation
complexity keeps both future features appropriately sized.

## R2: ThemeIcon reuses Badge's exact color convention, Avatar's exact size convention

**Correction, found by checking Badge's real markup rather than
assuming its color set**: Badge itself ships only 4 variants
(success/error/warning/neutral — verified directly against
`badge.html`, no `info` or `brand` badge exists). ThemeIcon's broader
purpose (general semantic iconography, not specifically a status
label) warrants this catalog's full 5 semantic/brand roles — all
already-ratified tokens, just not all surfaced by Badge specifically.
`info`'s opacity/ring values are taken from Alert's own `.alert-info`
(`bg-info/5 ring-info/20`, verified directly), and `brand` from the
existing `brand-light`/`brand-dark` pair buttons already use — no new
token in either case, only a new application of ones already ratified.

`.theme-icon-{success,warning,error,info,brand}` classes: `bg-{color}/
5 ring-1 ring-inset ring-{color}/{20 or 10, matching each color's real
existing value — success/info use `/20`, error/warning use `/10`,
verified per-color, not assumed uniform}` plus `text-{color}-strong`
for the icon's `currentColor` (brand uses `text-brand-dark` on
`bg-brand-light`, matching Button's own convention since brand has no
`-strong` suffix token), in a `rounded-full` circle instead of Badge's
`rounded-md` pill. `.theme-icon-sm`/`.theme-icon-lg` reuse Avatar's
exact `h-8 w-8`/`h-10 w-10` dimensions.

**Rationale**: Verified directly against `badge.html`'s real per-
variant classes and `.avatar-sm`/`.avatar-lg` in `tailwind.css` — zero
new color or size token needed.

## R3: Blockquote uses existing typography tokens only

**Decision**: A left border accent (`border-l-4 border-neutral-300`),
indent (`pl-4`), and italicized body text (`italic text-neutral-600`)
— no new font, size, or color token. An optional `<cite>` uses the
existing `text-sm text-neutral-600` convention this catalog already
applies to secondary/caption text elsewhere (e.g. Card's own
secondary-text pattern).

## R4: BackgroundImage's scrim reuses the existing overlay/backdrop convention

**Decision**: The scrim reuses this catalog's existing `bg-neutral-
900/50`-style overlay convention (the same darkening approach Modal/
Slide-over's `::backdrop` already uses via `theme("colors.neutral.500
/ 75%")`), applied as an absolutely-positioned layer between the
background image and the foreground content — not a new opacity/color
token, a new application of an existing one.

**Fallback, per spec.md Edge Case**: the container's own `bg-neutral-
200` (an existing neutral token) is set as the CSS `background-color`
underneath the `background-image`, so a failed image load still shows
a neutral surface, never a broken/transparent gap.

## R5: Watermark is a pure CSS repeating-background technique

**Decision**: An SVG data URI (generated once per instance, containing
the caller's text) set as a tiled `background-image` at low opacity
(`opacity-10`-equivalent, via the SVG's own fill alpha, not a
component-level opacity token) on a layer BEHIND the foreground
content (`z-0` vs. foreground's `z-10`), using existing neutral tokens
for the watermark text color. No new dependency (no watermark.js
library) — the tiling is CSS `background-repeat`, the rotation (a
common watermark diagonal look) is CSS `background-image` SVG
`transform`, not a JS-driven canvas technique.

## Summary

All 4 primitives are pure composition of already-ratified tokens and
existing overlay/typography conventions — zero new design tokens,
zero new dependencies, matching the inventory's own buildability
signal for every item in this batch.
