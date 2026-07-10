# Phase 0 Research: Application Shell Primitives

## R1. Navbar mobile menu — native `<details>`/`<summary>`, zero JavaScript

**Question**: Does the Navbar's mobile hamburger menu need JavaScript
(toggle state, or the Popover API as used for Dropdown Menu in feature
005), or can it reuse Accordion's zero-JS native mechanism?

**Decision**: Native `<details>`/`<summary>` — the exact mechanism
Accordion already established in feature 005, not a new JS module. The
`<summary>` element IS the hamburger button (containing the icon + an
accessible "Menu" label); the mobile nav links are the `<details>`
content, which pushes the rest of the page down when opened (an
accordion-style reveal directly beneath the header), not an overlay.

**Rationale**: A mobile nav menu's actual requirements — toggle open/
closed, keyboard-activatable, accessible expanded/collapsed state — are
already exactly what native `<details>`/`<summary>` provides for free
(verified in feature 005's Accordion research). It does not need the
Popover API's light-dismiss/top-layer behavior: unlike Dropdown Menu
(a floating panel that must not disturb surrounding layout), a mobile nav
menu pushing content down is a normal, expected mobile UX pattern (used
by production design systems, e.g. GOV.UK's "details polyfill" nav
pattern) and requires no floating positioning. Choosing the simpler native
mechanism over a floating one avoids introducing a third JS module in
this project for no functional gain — this feature ships zero JavaScript
across all three components, not merely "near-zero" as the spec allowed
for.

**Alternatives considered**: Popover API (Dropdown Menu's mechanism) —
rejected as unnecessary: no light-dismiss requirement exists for a mobile
nav menu (there is no competing floating content to dismiss around), and
using it would need `popover="auto"` plus a `popovertarget` button, adding
complexity with no user-facing benefit over `<details>`/`<summary>`.
Custom JS toggle (a `hidden` attribute flipped via `addEventListener`) —
rejected for the same reason feature 005 rejected it for Accordion: native
`<details>` already does this, so custom JS would only reimplement
existing browser behavior.

## R2. Pagination — no pre-existing ratified pattern

**Question**: Does the constitution's existing catalog cover Pagination,
or is this a new pattern to propose?

**Decision**: New pattern to propose (like Card/Accordion/Tabs/Dropdown
Menu before it) — no existing entry covers it. Proposed composition:

- Page links: `text-neutral-600` resting (AAA floor, per features 005/006's
  established lesson — never `text-neutral-500`), `hover:bg-neutral-50
  hover:text-neutral-900`, current page `bg-brand-dark text-white`
  (reusing Button primary's already-AAA-verified pair, 7.90:1 — NOT the
  literal `bg-brand text-white` the ratified Sidebar pattern names, which
  R3 below found fails AAA at 4.83:1), `aria-current="page"` on the
  current page link (same mechanism as Breadcrumbs' current item,
  feature 005).
- Previous/Next controls: native `disabled` attribute on a `<button>`
  (not a styled/faked disabled `<a>`, since `<a>` has no native disabled
  state — the same technical constraint feature 005's Breadcrumbs
  research already established) when at the first/last page; otherwise a
  real `<a href>` link.
- Truncation: static, consumer-composed markup (an ellipsis `<span>`
  between non-adjacent page numbers) — not a JavaScript range-computation
  utility, consistent with Avatar's initials-fallback precedent
  (feature 006): this is a formatting concern for whoever renders the
  page, not an interaction requirement.

**Rationale**: Reuses `bg-brand-dark text-white` (already AAA-verified as
Button primary's own treatment, 7.90:1 — corrected from an earlier draft
of this rationale that stated `bg-brand text-white`, stale text left over
from before R3's correction was folded in; `/speckit-analyze` caught the
inconsistency between this paragraph and the Decision above it, which
already named the correct pair) rather than inventing a new active-state
color, and reuses the `aria-current="page"` mechanism already proven
correct for Breadcrumbs — minimizing new surface area to verify.

## R3. Sidebar and Navbar — implementing pre-existing ratified patterns, verified not assumed

**Question**: Do the constitution's existing Sidebar and Navbar/Header
patterns (ratified since v1.2.1, never implemented) pass AAA when
actually built and tested?

**Decision**: Implement as ratified, but verify empirically rather than
assume correctness — the same discipline that caught Breadcrumbs'
`text-neutral-500` failure in feature 005. This research found **two**
real, previously-undiscovered gaps in the ratified Sidebar pattern,
computed directly via the WCAG relative-luminance formula (not assumed),
both corrected here before implementation rather than shipped and found
later:

1. **Active-item background** — the ratified pattern's `Active: bg-brand
   text-white` measures **4.83:1** (`#FFFFFF` on `#0066FF`) — clears AA
   (4.5:1) but fails AAA (7:1). This is the exact same gap Button primary
   already avoids by using `brand-dark` instead of `brand` for its own
   white-text-on-background treatment (`bg-brand-dark`, 7.90:1, already
   AAA-verified and in this project's `check-contrast.mjs`). Corrected:
   Sidebar's active item uses `bg-brand-dark text-white` (7.90:1), not the
   literal `bg-brand` the ratified text names — reusing Button's own
   already-verified pair rather than a new one.
2. **Dark-treatment resting text** — the ratified pattern's
   `text-neutral-400` on `bg-neutral-900` measures **6.99:1** (precisely:
   6.987), which **fails** the 7:1 AAA threshold by a hair — not a
   rounding-error pass. Corrected: `text-neutral-300` on `bg-neutral-900` =
   **12.04:1**, comfortably AAA.

Both corrections will be folded into the constitution amendment (not left
as silent implementation-only fixes) — see quickstart.md's reminder.

- Sidebar light: `bg-white`, item text `text-neutral-700` resting (not
  specified by the ratified pattern at all — only "hover"/"active" states
  are named; resting text color is this feature's own proposal, chosen at
  the AAA floor, 10.31:1 against white), active `bg-brand-dark text-white`
  (corrected above), hover `bg-neutral-100` with
  `transition-colors duration-150`.
- Sidebar dark: `bg-neutral-900`, item text `text-neutral-300` resting
  (corrected above), active `bg-brand-dark text-white` (same corrected
  pair — the ratified pattern names one `Active` treatment regardless of
  light/dark base, so both variants share it), hover `bg-neutral-800`
  (as ratified).
- Navbar: `sticky top-0 z-40`, `backdrop-blur-md bg-white/80`,
  `border-b border-neutral-200` (all as ratified), plus a solid `bg-white`
  fallback declared before the `backdrop-blur`/`bg-white/80` overrides, so
  a browser without `backdrop-filter` support still gets an opaque,
  legible background instead of a half-transparent one — spec.md's Edge
  Case, not previously addressed by the ratified pattern's original text.

**Alternatives considered**: N/A — R3 is a verification task, not a design
decision with alternatives, consistent with feature 005/006's equivalent
research sections.

## R4. Testing strategy: consistent with every prior feature

**Decision**: Same Playwright visual regression + axe-core pattern.
Linux baselines via `update-snapshots.yml`'s `workflow_dispatch` only.
New component pages added to `vite.config.ts`'s `rollupOptions.input` as
part of the implementation task itself, not a follow-up fix (features
005/006's established discipline).

## R5. No CSP or new-JS-dependency concerns

**Decision**: This feature ships zero JavaScript (R1) — no new `<script>`
tags, no CSP changes needed at all.
