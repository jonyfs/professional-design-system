# Component Contract: Skeleton

## Markup contract

```html
<!-- Text-line preset -->
<div class="skeleton skeleton-text" aria-hidden="true"></div>

<!-- Avatar preset — matches Avatar's exact h-8/h-10 sizes so a swap never shifts layout -->
<div class="skeleton skeleton-avatar-sm" aria-hidden="true"></div>
<div class="skeleton skeleton-avatar-lg" aria-hidden="true"></div>

<!-- Card-block preset — matches Card's rounded-lg radius -->
<div class="skeleton skeleton-card" aria-hidden="true"></div>
```

```css
.skeleton {
  @apply animate-pulse rounded-md bg-neutral-200 motion-reduce:animate-none;
}
.skeleton-text {
  @apply h-4 w-full;
}
.skeleton-avatar-sm {
  @apply h-8 w-8 rounded-full;
}
.skeleton-avatar-lg {
  @apply h-10 w-10 rounded-full;
}
.skeleton-card {
  @apply h-32 w-full rounded-lg;
}
```

`motion-reduce:animate-none` (R7) is this project's first-ever reduced-motion
handling — no existing mechanism was found to reuse, so this establishes it
via Tailwind's built-in variant rather than a hand-written media query.

## Required classes (Principle V gate)

Non-interactive/decorative — no hover/focus/disabled states apply. The one
required behavior is the `motion-reduce:animate-none` override.

## Required attributes

- `aria-hidden="true"` — a skeleton is a purely visual loading placeholder
  with no content to announce to assistive technology

## Token allowlist used

`bg-neutral-200`, plus the existing `rounded-full` (avatar presets, reused
verbatim from Avatar) and `rounded-lg` (card preset, reused verbatim from
Card). No new tokens.

## Acceptance mapping

- FR-004, edge case (reduced motion) → `tests/e2e/skeleton.spec.ts`
