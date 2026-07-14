# Quickstart: Gallery Theme Selector

## Prerequisites
- `npm install` at repo root (no new dependency added by this feature).

## Setup
```bash
npm run build
npm run dev
```

## Validate: every theme is selectable from the gallery page (SC-001, SC-003)
1. Open `/` (`index.html`).
2. Confirm a "Preview theme" `<select>` is visible in the header without
   scrolling, grouped by mood family (`<optgroup>` labels match
   `shared/design-tokens.ts`'s `MOOD_FAMILIES`).
3. Select a non-default theme.
4. Confirm every component card's border/background/text colors update
   immediately, with no page reload (check the URL bar/network tab shows
   no navigation).

## Validate: persistence across reload/navigation (SC-002)
```bash
npx playwright test tests/e2e/gallery-theme-selector.spec.ts
```
Expected: selecting a theme, reloading `/`, and re-checking
`document.documentElement.dataset.theme` and the `<select>`'s value both
still match the selected theme, with no flash of the previous theme.

## Validate: agreement with the dedicated Theme Gallery page (SC-005)
1. On `/src/components/theme-gallery/theme-gallery.html`, select a theme
   via its card grid.
2. Navigate to `/`.
3. Confirm the new `<select>` already shows that same theme selected and
   every card is already restyled.
4. Reverse the order (select via `/`'s new control first, then visit the
   Theme Gallery page) and confirm the same agreement holds.

## Validate: accessibility and responsive behavior (SC-004)
```bash
npx playwright test tests/e2e/gallery-theme-selector.spec.ts --project=chromium-320
```
Expected: 0 axe-core violations, the control remains fully visible and
operable with no horizontal overflow at 320px, and is reachable/operable
via keyboard alone (Tab to focus, arrow keys / typeahead to select).

## Full success-criteria trace
See `spec.md`'s Success Criteria (SC-001–SC-005) and `data-model.md`'s
Cross-cutting invariant for the complete list this quickstart validates
against.
