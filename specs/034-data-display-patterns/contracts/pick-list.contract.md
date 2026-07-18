# Contract: PickList / Transfer

Reuses List's exact `.list`/`.list-row` classes verbatim (feature
011) — the dual-panel layout is pure composition, no new list-
rendering mechanism (research.md R3).

## `src/styles/tailwind.css` additions

```css
@layer components {
  .pick-list-panel {
    @apply list max-h-64 min-h-[4rem] overflow-y-auto;
  }
  .pick-list-controls {
    @apply flex flex-col justify-center gap-2;
  }
}
```

## `src/scripts/pick-list.js`

```js
// Feature 034 (research.md R3) — every row/button is a real,
// natively focusable/activatable element (checkbox + button); no
// custom keyboard-handling layer is needed for FR-003's keyboard
// operability requirement.
export function initPickLists() {
  document.querySelectorAll("[data-pick-list]").forEach((container) => {
    const source = container.querySelector("[data-pick-list-source]");
    const destination = container.querySelector("[data-pick-list-destination]");
    const moveRight = container.querySelector("[data-pick-list-move-right]");
    const moveLeft = container.querySelector("[data-pick-list-move-left]");
    const moveAllRight = container.querySelector("[data-pick-list-move-all-right]");
    const moveAllLeft = container.querySelector("[data-pick-list-move-all-left]");

    function moveChecked(from, to) {
      from.querySelectorAll("input[type=checkbox]:checked").forEach((checkbox) => {
        checkbox.checked = false;
        to.appendChild(checkbox.closest("[data-pick-list-row]"));
      });
      updateEmptyStates();
    }

    function moveAll(from, to) {
      Array.from(from.querySelectorAll("[data-pick-list-row]")).forEach((row) => to.appendChild(row));
      updateEmptyStates();
    }

    function updateEmptyStates() {
      [source, destination].forEach((panel) => {
        const empty = panel.querySelector("[data-pick-list-empty]");
        const hasRows = panel.querySelectorAll("[data-pick-list-row]").length > 0;
        if (empty) empty.hidden = hasRows;
      });
    }

    moveRight?.addEventListener("click", () => moveChecked(source, destination));
    moveLeft?.addEventListener("click", () => moveChecked(destination, source));
    moveAllRight?.addEventListener("click", () => moveAll(source, destination));
    moveAllLeft?.addEventListener("click", () => moveAll(destination, source));
    updateEmptyStates();
  });
}
```

## Static HTML usage

```html
<div data-pick-list data-testid="pick-list-demo" class="mt-8 grid max-w-2xl grid-cols-[1fr_auto_1fr] gap-4">
  <div data-pick-list-source data-testid="pick-list-source" class="pick-list-panel">
    <label class="list-row" data-pick-list-row data-testid="pick-list-row-alice">
      <input type="checkbox" class="h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" />
      <span class="list-row-title">Alice Johnson</span>
    </label>
    <label class="list-row" data-pick-list-row data-testid="pick-list-row-bob">
      <input type="checkbox" class="h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" />
      <span class="list-row-title">Bob Martinez</span>
    </label>
    <p data-pick-list-empty class="list-row-metadata p-4" hidden>No available users.</p>
  </div>

  <div class="pick-list-controls">
    <button type="button" data-pick-list-move-right data-testid="pick-list-move-right" aria-label="Move selected right" class="action-icon action-icon-secondary">›</button>
    <button type="button" data-pick-list-move-all-right data-testid="pick-list-move-all-right" aria-label="Move all right" class="action-icon action-icon-secondary">»</button>
    <button type="button" data-pick-list-move-all-left data-testid="pick-list-move-all-left" aria-label="Move all left" class="action-icon action-icon-secondary">«</button>
    <button type="button" data-pick-list-move-left data-testid="pick-list-move-left" aria-label="Move selected left" class="action-icon action-icon-secondary">‹</button>
  </div>

  <div data-pick-list-destination data-testid="pick-list-destination" class="pick-list-panel">
    <p data-pick-list-empty class="list-row-metadata p-4">No members yet.</p>
  </div>
</div>
```

## React wrapper shape

```tsx
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
export function PickList({ source, destination, onChange, "data-testid": testId }: PickListProps) {
  const [checkedSource, setCheckedSource] = useState<Set<string>>(new Set());
  const [checkedDestination, setCheckedDestination] = useState<Set<string>>(new Set());

  function moveChecked(from: PickListItem[], to: PickListItem[], checked: Set<string>) {
    const moving = from.filter((item) => checked.has(item.id));
    const remaining = from.filter((item) => !checked.has(item.id));
    return from === source
      ? onChange(remaining, [...to, ...moving])
      : onChange([...to, ...moving], remaining);
  }

  return (
    <div data-testid={testId} className="mt-8 grid max-w-2xl grid-cols-[1fr_auto_1fr] gap-4">
      <div className="pick-list-panel">
        {source.map((item) => (
          <label key={item.id} className="list-row">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              checked={checkedSource.has(item.id)}
              onChange={(e) => {
                const next = new Set(checkedSource);
                e.target.checked ? next.add(item.id) : next.delete(item.id);
                setCheckedSource(next);
              }}
            />
            <span className="list-row-title">{item.label}</span>
          </label>
        ))}
        {source.length === 0 && <p className="list-row-metadata p-4">No available users.</p>}
      </div>
      <div className="pick-list-controls">
        <button type="button" aria-label="Move selected right" className="action-icon action-icon-secondary" onClick={() => moveChecked(source, destination, checkedSource)}>›</button>
        <button type="button" aria-label="Move all right" className="action-icon action-icon-secondary" onClick={() => onChange([], [...destination, ...source])}>»</button>
        <button type="button" aria-label="Move all left" className="action-icon action-icon-secondary" onClick={() => onChange([...source, ...destination], [])}>«</button>
        <button type="button" aria-label="Move selected left" className="action-icon action-icon-secondary" onClick={() => moveChecked(destination, source, checkedDestination)}>‹</button>
      </div>
      <div className="pick-list-panel">
        {destination.map((item) => (
          <label key={item.id} className="list-row">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              checked={checkedDestination.has(item.id)}
              onChange={(e) => {
                const next = new Set(checkedDestination);
                e.target.checked ? next.add(item.id) : next.delete(item.id);
                setCheckedDestination(next);
              }}
            />
            <span className="list-row-title">{item.label}</span>
          </label>
        ))}
        {destination.length === 0 && <p className="list-row-metadata p-4">No members yet.</p>}
      </div>
    </div>
  );
}
```

## Acceptance mapping

- FR-003, spec.md US2 Acceptance Scenario 2 → the markup/scripts above
- spec.md Edge Case (both panels empty / one becomes empty) → the `data-pick-list-empty`/conditional-render empty state per panel
