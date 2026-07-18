import { useState, useRef } from "react";
import { filterOptions, type MultiSelectOption } from "../../../../shared/multi-select";
import { findActiveTrigger, insertMention } from "../../../../shared/mentions";

export interface MentionsProps {
  label?: string;
  users: MultiSelectOption[];
  "data-testid"?: string;
}

// React port of src/scripts/mentions.js — @-trigger detection +
// popover anchored at the cursor (contracts/mentions.contract.md).
export function Mentions({ label, users, "data-testid": testId }: MentionsProps) {
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
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-neutral-900">{label}</label>}
      <div data-testid={testId} className="relative">
        <textarea
          ref={fieldRef}
          className="mentions-field"
          aria-label={label ?? "Comment"}
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
    </div>
  );
}
