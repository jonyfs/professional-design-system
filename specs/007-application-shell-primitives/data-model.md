# Phase 1 Data Model: Application Shell Primitives

This feature ships static UI markup only — zero JavaScript. The
"entities" below are the structural/state models each component must
implement, extracted from the functional requirements in `spec.md`.

**Note on the constitution's Component Catalog**: Sidebar and Navbar have
pre-existing ratified entries (never implemented until now); this feature
implements them and — per research.md R3 — corrects two real AAA gaps
found in the process. Pagination has no pre-existing entry (a new
pattern, like Card/Accordion/Tabs/Dropdown Menu before it). All
corrections/new patterns are tracked for the post-implementation
constitution amendment, per the "propose in Phase 1, ratify what shipped"
sequence established since feature 005.

## Pagination

| Field | Type | Values | Notes |
|---|---|---|---|
| `pages` | array of `{ number, href }` | 1+ entries | May be truncated with an ellipsis for large ranges (FR-003) |
| `currentPage` | integer | matches one entry in `pages` | Marked `aria-current="page"` (FR-001) |
| `hasPrevious` / `hasNext` | boolean | derived from `currentPage` | Governs whether Previous/Next are links or genuinely-disabled buttons (FR-002) |

**Validation rules**: exactly one page link carries `aria-current="page"`
and a distinct visual treatment. Previous/Next MUST be `<button disabled>`
at the boundaries — not a styled `<a>` (Tailwind's `disabled:` variant
cannot target an anchor element regardless of utility applied, the same
technical constraint Breadcrumbs' data-model.md established in feature
005) — and a real `<a href>` otherwise. Truncation (FR-003) is
consumer-composed static markup (an ellipsis `<span aria-hidden="true">`),
not a JavaScript range-computation utility (spec.md Assumptions).

**Full utility composition** (no pre-existing ratified pattern — proposed
here, research.md R2):

```css
.pagination-nav {
  @apply flex items-center justify-between gap-2;
}
.pagination-link {
  @apply inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3
    text-sm font-medium text-neutral-600 hover:bg-neutral-50
    hover:text-neutral-900 active:bg-neutral-100
    focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-brand;
}
.pagination-link[aria-current="page"] {
  @apply bg-brand-dark text-white hover:bg-brand-dark hover:text-white
    active:bg-brand-dark;
}
.pagination-control {
  @apply inline-flex h-9 items-center justify-center gap-1 rounded-md px-3
    text-sm font-medium text-neutral-600 hover:bg-neutral-50
    hover:text-neutral-900 active:bg-neutral-100
    focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-brand
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent;
}
.pagination-ellipsis {
  @apply inline-flex h-9 min-w-9 items-center justify-center text-sm
    text-neutral-600;
}
```

