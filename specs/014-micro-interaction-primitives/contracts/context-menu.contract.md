# Component Contract: Context Menu

## Markup contract

```html
<div data-context-menu-target class="rounded-md border border-neutral-200 p-4">
  Right-click this row
</div>

<div popover="auto" role="menu" class="dropdown-menu-panel" id="ctx-menu-1">
  <button type="button" role="menuitem" class="dropdown-menu-item">Open</button>
  <button type="button" role="menuitem" class="dropdown-menu-item">Rename</button>
  <button type="button" role="menuitem" class="dropdown-menu-item" disabled>Delete</button>
</div>
```

Panel styling (`.dropdown-menu-panel`/`.dropdown-menu-item`) is reused
**verbatim** from Dropdown Menu — only the JS positioning mechanism forks
(R5).

```js
// context-menu.js (forked from dropdown-menu.js; positioning diverges per R5)
target.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  panel.showPopover();
  const { offsetWidth: w, offsetHeight: h } = panel;
  const x = Math.min(event.clientX, window.innerWidth - w);
  const y = Math.min(event.clientY, window.innerHeight - h);
  panel.style.left = `${Math.max(0, x)}px`;
  panel.style.top = `${Math.max(0, y)}px`;
  // arrow-key roving focus among [role="menuitem"] items — copied
  // verbatim from dropdown-menu.js, no positioning dependency there
});
```

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| item hover | `hover:bg-neutral-50` (reused from Dropdown Menu) |
| item active | `active:bg-neutral-100` (reused from Dropdown Menu) |
| item disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |
| focus-visible layering | `bg-neutral-50` together with the standard outline (never instead of), reused from Dropdown Menu |

## Required attributes

- `popover="auto"` on the panel (native light-dismiss/Escape/top-layer, same as Dropdown Menu)
- `role="menu"` on the panel, `role="menuitem"` on each item
- `event.preventDefault()` on the native `contextmenu` event is REQUIRED —
  omitting it lets the browser's native menu appear alongside this one

## Token allowlist used

Identical to Dropdown Menu's existing allowlist — no new tokens. This
component reuses Dropdown Menu's panel/item classes, diverging only in the
JS positioning mechanism (R5).

## Acceptance mapping

- FR-010, edge cases (viewport-edge clamping, arrow-key roving focus) →
  `tests/e2e/context-menu.spec.ts`
