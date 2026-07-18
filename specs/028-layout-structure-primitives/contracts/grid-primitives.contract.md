# Contract: Grid Primitives (Grid, SimpleGrid, Flex)

## `src/styles/tailwind.css` additions

```css
@layer components {
  .grid-responsive {
    @apply grid grid-cols-1 gap-6;
  }
  .grid-responsive.grid-cols-2-lg { @apply sm:grid-cols-2; }
  .grid-responsive.grid-cols-3-lg { @apply sm:grid-cols-2 lg:grid-cols-3; }
  .grid-responsive.grid-cols-4-lg { @apply sm:grid-cols-2 lg:grid-cols-4; }

  /* SimpleGrid: identical responsive rule, no per-item span control —
     a thin, deliberately-constrained sibling of grid-responsive. */
  .simple-grid {
    @apply grid grid-cols-1 gap-6;
  }
  .simple-grid.grid-cols-2-lg { @apply sm:grid-cols-2; }
  .simple-grid.grid-cols-3-lg { @apply sm:grid-cols-2 lg:grid-cols-3; }
  .simple-grid.grid-cols-4-lg { @apply sm:grid-cols-2 lg:grid-cols-4; }

  .flex-row-primitive { @apply flex flex-row flex-wrap gap-4; }
  .flex-col-primitive { @apply flex flex-col gap-4; }
}
```

Breakpoint rule (research.md R3): 1 column below 768px (Tailwind
`sm:` boundary in this project's config), 2 columns 768-1023px, the
configured count (2/3/4) at 1024px+ (`lg:`).

## Static HTML usage

```html
<div class="grid-responsive grid-cols-3-lg">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

## React wrapper shape

```tsx
interface GridProps {
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
}
export function Grid({ columns = 3, children }: GridProps) {
  return <div className={`grid-responsive grid-cols-${columns}-lg`}>{children}</div>;
}
// SimpleGrid has the identical prop shape/behavior.

interface FlexProps {
  direction?: "row" | "col";
  children: React.ReactNode;
}
export function Flex({ direction = "row", children }: FlexProps) {
  return <div className={`flex-${direction}-primitive`}>{children}</div>;
}
```

## Acceptance mapping

- FR-003, spec.md US3 Acceptance Scenarios 1-3 → the classes above
- spec.md Edge Case (more items than fit one screen) → `flex-wrap`/
  CSS Grid's own natural row-wrapping handles this with zero
  additional logic — verified, not assumed, during implementation via
  a real overflow check at 320px
