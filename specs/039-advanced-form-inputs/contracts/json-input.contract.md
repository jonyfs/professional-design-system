# Contract: JsonInput

## `src/styles/tailwind.css` additions

```css
@layer components {
  .json-input {
    @apply form-textarea font-mono text-sm aria-invalid:ring-2 aria-invalid:ring-error;
  }
  .json-input-error {
    @apply mt-1 text-sm text-error-strong;
  }
}
```

## `src/scripts/json-input.js`

```js
// Feature 039 (research.md R2) — validates on every change; a
// non-blocking, always-editable error state (never prevents further
// typing), reusing Textarea's existing markup + this catalog's
// existing aria-invalid/error-text convention (Text Input's own error
// state, feature 001).
export function initJsonInputs() {
  document.querySelectorAll("[data-json-input]").forEach((field) => {
    const errorEl = document.querySelector(`[data-json-input-error-for="${field.id}"]`);

    function validate() {
      if (!field.value.trim()) {
        field.removeAttribute("aria-invalid");
        if (errorEl) errorEl.textContent = "";
        return;
      }
      try {
        JSON.parse(field.value);
        field.removeAttribute("aria-invalid");
        if (errorEl) errorEl.textContent = "";
      } catch (e) {
        field.setAttribute("aria-invalid", "true");
        if (errorEl) errorEl.textContent = e.message;
      }
    }

    field.addEventListener("input", validate);
    validate();
  });
}
```

## Static HTML usage

```html
<textarea id="json-input-demo" data-json-input data-testid="json-input-demo" class="json-input"></textarea>
<p data-json-input-error-for="json-input-demo" class="json-input-error" role="alert"></p>
```

## React wrapper shape

```tsx
import { useState } from "react";

export interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  "data-testid"?: string;
}
export function JsonInput({ value, onChange, "data-testid": testId }: JsonInputProps) {
  const [error, setError] = useState<string | null>(null);

  function handleChange(next: string) {
    onChange(next);
    if (!next.trim()) {
      setError(null);
      return;
    }
    try {
      JSON.parse(next);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div>
      <textarea
        data-testid={testId}
        className="json-input"
        aria-invalid={error !== null}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
      {error && (
        <p className="json-input-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

## Acceptance mapping

- FR-007, spec.md US3 Acceptance Scenario 2 → `JSON.parse` try/catch driving `aria-invalid` + visible error text, never blocking further typing
