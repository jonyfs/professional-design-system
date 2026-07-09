# Component Contract: Dropdown Menu

## Markup contract

```html
<div class="relative inline-block text-left">
  <button
    type="button"
    id="dropdown-trigger"
    popovertarget="dropdown-menu-panel"
    aria-expanded="false"
    class="btn-secondary"
    data-testid="dropdown-trigger"
    data-dropdown-trigger
  >
    More actions
  </button>

  <div
    id="dropdown-menu-panel"
    popover="auto"
    role="menu"
    aria-labelledby="dropdown-trigger"
    class="dropdown-menu-panel"
    data-testid="dropdown-menu"
  >
    <button type="button" role="menuitem" class="dropdown-menu-item" data-testid="dropdown-item-edit">
      Edit
    </button>
    <button type="button" role="menuitem" class="dropdown-menu-item" data-testid="dropdown-item-duplicate">
      Duplicate
    </button>
    <button type="button" role="menuitem" disabled class="dropdown-menu-item" data-testid="dropdown-item-archive">
      Archive
    </button>
    <button type="button" role="menuitem" class="dropdown-menu-item" data-testid="dropdown-item-delete">
      Delete
    </button>
  </div>
</div>
```

`popovertarget="dropdown-menu-panel"` (default `popovertargetaction="toggle"`)
handles opening/closing on trigger click natively — no click listener
needed for that part. `popover="auto"` on the panel provides top-layer
rendering, Escape-to-close, and light-dismiss (outside click) entirely
natively (research.md R1).

## Behavior wiring (`src/scripts/dropdown-menu.js`)

```js
export function initDropdownMenus() {
  document.querySelectorAll("[data-dropdown-trigger]").forEach((trigger) => {
    const menu = document.getElementById(trigger.getAttribute("popovertarget"));
    if (!menu) return;
    const items = () => Array.from(menu.querySelectorAll('[role="menuitem"]:not(:disabled)'));

    // Popover API's native "toggle" event fires on every open/close
    // transition (Escape, light-dismiss, and hidePopover() calls alike) —
    // used both to keep aria-expanded in sync (popovertarget does not set
    // it automatically, research.md R1) and to explicitly return focus to
    // the trigger on every closing path. Focus-return is NOT assumed to be
    // automatic Popover API behavior: an earlier draft of this module
    // relied on an unverified claim that it was, which /speckit-analyze
    // caught — this project already learned once, in feature 003, that a
    // similar native-restoration claim about <dialog> didn't hold in every
    // engine (WebKit), so this path is reinforced explicitly rather than
    // trusted on the strength of an unverified analogy.
    menu.addEventListener("toggle", (event) => {
      const open = event.newState === "open";
      trigger.setAttribute("aria-expanded", String(open));
      if (open) {
        items()[0]?.focus();
      } else {
        trigger.focus();
      }
    });

    menu.addEventListener("keydown", (event) => {
      const list = items();
      const currentIndex = list.indexOf(document.activeElement);
      const lastIndex = list.length - 1;
      if (event.key === "ArrowDown") {
        list[currentIndex === lastIndex ? 0 : currentIndex + 1]?.focus();
      } else if (event.key === "ArrowUp") {
        list[currentIndex <= 0 ? lastIndex : currentIndex - 1]?.focus();
      } else if (event.key === "Tab") {
        // Per the WAI-ARIA APG's Menu Button pattern: Tab closes the menu
        // and lets the browser's normal Tab order proceed from the
        // trigger, rather than cycling within the menu (menu items keep
        // their native default tabindex — no roving-tabindex management
        // is added here, deliberately different from Tabs' mechanism;
        // see data-model.md's parity note).
        menu.hidePopover();
        return;
      } else {
        return;
      }
      event.preventDefault();
    });

    // Selecting an item closes the menu and fires its action. hidePopover()
    // itself triggers the "toggle" listener above, which returns focus to
    // the trigger — no separate trigger.focus() call needed here, avoiding
    // the double-focus-management two independent code paths would risk.
    menu.querySelectorAll('[role="menuitem"]').forEach((item) => {
      item.addEventListener("click", () => {
        menu.hidePopover();
      });
    });
  });
}
```

## Required attributes (Principle II gate, FR-008/FR-009/FR-010)

