# Research: Lists Primitive

## R1: WCAG AAA contrast fix for metadata text

**Decision**: Use `text-neutral-600` (`#4B5563`) for list-item metadata
text against `bg-white`, not the previously ratified `text-neutral-500`
(`#6B7280`).

**Rationale**: Recomputed directly via the WCAG 2.1 relative-luminance
formula (the same method used for every prior contrast correction in
this project — Breadcrumbs in feature 005, Card's local workaround in
feature 006):

```
neutral-500 (#6B7280) vs white (#FFFFFF): 4.83:1  → FAILS AAA (needs 7:1)
neutral-600 (#4B5563) vs white (#FFFFFF): 7.56:1  → PASSES AAA
```

This empirically confirms the gap flagged during feature 006 (the
constitution's Lists entry states `text-xs text-neutral-500` for
metadata, but that combination fails AAA). `text-neutral-600` is already
in production use for the identical purpose — Card's composed demo
(`src/components/card/card.html:43`, `<p class="text-xs
text-neutral-600">Product Designer</p>`) — so this is not a new token,
just correcting which existing token the Lists pattern should cite.

**Alternatives considered**: Keeping `text-neutral-500` and only meeting
the lower AA threshold (4.5:1, which it does pass) was rejected —
Principle II (WCAG AAA, non-negotiable per the constitution) applies to
all new component work in this project, and the whole point of this
feature is closing the gap rather than re-ratifying the same mistake.

## R2: Avatar reuse

**Decision**: Reuse `.avatar-img` / `.avatar-fallback` and the
`avatar-lg` (`h-10 w-10 text-sm`) size variant verbatim from
`src/styles/tailwind.css:244-256` (feature 006). No new avatar CSS.

**Rationale**: The constitution's own Lists entry already specifies
`h-10 w-10` avatars — identical to the ratified `avatar-lg` — so Lists
was always meant to consume Avatar as a dependency, not reinvent it.
`avatar-lg` is used uniformly across all three contracted markup shapes
(read-only, interactive, trailing-action) — this feature does not
introduce a dense-list `avatar-sm` variant; that remains a future
extension if a denser list density is ever needed, out of scope here.

## R3: Interactive row semantic element

**Decision**: The interactive list-item variant wraps its entire row in
a single `<a href="...">`, matching the spec's assumption.

**Rationale**: This project's established precedent (native elements
over ARIA roles, since feature 001) always prefers the simplest native
element that satisfies the interaction. A list row's interactive use
case (navigating to a detail view) is semantically a link, not a
button-triggered action — consistent with Breadcrumbs' and Dropdown
Menu's own native-element choices. Table (feature 006's catalog entry)
has no existing "clickable row" precedent to conflict with, since Table
itself was never implemented as a standalone component (a separate,
pre-existing catalog gap — out of scope for this feature, tracked
separately). No conflict found.

## R4: No new design tokens

**Decision**: Confirmed — the only token change is R1's metadata-text
correction. `hover:bg-neutral-50`, `divide-y divide-neutral-200`,
`avatar-lg`, and `focus-visible` ring tokens are all already ratified
and require no additions to `shared/design-tokens.ts` or the
constitution's Base Semantic Palette.

## R6: Principle V exceptions for the interactive row

**Decision**: `.list-item-interactive` intentionally omits
`disabled:opacity-50 disabled:cursor-not-allowed`, and intentionally
uses `focus-visible:-outline-offset-2` (negative/inset offset) rather
than the majority-pattern positive offset.

**Rationale** (documenting the Principle V exception per the
constitution's Governance clause, mirroring existing precedent rather
than leaving it implicit):

- **No `disabled:` state**: the row is a single `<a href>` (R3), and
  Tailwind's `disabled:` variant targets the CSS `:disabled` pseudo-class,
  which never matches an anchor element — there is no disabled state to
  style because links cannot be disabled the way form controls can. This
  is the identical, already-ratified exception documented for
  Breadcrumbs' non-interactive current-page item.
- **Negative outline offset**: list rows sit directly adjacent to each
  other inside a `divide-y` container (data-model.md's List entity), so
  a positive (outward) focus ring would visually clip against the
  divider line of the neighboring row. An inset ring stays within the
  row's own box — the same rationale already documented for Dropdown
  Menu's item-level focus ring in an adjacent-item list context
  (`contracts/dropdown-menu.contract.md`).

## R5: Trailing-action ARIA

**Decision**: No additional ARIA is required. A single `<a>` wraps the
entire interactive row; a trailing Badge or chevron rendered as a
`<span>` inside that same anchor is non-interactive decoration, not a
second focusable control — so there is no nested-interactive-control
violation to guard against with ARIA. axe-core's own
`nested-interactive` rule is the mechanical proof: it fires only when
two focusable elements nest, which this markup never does by
construction (FR-007 is enforced by never rendering a real `<button>`
or second `<a>` inside the row, not by an ARIA attribute).
