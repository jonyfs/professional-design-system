import { useState } from "react";

export interface PickListItem {
  id: string;
  label: string;
}

export interface PickListProps {
  source: PickListItem[];
  destination: PickListItem[];
  onChange: (source: PickListItem[], destination: PickListItem[]) => void;
  "data-testid"?: string;
}

const CHECKBOX_CLASSES =
  "h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

// Feature 034 (contracts/pick-list.contract.md) — reuses List's exact
// row markup and Checkbox's real inline utility composition (not a
// nonexistent .checkbox class — verified against checkbox.html
// directly). Every row/button is a real, natively focusable/
// activatable element, satisfying FR-003's keyboard operability
// requirement without a custom keyboard-handling layer.
export function PickList({ source, destination, onChange, "data-testid": testId }: PickListProps) {
  const [checkedSource, setCheckedSource] = useState<Set<string>>(new Set());
  const [checkedDestination, setCheckedDestination] = useState<Set<string>>(new Set());

  function moveSourceToDestination() {
    const moving = source.filter((item) => checkedSource.has(item.id));
    const remaining = source.filter((item) => !checkedSource.has(item.id));
    onChange(remaining, [...destination, ...moving]);
    setCheckedSource(new Set());
  }

  function moveDestinationToSource() {
    const moving = destination.filter((item) => checkedDestination.has(item.id));
    const remaining = destination.filter((item) => !checkedDestination.has(item.id));
    onChange([...source, ...moving], remaining);
    setCheckedDestination(new Set());
  }

  return (
    <div data-testid={testId} className="mt-8 grid max-w-2xl grid-cols-[1fr_auto_1fr] gap-4">
      <div className="pick-list-column">
        <div className="pick-list-header">
          Available
          <span className="pick-list-count">{source.length}</span>
        </div>
        <div className="pick-list-panel">
        {source.map((item) => (
          <label key={item.id} className="list-row">
            <input
              type="checkbox"
              className={CHECKBOX_CLASSES}
              checked={checkedSource.has(item.id)}
              onChange={(e) => {
                const next = new Set(checkedSource);
                if (e.target.checked) next.add(item.id);
                else next.delete(item.id);
                setCheckedSource(next);
              }}
            />
            <span className="list-row-title">{item.label}</span>
          </label>
        ))}
        {source.length === 0 && <p className="list-row-metadata p-4">No available users.</p>}
        </div>
      </div>
      <div className="pick-list-controls">
        <button
          type="button"
          aria-label="Move selected right"
          className="action-icon action-icon-secondary"
          onClick={moveSourceToDestination}
        >
          ›
        </button>
        <button
          type="button"
          aria-label="Move all right"
          className="action-icon action-icon-secondary"
          onClick={() => onChange([], [...destination, ...source])}
        >
          »
        </button>
        <button
          type="button"
          aria-label="Move all left"
          className="action-icon action-icon-secondary"
          onClick={() => onChange([...source, ...destination], [])}
        >
          «
        </button>
        <button
          type="button"
          aria-label="Move selected left"
          className="action-icon action-icon-secondary"
          onClick={moveDestinationToSource}
        >
          ‹
        </button>
      </div>
      <div className="pick-list-column">
        <div className="pick-list-header">
          <span className="pick-list-dot" aria-hidden="true" />
          Selected
          <span className="pick-list-count">{destination.length}</span>
        </div>
        <div className="pick-list-panel">
        {destination.map((item) => (
          <label key={item.id} className="list-row">
            <input
              type="checkbox"
              className={CHECKBOX_CLASSES}
              checked={checkedDestination.has(item.id)}
              onChange={(e) => {
                const next = new Set(checkedDestination);
                if (e.target.checked) next.add(item.id);
                else next.delete(item.id);
                setCheckedDestination(next);
              }}
            />
            <span className="list-row-title">{item.label}</span>
          </label>
        ))}
        {destination.length === 0 && <p className="list-row-metadata p-4">No members yet.</p>}
        </div>
      </div>
    </div>
  );
}
