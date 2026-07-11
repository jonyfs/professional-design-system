import { useId } from "react";
import { useCombobox, type ComboboxOption } from "../hooks/useCombobox";

export type { ComboboxOption };

export interface ComboboxProps {
  label: string;
  options: ComboboxOption[];
  onCommit: (value: string) => void;
  "data-testid"?: string;
}

function highlight(label: string, query: string) {
  if (!query) return label;
  const start = label.toLowerCase().indexOf(query.toLowerCase());
  if (start === -1) return label;
  const end = start + query.length;
  return (
    <>
      {label.slice(0, start)}
      <mark>{label.slice(start, end)}</mark>
      {label.slice(end)}
    </>
  );
}

// Thin consumer of useCombobox (contracts/013-react-port-batch-2/
// react-port-batch-2.contract.md) — a from-scratch WAI-ARIA 1.2
// combobox, direct port of combobox.html/combobox.js (feature 008).
export function Combobox({ label, options, onCommit, "data-testid": testId }: ComboboxProps) {
  const {
    inputRef,
    listboxRef,
    instanceId,
    query,
    filtered,
    activeIndex,
    isOpen,
    activeDescendant,
    onInputChange,
    onInputKeyDown,
    onInputBlur,
    commit,
  } = useCombobox(options, onCommit);
  const labelId = useId();

  return (
    <div className="relative">
      <label id={labelId} htmlFor={instanceId} className="mb-1 block text-sm font-medium text-neutral-900">
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        id={instanceId}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${instanceId}-listbox`}
        aria-activedescendant={activeDescendant}
        aria-autocomplete="list"
        autoComplete="off"
        data-testid={testId}
        className="combobox-input"
        placeholder="Search…"
        value={query}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onInputKeyDown}
        onBlur={onInputBlur}
      />
      <ul
        ref={listboxRef}
        id={`${instanceId}-listbox`}
        role="listbox"
        data-testid={testId && `${testId}-listbox`}
        className="combobox-listbox"
      >
        {filtered.length === 0 ? (
          <div className="combobox-empty" data-testid={testId && `${testId}-empty`}>
            No results found.
          </div>
        ) : (
          filtered.map((option, index) => (
            <li
              key={option.value}
              id={`${instanceId}-option-${index}`}
              role="option"
              data-testid={testId && `${testId}-option-${index}`}
              className="combobox-option"
              aria-disabled={option.disabled}
              aria-selected={index === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                if (!option.disabled) commit(option);
              }}
            >
              {highlight(option.label, query)}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
