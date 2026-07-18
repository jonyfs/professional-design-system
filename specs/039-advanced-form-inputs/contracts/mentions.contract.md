# Contract: Mentions

## `shared/mentions/index.ts` (new shared module, research.md R4)

```ts
// Feature 039 — cursor-position trigger-character detection, shared
// verbatim between src/scripts/mentions.js and
// packages/react/src/Mentions/Mentions.tsx, parallel to
// shared/multi-select/index.ts's existing extraction pattern.

/** Returns the in-progress @query text ending at `cursorIndex`, or null if none is active. */
export function findActiveTrigger(text: string, cursorIndex: number, trigger = "@"): string | null {
  const beforeCursor = text.slice(0, cursorIndex);
  const triggerIndex = beforeCursor.lastIndexOf(trigger);
  if (triggerIndex === -1) return null;
  const between = beforeCursor.slice(triggerIndex + 1);
  if (/\s/.test(between)) return null; // whitespace ends the trigger
  return between;
}

/** Replaces the active trigger span with a committed mention token's label. */
export function insertMention(
  text: string,
  cursorIndex: number,
  label: string,
  trigger = "@",
): { text: string; cursorIndex: number } {
  const beforeCursor = text.slice(0, cursorIndex);
  const triggerIndex = beforeCursor.lastIndexOf(trigger);
  const token = `${trigger}${label} `;
  const next = text.slice(0, triggerIndex) + token + text.slice(cursorIndex);
  return { text: next, cursorIndex: triggerIndex + token.length };
}
```

## `src/styles/tailwind.css` additions

```css
@layer components {
  .mentions-field {
    @apply form-textarea;
  }
  .mentions-popover {
    @apply absolute z-10 max-h-48 w-64 overflow-auto rounded-md bg-neutral-50 py-1
      shadow-lg ring-1 ring-neutral-900/5;
  }
  .mentions-option {
    @apply cursor-pointer px-3 py-2 text-sm text-neutral-900 aria-selected:bg-brand
      aria-selected:text-white;
  }
  .mentions-token {
    @apply rounded bg-brand/10 px-0.5 font-medium text-brand-dark;
  }
}
```

## `src/scripts/mentions.js`

```js
// Feature 039 (research.md R2) — genuinely new logic: trigger
// detection + popover anchored at the cursor (not the field edge),
// reusing shared/mentions/index.ts + filterOptions for the list.
import { filterOptions } from "../../shared/multi-select/index.ts";
import { findActiveTrigger, insertMention } from "../../shared/mentions/index.ts";

export function initMentions() {
  document.querySelectorAll("[data-mentions]").forEach((container) => {
    const field = container.querySelector("[data-mentions-field]");
    const popover = container.querySelector("[data-mentions-popover]");
    const users = JSON.parse(container.dataset.users || "[]");
    if (!field || !popover) return;

    function open(query) {
      const matches = filterOptions(users, query);
      popover.innerHTML = "";
      matches.forEach((user) => {
        const item = document.createElement("div");
        item.className = "mentions-option";
        item.setAttribute("role", "option");
        item.textContent = user.label;
        item.addEventListener("mousedown", (e) => {
          e.preventDefault(); // keep field focus across the click
          const { text, cursorIndex } = insertMention(field.value, field.selectionStart, user.label);
          field.value = text;
          field.setSelectionRange(cursorIndex, cursorIndex);
          close();
        });
        popover.appendChild(item);
      });
      popover.hidden = matches.length === 0;
    }
    function close() {
      popover.hidden = true;
    }

    field.addEventListener("input", () => {
      const query = findActiveTrigger(field.value, field.selectionStart);
      if (query === null) close();
      else open(query);
    });
    field.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    close();
  });
}
```

## Static HTML usage

```html
<div
  data-mentions
  data-testid="mentions-demo"
  class="relative"
  data-users='[{"id":"jane","label":"jane"},{"id":"joão","label":"joão"}]'
>
  <textarea data-mentions-field class="mentions-field" aria-label="Comment"></textarea>
  <div data-mentions-popover role="listbox" class="mentions-popover" hidden></div>
</div>
```

## React wrapper shape

```tsx
import { useState, useRef } from "react";
import { filterOptions, type MultiSelectOption } from "../../../shared/multi-select";
import { findActiveTrigger, insertMention } from "../../../shared/mentions";

export interface MentionsProps {
  users: MultiSelectOption[];
  "data-testid"?: string;
}
export function Mentions({ users, "data-testid": testId }: MentionsProps) {
  const [text, setText] = useState("");
  const [query, setQuery] = useState<string | null>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  function handleInput() {
    const el = fieldRef.current;
    if (!el) return;
    setText(el.value);
    setQuery(findActiveTrigger(el.value, el.selectionStart ?? 0));
  }

  function commit(user: MultiSelectOption) {
    const el = fieldRef.current;
    if (!el) return;
    const { text: next, cursorIndex } = insertMention(el.value, el.selectionStart ?? 0, user.label);
    setText(next);
    setQuery(null);
    requestAnimationFrame(() => el.setSelectionRange(cursorIndex, cursorIndex));
  }

  const matches = query !== null ? filterOptions(users, query) : [];

  return (
    <div data-testid={testId} className="relative">
      <textarea
        ref={fieldRef}
        className="mentions-field"
        aria-label="Comment"
        value={text}
        onChange={handleInput}
        onKeyDown={(e) => e.key === "Escape" && setQuery(null)}
      />
      {query !== null && matches.length > 0 && (
        <div role="listbox" className="mentions-popover">
          {matches.map((user) => (
            <div
              key={user.id}
              role="option"
              className="mentions-option"
              onMouseDown={(e) => {
                e.preventDefault();
                commit(user);
              }}
            >
              {user.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Acceptance mapping

- FR-003, spec.md US1 Acceptance Scenario 3 → `findActiveTrigger` + `insertMention`
- spec.md Edge Case (empty/no-match filter) applies here too, shared with Autocomplete's "no results" requirement
