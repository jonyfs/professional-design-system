# Contract: RingProgress, SemiCircleProgress

## `src/styles/tailwind.css` additions

```css
@layer components {
  .circular-progress {
    @apply inline-block;
  }
  .circular-progress-track {
    @apply stroke-neutral-200;
    fill: none;
  }
  .circular-progress-fill {
    @apply stroke-brand;
    fill: none;
    stroke-linecap: round;
    transition: stroke-dashoffset 300ms ease-out;
  }
  .semi-circle-progress {
    @apply inline-block;
  }
}
```

## `src/scripts/circular-progress.js`

```js
// CSSOM strokeDashoffset assignment (research.md R2) — this project's
// CSP (style-src 'self') blocks inline style="..." attributes; direct
// CSSOM property assignment is not subject to that restriction, the
// same pattern src/scripts/progress.js already uses for fill width.
export function initCircularProgress() {
  document.querySelectorAll("[data-circular-progress-fill]").forEach((fill) => {
    const value = Number(fill.getAttribute("data-value") ?? 0);
    const clamped = Math.max(0, Math.min(100, value));
    const circumference = Number(fill.getAttribute("data-circumference"));
    fill.style.strokeDashoffset = `${circumference * (1 - clamped / 100)}`;
  });
}
```

## Static HTML usage

```html
<div class="circular-progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" aria-labelledby="ring-label">
  <span class="sr-only" id="ring-label">Storage used: 60%</span>
  <svg width="80" height="80" viewBox="0 0 80 80">
    <circle class="circular-progress-track" cx="40" cy="40" r="36" stroke-width="8" />
    <circle
      class="circular-progress-fill"
      data-circular-progress-fill
      data-value="60"
      data-circumference="226.19"
      cx="40" cy="40" r="36" stroke-width="8"
      stroke-dasharray="226.19"
      transform="rotate(-90 40 40)"
    />
  </svg>
</div>
```

SemiCircleProgress uses the identical markup/script with the SVG
`viewBox`/circle geometry constrained to a half-circle (research.md R3).

## React wrapper shape

```tsx
interface RingProgressProps {
  value: number; // 0-100, clamped internally
  label: string; // accessible text equivalent
  size?: number;
  color?: "brand" | "success" | "warning" | "error" | "info";
}
export function RingProgress({ value, label, size = 80, color = "brand" }: RingProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = size / 2 - 4;
  const circumference = 2 * Math.PI * r;
  return (
    <div role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label} className="circular-progress">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="circular-progress-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={8} />
        <circle
          className={`circular-progress-fill circular-progress-fill-${color}`}
          cx={size / 2} cy={size / 2} r={r} strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </div>
  );
}
// SemiCircleProgress shares this shape with half-circle geometry.
```

## Acceptance mapping

- FR-001, spec.md US1 Acceptance Scenarios 1-2 → the markup/script above
- spec.md Edge Case (value outside 0-100) → clamped in both the static
  script (`Math.max(0, Math.min(100, value))`) and the React wrapper
