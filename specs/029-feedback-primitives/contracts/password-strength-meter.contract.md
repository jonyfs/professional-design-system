# Contract: Password Strength Meter

## `src/scripts/password-strength-meter.js`

```js
// Simple, transparent heuristic (research.md R5) — a presentation-layer
// demo, not a production password policy. Length + character-class
// diversity, mapped to 4 levels driving Progress's existing fill
// mechanism (reused verbatim, not a new visual system).
const LEVELS = ["empty", "weak", "fair", "strong"];
const LEVEL_COLOR = { empty: "neutral", weak: "error", fair: "warning", strong: "success" };
const LEVEL_LABEL = { empty: "", weak: "Weak", fair: "Fair", strong: "Strong" };

export function scorePassword(value) {
  if (!value) return { level: "empty", score: 0 };
  let classes = 0;
  if (/[a-z]/.test(value)) classes++;
  if (/[A-Z]/.test(value)) classes++;
  if (/[0-9]/.test(value)) classes++;
  if (/[^a-zA-Z0-9]/.test(value)) classes++;

  const lengthScore = Math.min(value.length / 12, 1);
  const classScore = classes / 4;
  const score = Math.round(((lengthScore + classScore) / 2) * 100);

  const level = score < 34 ? "weak" : score < 67 ? "fair" : "strong";
  return { level, score };
}

export function initPasswordStrengthMeter() {
  document.querySelectorAll("[data-password-strength-input]").forEach((input) => {
    const fill = document.querySelector(`[data-password-strength-fill="${input.id}"]`);
    const label = document.querySelector(`[data-password-strength-label="${input.id}"]`);
    input.addEventListener("input", () => {
      const { level, score } = scorePassword(input.value);
      // CSSOM assignment, not inline style="..." (this project's CSP,
      // same pattern as progress.js/ring-progress.js).
      fill.style.width = `${score}%`;
      fill.dataset.level = level;
      label.textContent = LEVEL_LABEL[level];
    });
  });
}
```

## `src/styles/tailwind.css` additions

```css
@layer components {
  .password-strength-meter-fill[data-level="weak"] { @apply bg-error; }
  .password-strength-meter-fill[data-level="fair"] { @apply bg-warning; }
  .password-strength-meter-fill[data-level="strong"] { @apply bg-success; }
}
```

## Static HTML usage

```html
<div>
  <label for="password-strength-input" class="text-sm font-medium text-neutral-900">Password</label>
  <input id="password-strength-input" type="password" data-password-strength-input class="form-input mt-1" />
  <div class="progress-track mt-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Password strength">
    <div data-password-strength-fill="password-strength-input" class="progress-fill password-strength-meter-fill"></div>
  </div>
  <span id="password-strength-label" data-password-strength-label="password-strength-input" class="mt-1 text-xs text-neutral-600"></span>
</div>
```

## React wrapper shape

```tsx
interface PasswordStrengthMeterProps {
  value: string;
}
export function PasswordStrengthMeter({ value }: PasswordStrengthMeterProps) {
  const { level, score } = scorePassword(value); // same scoring function, ported
  return (
    <div>
      <div className="progress-track" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label="Password strength">
        <div className={`progress-fill password-strength-meter-fill`} data-level={level} style={{ width: `${score}%` }} />
      </div>
      <span className="mt-1 text-xs text-neutral-600">{LEVEL_LABEL[level]}</span>
    </div>
  );
}
```

Note: React's `style={{ width }}` is NOT subject to this project's
static-HTML CSP restriction — React's inline `style` prop compiles to
direct DOM property assignment (`element.style.width = ...`) at
runtime, not a literal `style="..."` HTML attribute parsed by the
browser, so it is CSSOM assignment already (consistent with research.md R2's
distinction) — no CSP violation for the React surface.

## Acceptance mapping

- FR-003, spec.md US3 Acceptance Scenarios 1-2 → the script/markup above
- spec.md Edge Case (empty string) → `scorePassword("")` returns
  `{ level: "empty", score: 0 }`, rendering a neutral, unfilled state
