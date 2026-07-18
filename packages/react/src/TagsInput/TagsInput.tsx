import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";

export interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  "data-testid"?: string;
}

// React port of src/scripts/tags-input.js — freeform multi-value
// entry, no fixed option list (contracts/tags-input.contract.md).
export function TagsInput({
  value,
  onChange,
  label,
  placeholder = "Add a tag…",
  "data-testid": testId,
}: TagsInputProps) {
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
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-neutral-900">{label}</label>}
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
          aria-label={label ?? "Add a tag"}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
      </div>
    </div>
  );
}
