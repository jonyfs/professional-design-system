# Contract: Autocomplete

## `src/styles/tailwind.css` additions

```css
@layer components {
  .autocomplete-field {
    @apply form-input;
  }
  .autocomplete-listbox {
    @apply absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-50
      py-1 shadow-lg ring-1 ring-neutral-900/5;
  }
  .autocomplete-option {
    @apply cursor-pointer px-3 py-2 text-sm text-neutral-900 aria-selected:bg-brand
      aria-selected:text-white;
  }
  .autocomplete-empty {
    @apply px-3 py-2 text-sm text-neutral-600;
  }
}
```

## `src/scripts/autocomplete.js`

```js
// Feature 039 (research.md R1) — reuses combobox.js's single-select
// commit semantics with shared/multi-select/index.ts's filterOptions
// for narrowing. Lighter than Combobox: no multi-line grouping, one
// committed value.
import { filterOptions } from "../../shared/multi-select/index.ts";

export function initAutocompletes() {
  document.querySelectorAll("[data-autocomplete]").forEach((container) => {
    const field = container.querySelector("[data-autocomplete-field]");
    const listbox = container.querySelector("[data-autocomplete-listbox]");
    const options = JSON.parse(container.dataset.options || "[]");
    if (!field || !listbox) return;

    function render(filtered) {
      listbox.innerHTML = "";
      if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.className = "autocomplete-empty";
        empty.textContent = "No results";
        listbox.appendChild(empty);
        return;
      }
      filtered.forEach((option) => {
        const item = document.createElement("div");
        item.className = "autocomplete-option";
        item.setAttribute("role", "option");
        item.dataset.testid = `autocomplete-option-${option.id}`;
        item.textContent = option.label;
        item.addEventListener("click", () => commit(option));
        listbox.appendChild(item);
      });
    }

    function commit(option) {
      field.value = option.label;
      field.dataset.selectedId = option.id;
      close();
      field.dispatchEvent(new CustomEvent("autocomplete-commit", { detail: option, bubbles: true }));
    }

    function open() {
      listbox.hidden = false;
      field.setAttribute("aria-expanded", "true");
    }
    function close() {
      listbox.hidden = true;
      field.setAttribute("aria-expanded", "false");
    }

    field.addEventListener("input", () => {
      render(filterOptions(options, field.value));
      open();
    });
    field.addEventListener("focus", () => render(filterOptions(options, field.value)));
    field.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) close();
    });

    close();
  });
}
```

## Static HTML usage

```html
<div
  data-autocomplete
  data-testid="autocomplete-demo"
  class="relative"
  data-options='[{"id":"br","label":"Brazil"},{"id":"ca","label":"Canada"}]'
>
  <input
    data-autocomplete-field
    class="autocomplete-field"
    type="text"
    role="combobox"
    aria-expanded="false"
    aria-autocomplete="list"
    aria-label="Country"
  />
  <div data-autocomplete-listbox role="listbox" class="autocomplete-listbox" hidden></div>
</div>
```

## React wrapper shape

```tsx
import { useState, useRef } from "react";
import { filterOptions, type MultiSelectOption } from "../../../shared/multi-select";

export interface AutocompleteProps {
  options: MultiSelectOption[];
  onCommit: (option: MultiSelectOption) => void;
  "data-testid"?: string;
}
export function Autocomplete({ options, onCommit, "data-testid": testId }: AutocompleteProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = filterOptions(options, query);

  return (
    <div data-testid={testId} className="relative">
      <input
        className="autocomplete-field"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      />
      {open && (
        <div role="listbox" className="autocomplete-listbox">
          {filtered.length === 0 ? (
            <div className="autocomplete-empty">No results</div>
          ) : (
            filtered.map((option) => (
              <div
                key={option.id}
                role="option"
                className="autocomplete-option"
                onClick={() => {
                  setQuery(option.label);
                  setOpen(false);
                  onCommit(option);
                }}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
```

## Acceptance mapping

- FR-002, spec.md US1 Acceptance Scenario 2 → `filterOptions` narrowing + `commit`
- spec.md Edge Case (empty/no-match filter) → the explicit `.autocomplete-empty` "No results" branch, never a silently empty panel
