# Research: Navigation Micro-Patterns

## R1: Team/Workspace Switcher and Language Switcher reuse Dropdown Menu's exact mechanics, richer content only where needed

**Decision**: Both static HTML pages use the identical
`popovertarget`/`popover="auto"`/`role="menu"` markup Dropdown Menu
already established (`src/components/dropdown-menu/dropdown-menu.html`),
wired by the SAME `src/scripts/dropdown-menu.js`. No new JS behavior
file for either. React ports reuse the existing `useDropdownMenu` hook
directly (not a new hook) — Team Switcher needs per-item Avatar
content the base `DropdownMenu` component's plain-text `dropdown-menu-
item` button doesn't support, so it gets its own thin component
composing the hook; Language Switcher's items are plain text and could
even reuse `<DropdownMenu>` unmodified, but ships its own thin wrapper
too for demo/gallery consistency with Team Switcher and to own its
"current selection" state cleanly.

**Rationale**: Verified directly against `dropdown-menu.html`/
`useDropdownMenu.ts` — the mechanics (native Popover API invoker
wiring, arrow-key roving focus, Tab-closes-menu, WebKit-safe focus
return) are identical to what both switchers need; building a second
implementation would violate this catalog's established
single-mechanism-per-behavior discipline (the same reasoning applied
to Slide-over reusing Modal's `<dialog>` mechanism in feature 003, and
Session Timeout Modal reusing Modal's mechanism in feature 030).

## R2: Back-to-Top Button ships only the scroll-threshold logic it needs, not a standalone "Affix" primitive

**Decision**: `src/scripts/back-to-top.js` listens to `scroll` (passive,
throttled via `requestAnimationFrame` to avoid the layout-thrashing
scroll-handler-churn this catalog's own performance rules warn
against) and toggles visibility past a fixed threshold (e.g. 400px).
No separate "Affix" component is extracted.

**Rationale**: Mirrors R2 of feature 030's research.md (Session
Timeout Modal / Countdown Timer) exactly — the inventory's own note
("reuses Button + Affix's scroll-threshold logic once built") points
at a DIFFERENT category's not-yet-built primitive; shipping only the
minimal logic this component needs keeps scope bounded to Navigation
micro-patterns, not silently absorbing a different category's item.

## R3: Scroll Progress Bar reuses Progress's exact fill mechanism, driven by scroll instead of a static value

**Decision**: Same `.progress-track`/`.progress-fill` classes, same
CSSOM `style.width` assignment pattern `progress.js` already
established (this project's CSP blocks inline `style="..."`
attributes) — only the VALUE source changes, from a caller-supplied
number to `(scrollY / (scrollHeight - clientHeight)) * 100`, computed
on the same throttled scroll listener Back-to-Top uses (a shared
`src/scripts/scroll-feedback.js` module drives both, avoiding two
independent scroll listeners on the same page).

**Rationale**: Verified directly against `progress.js` — zero new CSS,
zero new visual mechanism, matching the inventory's own buildability
signal precisely.

## R4: Onboarding Tour reuses Popover's positioning, adds a sequencing layer

**Decision**: Each tour step is a `popover="auto"` panel positioned via
CSS Anchor Positioning against its target element — the exact
mechanism `src/components/popover/popover.html`/`popover.js` already
establish (`anchor-name`/`position-anchor`, one per instance to avoid
collisions, per `popover.js`'s own `anchorCounter` pattern). The NEW
logic is a small step-sequencing controller: showing exactly one
step's popover at a time, Next/Previous advancing the index, Skip
closing immediately, and a step-indicator text ("2 of 4").

**Rationale**: This catalog has zero prior multi-step sequencing UI —
the ONLY genuinely new interaction pattern in this batch. Scoped to a
fixed, small step count (demo-defined) rather than a generic
tour-authoring runtime (spec.md Assumptions), keeping it a pattern
demonstration consistent with every other primitive in this catalog
rather than a bespoke framework.

## Summary

4 of 5 primitives are direct reuses of Dropdown Menu, Progress, and a
scroll listener with zero new CSS. Only Onboarding Tour introduces
genuinely new logic (step sequencing), reusing Popover's positioning
mechanism for the actual panel rendering. Zero new design tokens,
zero new dependencies.
