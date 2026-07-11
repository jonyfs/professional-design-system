import { useEffect, useId, useMemo, useRef, useState } from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Direct port of combobox.js's initCombobox() (feature 008). The Popover
// API provides top-layer rendering plus native Escape-to-close and
// light-dismiss (research.md R2 in that feature's own research); this
// hook adds everything else: filtering, aria-activedescendant roving
// "focus" (real DOM focus never leaves the input), and Enter/blur commit
// handling — genuine state-machine logic reimplemented as React state,
// not a direct DOM-manipulation port (research.md R3).
export function useCombobox(options: ComboboxOption[], onCommit: (value: string) => void) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  // useId(), sanitized to a valid CSS custom-ident (feature 010's fix,
  // mirroring useDropdownMenu's identical treatment) — a unique
  // anchor-name per hook instance so multiple Combobox instances on one
  // page never collide.
  const instanceId = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const anchorName = `--combobox-anchor-${instanceId}`;

  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );

  const enabledIndices = useMemo(
    () => filtered.reduce<number[]>((acc, o, i) => (o.disabled ? acc : [...acc, i]), []),
    [filtered],
  );

  useEffect(() => {
    const input = inputRef.current;
    const listbox = listboxRef.current;
    if (!input || !listbox) return;
    listbox.popover = "auto";
    input.style.setProperty("anchor-name", anchorName);
    listbox.style.setProperty("position-anchor", anchorName);

    function syncExpanded() {
      setIsOpen(listbox!.matches(":popover-open"));
    }
    listbox.addEventListener("toggle", syncExpanded);
    return () => listbox.removeEventListener("toggle", syncExpanded);
  }, [anchorName]);

  // Guards the auto-open effect below from reopening the listbox right
  // after commit() sets `query` to the committed value: combobox.js's
  // `input.value = option.value` is a direct DOM property write that
  // never fires an 'input' event, so its own query/filter state never
  // reacts to it — only close() runs. A controlled React input can't
  // replicate "set the value without triggering a state update" the
  // same way, so this ref flag suppresses exactly one query-effect run
  // to match that same "commit doesn't reopen" behavior.
  const suppressNextAutoOpen = useRef(false);

  useEffect(() => {
    const listbox = listboxRef.current;
    if (!listbox) return;
    if (suppressNextAutoOpen.current) {
      suppressNextAutoOpen.current = false;
      return;
    }
    if (query && !listbox.matches(":popover-open")) {
      listbox.showPopover();
    } else if (!query && listbox.matches(":popover-open")) {
      listbox.hidePopover();
    }
  }, [query]);

  function close() {
    const listbox = listboxRef.current;
    if (listbox?.matches(":popover-open")) listbox.hidePopover();
    setActiveIndex(-1);
  }

  function commit(option: ComboboxOption) {
    // Matches combobox.js's commit(): sets the input's displayed value
    // to the committed option, then closes — suppressing the query-
    // change effect so it doesn't reopen what close() just closed.
    suppressNextAutoOpen.current = true;
    setQuery(option.value);
    onCommit(option.value);
    close();
  }

  function moveActive(direction: 1 | -1) {
    if (enabledIndices.length === 0) return;
    const currentPos = enabledIndices.indexOf(activeIndex);
    let nextPos: number;
    if (currentPos === -1) {
      nextPos = direction === 1 ? 0 : enabledIndices.length - 1;
    } else {
      nextPos = (currentPos + direction + enabledIndices.length) % enabledIndices.length;
    }
    setActiveIndex(enabledIndices[nextPos]);
    listboxRef.current?.children[enabledIndices[nextPos]]?.scrollIntoView({ block: "nearest" });
  }

  function onInputChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);
  }

  function onInputKeyDown(event: React.KeyboardEvent) {
    const listbox = listboxRef.current;
    if (event.key === "ArrowDown") {
      if (!listbox?.matches(":popover-open")) return;
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      if (!listbox?.matches(":popover-open")) return;
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Enter") {
      if (activeIndex !== -1 && !filtered[activeIndex]?.disabled) {
        event.preventDefault();
        commit(filtered[activeIndex]);
      }
    } else if (event.key === "Escape") {
      if (listbox?.matches(":popover-open")) {
        event.preventDefault();
        close();
      }
    }
  }

  const activeDescendant = activeIndex === -1 ? "" : `${instanceId}-option-${activeIndex}`;

  return {
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
    onInputBlur: close,
    commit,
    setActiveIndex,
  };
}
