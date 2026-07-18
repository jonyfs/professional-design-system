import { useState } from "react";
import { filterOptions, type MultiSelectOption } from "../../../../shared/multi-select";

export type { MultiSelectOption as AutocompleteOption };

export interface AutocompleteProps {
  label?: string;
  options: MultiSelectOption[];
  placeholder?: string;
  onCommit?: (option: MultiSelectOption) => void;
  "data-testid"?: string;
}

// React port of src/scripts/autocomplete.js — a single-select sibling
// of Combobox, reusing shared/multi-select's filterOptions for
// narrowing (contracts/autocomplete.contract.md).
export function Autocomplete({
  label,
  options,
  placeholder = "Search…",
  onCommit,
  "data-testid": testId,
}: AutocompleteProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = filterOptions(options, query);

  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-neutral-900">{label}</label>}
      <div data-testid={testId} className="relative">
        <input
          className="autocomplete-field"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-label={label ?? placeholder}
          placeholder={placeholder}
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
                    onCommit?.(option);
                  }}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
