# Phase 0 Research: Navigation & Disclosure Primitives

## R1. Dropdown Menu interaction foundation: native Popover API vs. custom JS

**Question**: Can the native Popover API (`popover` attribute, `popovertarget`/
`popovertargetaction`, `showPopover()`/`hidePopover()`/`togglePopover()`,
`:popover-open`) provide Dropdown Menu's light-dismiss and top-layer behavior
the way `<dialog>`/`showModal()` did for Modal/Slide-over in feature 003 — or
is a fully custom JS implementation required?

**Decision**: Use the native Popover API (`popover="auto"`) as the open/close/
light-dismiss/top-layer foundation, exactly mirroring feature 003's
`<dialog>` precedent. A small, separate JS module still handles roving-
tabindex arrow-key navigation between menu items and `aria-expanded` syncing
on the trigger — neither of which any native element provides.

**Rationale**:
- `popover="auto"` (the default popover type) gives, for free and with zero
  JS: top-layer rendering (no z-index conflicts with the rest of the page,
  same benefit `<dialog>` gave Modal), Escape-to-close, and light-dismiss
  (a click anywhere outside the popover closes it) — this covers FR-010's
  Escape and outside-click requirements entirely natively.
- Cross-browser support for the Popover API (the `popover` attribute and its
  JS methods) reached Baseline "Widely available" across Chrome, Firefox,
  and Safari well before this project's target browser baseline — safe to
  use without a fallback, consistent with how `<dialog>`/`showModal()` was
  already adopted in feature 003 under the same evergreen-browser
  assumption.
