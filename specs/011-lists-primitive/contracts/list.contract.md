# Contract: List / List Item

## CSS Classes (Tailwind `@apply`, `src/styles/tailwind.css`)

```css
.list {
  @apply divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white;
}
.list-item {
  @apply flex items-center gap-3 px-4 py-3;
}
.list-item-interactive {
  @apply flex items-center gap-3 px-4 py-3
    hover:bg-neutral-50 active:bg-neutral-100
    focus-visible:outline focus-visible:outline-2
    focus-visible:-outline-offset-2 focus-visible:outline-brand;
}
.list-item-title {
  @apply truncate text-sm font-semibold text-neutral-900;
}
.list-item-metadata {
  @apply truncate text-xs text-neutral-600;
}
```

`.list-item-metadata`'s `text-neutral-600` is the corrected token
(research.md R1) — do not reintroduce `text-neutral-500`.

## Markup Shape

### Read-only row (User Story 1)

```html
<div class="list">
  <div class="list-item" data-testid="list-item-readonly">
    <img src="..." alt="..." class="avatar-img avatar-lg" />
    <!-- or fallback: <span class="avatar-fallback avatar-lg">JC</span> -->
    <div class="min-w-0">
      <p class="list-item-title">Jane Cooper</p>
      <p class="list-item-metadata">jane.cooper@example.com</p>
    </div>
  </div>
</div>
```

### Interactive row (User Story 2)

```html
<a href="#" class="list-item-interactive" data-testid="list-item-interactive">
  <img src="..." alt="..." class="avatar-img avatar-lg" />
  <div class="min-w-0">
    <p class="list-item-title">Jane Cooper</p>
    <p class="list-item-metadata">Product Designer</p>
  </div>
</a>
```

### Row with trailing action (User Story 3)

```html
<a href="#" class="list-item-interactive" data-testid="list-item-trailing">
  <img src="..." alt="..." class="avatar-img avatar-lg" />
  <div class="min-w-0">
    <p class="list-item-title">Jane Cooper</p>
    <p class="list-item-metadata">Product Designer</p>
  </div>
  <span class="ml-auto inline-flex items-center rounded-md bg-success/5
    px-2 py-1 text-xs font-medium text-success-strong ring-1 ring-inset
    ring-success/20">Active</span>
</a>
```

### Row with trailing chevron (User Story 3, second composition)

```html
<a href="#" class="list-item-interactive" data-testid="list-item-trailing-chevron">
  <img src="..." alt="..." class="avatar-img avatar-lg" />
  <div class="min-w-0">
    <p class="list-item-title">Jane Cooper</p>
    <p class="list-item-metadata">Product Designer</p>
  </div>
  <svg class="ml-auto h-5 w-5 flex-none text-neutral-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
  </svg>
</a>
```

`text-neutral-400` matches this project's existing decorative-icon
color precedent (e.g. Combobox's chevron/clear-icon treatment); the SVG
is `aria-hidden="true"` since it's purely decorative and the row's
accessible name is already carried by the title/metadata text — this is
the same "no extra ARIA needed" reasoning as the Badge variant above.

**Contract invariant**: the trailing `<span>`/`<svg>` (Badge or chevron)
is never a `<button>` or `<a>` — FR-007's nested-interactive-control
constraint is satisfied by construction, not by an ARIA attribute
(research.md R5).

## Accessibility Contract

- Read-only row: no `role` overrides needed; plain text content is
  exposed to assistive tech via normal DOM order (avatar `alt` text →
  title → metadata).
- Interactive row: the whole row is one `<a href>` — screen readers
  announce it as a single link with its accessible name computed from
  the link's text content (title + metadata + any trailing Badge text).
  If the accessible name becomes too verbose in practice, `aria-label`
  on the `<a>` MAY be used to override it, but this is not required by
  default per axe-core's `link-name` rule (any non-empty accessible name
  passes).
- Zero axe-core violations required in both states (spec SC-002).
