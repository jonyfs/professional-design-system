# Phase 0 Research: Homepage Component Showcase

## R1. Prior art — what feature 026 actually shipped (verified, not assumed)

Feature 026 ("Demo Gallery Visual Showcase") targeted this exact same
complaint once before (78 components at the time) but its actual
delivered scope (tasks.md T001-T018) was: (a) grouping cards into
category `<section>`s with a quick-jump nav, (b) a "flagship" treatment
— 2-column span + one extra sentence — applied to only 4 named
components (Data Table, Chart, Command Palette, Theme Gallery), and
(c) a header-treatment polish pass on each *individual* component demo
page. **It never added a live visual preview to any of the 114 cards
on the homepage itself** — every card today is still title + one-line
description + a bare "View full demo →" text link. This feature's
scope (live preview inside every card) is genuinely new, not a
duplicate of 026's work — confirmed by reading the current `index.html`
directly (114 `<a class="demo-link">` entries, zero live-rendered
component markup inside any card).

## R2. Design system guidance applied (per user's explicit request)

**`/ui-ux-pro-max`**: the installed skill's search tool
(`scripts/search.py`) is broken in this environment (its `scripts/`
and `data/` symlinks point to a path that does not exist,
`~/.claude/src/ui-ux-pro-max/...`) — confirmed via `stat`, not assumed.
Its `SKILL.md` embeds a full Quick Reference rule set inline, which was
applied directly: `touch-target-size` (44×44 minimum — every card
already exceeds this given its content), `state-clarity` (hover/
pressed/disabled states visually distinct while staying on-style),
`elevation-consistent` (one shared shadow/elevation scale, not random
per-card values), `visual-hierarchy` (established via size/spacing/
contrast, not color alone), `duration-timing` (150-300ms micro-
interactions), `layout-shift-avoid` (hover transforms use `transform`,
never `width`/`height`), `color-accessible-pairs` (this catalog's own
existing AAA bar already exceeds the referenced 4.5:1/7:1 minimums).

**`/frontend-design:frontend-design`**: applied its brainstorm→plan→
critique process (R3-R6 below). Its core tension for THIS brief: the
skill's playbook assumes a free color palette, but this catalog's
color is a hard, pre-existing constraint (the fixed 21-token semantic
schema, reactive across 49 curated themes) — "the brief's own words
always win" where the brief pins something down, and this catalog's
own constitution (Principle IV, non-negotiable) pins down color. The
signature/distinctiveness budget for this redesign is therefore spent
on **composition and typography**, not on inventing a new palette.

## R3. Signature element: a live "proof wall" hero, not a stat strip

The current hero is 4 static `<dt>/<dd>` numbers (114 components, 2
surfaces, AAA, 40+ themes) — a claim, not a demonstration. The
redesigned hero instead stages 5-6 real, already-shipped components
(e.g. a Toast, a Badge cluster, a Card, a Progress bar, an Avatar
Group) as an overlapping, gently rotated "deck" of live-rendered
fragments at different depths (z-index + subtle `translate`/`rotate`,
compositor-only transforms) behind/beside the headline — literally
proving "everything in this catalog is real, live UI" before any
stat is read. The 4 existing stat figures move to a quieter supporting
row beneath. This is the ONE deliberate risk this redesign takes
(per `/frontend-design`'s "spend your boldness in one place"); every
other surface stays disciplined.

## R4. Typographic decision: lean on the existing mono face, no new font

This catalog ships exactly two font stacks today (`shared/design-
tokens.ts` `fontFamily`): `sans` (Inter) and `mono` (system monospace
stack) — no display face. Rather than importing a third, brand-new
typeface (a real new dependency/performance cost this catalog's own
`rules/web/performance.md` — max 2 font families — argues against),
this redesign's typographic signature is: **the already-available
mono stack, used large and bold, exclusively for structural/eyebrow
labels** (category dividers, the live component count, card category
tags) — Inter remains the body/heading workhorse everywhere else. This
is a real, deliberate pairing decision (a "utility face" elevated to a
structural/signature role, per `/frontend-design`'s type-pairing
guidance) that costs zero new dependencies and reinforces this being a
*developer*-facing, code-adjacent catalog.

## R5. Bento sizing: cell span driven by real component footprint, not decoration

Extends feature 026's own "flagship = wider span" precedent (previously
manual, 4 components) into a systematic, content-driven rule for all
114:

| Tier | Span (`sm:`+) | Criterion (real, not arbitrary) | Example components |
|---|---|---|---|
| Large | 2 cols × 2 rows | Component's natural rendered footprint needs real width AND height to read correctly (grids, tables, calendars, multi-panel layouts) | Data Table, Advanced Data Table, Chart(s), Command Palette, Kanban-adjacent PickList, Gallery, Compare |
| Wide | 2 cols × 1 row | Needs real width but not height (full-width bars, multi-item rows, wide forms) | Navbar, Breadcrumbs, Stepper, Menubar, Pagination, Progress, Slider, Social Login Group, Toolbar-like groups |
| Standard | 1 col × 1 row | Everything whose natural rendered size is compact and roughly square/portrait | The large majority — Button, Card, Badge, Avatar, TextInput, Checkbox, Toggle, Tooltip, etc. |

This is assigned per-component during implementation (T-level task),
derived from each component's own existing static demo page's natural
content, not invented per card.

## R6. Nested-interactive-content resolution (real HTML/a11y constraint, not a style choice)

FR-001 (real component markup inside the card) and FR-003 (the whole
card is one native `<a>`) collide for any component whose real markup
IS itself interactive (Button, Checkbox, TextInput, Toggle, Switch,
etc.) — the HTML spec disallows interactive descendants inside an
`<a>`, and screen readers announce nested-interactive content
unpredictably. Resolution (a well-established, valid pattern, not a
workaround): the live preview markup renders inside a wrapper carrying
`inert` (removes it from the accessibility tree and from tab order,
browser-native, zero JS) — the outer `<a>` alone carries the
accessible name (the component's name, via visible text) and is the
only focusable/actionable element in the card. This preserves FR-001's
"real markup, not a placeholder" (the DOM is the real component) while
keeping FR-003's whole-card-link fully valid and screen-reader-correct.

## R7. Overlay/triggered components (Clarifications 2026-07-18)

Per the resolved clarification: Modal, Toast, Slide-over, Command
Palette, Dropdown Menu, Popover, Context Menu, Menubar, Tooltip,
Notification Center, Session Timeout Modal, and any other Popover-API/
native-`<dialog>`-based component (spec.md FR-004's now-reconciled
full list) render their real classes/markup in their visual open-state
appearance, wrapped in the same `inert` container as R6, WITHOUT
invoking the real trigger mechanism (no `showModal()`, no Popover API
`.showPopover()`, no timer-driven auto-dismiss). Concretely: reuse each
component's own existing
static demo HTML's "open state" markup fragment directly (already
hand-authored and visually correct on its own demo page), rather than
attempting to script-trigger 114 components simultaneously on load.
