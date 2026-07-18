# Quickstart: Advanced Form Inputs Batch

## Prerequisites

- Repo installed (`npm install`), dev server available via `npm run dev` (static site, port 5173) and `npm run dev --workspace=tests/react-harness` (React harness, port 5174).

## Validate TagsInput

1. Open `/src/components/tags-input/tags-input.html`.
2. Type a value and press Enter — confirm it becomes a removable tag and the field clears.
3. Paste `a,b,c` — confirm three separate tags are created, not one malformed entry.
4. Press Backspace on an empty field — confirm the last tag is removed.

## Validate Autocomplete

1. Open `/src/components/autocomplete/autocomplete.html`.
2. Type a partial match — confirm the list narrows; type a non-match — confirm an explicit "No results" state, never a silently empty panel.
3. Select an option via mouse and via keyboard (Arrow + Enter) — confirm both commit the same way.

## Validate Mentions

1. Open `/src/components/mentions/mentions.html`.
2. Type `@` followed by characters inside the text field — confirm a filtered popover appears anchored at the cursor.
3. Select a suggestion — confirm a distinct, styled mention token is inserted in place of the typed characters.

## Validate Cascader

1. Open `/src/components/cascader/cascader.html`.
2. Open the trigger, select a first-level option — confirm a second-level panel appears.
3. Select a leaf — confirm the trigger commits and displays the full path; confirm Escape closes without changing a previously committed value.

## Validate TreeSelect

1. Open `/src/components/tree-select/tree-select.html`.
2. Open the trigger — confirm the same expand/collapse affordance as the existing TreeView.
3. Select a node (mouse and keyboard) — confirm it commits and the panel closes.

## Validate InputMask

1. Open `/src/components/input-mask/input-mask.html`.
2. Type digits into the phone-mask field — confirm literal characters (parentheses, dashes) are inserted automatically.
3. Paste a value longer than the mask allows — confirm only the matching prefix is accepted.

## Validate JsonInput

1. Open `/src/components/json-input/json-input.html`.
2. Type invalid JSON — confirm a visible inline error appears without blocking further typing.
3. Fix the JSON — confirm the error clears.

## Validate RangeSlider

1. Open `/src/components/range-slider/range-slider.html`.
2. Drag (mouse) and Arrow-key (keyboard) each handle independently — confirm neither can cross the other's current position.

## Validate FloatLabel

1. Open `/src/components/float-label/float-label.html`.
2. Focus the field — confirm the label animates to a floated position above the field.
3. Blur while empty — confirm the label returns to its resting position; reload with a pre-filled value — confirm the label starts floated with no focus event needed.

## Validate Interactive Rating

1. Open `/src/components/rating/rating.html`, scroll to the new "Rate this product" section.
2. Click a star — confirm the value updates and every star up to it visually fills.
3. Focus the group and press Arrow Left/Right — confirm the value changes accordingly; confirm the pre-existing read-only rating demos above it are unchanged.

## Full regression

`npx playwright test` — confirm zero regressions against the pre-existing 115-component catalog and all 119 themes, per `tests/e2e/advanced-form-inputs.spec.ts`'s own dedicated suite passing across all 6 browser/viewport projects first.
