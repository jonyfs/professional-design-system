# Component Contract: Menubar

## Markup contract

```html
<div class="menubar" role="menubar" aria-label="Application menu" data-menubar data-testid="menubar">
  <div class="relative inline-block">
    <button
      type="button"
      id="menubar-file-trigger"
      popovertarget="menubar-file-panel"
      aria-expanded="false"
      role="menuitem"
      class="menubar-trigger"
      data-testid="menubar-file-trigger"
      data-dropdown-trigger
      data-menubar-item
      tabindex="0"
    >
      File
    </button>
    <div id="menubar-file-panel" popover="auto" role="menu" aria-labelledby="menubar-file-trigger" class="dropdown-menu-panel" data-testid="menubar-file-panel">
      <button type="button" role="menuitem" class="dropdown-menu-item">New</button>
      <button type="button" role="menuitem" class="dropdown-menu-item">Open</button>
      <button type="button" role="menuitem" class="dropdown-menu-item">Save</button>
    </div>
  </div>
  <div class="relative inline-block">
    <button
      type="button"
      id="menubar-edit-trigger"
      popovertarget="menubar-edit-panel"
      aria-expanded="false"
      role="menuitem"
      class="menubar-trigger"
      data-testid="menubar-edit-trigger"
      data-dropdown-trigger
      data-menubar-item
      tabindex="-1"
    >
      Edit
    </button>
    <div id="menubar-edit-panel" popover="auto" role="menu" aria-labelledby="menubar-edit-trigger" class="dropdown-menu-panel" data-testid="menubar-edit-panel">
      <button type="button" role="menuitem" class="dropdown-menu-item">Cut</button>
      <button type="button" role="menuitem" class="dropdown-menu-item">Copy</button>
      <button type="button" role="menuitem" class="dropdown-menu-item">Paste</button>
    </div>
  </div>
  <div class="relative inline-block">
    <button
      type="button"
      id="menubar-view-trigger"
      popovertarget="menubar-view-panel"
      aria-expanded="false"
      role="menuitem"
      class="menubar-trigger"
      data-testid="menubar-view-trigger"
      data-dropdown-trigger
      data-menubar-item
      tabindex="-1"
    >
      View
    </button>
    <div id="menubar-view-panel" popover="auto" role="menu" aria-labelledby="menubar-view-trigger" class="dropdown-menu-panel" data-testid="menubar-view-panel">
      <button type="button" role="menuitem" class="dropdown-menu-item">Zoom In</button>
      <button type="button" role="menuitem" class="dropdown-menu-item">Zoom Out</button>
    </div>
  </div>
</div>
```

```css
.menubar {
  @apply flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-1;
}
.menubar-trigger {
  @apply rounded-sm px-3 py-1.5 text-sm font-medium text-neutral-700
    hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-brand;
}
.menubar-trigger[aria-expanded="true"] {
  @apply bg-neutral-100;
}
```

Reuses `.dropdown-menu-panel`/`.dropdown-menu-item` (feature 005/010)
verbatim for every panel — no new panel/item CSS. `src/scripts/dropdown-
menu.js`'s `initDropdownMenus()` is called completely unmodified over all
`[data-dropdown-trigger]` elements on the page (research.md R3, confirmed
its existing `anchorCounter` pattern already handles multiple independent
trigger+panel pairs with zero changes needed) — this provides each
panel's own open/close, in-panel arrow-key roving focus, Escape-to-close-
and-return-focus, and light-dismiss entirely for free. The only new script
is `src/scripts/menubar.js`, adding the between-trigger roving-tabindex
layer (`[data-menubar-item]`, adapted from `tabs.js`'s `enabledIndices()`/
Left-Right/Home/End pattern) plus the auto-switch-open-panel behavior when
arrow-navigating while a sibling panel is already open (checked via
`:popover-open`).

**Implementation corrections found during `/speckit-implement` (all
documented in research.md R3's addendum)**:
1. `menubar.js`'s keydown listener is attached to the `[data-menubar]`
   container (hence that attribute on the outer `<div>`, added during
   implementation), not to each individual trigger — a per-trigger
   listener stops receiving ArrowRight/ArrowLeft once a panel opens and
   dropdown-menu.js's own toggle listener moves focus into the panel's
   first item; the container-level listener catches the key bubbling up
   from inside an open panel, matching real Menubar keyboard convention
   (arrow keys must switch top-level menus even while a submenu has
   focus).
2. When auto-switching to a sibling trigger while a panel is open, focus
   is explicitly returned to the newly-focused TRIGGER button itself
   (never left inside the newly-opened panel's first item) — matching
   spec.md's literal wording ("moves focus to a different top-level
   trigger"). Since dropdown-menu.js's own toggle listener unconditionally
   moves focus into `items()[0]` on open, `menubar.js` attaches its own
   one-time `toggle` listener to the SAME panel (registered after
   dropdown-menu.js's, since `initDropdownMenus()` always runs first) so
   its own `focus()` call runs strictly after and wins.

**Fourth correction found during code review (HIGH — a real rapid-
keypress corrupted-state bug, fixed after two iterations, both documented
in research.md R3's addendum)**: the sibling-switch transition does NOT
call `hidePopover()` on the old panel at all. Confirmed empirically that
calling `showPopover()` directly on a sibling `popover="auto"` panel
already closes whichever one is currently open as one atomic native
operation — the resulting "closed"/"open" toggle events fire in a fixed,
guaranteed order with no separate developer-orchestrated chain in
between, eliminating an entire class of rapid-double-keypress
interleaving that the original two-call (`hidePopover()` then
`showPopover()`) design was vulnerable to. `menubar.js` additionally
tracks a `generation`/`settledGeneration` pair: a keypress arriving before
an earlier transition's final focus placement has completed is ignored
outright rather than allowed to start an overlapping second transition.

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| focus-visible | `focus-visible:outline outline-2 outline-offset-2 outline-brand` |
| expanded (panel open) | `bg-neutral-100` via `.menubar-trigger[aria-expanded="true"]` (visual affordance that this trigger's panel is currently open, matching Pagination's `[aria-current="page"]` attribute-selector precedent) |

## Required attributes

- `role="menubar"` on the container, `aria-label` describing its purpose
- `role="menuitem"` on each top-level trigger (WAI-ARIA Menubar pattern —
  a top-level trigger IS a menuitem of the menubar itself)
- Only the first trigger has `tabindex="0"` on initial render; all
  others start `tabindex="-1"` (roving tabindex, `menubar.js` maintains
  this exactly like `tabs.js` does for Tabs)
- Each trigger's `popovertarget` references its own panel `id`;
  `aria-expanded` is synced by the REUSED `dropdown-menu.js` toggle
  listener, not duplicated logic in `menubar.js`

## Token allowlist used

`border-neutral-200`, `text-neutral-700`, `bg-neutral-50`,
`bg-neutral-100`, `outline-brand` — all already-ratified, reused
verbatim. No new tokens.

## Acceptance mapping

- FR-005, FR-006, SC-001, SC-002 → `tests/e2e/menubar.spec.ts` (Left/Right/
  Down/Enter/Space/Escape and the at-most-one-panel-open invariant all
  asserted via real keyboard simulation, per research.md R5)
