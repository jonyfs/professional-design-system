# Quickstart: Overlays

## Prerequisites

- Repo installed (`npm install`), dev server available via `npm run dev` (static site, port 5173) and `npm run dev --workspace=tests/react-harness` (React harness, port 5174).

## Validate Affix

1. Open `/src/components/affix/affix.html`.
2. Scroll past the wrapped element's natural position — confirm it pins (fixed) and the page doesn't jump (a placeholder fills its former space).
3. Scroll back above the threshold — confirm it returns to its natural position.

## Validate LoadingOverlay

1. Open `/src/components/loading-overlay/loading-overlay.html`.
2. Click "Toggle loading" — confirm a semi-opaque overlay with a centered Spinner covers the container, `aria-busy="true"` is set, and the container's own button underneath is not clickable.
3. Toggle again — confirm the overlay disappears and content is interactive again.

## Validate Bottom Sheet

1. Open `/src/components/bottom-sheet/bottom-sheet.html`.
2. Click the trigger — confirm the panel slides up from the bottom edge.
3. Confirm Escape, backdrop click, and the explicit close button all dismiss it, with focus returning to the trigger — identical to Slide-over's existing behavior.

## Full regression

`npx playwright test` — confirm zero regressions against the pre-existing catalog, per `tests/e2e/overlays.spec.ts`'s own dedicated suite passing across all 6 browser/viewport projects first.
