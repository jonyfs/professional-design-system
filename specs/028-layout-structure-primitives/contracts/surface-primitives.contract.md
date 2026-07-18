# Contract: Surface Primitives (Container, Paper)

## `src/styles/tailwind.css` additions

```css
@layer components {
  /* Named .container-page, not .container — Tailwind ships its own
     built-in `.container` breakpoint-keyed max-width utility; reusing
     the name would silently change behavior for any existing page
     relying on Tailwind's default .container semantics. */
  .container-page {
    @apply mx-auto max-w-5xl px-6;
  }

  .paper {
    @apply rounded-lg border border-neutral-200 bg-neutral-50;
  }
}
```

## Static HTML usage

```html
<div class="container-page">
  <h1>Page title</h1>
  <p>Body content, width-constrained and centered.</p>
</div>

<div class="paper p-4">
  <p>Lightweight grouped content, no shadow, no header/footer slots.</p>
</div>
```

## React wrapper shape

```tsx
interface ContainerProps {
  children: React.ReactNode;
}
export function Container({ children }: ContainerProps) {
  return <div className="container-page">{children}</div>;
}

interface PaperProps {
  children: React.ReactNode;
  className?: string; // for consumer-supplied padding, e.g. "p-4"
}
export function Paper({ children, className }: PaperProps) {
  return <div className={`paper ${className ?? ""}`.trim()}>{children}</div>;
}
```

## Acceptance mapping

- FR-002, spec.md US2 Acceptance Scenarios 1-2 → the classes above
- spec.md Edge Case (nested Container) → `.container-page`'s
  `mx-auto max-w-5xl px-6` applies identically regardless of ancestor
  Container — no first-only special case
