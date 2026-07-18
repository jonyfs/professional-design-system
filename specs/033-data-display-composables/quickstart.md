# Quickstart: Data Display Composables

## Prerequisites

- Repo installed (`npm install`), dev server available via `npm run dev` (static site, port 5173) and `npm run dev --workspace=tests/react-harness` (React harness, port 5174).

## Validate ThemeIcon

1. Open `/src/components/theme-icon/theme-icon.html`.
2. Confirm each semantic color renders a circled icon matching Badge's own color-token convention, at both `sm`/`lg` sizes.

## Validate Blockquote

1. Open `/src/components/blockquote/blockquote.html`.
2. Confirm the quoted text is visually distinguished (left border, italic) and the citation renders non-italic.

## Validate BackgroundImage

1. Open `/src/components/background-image/background-image.html`.
2. Confirm overlaid content is legible against the background image via the scrim.
3. Simulate an image load failure (block the image URL in DevTools) — confirm the neutral fallback background still shows, content remains legible.

## Validate Watermark

1. Open `/src/components/watermark/watermark.html`.
2. Confirm the watermark text tiles across the background at low opacity and the foreground content stays fully legible.

## Full regression

`npx playwright test` — confirm zero regressions against the pre-existing catalog, per `tests/e2e/data-display-composables.spec.ts`'s own dedicated suite passing across all 6 browser/viewport projects first.