- What Popover API does **not** provide, confirmed by inspecting its actual
  spec surface rather than assumed: (a) arrow-key navigation between the
  menu's own items — there is no native equivalent to the WAI-ARIA menu
  pattern's keyboard model, the same *class* of gap that makes Tabs (R2)
  need JS too, though the two components close it by different mechanisms
  (see below — an earlier draft of this note overstated the parity as
  identical, `/speckit-analyze` caught it); (b) automatic `aria-expanded`
  state on the *trigger* element — the popover's own open/closed state is
  exposed via `:popover-open` on the popover itself, but the triggering
  `<button popovertarget="...">` does not get `aria-expanded` toggled
  automatically; (c) focus reliably returning to the trigger on every
  closing path (Escape, outside-click, item selection) — not assumed to be
  automatic, given feature 003's own lesson that a similar native-
  restoration claim about `<dialog>` didn't hold in every engine (WebKit).
  All three gaps are closed by a small `dropdown-menu.js` module (see
  Project Structure) that listens for the popover's native `toggle` event
  to sync `aria-expanded` and reinforce focus-return, and handles
  `ArrowUp`/`ArrowDown`/`Home`/`End`/`Tab` keydowns among `[role="menuitem"]`
  children — the same "native element handles dismissal semantics, a thin
  JS layer handles what it doesn't cover" division of labor already
  established by `overlay.js`/`toast.js` in feature 003, but **not**
  identical in mechanism to Tabs' roving tabindex (R2): Dropdown Menu moves
  focus directly via `.focus()` calls and closes on Tab (per the WAI-ARIA
  APG's Menu Button pattern), rather than maintaining a roving `tabindex`
  across a persistent tablist — see data-model.md's Dropdown Menu section
  for the corrected parity note.
- CSS Anchor Positioning (`anchor-name`/`position-anchor`/`position-area`) —
  the mechanism that would let a popover automatically reposition itself
  near a viewport edge — is explicitly **not** adopted for this feature.
  Unlike the Popover API itself, anchor positioning's cross-engine support
  is newer and less uniformly available across this project's Chrome/
  Firefox/Safari baseline. Per spec.md's Assumptions, a fixed,
  always-downward-opening menu (positioned via ordinary Tailwind utilities
  relative to the trigger, e.g. `absolute right-0 mt-2`) is the v1
  behavior; viewport-edge repositioning is out of scope, not attempted via
  a partially-supported CSS feature.

**Alternatives considered**:
- *Fully custom JS (manual `open`/`closed` state, a document-level
  `click` listener for outside-click detection, manual `z-index`
  management)*: rejected as the fallback only if Popover API support were
  insufficient. It is not — Popover API is well-supported and directly
  replaces the highest-risk, most error-prone parts of a hand-rolled
  dropdown (outside-click detection has well-known edge cases around event
  propagation and touch devices; top-layer rendering via native popover
  avoids the entire class of z-index bugs a hand-rolled implementation
  would need to manage manually). Using it keeps this feature consistent
  with the project's established "native element first" philosophy.
- *CSS-only dropdown via `:focus-within` or a checkbox hack*: rejected —
  cannot satisfy FR-010's Escape-to-close and outside-click-to-close
  requirements without JS regardless, and does not provide top-layer
  rendering (the dropdown would be clipped by any ancestor's `overflow:
  hidden`, a real risk in a real product layout).

## R2. Tabs interaction: confirms no native element applies

**Question**: Does any native HTML element or Popover-API-adjacent
mechanism cover the WAI-ARIA Tabs pattern's roving-tabindex/arrow-key
requirements, the way `<details>`/`<summary>` covers Accordion?

**Decision**: No — Tabs requires a dedicated `tabs.js` module. This was
verified, not assumed: HTML has no native tabbed-panel element (unlike
`<details>`, `<dialog>`, or `<select>`), and the WAI-ARIA Tabs pattern's
defining behavior — arrow keys move both focus and selection between tabs,
with only the active tab in the page's Tab order — has no equivalent in
any shipped browser feature as of this project's target baseline.

**Rationale**: Confirms FR-005/FR-006 as written are the minimum necessary
JS surface, not a design choice that should be second-guessed during
implementation. The module is scoped narrowly: given a `[role="tablist"]`
container, it (a) sets `tabindex="0"` on the selected tab and `tabindex="-1"`
on the rest, (b) handles `ArrowLeft`/`ArrowRight`/`Home`/`End` keydowns to
move focus and toggle `aria-selected`, and (c) toggles the `hidden` attribute
on the associated `tabpanel` via `aria-controls`. No positioning, dismissal,
or focus-trap logic is needed — Tabs is simpler in scope than the
Modal/Toast/Dropdown Menu family despite needing its own JS, because there
is no open/closed lifecycle to manage, only a selection index.

**Alternatives considered**:
- *Radio-input + `:checked` + sibling-selector CSS trick (no JS)*: rejected.
  This can visually swap panels with zero JS, but produces a component that
  fails FR-005/FR-006 outright — radio inputs have no `role="tab"`
  semantics, arrow-key behavior would be native radio-group behavior (which
  does move focus+selection together, coincidentally close to the Tabs
  spec) but the *panels* would need `:has()` or adjacent-sibling selectors
  keyed to `:checked` state, which cannot express "show the panel whose
  `id` matches the checked radio's `aria-controls` value" — the association
  the accessibility tree needs. Confirmed via testing: axe-core flags a
  radio-group-as-tabs implementation for missing `tablist`/`tab`/`tabpanel`
  roles that can't be added to `<input type="radio">` without contradicting
  its native role.

## R3. Design token sufficiency — verified, not assumed

**Question**: Do all four components render fully within the already-
ratified Base Semantic Palette, or does any of them need a new token?

**Decision**: No new tokens are needed. Verified against the actual
ratified palette (`.specify/memory/constitution.md`'s Base Semantic
Palette and existing Component Catalog entries), component by component:

- **Breadcrumbs**: the constitution's Component Catalog *already contains*
  a ratified Breadcrumbs pattern (`Application & Navigation` section,
  pre-existing from the original constitution ratification, never
  implemented until now): `text-sm text-neutral-500`, divider
  `text-neutral-300`, current item `text-neutral-900 font-medium` +
  `aria-current="page"`. This feature implements that existing pattern
  rather than inventing a new one — confirmed by reading the constitution
  directly rather than assuming the catalog entry didn't exist.
- **Accordion/Disclosure**: `text-neutral-900` (trigger label),
  `text-neutral-500` (secondary/metadata text if used),
  `border-neutral-200` (item divider/container border), `text-neutral-400`
  → `text-neutral-600` (chevron icon, default/hover), the standard
  `focus-visible:outline focus-visible:outline-2
  focus-visible:outline-offset-2 focus-visible:outline-brand` state set
  from Principle V. No new token required.
- **Tabs**: `text-neutral-500` (unselected tab), `text-neutral-900
  font-medium` (selected tab label), `border-brand` (selected tab's
  underline indicator, reusing the existing `brand` token non-textually,
  same pattern as Toggle's `bg-brand` track), `border-neutral-200` (tab
  list's baseline rule), the standard focus-visible state set. No new
  token required.
- **Dropdown Menu**: `bg-white`, `ring-1 ring-neutral-300` or
  `border border-neutral-200` (menu panel container, consistent with the
  existing Modal panel / Select field treatment), `text-neutral-900`
  (menu item text), `bg-neutral-50` (item hover/highlighted-via-keyboard
  state, reusing the existing List item hover token from Data Display &
  Listings), `text-neutral-400`/`opacity-50` (disabled item, per Principle
  V's existing disabled-state pattern). No new token required.

**Alternatives considered**: N/A — this was a verification task, not a
design decision with alternatives. The explicit goal (learning from
feature 001's token-allowlist assumption bug) was confirming sufficiency
by reading the ratified palette, not assuming it and discovering a gap
mid-implementation.

## R4. Testing strategy: consistent with features 001-004

**Decision**: Same Playwright visual regression + axe-core pattern as
every prior feature. New visual regression baselines MUST be generated via
`update-snapshots.yml`'s `workflow_dispatch` job on the real
`ubuntu-latest` runner — never locally, never via local Docker (feature
001's CI incident: even a local Playwright Docker container was not
bit-identical to the actual GitHub Actions image).

**Verified, not assumed**: `update-snapshots.yml` was modified in feature
004 to build `packages/react` before running `playwright test
--update-snapshots` (that workflow calls Playwright directly, bypassing
the `pretest:e2e` npm hook that normally triggers the build). This
feature does not touch `packages/react` at all, so that build step is a
no-op for this feature's own baselines — confirmed by reading the
workflow file directly rather than assuming the feature-004-era change
needs revisiting here. No workflow changes are needed for this feature.

## R5. CSP: no change needed

**Decision**: No Content-Security-Policy changes. The project-wide CSP
(`default-src 'self'; script-src 'self'; style-src 'self'; object-src
'none'; base-uri 'self'`, added in feature 003) already permits same-origin
`<script>` tags, which is all `tabs.js`/`dropdown-menu.js` need — no
inline scripts, no external script sources, no `eval`-adjacent APIs
(Popover API's `showPopover()`/`hidePopover()`/`togglePopover()` are
ordinary DOM methods, not string-evaluated). Verified by confirming the
existing CSP's `script-src 'self'` directive already covers this without
modification, consistent with how feature 003's own `overlay.js`/
`toast.js` required no CSP loosening either.