`.pagination-link[aria-current="page"]` uses `bg-brand-dark text-white`
(7.90:1, reusing Button primary's already-AAA-verified pair) — **not**
the literal `bg-brand text-white` a naive reading of the ratified
Sidebar's "Active" treatment might suggest, since research.md R3 found
that exact pairing fails AAA at 4.83:1. `active:` is declared on every
interactive class per Principle V's unconditional mandate — a first
draft omitted it entirely across all three components in this feature,
which `/speckit-analyze` caught as a CRITICAL gap (the same class of
deviation features 005/006 already hit and fixed). `.pagination-ellipsis`
uses `text-neutral-600` (7.56:1), not `text-neutral-500` (4.83:1) — a
first draft tried to exempt it as "decorative, AT-redundant punctuation"
via `aria-hidden`, but `/speckit-analyze` correctly pointed out that
`aria-hidden` only hides content from assistive technology, not from
sighted low-vision users who still read the glyph visually; AAA's
contrast bar applies regardless of `aria-hidden`. Using the same
`text-neutral-600` floor as every other body text in this project
sidesteps the exemption question entirely rather than relying on a
reasoning shortcut.

## Sidebar

| Field | Type | Values | Notes |
|---|---|---|---|
| `items` | array of `{ label, href, icon? }` | 1+ entries | Navigation items |
| `activeItem` | one of `items` | exactly one | Statically marked by the consumer/router at render time (spec.md Assumptions) |
| `theme` | enum | `light` (default), `dark` | Both named in the ratified pattern (FR-005) |

**Validation rules**: exactly one item is visually and semantically
marked active (`aria-current="page"`, consistent with Pagination/
Breadcrumbs' mechanism). Both themes MUST pass AAA independently —
verified per research.md R3, not assumed because the light theme passes.

**Full utility composition** (implements + corrects the ratified pattern,
research.md R3):

```css
.sidebar {
  @apply flex h-full w-64 flex-col gap-1 p-4;
}
.sidebar-light {
  @apply bg-white border-r border-neutral-200;
}
.sidebar-dark {
  @apply bg-neutral-900;
}
.sidebar-item {
  @apply flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
    transition-colors duration-150 focus-visible:outline
    focus-visible:outline-2 focus-visible:outline-offset-2
    focus-visible:outline-brand;
}
.sidebar-item-light {
  @apply text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200;
}
.sidebar-item-dark {
  @apply text-neutral-300 hover:bg-neutral-800 active:bg-neutral-700;
}
.sidebar-item[aria-current="page"] {
  @apply bg-brand-dark text-white hover:bg-brand-dark active:bg-brand-dark;
}
```

**Two real AAA corrections** (research.md R3, computed via the WCAG
relative-luminance formula, not assumed from the ratified text): (1) the
ratified pattern's literal `Active: bg-brand text-white` measures 4.83:1
— corrected here to `bg-brand-dark text-white` (7.90:1), reusing Button
primary's own already-verified pair; (2) the ratified pattern's dark-theme
resting text, `text-neutral-400` on `bg-neutral-900`, measures 6.99:1 —
fails AAA by a hair, not a rounding-error pass. Corrected to
`text-neutral-300` (12.04:1). The light theme's resting text color
(`text-neutral-700`, 10.31:1) was never specified by the ratified pattern
at all (only hover/active were named) — proposed here at the AAA floor.
`active:` (press-state feedback) is declared on every variant per
Principle V's unconditional mandate — a first draft omitted it across
all three of this feature's components, which `/speckit-analyze` caught
as a CRITICAL gap.

## Navbar / Header

| Field | Type | Values | Notes |
|---|---|---|---|
| `links` | array of `{ label, href }` | 1+ entries | Full navigation, shown at wide viewports |
| `brand` | markup | any | Logo/wordmark, always visible |

**Validation rules**: pinned to the viewport top during scroll (FR-006).
Background MUST remain legible without native `backdrop-filter` support
(FR-006, spec.md Edge Case) — a solid `bg-white` declared before the
`backdrop-blur`/`bg-white/80` overrides so an unsupporting browser still
gets an opaque background, not a semi-transparent one over unstyled
content. Mobile menu MUST have an accessible name and a ≥44×44px touch
target (FR-007, Principle I).

**Full utility composition** (implements the ratified pattern verbatim,
plus the backdrop-filter fallback and native-`<details>` mobile menu —
research.md R1):

```css
.navbar {
  @apply sticky top-0 z-40 border-b border-neutral-200 bg-white
    supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-md;
}
.navbar-inner {
  @apply mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4;
}
.navbar-link {
  @apply text-sm font-medium text-neutral-600 hover:text-neutral-900
    active:text-neutral-700 focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-brand;
}
.navbar-menu-trigger {
  @apply flex h-11 w-11 items-center justify-center rounded-md text-neutral-600
    hover:bg-neutral-100 hover:text-neutral-900 active:scale-95
    cursor-pointer list-none transition-transform duration-150
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
    focus-visible:outline-brand;
}
.navbar-mobile-panel {
  @apply flex flex-col gap-1 border-t border-neutral-200 px-6 py-4;
}
```

`supports-[backdrop-filter]:...` (Tailwind's arbitrary `@supports`
variant) is used instead of the ratified pattern's unconditional
`backdrop-blur-md bg-white/80`, so the plain `bg-white` (opaque) is the
baseline and the blur/translucency are additive enhancements only where
supported — resolving spec.md's Edge Case, which the original v1.2.1
ratified text did not address. `.navbar-menu-trigger` is a `<summary>`
element (44×44px via `h-11 w-11`, Principle I's Fitts's Law minimum),
mirroring Accordion's exact `<details>`/`<summary>` mechanism — no
JavaScript. `active:` is declared on both `.navbar-link`
(`active:text-neutral-700`, matching Breadcrumbs' own established
hover/active convention) and `.navbar-menu-trigger`
(`active:scale-95`, matching `close-icon-btn`'s existing press-feedback
idiom) — a first draft omitted both, the same CRITICAL gap
`/speckit-analyze` caught across all three components in this feature.

## Cross-cutting invariants (all three components)

- Every color token referenced MUST exist in the constitution's Base
  Semantic Palette table. No new color tokens are introduced by this
  feature — `brand-dark`/`neutral-300`/`neutral-700`/`neutral-800`/
  `neutral-900`/`white` are all already ratified (research.md R2-R3
  corrected which *pairing* is used, not introduced any new hex value).
- Every text/background pairing MUST pass WCAG 2.2 AAA contrast (FR-009,
  SC-002) — verified via a real `@axe-core/playwright` scan during
  implementation, not assumed from the ratified pattern's original text
  (research.md R3's whole premise).
- No raw Tailwind palette class may appear in shipped markup (FR-008,
  SC-003) — enforced by the existing `scripts/audit-tokens.mjs`, run
  unmodified.
- Zero JavaScript this feature (research.md R1) — no `src/scripts/`
  additions, no CSP changes.
- All three new component pages MUST be added to `vite.config.ts`'s
  `rollupOptions.input` as part of implementation (FR-012).
