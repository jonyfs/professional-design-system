# Contract: FloatLabel

## `src/styles/tailwind.css` additions

```css
@layer components {
  .float-label-wrapper {
    @apply relative;
  }
  .float-label-field {
    @apply form-input pt-4;
  }
  .float-label-text {
    @apply pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm
      text-neutral-600 transition-all duration-150 ease-out
      motion-reduce:transition-none
      peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-brand-dark
      peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0
      peer-[:not(:placeholder-shown)]:text-xs;
  }
}
```

## `src/scripts/float-label.js`

None — CSS-only via `:focus`/`:placeholder-shown` + Tailwind's `peer`
variant (research.md R1). No JavaScript needed for the label state
itself, matching this catalog's zero-JS-where-possible discipline.
`prefers-reduced-motion` is handled by the `motion-reduce:transition-none`
utility, which swaps the animated transition for an instant position
change with no code-level branching required.

## Static HTML usage

```html
<div class="float-label-wrapper" data-testid="float-label-demo">
  <input id="float-label-email" class="float-label-field peer" type="email" placeholder=" " />
  <label for="float-label-email" class="float-label-text">Email address</label>
</div>
```

Note: `placeholder=" "` (a single space, not empty) is required for
the `:placeholder-shown` CSS selector to correctly distinguish "empty
and unfocused" from "has a real value" — an empty string placeholder
matches `:placeholder-shown` identically to a non-empty field in some
engines, per the standard floating-label CSS technique.

## React wrapper shape

```tsx
export interface FloatLabelProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}
export function FloatLabel({ id, label, type = "text", value, onChange }: FloatLabelProps) {
  return (
    <div className="float-label-wrapper">
      <input
        id={id}
        className="float-label-field peer"
        type={type}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <label htmlFor={id} className="float-label-text">
        {label}
      </label>
    </div>
  );
}
```

## Acceptance mapping

- FR-009, spec.md US4 Acceptance Scenarios 1-2 → the `peer-focus:`/`peer-[:not(:placeholder-shown)]:` CSS selectors, all state driven by the browser's own focus/value tracking, no JS state duplication
- `motion-reduce:transition-none` → FR-009's `prefers-reduced-motion` requirement
