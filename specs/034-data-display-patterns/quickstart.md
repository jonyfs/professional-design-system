# Quickstart: Data Display Patterns

## Prerequisites

- Repo installed (`npm install`), dev server available via `npm run dev` (static site, port 5173) and `npm run dev --workspace=tests/react-harness` (React harness, port 5174).

## Validate OverflowList

1. Open `/src/components/overflow-list/overflow-list.html`.
2. Confirm a fixed-width container shows only the chips that fit plus an accurate "+N more" indicator.

## Validate RollingNumber

1. Open `/src/components/rolling-number/rolling-number.html`.
2. Click the increment button — confirm the number animates through intermediate values, not an instant jump.
3. Click rapidly multiple times — confirm no glitching/stacked animation.

## Validate PickList

1. Open `/src/components/pick-list/pick-list.html`.
2. Check an item, click the move-right control — confirm it moves panels. Repeat for move-left and move-all.
3. Confirm every control is keyboard-reachable and activatable (Tab + Space/Enter).

## Validate Gallery

1. Open `/src/components/gallery/gallery.html`.
2. Click a thumbnail — confirm it opens full-screen, focus-trapped.
3. Confirm Next/Previous cycle images and disable correctly at the ends; Escape/close dismiss it.

## Validate Compare

1. Open `/src/components/compare/compare.html`.
2. Drag the slider (mouse) and use arrow keys (keyboard) — confirm the before/after reveal proportion tracks the position, clamped to 0-100%.

## Full regression

`npx playwright test` — confirm zero regressions against the pre-existing catalog, per `tests/e2e/data-display-patterns.spec.ts`'s own dedicated suite passing across all 6 browser/viewport projects first.
