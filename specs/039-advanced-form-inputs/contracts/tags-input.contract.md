# Contract: TagsInput

## `src/styles/tailwind.css` additions

```css
@layer components {
  .tags-input {
    @apply flex flex-wrap items-center gap-1.5 rounded-md border border-neutral-300
      bg-neutral-50 px-2 py-1.5 focus-within:outline focus-within:outline-2
      focus-within:outline-offset-2 focus-within:outline-brand;
  }
  .tags-input-tag {
    @apply inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5
      text-sm font-medium text-neutral-800;
  }
  .tags-input-tag-remove {
    @apply inline-flex h-4 w-4 items-center justify-center rounded-sm text-neutral-500
      hover:bg-neutral-200 hover:text-neutral-900 focus-visible:outline
      focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand
      disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .tags-input-field {
    @apply min-w-[8ch] flex-1 border-0 bg-transparent p-0 text-sm text-neutral-900
      focus:outline-none focus:ring-0;
  }
}
```

## `src/scripts/tags-input.js`

```js
// Feature 039 (research.md R2) — freeform multi-value entry. No fixed
// option list, so shared/multi-select/index.ts's filterOptions does
// not apply; addSelection/removeSelection's immutable-Set shape is
// reused conceptually (a fresh array is always produced, the DOM
// input's existing tag list is never mutated in place).
export function initTagsInputs() {
  document.querySelectorAll("[data-tags-input]").forEach((container) => {
    const field = container.querySelector("[data-tags-input-field]");
    const tagList = container.querySelector("[data-tags-input-list]");
    const hiddenInput = container.querySelector("[data-tags-input-value]");
    if (!field || !tagList || !hiddenInput) return;

    let tags = (hiddenInput.value ? hiddenInput.value.split(",") : []).filter(Boolean);

    function sync() {
      hiddenInput.value = tags.join(",");
      hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
      tagList.innerHTML = "";
      tags.forEach((tag, index) => {
        const chip = document.createElement("span");
        chip.className = "tags-input-tag";
        chip.dataset.testid = `tags-input-tag-${index}`;
        chip.textContent = tag;
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "tags-input-tag-remove";
        removeBtn.setAttribute("aria-label", `Remove ${tag}`);
        removeBtn.textContent = "×";
        removeBtn.addEventListener("click", () => {
          tags = tags.filter((_, i) => i !== index); // fresh array, never mutated in place
          sync();
          field.focus();
        });
        chip.appendChild(removeBtn);
        tagList.appendChild(chip);
      });
    }

    function commitValue(raw) {
      const value = raw.trim();
      if (value && !tags.includes(value)) {
        tags = [...tags, value]; // fresh array
        sync();
      }
      field.value = "";
    }

    field.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        commitValue(field.value);
      } else if (e.key === "Backspace" && field.value === "" && tags.length > 0) {
        tags = tags.slice(0, -1); // fresh array
        sync();
      }
    });

    field.addEventListener("paste", (e) => {
      const text = e.clipboardData?.getData("text") ?? "";
      if (/[,\n]/.test(text)) {
        e.preventDefault();
        text.split(/[,\n]/).forEach((part) => commitValue(part));
      }
    });

    sync();
  });
}
```

## Static HTML usage

```html
<div data-tags-input data-testid="tags-input-demo" class="tags-input">
  <div data-tags-input-list class="contents"></div>
  <input
    data-tags-input-field
    class="tags-input-field"
    type="text"
    aria-label="Add a tag"
    placeholder="Add a tag…"
  />
  <input data-tags-input-value type="hidden" name="tags" />
</div>
```

## React wrapper shape

```tsx
import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";

export interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  "data-testid"?: string;
}
export function TagsInput({ value, onChange, "data-testid": testId }: TagsInputProps) {
  const [draft, setDraft] = useState("");
  const fieldRef = useRef<HTMLInputElement>(null);

  function commit(raw: string) {
    const v = raw.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    if (/[,\n]/.test(text)) {
      e.preventDefault();
      text.split(/[,\n]/).forEach(commit);
    }
  }

  return (
    <div data-testid={testId} className="tags-input">
      {value.map((tag, i) => (
        <span key={tag} className="tags-input-tag">
          {tag}
          <button
            type="button"
            className="tags-input-tag-remove"
            aria-label={`Remove ${tag}`}
            onClick={() => {
              onChange(value.filter((_, idx) => idx !== i));
              fieldRef.current?.focus();
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={fieldRef}
        className="tags-input-field"
        aria-label="Add a tag"
        placeholder="Add a tag…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    </div>
  );
}
```

## Acceptance mapping

- FR-001, spec.md US1 Acceptance Scenario 1 → `commitValue`/`commit` (Enter/comma) and duplicate-prevention (`!tags.includes`)
- spec.md Edge Case (multi-value paste) → the `paste` handler's `/[,\n]/` split
- spec.md US1 Acceptance Scenario 4 (keyboard-only) → Backspace-to-remove-last-tag + native `<input>` typing, no mouse required
