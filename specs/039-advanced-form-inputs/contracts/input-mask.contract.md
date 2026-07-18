# Contract: InputMask

## `src/styles/tailwind.css` additions

```css
@layer components {
  .input-mask {
    @apply form-input;
  }
}
```

## `shared/input-mask/index.ts` (new shared module, reused by both surfaces)

```ts
// Feature 039 (research.md R2) — mask-pattern parser, shared verbatim
// between src/scripts/input-mask.js and
// packages/react/src/InputMask/InputMask.tsx, parallel to
// shared/multi-select/index.ts's/shared/mentions/index.ts's existing
// extraction pattern. `9` = digit placeholder; any other pattern
// character is literal and auto-inserted.
export const MASK_PRESETS: Record<string, string> = {
  phone: "(999) 999-9999",
  date: "99/99/9999",
  currency: "$999,999,999.99",
};

export function applyMask(pattern: string, rawDigits: string): string {
  let result = "";
  let digitIndex = 0;
  for (const patternChar of pattern) {
    if (digitIndex >= rawDigits.length) break;
    if (patternChar === "9") {
      result += rawDigits[digitIndex];
      digitIndex++;
    } else {
      result += patternChar;
    }
  }
  return result;
}
```

## `src/scripts/input-mask.js`

```js
import { applyMask, MASK_PRESETS } from "../../shared/input-mask/index.ts";

export function initInputMasks() {
  document.querySelectorAll("[data-input-mask]").forEach((field) => {
    const preset = field.dataset.inputMask;
    const pattern = MASK_PRESETS[preset] ?? field.dataset.inputMaskPattern;
    if (!pattern) return;

    field.addEventListener("input", () => {
      const digits = field.value.replace(/\D/g, "");
      field.value = applyMask(pattern, digits);
    });
  });
}
```

## Static HTML usage

```html
<input
  data-input-mask="phone"
  data-testid="input-mask-phone-demo"
  class="input-mask"
  type="text"
  inputmode="numeric"
  aria-label="Phone number"
  placeholder="(555) 555-5555"
/>
```

## React wrapper shape

```tsx
import { applyMask, MASK_PRESETS } from "../../../shared/input-mask";

export interface InputMaskProps {
  preset?: keyof typeof MASK_PRESETS;
  pattern?: string;
  value: string;
  onChange: (value: string) => void;
  "data-testid"?: string;
}
export function InputMask({ preset, pattern, value, onChange, "data-testid": testId }: InputMaskProps) {
  const activePattern = preset ? MASK_PRESETS[preset] : pattern;
  return (
    <input
      data-testid={testId}
      className="input-mask"
      inputMode="numeric"
      value={value}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "");
        onChange(activePattern ? applyMask(activePattern, digits) : e.target.value);
      }}
    />
  );
}
```

## Acceptance mapping

- FR-006, spec.md US3 Acceptance Scenario 1 → `applyMask` inserts literal characters and only consumes `\d` digits
- spec.md Edge Case (paste doesn't fully match mask) → `applyMask` naturally accepts only the matching-length prefix of digits, discarding the rest
