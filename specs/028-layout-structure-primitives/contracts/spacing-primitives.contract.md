# Contract: Spacing Primitives (Stack, Group, Center)

## `src/styles/tailwind.css` additions

```css
@layer components {
  .stack {
    @apply flex flex-col;
  }
  .stack-xs { @apply space-y-2; }
  .stack-sm { @apply space-y-4; }
  .stack-md { @apply space-y-6; }
  .stack-lg { @apply space-y-8; }

  /* Named .group-row, not .group — Tailwind's own built-in `.group`
     utility (group-hover:/group-focus: state scoping) already claims
     that class name; colliding would silently break any component
     using group-hover inside a Stack/Group composition. Same class
     of bug as .collapse vs Tailwind's visibility:collapse (feature
     023). */
  .group-row {
    @apply flex flex-row flex-wrap items-center;
  }
  .group-row-xs { @apply gap-2; }
  .group-row-sm { @apply gap-4; }
  .group-row-md { @apply gap-6; }
  .group-row-lg { @apply gap-8; }

  .center {
    @apply flex items-center justify-center;
  }
}
```

## Static HTML usage

```html
<div class="stack stack-md">
  <p>First item</p>
  <p>Second item</p>
</div>

<div class="group-row group-row-sm">
  <button class="btn-primary">Save</button>
  <button class="btn-secondary">Cancel</button>
</div>

<div class="center h-40">
  <span>Centered content</span>
</div>
```

## React wrapper shape

```tsx
interface StackProps {
  gap?: "xs" | "sm" | "md" | "lg";
  children: React.ReactNode;
}
export function Stack({ gap = "md", children }: StackProps) {
  return <div className={`stack stack-${gap}`}>{children}</div>;
}
// Group and Center follow the identical shape (Group takes the same
// gap prop; Center takes no props beyond children/className passthrough).
```

## Acceptance mapping

- FR-001, spec.md US1 Acceptance Scenarios 1-3 → the classes and
  wrapper shape above
- spec.md Edge Case (children's own margin not stripped) → these
  classes apply spacing via the PARENT's `space-y-*`/`gap-*`, never
  via a child selector or inline style injection
