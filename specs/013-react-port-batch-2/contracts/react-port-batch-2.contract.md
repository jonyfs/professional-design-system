# Contract: React Port — Batch 2

One section per component. Each component's className strings reuse
its static reference's already-ratified Tailwind classes verbatim — no
new CSS is introduced by this feature (research.md R5).

## Pagination

```tsx
<Pagination currentPage={3} totalPages={10} onPageChange={(p) => ...} />
```

- Renders `.pagination-nav` > Previous control, page-number links,
  ellipses, Next control — reusing `.pagination-control`/
  `.pagination-link`/`.pagination-ellipsis` verbatim.
- Previous/Next render as `<button disabled>` (not a dimmed `<a>`) when
  `currentPage` is at a boundary (page 1 / `totalPages`), matching
  `pagination.html`'s genuinely-disabled-controls contract.
- `aria-current="page"` on the active page number.

## Sidebar

```tsx
<Sidebar theme="dark" items={[{ id: "dashboard", label: "Dashboard", href: "#", active: true }, ...]} />
```

- `.sidebar.sidebar-{theme}` container; each item is a real
  `<a href class="sidebar-item sidebar-item-{theme}">` (data-model.md:
  `href` is required, not a callback-only button — preserves native
  link affordances, matching the static reference).
- The active item gets `aria-current="page"`, matching the static
  reference.

## Navbar

```tsx
<Navbar brand={<span>Acme</span>} links={[{ label: "Product", href: "#" }, ...]} />
```

- `.navbar` > `.navbar-inner` > brand, full nav (`.navbar-link`, hidden
  below `lg`), and a native `<details data-testid="navbar-mobile-menu">`
  mobile menu (visible only below `lg`) — no React state for open/close
  (research.md R1).

## Avatar

```tsx
<Avatar src="..." alt="Jane Cooper" size="lg" />
<Avatar initials="AM" alt="Alex Morgan" size="lg" />
```

- Image variant: `<img class="avatar-img avatar-{size}">`.
- Fallback variant (no `src`): `<span class="avatar-fallback avatar-{size}" aria-label={alt}>{initials}</span>`.

## Card

```tsx
<Card elevated>{children}</Card>
```

- `.card` (+ `.card-elevated` when `elevated`).

## List

```tsx
<List items={[{ id, avatar: { initials: "JC", alt: "Jane Cooper" }, title: "Jane Cooper", metadata: "...", href: "#" }]} interactive />
```

- `.list` container, `.list-row` (or `.list-row-interactive` wrapping an
  `<a tabindex="0">` when `interactive`) per item, `.list-row-title`/
  `.list-row-metadata` text, avatar slot reusing Avatar's own classes.
- `tabindex="0"` on every interactive row's `<a>` — the WebKit Tab-order
  fix from feature 011, ported verbatim, not re-derived.

## Table

```tsx
<Table columns={["Name", "Email", "Role"]} rows={[{ cells: ["Jane Cooper", "jane@x.com", "Admin"] }]} zebra ariaLabel="Baseline table, scrollable horizontally" />
```

- Real `<table>`/`<thead>`/`<tbody>`/`<th scope="col">`/`<td>` — no
  `<div>` grid.
- `.data-table-wrapper` gets `tabindex="0"`/`role="region"`/
  `aria-label` (feature 012's `scrollable-region-focusable` fix, ported
  verbatim).

## Alert

```tsx
<Alert variant="info" message="..." onDismiss={() => setAlerts(...)} />
```

- `.alert.alert-{variant}` with the variant's icon; a dismiss
  `.close-icon-btn` renders only when `onDismiss` is provided
  (research.md R6 — no internal DOM removal, unlike `alert.js`).

## Combobox

```tsx
<Combobox label="Country" options={[{ value, label, disabled? }]} onCommit={(value) => ...} />
```

- `.combobox-input` + a `role="listbox"` `.combobox-listbox` Popover-API
  panel, per-instance `anchor-name` via `useId()` (research.md R3).
- Filter-as-you-type narrows `options` to matches (case-insensitive
  substring), matched substring wrapped in `<mark>`.
- ArrowDown/ArrowUp move `aria-activedescendant` among filtered,
  non-disabled options, wrapping at the ends.
- Enter commits the active option's `value` to the input and calls
  `onCommit`; Escape closes without changing the input; blur closes.
- Option ids are `${instanceId}-option-${index}` (`useId()`-scoped,
  research.md R3a) — never the static reference's bare
  `combobox-option-${index}`, which would collide across multiple
  instances on one page.

## Command Palette

```tsx
<CommandPalette actions={[{ id, label, disabled?, onExecute: () => ... }]} />
```

- Mounts a global `document`-level Cmd/Ctrl+K listener (research.md R4)
  that opens a `<dialog class="command-palette-dialog">` via
  `useDialogTrigger` (research.md R2, reused verbatim — no new
  dialog-close logic).
- Same filter/arrow-key/`aria-activedescendant` model as Combobox,
  independently implemented (matching `command-palette.js`'s own
  documented decision not to share a module with `combobox.js`).
- Escape closes the dialog; focus returns to whatever had focus before
  Cmd/Ctrl+K was pressed (via `useDialogTrigger`'s `document.activeElement`
  fallback), including the WebKit-safe refocus guarantee.
- Action ids are `${instanceId}-action-${index}` (`useId()`-scoped,
  research.md R3a), same rationale as Combobox's option ids.