| Behavior | Mechanism |
|---|---|
| Menu semantics | `role="menu"` on the panel, `role="menuitem"` on each item |
| Trigger/menu association | `aria-labelledby` (menu → trigger); `popovertarget` (trigger → menu, also drives native open/close) |
| Expanded state announced on trigger | `aria-expanded`, synced by `dropdown-menu.js` via the popover's native `toggle` event (not automatic — research.md R1) |
| Opens via mouse or keyboard | Native — `popovertarget` buttons are natively focusable and activate via click, Enter, or Space |
| Focus moves to first item on open | `dropdown-menu.js`'s `toggle` listener |
| Up/Down arrow navigation, wrapping | `dropdown-menu.js`'s `keydown` listener, operating only over non-`:disabled` items |
| Escape closes | Native — built into `popover="auto"` by default |
| Outside click closes | Native — `popover="auto"`'s light-dismiss behavior |
| Tab closes (APG convention, not a Popover API default) | `dropdown-menu.js`'s `keydown` listener calling `hidePopover()` |
| Selection closes + fires action | `dropdown-menu.js`'s per-item `click` listener calling `hidePopover()` |
| Focus returns to trigger on every closing path (Escape, outside-click, Tab, selection) | `dropdown-menu.js`'s `toggle` listener — explicit `trigger.focus()` on the closed transition, not assumed to be automatic Popover API behavior (see the module's own comment) |
| Disabled items skipped in navigation | `items()`'s `:not(:disabled)` selector |

## Required states (Principle V gate)

| Element | State | Required utility |
|---|---|---|
| trigger button | reuses `.btn-secondary`'s full state set (feature 001) — no new trigger class needed | — |
| `.dropdown-menu-item` | resting | `text-neutral-900` |
| `.dropdown-menu-item` | hover | `hover:bg-neutral-50` |
| `.dropdown-menu-item` | active | `active:bg-neutral-100` |
| `.dropdown-menu-item` | focus-visible (keyboard roving focus) | `focus-visible:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand` — the bg highlight matches hover per the WAI-ARIA APG Menu Button pattern's own convention (data-model.md), layered **together with**, not instead of, Principle V's mandated outline set (an earlier draft used `outline-none` to rely on the bg alone, which `/speckit-analyze` correctly flagged as a silent Principle V/AAA Focus Appearance gap); the outline uses a negative (inset) offset so it stays within the item's own box instead of clipping against adjacent items |
| `.dropdown-menu-item` | disabled | `disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent` |

`active:`/the full focus-visible outline are declared per Principle V's
unconditional mandate for any `<button>` (FR-013, corrected after
`/speckit-analyze`), matching the same fix applied to `.tab-trigger`.

## Edge cases

- **Viewport-edge positioning**: out of scope for this slice (research.md
  R1, spec.md Assumptions) — `.dropdown-menu-panel` always opens
  downward-right (`absolute right-0 mt-2`) relative to its trigger's
  `relative`-positioned wrapper. Not attempted via CSS Anchor Positioning
  (inconsistent cross-engine support at this project's baseline).
- **Trigger's containing Tabs panel becomes hidden while menu is open**:
  the native Popover API's `toggle`/light-dismiss mechanism operates
  independently of the trigger's own visibility — if `tabs.js` hides the
  panel containing an open dropdown's trigger (via the `hidden` attribute),
  the popover itself is unaffected (top-layer rendering is independent of
  normal DOM layout/visibility), so it would remain visibly open, detached
  from its now-hidden trigger. Documented as a known interaction gap, not
  silently ignored: this slice's gallery page does not compose a Dropdown
  Menu trigger inside a Tabs panel, so the interaction is out of scope to
  fix here, but a future feature adding this composition MUST explicitly
  call `menu.hidePopover()` when its containing tab panel is hidden.

## Token allowlist used

`text-neutral-900` (item text), `bg-neutral-50` (item hover/focus-visible),
`bg-neutral-100` (item active), `outline-brand` (focus-visible outline,
same token as every other component's Principle V state set),
`ring-neutral-300` (panel border,
consistent with Select's field ring token). Trigger reuses `.btn-secondary`
verbatim (feature 001). No raw palette classes (FR-011).

## Acceptance mapping

- FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-015 → this contract
- SC-001, SC-002, SC-003, SC-005 → verified by
  `tests/e2e/dropdown-menu.spec.ts`, `scripts/audit-tokens.mjs`,
  `scripts/check-contrast.mjs`
