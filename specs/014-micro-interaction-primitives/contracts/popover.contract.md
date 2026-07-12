# Component Contract: Popover

## Markup contract

```html
<div class="relative inline-block">
  <button type="button" class="btn-secondary" popovertarget="pop-1" aria-expanded="false">
    Share
  </button>
  <div id="pop-1" popover="auto" class="popover-panel">
    <!-- arbitrary content: forms, text, other components -->
    <p class="text-sm text-neutral-900">Anyone with the link can view.</p>
  </div>
</div>
```

```css
.popover-panel {
  @apply w-72 rounded-md border border-neutral-300 bg-white p-4 shadow-lg;
  position-try-fallbacks: flip-block, flip-inline;
}
```

Identical mechanism to Dropdown Menu (`popover="auto"` + CSS Anchor
Positioning, unique `anchor-name` per instance assigned at init) but with
**no fixed item-list markup or roving-focus JS**. `popover.js` (extracted
from `dropdown-menu.js`'s generic `toggle`-listener wiring) carries over
two things, not one: `aria-expanded` sync AND close-path `trigger.focus()`
(returning focus to the trigger when the panel closes) — the open-path
focus-first-item behavior is dropped, since Popover's content is arbitrary
and has no "first item" concept, but a real interactive panel (e.g. this
contract's own copy-button example) still needs focus returned somewhere
sane on close, exactly like Dropdown Menu/Context Menu already do. Omitting
this was a genuine gap `/speckit-analyze` caught (flagged asymmetrically
fixed for Context Menu but not here, in the same feature) — fixed here
before implementation rather than after. Unlike Dropdown Menu (which
explicitly leaves viewport-edge positioning out of scope), Popover adds
`position-try-fallbacks` (research.md R8) — verified supported on all
three target engines — so the panel automatically flips to the opposite
side of its trigger when the default position would overflow the
viewport. This is new coverage, not inherited from Dropdown Menu, which
never solved this.

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| trigger focus-visible | standard `focus-visible:outline` (inherited from `.btn-secondary`) |
| trigger `aria-expanded` sync | no visual class required — state communicated via attribute, matching Dropdown Menu |

## Required attributes

- `popovertarget` on the trigger referencing the panel's `id`
- `popover="auto"` on the panel (native light-dismiss + Escape + top-layer)
- `aria-expanded` on the trigger, synced on the panel's `toggle` event

## Token allowlist used

`border-neutral-300`, `bg-white`, `shadow-lg` — reused verbatim from Dropdown
Menu's panel treatment. No new tokens.

## Acceptance mapping

- FR-009, SC-001, SC-002 → `tests/e2e/popover.spec.ts` (Escape + outside-click
  dismissal asserted, not assumed, per R9)
