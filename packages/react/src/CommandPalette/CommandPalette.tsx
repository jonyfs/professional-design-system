import { useCommandPalette, type CommandPaletteAction } from "../hooks/useCommandPalette";

export type { CommandPaletteAction };

export interface CommandPaletteProps {
  actions: CommandPaletteAction[];
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

// Thin consumer of useCommandPalette (contracts/013-react-port-batch-2/
// react-port-batch-2.contract.md) — direct port of
// command-palette.html/command-palette.js (feature 008). Mounts a
// global Cmd/Ctrl+K listener; no open/onClose prop, since the static
// reference is entirely self-contained (unlike Modal, which is
// consumer-controlled).
export function CommandPalette({ actions, "data-testid": testId }: CommandPaletteProps) {
  const {
    dialogRef,
    inputRef,
    instanceId,
    query,
    filtered,
    activeIndex,
    activeDescendant,
    confirmation,
    onInputChange,
    onInputKeyDown,
    execute,
  } = useCommandPalette(actions);

  return (
    <>
      <dialog ref={dialogRef} data-testid={testId} className="command-palette-dialog">
        <input
          ref={inputRef}
          type="text"
          id={instanceId}
          role="combobox"
          aria-expanded="true"
          aria-controls={`${instanceId}-list`}
          aria-activedescendant={activeDescendant}
          aria-autocomplete="list"
          autoComplete="off"
          data-testid={testId && `${testId}-input`}
          className="command-palette-input"
          placeholder="Type a command or search…"
          value={query}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onInputKeyDown}
        />
        <ul
          id={`${instanceId}-list`}
          role="listbox"
          data-testid={testId && `${testId}-list`}
          className="command-palette-list"
        >
          {filtered.length === 0 ? (
            <div className="command-palette-empty" data-testid={testId && `${testId}-empty`}>
              No results found.
            </div>
          ) : (
            filtered.map((action, index) => (
              <li
                key={action.id}
                id={`${instanceId}-action-${index}`}
                role="option"
                data-testid={testId && `${testId}-action-${index}`}
                className="command-palette-action"
                aria-disabled={action.disabled}
                aria-selected={index === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (!action.disabled) execute(action);
                }}
              >
                {highlight(action.label, query)}
              </li>
            ))
          )}
        </ul>
      </dialog>
      <p aria-live="polite" data-testid={testId && `${testId}-confirmation`} className="sr-only">
        {confirmation}
      </p>
    </>
  );
}
