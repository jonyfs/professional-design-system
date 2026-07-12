# Component Contract: Timeline

## Markup contract

```html
<ol class="timeline">
  <li class="timeline-item">
    <span class="avatar-fallback avatar-sm" aria-hidden="true">JD</span>
    <div class="timeline-content">
      <p class="text-sm text-neutral-900">
        <span class="font-medium">Jane Doe</span> shipped the order
      </p>
      <time class="text-xs text-neutral-600" datetime="2024-01-12T14:30:00Z">
        Jan 12, 2024 at 2:30 PM
      </time>
    </div>
  </li>
  <li class="timeline-item">
    <span class="avatar-fallback avatar-sm" aria-hidden="true">JD</span>
    <div class="timeline-content">
      <p class="text-sm text-neutral-900">
        <span class="font-medium">Jane Doe</span> confirmed the order
      </p>
      <time class="text-xs text-neutral-600" datetime="2024-01-11T09:15:00Z">
        Jan 11, 2024 at 9:15 AM
      </time>
    </div>
  </li>
</ol>
```

```css
.timeline {
  @apply relative space-y-6;
}
.timeline-item {
  @apply relative flex gap-3;
}
.timeline-item:not(:last-child)::before {
  content: "";
  @apply absolute left-4 top-8 h-full w-px bg-neutral-200;
}
.timeline-content {
  @apply flex-1 space-y-0.5;
}
```

Reuses Avatar's `.avatar-fallback`/`.avatar-sm` classes verbatim for each
event's actor. The connecting line (`bg-neutral-200`) is the same accepted
decorative-border exception as Stepper's connector (research.md R7) and
Divider — not a new contrast gap.

## Required classes (Principle V gate)

Non-interactive — no state suffixes apply.

## Required attributes

- Real `<ol>` (chronological order is semantically meaningful, not just
  visual)
- Real `<time datetime="...">` for each event's timestamp

## Token allowlist used

`bg-neutral-200`, `text-neutral-900`, `text-neutral-600` — plus Avatar's
existing classes, reused verbatim. No new tokens.

## Acceptance mapping

- FR-008, SC-001 → `tests/e2e/timeline.spec.ts`
