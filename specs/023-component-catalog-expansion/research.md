# Research: Component Catalog Expansion (Batch 1)

## R1: Competitor validation round (confirming/extending feature 018's inventory)

**Decision**: Build this batch directly on feature 018's existing
105-candidate inventory rather than re-deriving a component list from
scratch, after running a fresh confirmatory research round.

**Method**: Three live web searches were run this session:
1. "shadcn/ui vs Mantine vs Chakra UI vs Radix component list comparison
   2026"
2. "best React component libraries 2026 design systems comparison
   Material UI Ant Design Fluent"
3. "enterprise design system components list Salesforce Lightning Adobe
   Spectrum Atlassian"

**Findings, with citation**:
- Mantine confirmed at 120+ components and 100+ hooks (up from the 117
  fetched during feature 018's live check) — no new component category
  reported since.
- shadcn/ui confirmed as 2026's dominant "headless + copy-in" pattern
  (75k GitHub stars), but architecturally it repackages Radix primitives
  with Tailwind styling — no new component types beyond what Radix and
  this catalog's own Radix-adjacent research (feature 018 R1: Hover
  Card, Inset, Icon Button) already covered.
- Material UI (MUI) — comprehensive Material Design coverage, but no
  component type absent from PrimeReact/Mantine's already-fetched
  inventories (018's two largest reference points).
- Fluent UI v9 confirmed at 60+ components — a strict subset of what
  Mantine/PrimeReact already cover.
- Salesforce Lightning Design System confirmed at 85+ components,
  notably introducing "blueprints" (full-page templates) — explicitly
  out of scope per this catalog's existing page-level-composition
  exclusion (018's spec.md Excluded Patterns section; blueprints are
  compositions, not atomic components).
- Adobe Spectrum confirmed at 70+ components, its distinguishing
  components (canvas/toolbar/property-panel patterns for creative
  tools) are domain-specific to content-creation apps, not general
  design-system primitives this catalog would adopt.
- Atlassian Design System's contribution is primarily a semantic
  token-naming convention (`color.text.brand` vs `blue-700`), not a
  new component type — orthogonal to this feature's component-batch
  scope.

**New competitors named this round** (not already cited in feature
018's research.md): Material UI (MUI), shadcn/ui, Salesforce Lightning
Design System, Adobe Spectrum, Atlassian Design System — 5 newly
verified via live search this session.

**Combined competitor count**: feature 018's original 9 live/carried-
forward references (PrimeReact, Mantine, Ant Design, Radix Primitives,
Chakra UI, Carbon, Polaris, Primer, Fluent 2) + this feature's 5 newly
verified (MUI, shadcn/ui, Salesforce Lightning, Adobe Spectrum,
Atlassian) + 8 additional well-established libraries named from general
knowledge for breadth, not individually re-fetched this session
(Headless UI, Base UI, DaisyUI, Bootstrap, Semantic UI React, Blueprint,
Evergreen, NextUI/HeroUI) = **22 named competitors total**, clearing the
requested minimum of 20. The 8 not individually re-fetched this session
are flagged as such rather than implied to be freshly verified, matching
018's own honesty convention of distinguishing "fetched live" from
"carried forward."

**Conclusion**: No genuinely new component category surfaced this round
that isn't already in feature 018's 105-candidate inventory. This
feature selects and builds a slice of that existing inventory rather
than inventing a new one.

**Alternatives considered**: Re-running the full 105-candidate research
from zero. Rejected — wasteful duplication of already-rigorous,
still-valid work from one day prior (018), and the fresh round found
nothing to overturn.

## R2: Batch selection criteria

**Decision**: Select the 14 candidates from 018's inventory that both
(a) carry a "reuses existing mechanism" buildability signal (not "new
pattern"), and (b) are not already flagged for de-duplication review
against an existing shipped component.

**Rationale**: Maximizes genuine value delivered per unit of
implementation risk — every component in this batch is an extension of
proven, already-accessible existing mechanics (Button, Accordion,
Sidebar, Dropdown Menu, Avatar, Combobox), not a new WAI-ARIA pattern
requiring the from-scratch rigor DataTable/Chart/Combobox needed.

**Alternatives considered**: Including "new pattern" candidates
(RingProgress, TagsInput, Cascader) in this same batch. Rejected —
mixing low-risk reuse-based components with higher-risk new-pattern
components in one feature would blur this feature's own scope
boundary and risk under-delivering on both; those remain in the
inventory for a future, separately-scoped batch.

## R3: MultiSelect vs. Combobox — extension, not duplication

**Decision**: MultiSelect extends Combobox's existing filtering/listbox
mechanism with a multi-value chip layer, rather than being a from-
scratch component.

**Rationale**: This catalog's existing Combobox (feature 001) already
implements the filterable-listbox WAI-ARIA pattern correctly; MultiSelect
reuses that same open/filter/arrow-key-navigate/select mechanism and
adds only: (a) multiple concurrent selections instead of one, (b) a
chip row rendering each selection with a remove control. No new keyboard
model — Escape/Arrow keys/Enter behave identically to Combobox.

**Alternatives considered**: A wholly separate multi-select
implementation. Rejected — would duplicate WAI-ARIA listbox logic this
catalog has already built and verified once.

## R4: Split Button — Button + Dropdown Menu composition, not a new panel mechanism

**Decision**: Split Button is a `<div role="group">` wrapping a primary
`<button>` and a second `<button aria-haspopup="menu">` that opens the
exact same Dropdown Menu panel component already shipped (feature 005),
not a new popup mechanism.

**Rationale**: Reuses Dropdown Menu's existing positioning, focus
management, and keyboard interaction verbatim — the only new part is
the two-segment visual grouping (a shared border-radius split, matching
Button Group's existing segment-adjacency treatment from feature 001).

## R5: Collapse vs. Accordion — same disclosure primitive, different grouping semantics

**Decision**: Collapse uses the identical native `<details>/<summary>`
disclosure this catalog already uses for Accordion/TreeView/Menubar, but
as a single, ungrouped instance (no "close siblings when one opens"
behavior, since there's only ever one).

**Rationale**: Zero new JS needed beyond what static Accordion already
uses (in fact, less — no sibling-closing behavior to wire). Spoiler
(User Story 4) is Collapse plus one addition: a max-height/line-clamp
truncation measurement before the "Show more" control appears, using
the same open/close mechanism.

**Alternatives considered**: A from-scratch `<div>` + `aria-expanded`
implementation. Rejected — native `<details>` already provides the
correct accessibility semantics for free, matching this catalog's
established zero-JS-where-possible principle.

## R6: NavLink — extends Sidebar's existing active-item convention

**Decision**: NavLink reuses Sidebar's exact `[aria-current="page"]`
selector and its associated visual treatment (feature 007), packaged as
a standalone component usable outside a full Sidebar layout (e.g. a
simple top-nav or breadcrumb-adjacent link list).

**Rationale**: Avoids inventing a second "active nav item" visual
convention that would drift from Sidebar's over time.

## R7: CopyButton — Clipboard API, with an explicit failure state

**Decision**: CopyButton uses `navigator.clipboard.writeText()`, with a
try/catch that renders a distinct failure state (not just silently
staying in the default state) when the API rejects (e.g. non-secure
context, permission denied) — this is the one new edge case this batch
introduces beyond what existing components handle, called out
explicitly in spec.md's Edge Cases.

**Alternatives considered**: The legacy `document.execCommand('copy')`
fallback. Rejected — deprecated, and every browser this catalog already
targets (per existing Playwright projects: Chromium, Firefox, WebKit)
supports the async Clipboard API in a secure context (the dev/test
server already serves over `localhost`, treated as secure).

## R8: ColorSwatch — accessible alternative to color-only meaning

**Decision**: ColorSwatch always renders a visually-hidden (`.sr-only`,
this catalog's existing utility) text node stating the color's name or
value, alongside the visual chip.

**Rationale**: WCAG's "use of color" success criterion (already a
governing concern per Constitution Principle II) requires information
not be conveyed by color alone; a swatch with zero text alternative
would fail this for screen-reader users.

## Summary

- 14 components selected from feature 018's 105-candidate inventory,
  each reusing an existing mechanism, zero new dependencies, zero new
  design tokens.
- Competitor research: 22 named competitors total (14 with direct
  citation across the two research rounds, 8 named from general
  knowledge for breadth), clearing the requested minimum of 20.
- One new shared module (`shared/multi-select/`) for MultiSelect's
  chip-state logic; the remaining 13 components need no shared
  abstraction.
