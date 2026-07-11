# Contract: Table

## CSS Classes (Tailwind `@apply`, `src/styles/tailwind.css`)

```css
.data-table-wrapper {
  @apply overflow-x-auto rounded-md border border-neutral-200;
}
.data-table {
  @apply min-w-full divide-y divide-neutral-200;
}
.data-table-header-cell {
  @apply bg-neutral-50 px-6 py-3 text-left text-xs font-semibold
    text-neutral-600 uppercase tracking-wider;
}
.data-table-cell {
  @apply max-w-xs truncate px-6 py-4 text-sm text-neutral-900;
}
.data-table-row-zebra {
  @apply even:bg-neutral-50;
}
```

Named `.data-table*`, not `.table*`: Tailwind's own core `display`
plugin defines `.table { display: table }`, `.table-cell { display:
table-cell }`, and `.table-row { display: table-row }` as core
utilities (`node_modules/tailwindcss/src/corePlugins.js`) — a
component class of the same name would have its own layout properties
silently overridden by Tailwind's own generated utility, the identical
class of bug feature 011 found and fixed for Lists' `.list-item`.

## Markup Shape

### Baseline table (User Story 1)

```html
<div class="data-table-wrapper">
  <table class="data-table" data-testid="table-baseline">
    <thead>
      <tr>
        <th scope="col" class="data-table-header-cell">Name</th>
        <th scope="col" class="data-table-header-cell">Email</th>
        <th scope="col" class="data-table-header-cell">Role</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-neutral-200 bg-white">
      <tr>
        <td class="data-table-cell">Jane Cooper</td>
        <td class="data-table-cell">jane.cooper@example.com</td>
        <td class="data-table-cell">Admin</td>
      </tr>
      <!-- more rows -->
    </tbody>
  </table>
</div>
```

### Zebra-striped table (User Story 2)

```html
<div class="data-table-wrapper">
  <table class="data-table" data-testid="table-zebra">
    <thead>...</thead>
    <tbody class="divide-y divide-neutral-200 bg-white">
      <tr class="data-table-row-zebra">
        <td class="data-table-cell">Jane Cooper</td>
        <!-- ... -->
      </tr>
      <!-- more rows, each with class="data-table-row-zebra" -->
    </tbody>
  </table>
</div>
```

### Row with a trailing action (User Story 3)

```html
<tr class="data-table-row-zebra">
  <td class="data-table-cell">Jane Cooper</td>
  <td class="data-table-cell">jane.cooper@example.com</td>
  <td class="data-table-cell">
    <span class="inline-flex items-center rounded-md bg-success/5 px-2 py-1
      text-xs font-medium text-success-strong ring-1 ring-inset ring-success/20">
      Active
    </span>
  </td>
  <td class="data-table-cell text-right">
    <a href="#" class="demo-link">Edit</a>
  </td>
</tr>
```

**Contract invariant**: a trailing-action `<td>` contains at most one
interactive element (`<a>`); a Badge is a plain `<span>`, never itself
interactive.

## Accessibility Contract

- `<th scope="col">` on every header cell — gives screen readers
  column-header association per cell without any ARIA (SC-004).
- Zero axe-core violations required in all three variants (spec
  SC-002).
- The trailing-action link's accessible name comes from its own text
  content ("Edit") — sufficient per axe-core's `link-name` rule; no
  `aria-label` required unless a future consumer's link text is
  ambiguous across rows (not the case in this feature's demo).
- `.data-table-wrapper` MUST carry `tabindex="0"`, `role="region"`, and
  a descriptive `aria-label` — a genuine axe-core finding (caught by
  actually running the test at 320px, not assumed): the wrapper's
  `overflow-x-auto` makes it a real scrollable region once the table's
  content is wider than the viewport, and axe-core's
  `scrollable-region-focusable` rule requires such regions to be
  keyboard-reachable so a keyboard-only user can scroll it (arrow keys
  once focused). This only fires at narrow viewports where genuine
  overflow occurs — 1440px never triggered it locally, underscoring why
  the full responsive viewport matrix must be tested, not just one
  width.
  **Known tradeoff** (code review finding): `tabindex="0"` is applied
  unconditionally, since static HTML/CSS cannot detect at runtime
  whether the table's content actually overflows its wrapper. At wide
  viewports where nothing overflows, a keyboard user still lands on a
  focusable region with nothing to scroll before reaching real
  interactive content (e.g. a trailing "Edit" link) — an inherent
  limitation of a zero-JavaScript component, not a defect to silently
  accept without documenting. A future JS-enhanced variant could set
  `tabindex` conditionally based on `scrollWidth > clientWidth`, but
  that is out of scope for this primitive.
