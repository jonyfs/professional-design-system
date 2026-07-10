# Phase 0 Research: Fix Popover Panel Positioning

## R1: CSS Anchor Positioning API — browser support verified empirically

**Decision**: Use the CSS Anchor Positioning API (`anchor-name`,
`position-anchor`, the `anchor()` function) as the fix mechanism — not a
JS-computed `getBoundingClientRect()` + inline-style fallback.

**Rationale**: Verified directly against this project's own Playwright
browser engines (the exact Chromium, Firefox, and WebKit builds this
project's test suite runs against), not assumed from general web-platform
knowledge that could be stale:

```js
// Ran once against each of chromium/firefox/webkit launched via Playwright:
CSS.supports("anchor-name", "--foo")        // true, true, true
CSS.supports("position-anchor", "--foo")    // true, true, true
CSS.supports("top", "anchor(--foo top)")    // true, true, true
```

All three report full native support. This mirrors the exact research
discipline already established for the Popover API itself in feature
005 (verify browser maturity in this project's actual target engines
before adopting it, not assume from general knowledge) — applied here
to a second, newer CSS API for the same reason.

**Alternatives considered**: A JS-computed position (an "open" handler
reading `trigger.getBoundingClientRect()` and setting the panel's inline
`top`/`left`, plus a `resize`/`scroll` listener to keep it in sync while
open) — rejected once native support was confirmed universal. It would
have been strictly more code (a resize/scroll listener neither
`dropdown-menu.js` nor `combobox.js` currently has) to reproduce
behavior the CSS Anchor Positioning API already provides natively and
correctly, including automatically tracking the trigger's position
during scroll without any JS at all.

## R2: Root cause, precisely

Once an element is shown via `showPopover()` (or the declarative
`popover`/`popovertarget` mechanism), the browser promotes it into the
top layer. A top-layer element's containing block for `position:
absolute`/`fixed` is the viewport's initial containing block — it does
**not** trace back through its original DOM ancestor chain, regardless
of any `position: relative` wrapper around its original DOM location.
This is why `.dropdown-menu-panel`'s `absolute right-0 mt-2` (feature
005) and `.combobox-listbox`'s `absolute left-0 right-0 mt-1` (feature
008) silently resolved against the viewport instead of their trigger/
input — confirmed by direct Playwright bounding-box measurement against
both shipped static pages (panel/listbox rendered near the top of the
viewport, not adjacent to the trigger/input, regardless of the
trigger's/input's actual on-page position).

CSS Anchor Positioning exists specifically to solve this: `anchor()` and
`position-anchor` establish an explicit anchor relationship that is
**not** mediated by the normal containing-block/ancestor chain at all,
so it works correctly regardless of whether the positioned element has
been promoted to the top layer.

## R3: Anchor-name uniqueness for multiple instances on one page

**Decision**: Assign a unique `anchor-name` per component *instance* at
runtime (not a single hardcoded name in the stylesheet), matching the
already-established `useId()`-based uniqueness pattern from feature
009's Accordion fix (a stable-but-unique native `<details name="...">`
group per instance, for the identical reason).

- **Vanilla JS** (`dropdown-menu.js`, `combobox.js`): a module-level
  counter generates a unique CSS custom-ident per instance at init time
  (e.g. `--dropdown-anchor-0`, `--dropdown-anchor-1`, ...), set via
  `trigger.style.anchorName` / `input.style.anchorName` and the
  corresponding `panel.style.positionAnchor` /
  `listbox.style.positionAnchor`.
- **React** (`useDropdownMenu.ts`): `useId()`, sanitized to a valid CSS
  custom-ident (React's `useId()` return value contains `:` characters,
  which are invalid in a custom-ident — stripped/replaced), set the same
  way via the DOM `style.anchorName`/`style.positionAnchor` properties in
  the existing ref effect (the same effect that already sets
  `panel.popover = "auto"`).

**Rationale**: A single hardcoded `anchor-name` in the stylesheet would
"work" for every current demo page (each has exactly one instance today)
but would silently misbehave the moment a real consuming app renders two
Dropdown Menu or Combobox instances on the same page — the exact
"ratified but never stress-tested beyond the demo's own shape" trap this
project has hit before (Accordion's `useId()` fix in feature 009 for the
identical underlying reason: a shared native group name colliding across
instances).

**Alternatives considered**: A single fixed `anchor-name` (rejected per
above). Requiring consumers to manually assign unique `anchor-name`
values themselves (rejected — this project's components are meant to
work correctly out of the box with zero consumer-side wiring, matching
every other multi-instance-safety guarantee already established, e.g.
Modal's `useId()`-based `aria-labelledby`).

## R4: CSS changes, no JS interaction-logic changes needed for keyboard/focus behavior

**Decision**: This fix touches only `anchor-name`/`position-anchor`/
`anchor()` CSS (plus the minimal JS lines needed to assign a unique
anchor-name per instance, R3) — no change to either component's
existing open/close, keyboard-navigation, or focus-management logic.

**Rationale**: Confirmed by reading `dropdown-menu.js`, `combobox.js`,
and `useDropdownMenu.ts` in full — none of that logic depends on the
panel's screen position; it operates entirely on DOM structure (querying
`[role="menuitem"]`/`[role="option"]`, focus, ARIA attributes). Matches
FR-005's requirement that no other ratified behavior changes.

## Testing Strategy

Add one new assertion per fixed component: after opening, compare the
panel/listbox's `boundingBox()` against its trigger/input's
`boundingBox()` and assert they are adjacent (e.g. the panel's top edge
is within a few pixels of the trigger's bottom edge, and horizontally
overlapping or closely aligned) — the concrete missing check that let
this bug ship undetected. Existing visual-regression screenshots (which
crop to just the panel/listbox) are kept as-is; they still validate the
panel's own internal appearance, just not its page position, which the
new assertion now covers. New Linux baselines are needed only if any
existing screenshot's pixel content changes as a side effect of the
position fix (expected: no change, since the crop is relative to the
element itself, not the viewport) — verified during implementation via
`cmp`, not assumed.
