import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useDialogTrigger } from "./useDialogTrigger";

export interface CommandPaletteAction {
  id: string;
  label: string;
  disabled?: boolean;
  onExecute: () => void;
}

// Direct port of command-palette.js's initCommandPalette() (feature 008).
// Reuses <dialog>/showModal() chrome via useDialogTrigger (research.md
// R2 — the same hook Modal's port already uses for backdrop-click-close
// and WebKit-safe focus-return; no new dialog-close logic invented).
// Independently implements the same filter/arrow-key/
// aria-activedescendant model as useCombobox (research.md R3's sibling
// decision: command-palette.js documents NOT sharing a module with
// combobox.js, and this port preserves that decision rather than
// silently merging them).
export function useCommandPalette(actions: CommandPaletteAction[]) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [confirmation, setConfirmation] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const instanceId = useId().replace(/[^a-zA-Z0-9-]/g, "");

  const dialogRef = useDialogTrigger(open, () => setOpen(false));

  const filtered = useMemo(
    () => actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())),
    [actions, query],
  );

  const enabledIndices = useMemo(
    () => filtered.reduce<number[]>((acc, a, i) => (a.disabled ? acc : [...acc, i]), []),
    [filtered],
  );

  // Global Cmd/Ctrl+K shortcut (research.md R4) — the exact same
  // modifier-key check as command-palette.js, which cannot fire from
  // plain typing in any other component's input (no other ported
  // component binds a document-level listener for the same key).
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isShortcut) return;
      event.preventDefault();
      // Checks THIS instance's own dialog via the DOM property (not
      // React's `open` state, which this effect's `[]` deps would
      // otherwise close over stale forever, and not a page-wide
      // `document.querySelector("dialog[open]")`, which would
      // incorrectly block this palette from opening just because some
      // unrelated Modal/SlideOver — or a second CommandPalette
      // instance — happens to be open elsewhere on the page; code
      // review finding).
      if (dialogRef.current?.open) return;
      setConfirmation("");
      setQuery("");
      setActiveIndex(-1);
      setOpen(true);
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (open) {
      // Matches command-palette.html's `autofocus` on the input.
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [open]);

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
  }

  function execute(action: CommandPaletteAction) {
    action.onExecute();
    setConfirmation(`Executed: ${action.label}`);
    setOpen(false);
  }

  function onInputChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);
  }

  function onInputKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Enter") {
      if (activeIndex !== -1 && !filtered[activeIndex]?.disabled) {
        event.preventDefault();
        execute(filtered[activeIndex]);
      }
    }
  }

  const activeDescendant = activeIndex === -1 ? "" : `${instanceId}-action-${activeIndex}`;

  return {
    dialogRef,
    inputRef,
    instanceId,
    open,
    query,
    filtered,
    activeIndex,
    activeDescendant,
    confirmation,
    onInputChange,
    onInputKeyDown,
    execute,
  };
}
