# Phase 1 Data Model: Navigation & Disclosure Primitives

This feature ships static UI markup plus two small behavior scripts. The
"entities" below are the structural/state models each component must
implement, extracted from the functional requirements in `spec.md`.

**Note on the constitution's Component Catalog**: unlike Modal/Slide-over/
Toast (which had a pre-existing "Overlays, Modals & Feedback" catalog
entry to build against from the original v1.2.1 ratification), Accordion,
Tabs, and Dropdown Menu have **no** pre-existing catalog section — only
Breadcrumbs does (`Application & Navigation`, already ratified). The exact
utility compositions below are this feature's proposed patterns, to be
built against during implementation and then ratified into a new
"Navigation & Disclosure" Component Catalog section via a MINOR constitution
amendment once shipped and verified — the same "propose in Phase 1, ratify
what actually shipped" sequence features 001-003 used for genuinely new
patterns (e.g. v1.3.0's `-strong` status tokens). Tracked as an explicit
task in `tasks.md`'s Polish phase, not silently deferred.

## Breadcrumbs

| Field | Type | Values | Notes |
|---|---|---|---|
| `trail` | array of `{ label, href? }` | 1+ entries | The last entry MUST omit `href` — it is the current page, rendered as text |
| `current` | derived | last trail entry | Rendered with `aria-current="page"`, non-interactive |

**Validation rules**: MUST render inside a `<nav aria-label="Breadcrumb">`
distinct from the page's primary navigation landmark (FR-001). Requires
zero JavaScript (FR-002) — pure `<ol>`/`<li>`/`<a>` markup. A single-entry
trail (Edge Case: only the current page, no ancestors) still renders the
`<nav>` wrapper with just the current-page text — omitting the wrapper
entirely would make the component's presence unpredictable to consumers
composing pages programmatically.

**Full utility composition** (from the constitution's pre-existing,
already-ratified pattern — `Application & Navigation` → Breadcrumbs — used
verbatim, not reinvented):

```css
.breadcrumb-nav {
  @apply flex items-center gap-2 text-sm text-neutral-600;
}
.breadcrumb-link {
  @apply text-neutral-600 hover:text-neutral-900 active:text-neutral-700
    transition-colors duration-150 focus-visible:outline
    focus-visible:outline-2 focus-visible:outline-offset-2
    focus-visible:outline-brand rounded-sm;
}
.breadcrumb-divider {
  @apply text-neutral-300;
}
.breadcrumb-current {
  @apply text-neutral-900 font-medium;
}
```

**AAA contrast correction** (found during implementation, not planning —
the constitution's pre-existing ratified Breadcrumbs pattern specifies
`text-neutral-500` for the resting link, and this feature is the first to
actually implement and test it): running `@axe-core/playwright` against
the real rendered page failed — `text-neutral-500` (#6B7280) measures
4.83:1 against white, clearing WCAG AA's 4.5:1 but failing Principle II's
AAA mandate (7:1) for normal-sized text. Corrected to `text-neutral-600`
(#4B5563, 7.56:1 — the same token feature 003's `close-icon-btn` hover
state already established as AAA-safe), on both `.breadcrumb-nav`
(container-level default, inherited by any un-styled descendant text) and
`.breadcrumb-link` itself. This is the same class of gap feature 003's
close-icon-btn color correction and feature 001's badge background
correction caught — a ratified catalog pattern that hadn't yet been
empirically verified against real rendered markup, corrected the moment it
actually shipped, not assumed correct because it was "already ratified."
Tracked as a required correction in this feature's own planned
post-implementation constitution amendment (quickstart.md) — the
Breadcrumbs catalog entry ships materially different from what v1.2.1
originally speculatively ratified.

**Principle V compliance note** (a second `/speckit-analyze` pass caught a
real gap here): `.breadcrumb-link` now declares `active:` — a first draft
omitted it on the reasoning "breadcrumb links are plain navigational
anchors, not action buttons," exactly the kind of unconditional-mandate
exemption FR-013 no longer permits for a literal `<a>` element. `disabled:`
is a different case, not the same hedge: Tailwind's `disabled:` variant
compiles to a `:disabled` CSS pseudo-class selector, which **cannot ever
match** on an `<a>` element (unlike `<button>`/`<input>`/`<select>`,
anchors have no native disabled state) — appending `disabled:opacity-50`
to `.breadcrumb-link` would be inert, non-functional CSS, not a real
Principle V declaration. The correct, already-established resolution for
an unreachable/non-interactive breadcrumb entry is the pattern this
component already uses for the current page: render it as `.breadcrumb-current`
(a `<span>`, not an `<a>`), never as a "disabled" anchor. This is a
technical constraint of the `<a>` tag itself, not a scope hedge — verified
by checking Tailwind's actual variant behavior rather than assumed.

## Accordion / Disclosure

| Field | Type | Values | Notes |
|---|---|---|---|
| `state` | enum | `closed`, `open` | Backed by the native `<details>` element's `open` attribute/property — not a custom class toggle (FR-003) |
| `summary` | string | any | The always-visible trigger label |
| `content` | markup | any | Hidden/shown by the browser's native `<details>` rendering |
| `exclusive` | boolean | `false` (default), `true` (Edge Case variant) | When `true`, sibling `<details>` elements share a `name` attribute (the HTML Living Standard's native exclusive-accordion mechanism, shipped alongside `<details>`'s existing baseline support) so opening one natively closes the others — no JS required even for this variant |

**Validation rules**: each instance's state MUST be independent unless
`exclusive` is used (FR-004) — verified via the native `name` attribute
mechanism, not a hand-rolled JS toggle. The open/closed state MUST be
announced to assistive technology — native `<details>`/`<summary>` already
exposes this via the implicit ARIA disclosure semantics browsers apply to
the element pair, requiring no explicit `aria-expanded` attribute (unlike
Dropdown Menu below, which has no native element and must set it manually).

**Full utility composition**:

```css
.accordion-item {
  @apply border-b border-neutral-200;
}
.accordion-trigger {
  @apply flex w-full items-center justify-between gap-4 py-4 text-left
    text-sm font-medium text-neutral-900 cursor-pointer list-none
    hover:text-neutral-700 active:text-neutral-600
    focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-brand;
}
.accordion-chevron {
  @apply h-5 w-5 shrink-0 text-neutral-400 transition-transform
    duration-200 group-open:rotate-180;
}
.accordion-content {
  @apply pb-4 text-sm text-neutral-600;
}
```

`.accordion-trigger` sets `list-style: none` (`list-none`) to remove the
browser's default disclosure triangle — `.accordion-chevron` is the
on-brand replacement icon, rotated via the `<details>` element's `open`
state using Tailwind's `group-open:` variant (the `<details>` element
itself carries `group`, per Tailwind's documented pattern for exactly this
native-element-plus-`group-open:` use case).

**Principle V scope note**: Principle V's literal text mandates its state
set for "every interactive `<button>` or `<a>`" — `<summary>` is neither,
so this component sits at the edge of that principle's literal scope
(`/speckit-analyze` flagged this ambiguity explicitly). `.accordion-trigger`
declares hover/active/focus-visible anyway, matching Principle V's *intent*
(no interactive element should be state-incomplete) rather than relying on
the literal-tag-scope gap as an excuse to skip them. No `disabled:` state
is declared — this slice does not ship a disabled Accordion item, and
`<details>`/`<summary>` has no native `disabled` attribute to hook a variant
onto (unlike `<button>`/`<input>`). Whether Principle V's `<button>`/`<a>`
scope should be formally extended to native semantic-disclosure elements
like `<summary>` is deferred to the same post-implementation constitution
amendment already planned for ratifying this feature's new Component
Catalog section (quickstart.md), not resolved silently here.

## Tabs

| Field | Type | Values | Notes |
|---|---|---|---|
| `tabs` | array of `{ id, label, panelId }` | 2+ entries | Rendered as `role="tab"` elements inside a `role="tablist"` |
| `selectedIndex` | integer | `0`-based, defaults to `0` | Exactly one tab is selected at a time (FR-007) |
| `panels` | array of `{ id, content }` | matches `tabs` length | Each panel's `id` matches its tab's `panelId` via `aria-controls` |

**Validation rules**: only the selected tab has `tabindex="0"`; all others
have `tabindex="-1"` (roving tabindex, FR-005). Arrow-key navigation
(Left/Right/Home/End, FR-006) moves both focus and `aria-selected` together
— consistent with the WAI-ARIA Tabs pattern's "automatic activation" model
(selecting on arrow-key focus move, not requiring a separate activation
key), the simpler and more common of the two APG-documented Tabs
activation models, chosen because none of this feature's acceptance
scenarios call for the deferred-activation ("manual activation") variant.

**Full utility composition**:

```css
.tabs-list {
  @apply flex gap-6 overflow-x-auto border-b border-neutral-200;
}
.tab-trigger {
  @apply border-b-2 border-transparent px-1 py-3 text-sm font-medium
    text-neutral-600 hover:text-neutral-700 hover:border-neutral-300
    active:text-neutral-800
    focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-brand
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:border-transparent;
}
.tab-trigger[aria-selected="true"] {
  @apply border-brand text-neutral-900;
}
.tab-panel {
  @apply pt-4 text-sm text-neutral-600;
}
```

**AAA contrast correction** (found during implementation, same class of
gap as Breadcrumbs' above): `.tab-trigger`'s resting `text-neutral-500`
failed a real `@axe-core/playwright` scan at 4.83:1 (AA-safe, AAA-unsafe).
Corrected to `text-neutral-600` (7.56:1), matching the same fix applied to
`.breadcrumb-link`.

`overflow-x-auto` on `.tabs-list` is not merely documented in the Edge
Cases prose below — it is part of the component's own canonical
composition, so the contract's markup and this data model do not disagree
(`/speckit-analyze` caught a first-draft mismatch where the Edge Case text
mentioned it but the composition above omitted it). `disabled:` is declared
per Principle V even though this slice's own acceptance scenarios don't
exercise a disabled tab — Principle V's mandate is unconditional for any
`<button>`/`<a>`, not conditioned on whether a current scenario needs it
(FR-013, corrected after `/speckit-analyze`). `disabled:opacity-50
disabled:cursor-not-allowed` (not a custom color-only treatment) is used
verbatim — a second `/speckit-analyze` pass caught that an earlier draft
substituted `disabled:text-neutral-300` for `opacity-50`, an unexplained,
unjustified deviation from the literal pattern every other disabled
declaration in this project uses without exception (Button, Checkbox,
Radio, Toggle, Select — `grep disabled: src/styles/tailwind.css` confirms
8/8 existing declarations use exactly `disabled:opacity-50
disabled:cursor-not-allowed`, zero variants).

`[aria-selected="true"]` is used as the selected-state selector (an
attribute selector on `@layer components`, the same mechanism already
established for `.tab-trigger[aria-selected="true"]`-style state-attribute
styling as `Modal.tsx`'s `[id="..."]` pattern in feature 004 — attribute
selectors are ordinary CSS, not a Principle III exception) rather than a
JS-toggled class, so the visual selected state can never drift out of sync
with the actual ARIA state `tabs.js` sets — there is exactly one source of
truth for "which tab is selected."

## Dropdown Menu

| Field | Type | Values | Notes |
|---|---|---|---|
| `state` | enum | `closed`, `open` | Backed by the native Popover API's `popover`/`:popover-open` state (research.md R1) — not a custom class toggle |
| `trigger` | element reference | the `<button popovertarget="...">` | Native `popovertarget` association handles opening; `aria-expanded` is synced onto it manually by `dropdown-menu.js` (Popover API does not do this automatically — research.md R1) |
| `items` | array of `{ label, action, disabled? }` | 1+ entries | Rendered as `role="menuitem"` elements; `disabled` items are skipped during arrow-key navigation (Edge Case) |
| `focusedIndex` | integer | derived from `document.activeElement`, not a stored index | `dropdown-menu.js` moves native DOM focus directly between items on arrow-key press (see the parity note below) among non-disabled items only |

**Validation rules**: opening MUST move focus to the first (non-disabled)
menu item (FR-008). Up/Down arrow keys move focus among items, wrapping at
the ends and skipping disabled items (FR-009). Escape, item selection, and
outside click MUST all close the menu and return focus to the trigger
(FR-010) — Escape and outside-click are handled natively by `popover="auto"`'s
light-dismiss behavior (research.md R1) for the *closing* itself, but
focus-return to the trigger in all three paths is explicitly reinforced by
`dropdown-menu.js`'s `toggle` listener calling `trigger.focus()`
unconditionally on the popover's closed transition — not assumed to be
automatic (`/speckit-analyze` caught an earlier draft's unverified claim
that the Popover API restores focus the way `<dialog>` does; this project
already learned once, in feature 003, that a *documented* native
focus-restoration claim didn't hold across every engine (WebKit), so this
path is reinforced explicitly rather than trusted on the strength of an
unverified analogy — see `dropdown-menu.contract.md`).

**Roving-focus parity note** (corrects an earlier draft's inaccurate
claim): Dropdown Menu does **not** implement true roving tabindex the way
Tabs does. Tabs is a persistent, always-visible `tablist` where exactly one
tab must remain the sole Tab-stop at all times. Dropdown Menu is an
ephemeral overlay — per the WAI-ARIA APG's own Menu Button pattern, pressing
Tab while a menu is open conventionally **closes the menu** and moves focus
to the next focusable element after the trigger, rather than cycling among
menu items; menu items keep their native default `tabindex` (0 for a plain
`<button>`), and `dropdown-menu.js` handles Tab by closing the popover
(`hidePopover()`) so the browser's normal Tab order takes over from there.
Arrow keys move focus directly via `.focus()` calls on the target item, not
via tabindex manipulation. This is a deliberately different, simpler
mechanism than Tabs' roving tabindex — not an inconsistency, but the two
were previously (incorrectly) described as sharing "the same division of
labor," which this note corrects.

**Full utility composition**:

```css
.dropdown-menu-panel {
  @apply absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white
    shadow-lg ring-1 ring-neutral-300 focus:outline-none;
}
.dropdown-menu-item {
  @apply block w-full px-4 py-2 text-left text-sm text-neutral-900
    hover:bg-neutral-50 active:bg-neutral-100
    focus-visible:bg-neutral-50 focus-visible:outline
    focus-visible:outline-2 focus-visible:-outline-offset-2
    focus-visible:outline-brand
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:bg-transparent;
}
```

`.dropdown-menu-panel` uses `absolute right-0 mt-2` (positioned relative to
a `relative`-positioned wrapper around the trigger) rather than any
anchor-positioning mechanism, per research.md R1's decision to accept
always-downward-opening as the v1 behavior and not depend on
inconsistently-supported CSS Anchor Positioning. `.dropdown-menu-item`
layers `focus-visible:bg-neutral-50` **together with**, not instead of, the
Principle V-mandated focus-visible outline set — a first draft used
`focus-visible:outline-none` to rely on the bg highlight alone, which
`/speckit-analyze` correctly flagged as silently dropping Principle V's
unconditional mandate for a literal `<button role="menuitem">` and risking
a WCAG 2.2 §2.4.13 Focus Appearance (AAA) shortfall. The outline uses
`-outline-offset-2` (negative, inset) rather than the usual positive offset
other components use, since a positive offset on a full-width menu item
packed edge-to-edge against its siblings would visually clip against the
adjacent item; an inset outline stays fully visible within the item's own
box while the bg highlight still provides the APG's conventional roving-
focus affordance underneath it. `disabled:opacity-50
disabled:cursor-not-allowed` (not a custom color-only treatment) is used
verbatim, matching the same second `/speckit-analyze` fix applied to
`.tab-trigger` above — see its note for the full rationale.

## Cross-cutting invariants (all four components)

- Every color token referenced MUST exist in the constitution's Base
  Semantic Palette table — no new *color* tokens are introduced by this
  feature (verified explicitly in research.md R3, not assumed).
- Every text/background pairing MUST pass WCAG 2.2 AAA contrast (FR-012,
  SC-002) — `scripts/check-contrast.mjs` runs unmodified against these new
  patterns since no new tokens are introduced.
- No raw Tailwind palette class may appear in shipped markup (FR-011,
  SC-003) — enforced by the existing `scripts/audit-tokens.mjs`, also
  unmodified.
- `src/scripts/tabs.js` and `src/scripts/dropdown-menu.js` contain zero
  styling decisions — Principle III's Tailwind-only mandate governs CSS,
  not these behavior scripts, same relationship `overlay.js`/`toast.js`
  had to Principle III in feature 003.
- None of the four components' markup or scripts require any change to
  the project-wide CSP established in feature 003 (`script-src 'self'`
  already covers same-origin `<script src="...">` tags) — verified in
  research.md R5.
