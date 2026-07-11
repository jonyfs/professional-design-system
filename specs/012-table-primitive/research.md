# Research: Table Primitive

## R1: Header/cell contrast verification

**Decision**: The constitution's existing Tables pattern is
contrast-correct as documented — no correction needed (unlike Lists'
metadata token, feature 011).

**Rationale**: Recomputed directly via the WCAG 2.1 relative-luminance
formula:

```
neutral-600 (#4B5563) vs neutral-50 (#F9FAFB) [header]: 7.23:1 → PASSES AAA
neutral-900 (#111827) vs white (#FFFFFF)      [cell text]: 17.74:1 → PASSES AAA
neutral-900 (#111827) vs neutral-50 (#F9FAFB) [zebra row]: 16.98:1 → PASSES AAA
```

This is a different outcome from Lists' investigation (feature 011),
where the documented pattern was actually wrong — Table's documented
pattern was never empirically verified either, but happens to be
correct. Verified directly rather than assumed, per this project's
established discipline (checking, not just because Lists' bug primed
an expectation of finding another one).

## R1a: Class naming — avoiding Tailwind's own core utility collisions

**Decision**: Use `.data-table`, `.data-table-header-cell`,
`.data-table-cell`, `.data-table-row-zebra` — NOT `.table`,
`.table-cell`, or `.table-row`.

**Rationale**: Directly informed by feature 011's real, empirically-
found bug (a component class named `.list-item` was silently
overridden because Tailwind's own core `display` plugin generates a
same-named utility). Checked `node_modules/tailwindcss/src/
corePlugins.js` before naming anything here, rather than repeating the
same mistake: it defines `.table { display: table }`, `.table-cell {
display: table-cell }`, and `.table-row { display: table-row }` as
core display utilities (lines 840-849). A component named `.table`
would have had this exact component's own `border`/`overflow-hidden`
declarations silently fight a conflicting `display: table` from
Tailwind's utilities layer. Confirmed `.data-table*` has no such
collision before adopting it.

## R1b: Header vs. body cell vertical padding (py-3 vs py-4)

**Decision**: Header cells use `py-3`; body cells use `py-4`.

**Rationale**: The constitution's Tables entry says only "cells `px-6
py-4`" without distinguishing header from body — this feature
implements the common, denser header convention (`py-3`) since a
header row typically carries less visual weight than data rows and
this matches the reference Tailwind UI "Simple table" pattern this
catalog entry was originally modeled on. Recorded explicitly here
(rather than left as silent implementation drift, an /speckit-analyze
finding) so the constitution update (T020) documents both values
rather than repeating the single undifferentiated `px-6 py-4`.

## R2: Semantic markup, not div-based tabular styling

**Decision**: Real `<table>`/`<thead>`/`<tbody>`/`<th scope="col">`/
`<td>` elements — not a `<div>`-grid reimplementation.

**Rationale**: Native table semantics give screen readers row/column
navigation for free (SC-004) — this project's established precedent of
"native elements over ARIA reimplementation" (Dropdown Menu's Popover
API, Breadcrumbs' `<nav>`/`<ol>`, Lists' `<a>` rows) applies identically
here. A `<div>` grid would require re-deriving `role="table"`/
`role="row"`/`role="cell"` and manual `aria-colindex` bookkeeping for no
benefit.

## R3: Zebra striping as a separate, composable variant

**Decision**: `even:bg-neutral-50` is its own opt-in class/variant, not
baked into the base row style.

**Rationale**: Matches the constitution's own phrasing ("rows with
*optional* zebra striping") and Lists' precedent of layering
read-only/interactive/trailing-action as separate compositions rather
than one do-everything class. Keeps the baseline table (User Story 1)
independently shippable without forcing the striping decision on every
consumer.

## R4: No new design tokens

**Decision**: Confirmed — `bg-neutral-50`, `text-neutral-600`,
`text-neutral-900`, `divide-neutral-200`, `px-6 py-4` are all already
ratified. No additions to `shared/design-tokens.ts` or the
constitution's Base Semantic Palette are needed.

## R5: Trailing-action cell — no new nested-interactive risk

**Decision**: A trailing `<td>` containing either a non-interactive
Badge (`<span>`, reusing Badge's exact ratified classes verbatim) or a
single text link (`<a>`) requires no special ARIA — axe-core's
`nested-interactive` rule only fires when two focusable elements nest,
and a table cell's contents are not themselves a focusable container,
so a single link inside a `<td>` is definitionally not nested.

## R6: Overflow handling on narrow viewports

**Decision**: Wrap `<table>` in a `<div class="overflow-x-auto">` for
horizontal scroll on narrow viewports (320px), rather than attempting a
responsive column-collapse ("card view") redesign.

**Rationale**: This is the standard, lowest-complexity native pattern
for tabular data on narrow viewports, and matches this project's
"primitive, not a redesign" scoping for every component so far (e.g.
Pagination doesn't attempt a mobile-specific layout beyond its existing
button sizing). A column-collapse redesign is a legitimate future
enhancement but explicitly out of scope here (spec.md Edge Cases).
