# Contract: ThemeIcon, Blockquote

## `src/styles/tailwind.css` additions

```css
@layer components {
  .theme-icon {
    @apply inline-flex items-center justify-center rounded-full;
  }
  .theme-icon-sm {
    @apply h-8 w-8;
  }
  .theme-icon-lg {
    @apply h-10 w-10;
  }
  .theme-icon-success {
    @apply bg-success/5 text-success-strong ring-1 ring-inset ring-success/20;
  }
  .theme-icon-error {
    @apply bg-error/5 text-error-strong ring-1 ring-inset ring-error/10;
  }
  .theme-icon-warning {
    @apply bg-warning/5 text-warning-strong ring-1 ring-inset ring-warning/10;
  }
  .theme-icon-info {
    @apply bg-info/5 text-info-strong ring-1 ring-inset ring-info/20;
  }
  .theme-icon-brand {
    @apply bg-brand-light text-brand-dark;
  }

  .blockquote {
    @apply border-l-4 border-neutral-300 pl-4 italic text-neutral-600;
  }
  .blockquote-cite {
    @apply mt-2 block text-sm not-italic text-neutral-600;
  }
}
```

## Static HTML usage

```html
<span class="theme-icon theme-icon-lg theme-icon-success" data-testid="theme-icon-success" role="img" aria-label="Success">
  <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true">
    <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
  </svg>
</span>

<blockquote class="blockquote" data-testid="blockquote-demo">
  <p>Design is not just what it looks like and feels like. Design is how it works.</p>
  <cite class="blockquote-cite">— Steve Jobs</cite>
</blockquote>
```

## React wrapper shape

```tsx
import type { ReactNode } from "react";

export interface ThemeIconProps {
  icon: ReactNode;
  color: "brand" | "success" | "warning" | "error" | "info";
  size?: "sm" | "lg";
  label: string;
  "data-testid"?: string;
}
export function ThemeIcon({ icon, color, size = "lg", label, "data-testid": testId }: ThemeIconProps) {
  return (
    <span
      data-testid={testId}
      role="img"
      aria-label={label}
      className={`theme-icon theme-icon-${size} theme-icon-${color}`}
    >
      {icon}
    </span>
  );
}

export interface BlockquoteProps {
  children: ReactNode;
  cite?: string;
  "data-testid"?: string;
}
export function Blockquote({ children, cite, "data-testid": testId }: BlockquoteProps) {
  return (
    <blockquote data-testid={testId} className="blockquote">
      {children}
      {cite && <cite className="blockquote-cite">{cite}</cite>}
    </blockquote>
  );
}
```

## Acceptance mapping

- FR-001, spec.md US1 Acceptance Scenario 1 → the markup/component above
- FR-002, spec.md US2 Acceptance Scenario 1 → the markup/component above
- spec.md Edge Case (icon size consistency) → `.theme-icon-sm`/`.theme-icon-lg`'s fixed dimensions, matching Avatar's own scale
