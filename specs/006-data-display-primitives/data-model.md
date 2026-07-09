# Phase 1 Data Model: Data Display Primitives

This feature ships static UI markup plus one small behavior script. The
"entities" below are the structural/state models each component must
implement, extracted from the functional requirements in `spec.md`.

**Note on the constitution's Component Catalog**: Avatar reuses the
existing ratified Lists avatar size (`rounded-full h-10 w-10`) as its
"large" size — not a new pattern. Card has no pre-existing catalog entry
(new pattern, research.md R3). Alert/Banner has no pre-existing catalog
entry either but reuses Badge's exact severity-token family (success/
error/warning/info) and Toast's `close-icon-btn`. All three are proposed
here and tracked for ratification into the constitution's Data Display &
Listings section once shipped and verified, per the "propose in Phase 1,
ratify what shipped" sequence used for feature 005's Navigation &
Disclosure section.

## Avatar

| Field | Type | Values | Notes |
|---|---|---|---|
| `src` | string? | image URL | When absent or broken, the initials fallback renders instead (FR-002) |
| `alt` | string | required when `src` is present | Accessible name for the image (FR-001) |
| `initials` | string | 1-2 letters | Consumer-composed markup (research.md/Assumptions — no JS name-parsing utility), rendered when `src` is absent |
| `size` | enum | `sm` (`h-8 w-8`), `lg` (`h-10 w-10`, the existing ratified size) | FR-003 |

**Validation rules**: the image variant and the initials-fallback variant
are two separate markup blocks in this static-HTML context (no JS
`onerror` handler needed to swap between them — a real app would use
`onerror` or conditional rendering at the framework layer, but this
feature ships the static reference markup for each state, same as every
other component's "here is the closed state, here is the open state"
pattern). Both variants MUST render as a perfect circle (`rounded-full`)
and MUST NOT distort a non-square source image (`object-cover`).

**Full utility composition**:

```css
.avatar-img {
  @apply rounded-full object-cover;
}
.avatar-fallback {
  @apply flex items-center justify-center rounded-full bg-neutral-100
    font-medium text-neutral-700;
}
.avatar-sm {
  @apply h-8 w-8 text-xs;
}
.avatar-lg {
  @apply h-10 w-10 text-sm;
}
```

`bg-neutral-100`/`text-neutral-700` (9.37:1) is deliberately more
contrast-safe than the `text-neutral-600` floor used elsewhere in this
feature (research.md R2) — initials are often only 1-2 characters at a
small size, and benefit from the extra margin.

## Card

| Field | Type | Values | Notes |
|---|---|---|---|
| `elevated` | boolean | `false` (default), `true` | Optional hover-elevation variant (FR-005) |
| `content` | markup | any | Heading, body text, and/or composed components (Avatar, Badge, Button) |

**Validation rules**: MUST render as a single visually-distinct container
(FR-004) — border and shadow, not just one or the other, so the boundary
reads clearly against both a white and a tinted page background. The
`elevated` variant's `hover:shadow-md` transition MUST NOT change the
card's box dimensions (no layout shift, FR-005) — only `box-shadow`
changes, which is already a compositor-friendly, layout-neutral property.

**Full utility composition** (no pre-existing ratified pattern — proposed
here, research.md R3):

```css
.card {
  @apply rounded-lg border border-neutral-200 bg-white p-6 shadow-sm;
}
.card-elevated {
  @apply transition-shadow duration-150 hover:shadow-md;
}
```

`rounded-lg`/`border-neutral-200` reuse the exact token pair the
constitution's ratified Modals pattern already uses for its panel — no
new visual vocabulary. `hover:shadow-md` reuses the exact transition
already shipped in `.btn-primary` since feature 001.

## Alert / Banner

| Field | Type | Values | Notes |
|---|---|---|---|
| `severity` | enum | `success`, `error`, `warning`, `info` | FR-006 — reuses Badge's exact severity-token family |
| `message` | string | any | The notice content |
| `dismissible` | boolean | `false` (default), `true` | FR-007/FR-008 |

**Validation rules**: MUST NOT carry `role="status"`/`aria-live`/
`role="alert"` — this is static page content perceivable on normal page
read-through, not a dynamically-announced notification (FR-011,
research.md R1). Dismissing MUST remove the element from the DOM (FR-007)
— a plain visibility toggle would fail SC-004's "zero accessibility-tree
traces" requirement, same discipline as Toast's dismissal in feature 003.
The non-dismissible default variant renders no close button at all
(FR-008) — not a hidden/disabled one.

**Full utility composition** (reuses Badge's severity tokens and Toast's
`close-icon-btn` — no new interactive class introduced, per plan.md's G4):

```css
.alert {
  @apply flex items-start gap-3 rounded-md p-4;
}
.alert-success {
  @apply bg-success/5 ring-1 ring-inset ring-success/20;
}
.alert-error {
  @apply bg-error/5 ring-1 ring-inset ring-error/10;
}
.alert-warning {
  @apply bg-warning/5 ring-1 ring-inset ring-warning/10;
}
.alert-info {
  @apply bg-info/5 ring-1 ring-inset ring-info/20;
}
```

Background/ring pairings for success/error/warning are copied verbatim
from the constitution's already-AAA-verified Badge pattern (v1.3.0/v1.3.1
corrections) — not reinvented. `info` initially proposed reusing
`brand-light`/`brand-dark` since Badge has no `info` variant to copy the
formula from directly — `/speckit-analyze` correctly flagged this as
bypassing the constitution's own already-ratified `status.info` token
(`#3B82F6`) for no real reason, breaking structural consistency with the
other three severities (which all follow `bg-{status}/5 ring-{status}/X
text-{status}-strong`) and leaving `info` the only variant without a
text-safe `-strong` companion token. Corrected: `status.info` is now
`{ DEFAULT: "#3B82F6", strong: "#1E40AF" }` in `shared/design-tokens.ts`
(mirroring success/error/warning's `DEFAULT`/`strong` shape exactly), so
`.alert-info` follows the identical `bg-info/5 ring-1 ring-inset
ring-info/20` formula, and the icon uses `text-info-strong` (8.72:1
against white — computed via the WCAG relative-luminance formula, the
same verification method used for every other `-strong` token since
v1.3.0). Message text uses `text-neutral-900` (matching Toast's own
message treatment) for all four severities.

## Cross-cutting invariants (all three components)

- Every color token referenced MUST exist in the constitution's Base
  Semantic Palette table. Avatar and Card introduce no new color tokens
  (verified in research.md R2-R4). Alert/Banner's `info` severity is the
  one exception: `status.info` already existed but had no `-strong`
  text-safe variant (unlike success/error/warning) — `info-strong`
  (`#1E40AF`, 8.72:1) is added, following the exact `-strong` pattern
  established since v1.3.0, and will be folded into the constitution
  amendment alongside the new Data Display patterns (T024).
- Every text/background pairing MUST pass WCAG 2.2 AAA contrast (FR-010,
  SC-002) — verified via a real `@axe-core/playwright` scan during
  implementation, not assumed from a token's use elsewhere (feature 005's
  established discipline).
- No raw Tailwind palette class may appear in shipped markup (FR-009,
  SC-003) — enforced by the existing `scripts/audit-tokens.mjs`, run
  unmodified.
- `src/scripts/alert.js` contains zero styling decisions.
- All three new component pages MUST be added to `vite.config.ts`'s
  `rollupOptions.input` as part of implementation (FR-014) — not deferred
  to a follow-up fix, per feature 005's real, code-review-caught gap.
