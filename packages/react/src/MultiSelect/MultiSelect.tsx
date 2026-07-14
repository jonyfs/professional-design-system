import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  addSelection,
  removeSelection,
  filterOptions,
  type MultiSelectOption,
} from "../../../../shared/multi-select";

export type { MultiSelectOption };

export interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  /** Placeholder shown while nothing is selected (Select/Combobox convention). */
  placeholder?: string;
  /** Notified with the current selected-id set whenever it changes. */
  onChange?: (selectedIds: Set<string>) => void;
  "data-testid"?: string;
}

// React port of src/scripts/multi-select.js — Combobox's filter/listbox/
// keyboard model (a direct sibling of useCombobox) plus multi-select
// behavior: selecting toggles membership in a Set, the panel stays open,
// and selections render as removable chips. The pure add/remove/filter
// logic is imported from shared/multi-select so both surfaces share one
// implementation (contracts/form-inputs.contract.md).
export function MultiSelect({
  label,
  options,
  placeholder = "Select…",
  onChange,
  "data-testid": testId,
}: MultiSelectProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const labelId = useId();
  const instanceId = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const anchorName = `--multi-select-anchor-${instanceId}`;

  const optionById = useMemo(() => new Map(options.map((o) => [o.id, o])), [options]);
  const filtered = useMemo(() => filterOptions(options, query), [options, query]);

  useEffect(() => {
    const input = inputRef.current;
    const listbox = listboxRef.current;
    if (!input || !listbox) return;
    // "manual" (not "auto"): a MultiSelect opens on focus/click of the
    // input, which sits OUTSIDE the popover — an "auto" popover's
    // light-dismiss treats that same click as an outside-click and closes
    // it on the very pointerup that opened it. Combobox never hits this
    // because it only opens on typing. We drive close ourselves from
    // blur/Escape instead.
    listbox.popover = "manual";
    input.style.setProperty("anchor-name", anchorName);
    listbox.style.setProperty("position-anchor", anchorName);
    function syncExpanded() {
      setIsOpen(listbox!.matches(":popover-open"));
    }
    listbox.addEventListener("toggle", syncExpanded);
    return () => listbox.removeEventListener("toggle", syncExpanded);
  }, [anchorName]);

  function commitSelection(next: Set<string>) {
    setSelectedIds(next);
    onChange?.(next);
  }

  function open() {
    const listbox = listboxRef.current;
    if (listbox && !listbox.matches(":popover-open")) listbox.showPopover();
  }

  function close() {
    const listbox = listboxRef.current;
    if (listbox?.matches(":popover-open")) listbox.hidePopover();
    setActiveIndex(-1);
  }

  function toggleOption(option: MultiSelectOption) {
    commitSelection(
      selectedIds.has(option.id)
        ? removeSelection(selectedIds, option.id)
        : addSelection(selectedIds, option.id),
    );
    // Multi-select convention: keep the panel open after a selection.
    open();
  }

  function moveActive(direction: 1 | -1) {
    if (filtered.length === 0) return;
    setActiveIndex((current) => {
      if (current === -1) return direction === 1 ? 0 : filtered.length - 1;
      return (current + direction + filtered.length) % filtered.length;
    });
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const listbox = listboxRef.current;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!listbox?.matches(":popover-open")) open();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!listbox?.matches(":popover-open")) open();
      moveActive(-1);
    } else if (event.key === "Enter") {
      if (activeIndex !== -1 && filtered[activeIndex]) {
        event.preventDefault();
        toggleOption(filtered[activeIndex]);
      }
    } else if (event.key === "Escape") {
      if (listbox?.matches(":popover-open")) {
        event.preventDefault();
        close();
      }
    } else if (event.key === "Backspace" && query === "" && selectedIds.size > 0) {
      const last = [...selectedIds].pop()!;
      commitSelection(removeSelection(selectedIds, last));
    }
  }

  const activeDescendant = activeIndex === -1 ? "" : `${instanceId}-option-${activeIndex}`;

  return (
    <div className="relative">
      <label id={labelId} htmlFor={instanceId} className="mb-1 block text-sm font-medium text-neutral-900">
        {label}
      </label>
      {selectedIds.size > 0 && (
        <div data-testid={testId && `${testId}-chips`} className="mb-1 flex flex-wrap gap-1">
          {[...selectedIds].map((id) => {
            const option = optionById.get(id);
            if (!option) return null;
            return (
              <span
                key={id}
                data-testid={testId && `${testId}-chip-${id}`}
                className="inline-flex items-center gap-1 rounded-md bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-500/10"
              >
                {option.label}
                <button
                  type="button"
                  aria-label={`Remove ${option.label}`}
                  data-testid={testId && `${testId}-chip-remove-${id}`}
                  onClick={() => {
                    commitSelection(removeSelection(selectedIds, id));
                    inputRef.current?.focus();
                  }}
                  className="-mr-1.5 flex h-6 w-6 items-center justify-center rounded-sm text-neutral-600 hover:text-neutral-900 active:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
                >
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}
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
        placeholder={selectedIds.size === 0 ? placeholder : ""}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(-1);
          open();
        }}
        onFocus={open}
        onKeyDown={onKeyDown}
        onBlur={close}
      />
      <ul
        ref={listboxRef}
        id={`${instanceId}-listbox`}
        role="listbox"
        aria-multiselectable="true"
        data-testid={testId && `${testId}-listbox`}
        className="combobox-listbox"
      >
        {filtered.length === 0 ? (
          <div className="combobox-empty" data-testid={testId && `${testId}-empty`}>
            No results found.
          </div>
        ) : (
          filtered.map((option, index) => {
            const isSelected = selectedIds.has(option.id);
            return (
              <li
                key={option.id}
                id={`${instanceId}-option-${index}`}
                role="option"
                data-testid={testId && `${testId}-option-${index}`}
                aria-selected={isSelected}
                className={`combobox-option flex items-center ${index === activeIndex ? "bg-neutral-200" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleOption(option);
                }}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg className="ml-auto h-4 w-4 text-brand" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M13 4.5 6.5 11 3 7.5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
