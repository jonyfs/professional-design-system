# Component Contract: Dropdown Menu (React)

## Props

```tsx
export interface DropdownMenuItemData {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItemData[];
}
```

## `useDropdownMenu(items)` hook contract (`hooks/useDropdownMenu.ts`)

Returns `{ isOpen, panelRef, triggerRef, itemRefs, open, close,
onPanelKeyDown, onTriggerClick }`. No `activeIndex` in the returned
surface — the "active" item is real DOM focus, not tracked state (see
below); `itemRefs` is an internal array of item-button refs the hook
manages to compute/move focus.

- On mount, an effect sets `panelRef.current.popover = "auto"`
  **imperatively via the DOM property**, not a JSX `popover="auto"`
  attribute — confirmed against this package's pinned `@types/react`
  (`^18.3.0`): the `popover` JSX attribute only exists in React 19's
  canary types, so `<div popover="auto">` does not typecheck here.
  `HTMLElement.prototype.popover` is natively typed in `lib.dom.d.ts`
  independent of React's JSX attribute set, so the imperative form
  compiles with no dependency change.
- `open()`: sets `isOpen = true`.
- An effect on `isOpen`: `true` → call `panelRef.current!.showPopover()`,
  then call `.focus()` directly on the first non-disabled item's DOM
  node; `false` → call `panelRef.current!.hidePopover()` only if
  `.matches(":popover-open")` (idempotent, mirrors `dropdown-menu.js`).
- `onPanelKeyDown`: `ArrowDown`/`ArrowUp` compute the next non-disabled
  index among `items` with wraparound (same algorithm as
  `combobox.js`/`command-palette.js`'s `moveActive()`, features 005/008)
  **and call `.focus()` on that computed index's item ref synchronously
  in the same handler** — moving real DOM focus, not just tracking an
  "active" index as inert state, matching the static reference
  (`src/scripts/dropdown-menu.js`) calling `.focus()` directly on every
  arrow-key press. `Tab` calls `close()` (WAI-ARIA APG Menu Button
  convention) and lets the browser's normal Tab order proceed from the
  trigger.
- Every path that sets `isOpen = false` (Tab, item `onSelect`, the
  panel's native `toggle` event firing "closed" from Escape or outside
  light-dismiss) is followed by `triggerRef.current?.focus()` — explicit,
  not assumed automatic (research.md's cross-reference to feature 004's
  WebKit `<dialog>` finding: the same class of risk applies to the
  Popover API and is not left to an unverified native guarantee here
  either).

**No `aria-selected` on items**: `aria-selected` is not a WAI-ARIA-
supported state on `role="menuitem"` (only `option`/`row`/`tab`/
`treeitem`/`gridcell`/`columnheader`/`rowheader` support it per the ARIA
spec) — adding it would trip axe-core's `aria-allowed-attr` rule,
violating FR-007's zero-violation requirement. The "active" item is
communicated by real DOM focus alone, exactly like the static reference.

## Rendered markup

```tsx
<button ref={triggerRef} type="button" className="dropdown-menu-trigger"
        aria-expanded={isOpen} aria-haspopup="menu" onClick={onTriggerClick}>
  {trigger}
</button>
<div ref={panelRef} role="menu" className="dropdown-menu-panel"
     onKeyDown={onPanelKeyDown}>
  {items.map((item, i) => (
    <button key={item.id} ref={(el) => (itemRefs.current[i] = el)}
            role="menuitem" type="button"
            className="dropdown-menu-item" disabled={item.disabled}
            onClick={() => { item.onSelect(); close(); }}>
      {item.label}
    </button>
  ))}
</div>
```

## Required attributes (Principle II gate)

`aria-expanded` synced to `isOpen`; `aria-haspopup="menu"` on the
trigger; `role="menu"`/`role="menuitem"` on panel/items — identical
semantics to `contracts/005-navigation-disclosure-primitives/dropdown-menu.contract.md`.

## Required states (Principle V gate)

Identical to the static reference: item `text-neutral-900`,
`hover:bg-neutral-50`, `active:bg-neutral-100`, focus-visible layers
`bg-neutral-50` together with the standard focus-visible outline,
disabled `disabled:opacity-50 disabled:cursor-not-allowed`.

## Token allowlist used

Identical to the static reference — no new tokens.

## Acceptance mapping

- FR-005, FR-006, FR-007, FR-008, FR-009 → this contract
- SC-001, SC-002, SC-003, SC-004 → verified by `tests/e2e/react-dropdown-menu.spec.ts`
