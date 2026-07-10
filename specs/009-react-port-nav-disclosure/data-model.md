# Phase 1 Data Model: React Port — Navigation & Disclosure Primitives

## Breadcrumbs

```tsx
export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbsProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: BreadcrumbItem[];
  currentLabel: string;
}
```

Pure markup translation — `<nav aria-label="Breadcrumb">` wrapping an
ordered list of `<a className="breadcrumb-link">` for `items`, a
`<svg className="breadcrumb-divider">` between each, and a trailing
non-interactive `<span aria-current="page">{currentLabel}</span>`. No
internal state, no hooks.

## Accordion

```tsx
export interface AccordionItemData {
  id: string;
  trigger: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: AccordionItemData[];
  exclusive?: boolean;
}
```

Renders one `<details className="group accordion-item" open={item.defaultOpen}>`
per entry. When `exclusive` is `true`, every `<details>` receives the
same `name` value from a single `useId()` call made once per `Accordion`
instance (research.md R1) — no `useState`. When `false` (default), no
`name` attribute is rendered. Each item's `<summary className="accordion-trigger">`
contains the trigger label plus the existing `accordion-chevron` SVG,
identical to the static markup.

## Tabs

```tsx
export interface TabData {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  tabs: TabData[];
  defaultSelectedId?: string;
}
```

Internal `useState<string>` for `selectedId` (initialized from
`defaultSelectedId` or the first non-disabled tab). A `tablist` `<div
role="tablist">` renders one `<button role="tab" className="tab-trigger">`
per entry, with `aria-selected`, `tabIndex={id === selectedId ? 0 : -1}`
(roving tabindex, FR-004), and `disabled` passed through natively for
disabled tabs (skipped entirely by the browser's own Tab order, matching
the static reference). A `keydown` handler on the tablist container
implements Left/Right (move to adjacent enabled tab, wrapping) and Home/
End (jump to first/last enabled tab), calling `.focus()` on the newly-
selected tab's button ref after updating `selectedId` (research.md R2 —
state alone does not move focus). One `<div role="tabpanel">` renders
per tab, visibility gated on `id === selectedId`.

## Dropdown Menu

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

`useDropdownMenu(items)` hook (new file, `hooks/useDropdownMenu.ts`)
owns: `isOpen` state, `activeIndex` state, a `panelRef`
(`RefObject<HTMLDivElement>`) and `triggerRef`
(`RefObject<HTMLButtonElement>`). On mount, an effect sets
`panelRef.current.popover = "auto"` **imperatively via the DOM property**
— not the JSX `popover="auto"` attribute, which does not typecheck under
this package's pinned `@types/react` (`^18.3.0`; the `popover` JSX
attribute is React-19-canary-only, confirmed by inspecting the installed
type declarations). `HTMLElement.prototype.popover` is natively typed in
`lib.dom.d.ts` independent of React's own JSX attribute typing, so this
compiles today with no version bump. A second effect reacting to `isOpen`:
`true` → `panelRef.current.showPopover()` + call `.focus()` on the first
enabled item's DOM node; `false` → `panelRef.current.hidePopover()`
(guarded — only if `.matches(":popover-open")`, mirroring
`dropdown-menu.js`'s own idempotency). A `keydown` handler on the panel:
ArrowDown/ArrowUp compute the next enabled index (wraparound, mirroring
`enabledIndices()`/`moveActive()` from features 005/008's vanilla
modules), update `activeIndex` state, **and synchronously call
`.focus()` on that computed index's item ref in the same handler** — a
state update alone does not move real DOM focus, and the static
reference this ports (`src/scripts/dropdown-menu.js`) calls
`.focus()` directly on every arrow-key press, so the port must too, not
just track "active" as inert state. Tab closes the menu (WAI-ARIA APG
Menu Button convention, feature 005) and lets the browser's normal Tab
order continue; Escape is handled natively by the Popover API. Every
closing path (Tab, Escape, item selection, outside light-dismiss via the
panel's native `toggle` event) ends in an explicit
`triggerRef.current?.focus()` call — mirroring `dropdown-menu.js`'s own
explicit-refocus discipline rather than trusting an unverified native
guarantee (feature 004's WebKit focus-restoration finding for `<dialog>`
is the same class of risk this guards against for the Popover API).

**No `aria-selected` on items**: the "active" (keyboard-focused) item is
communicated by real DOM focus alone, exactly like the static reference
— `aria-selected` is not a WAI-ARIA-supported state on `role="menuitem"`
(only `option`/`row`/`tab`/`treeitem`/`gridcell`/`columnheader`/
`rowheader` support it) and would trip axe-core's `aria-allowed-attr`
rule if added, an /speckit-analyze-caught finding.

`DropdownMenu` itself is a thin consumer of the hook: renders
`<button ref={triggerRef} className="dropdown-menu-trigger" aria-expanded={isOpen} aria-haspopup="menu" onClick={...}>{trigger}</button>`
plus `<div ref={panelRef} role="menu" className="dropdown-menu-panel" onKeyDown={onPanelKeyDown}>`
containing one `<button role="menuitem" className="dropdown-menu-item" disabled={item.disabled}>`
per entry — no `aria-selected`, real focus is the only "active" signal.
