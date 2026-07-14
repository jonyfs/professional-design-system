# Quickstart: Component Catalog Expansion (Batch 1)

## Prerequisites
- `npm install` (no new dependency added by this feature).

## Setup
```bash
npm run build --workspace packages/react
npm run build
npm run dev
```

## Validate: Form Inputs (US1, SC-001/SC-003)
1. Open each of NumberInput/PasswordInput/MultiSelect's static gallery
   page and the React harness's equivalent demos.
2. NumberInput: click increment/decrement, confirm clamping at
   min/max; type a value beyond a bound, blur, confirm it clamps.
3. PasswordInput: type a value, toggle visibility twice, confirm the
   value and cursor position survive both toggles.
4. MultiSelect: select several options, confirm chips render; remove a
   chip, confirm the underlying value updates immediately.

## Validate: Button Variants (US2, SC-001/SC-003)
```bash
npx playwright test tests/e2e/catalog-expansion-buttons.spec.ts tests/e2e/react-catalog-expansion-buttons.spec.ts
```
Expected: ActionIcon exposes an `aria-label` and takes visible focus;
CopyButton shows a "Copied" confirmation after a successful clipboard
write and a distinct failure state on a simulated rejection; Split
Button's primary segment fires its default action while the attached
dropdown segment opens the shared Dropdown Menu panel, fully keyboard-
operable.

## Validate: Data-Display Micro-Components (US3, SC-001/SC-003)
1. Avatar Group: render with more members than the configured limit,
   confirm a "+N" indicator appears; render with fewer, confirm it does
   not.
2. Highlight: confirm only the matching substring is wrapped, case-
   insensitively.
3. Code: confirm both inline and block variants use the same monospace
   token as Kbd.
4. ColorSwatch: confirm a visually-hidden text alternative is present
   in the DOM alongside the visual chip.

## Validate: Navigation & Disclosure Utilities (US4, SC-001/SC-003)
1. NavLink: confirm `aria-current="page"` and Sidebar's active styling
   apply only when `current` is true.
2. Collapse: open two independent instances, confirm neither affects
   the other (unlike Accordion).
3. Spoiler: render with content shorter than the clamp threshold,
   confirm no "Show more" control appears at all; render with longer
   content, confirm "Show more"/"Show less" toggle correctly.

## Validate: accessibility, tokens, and responsive behavior (SC-002, SC-004)
```bash
npx playwright test tests/e2e/catalog-expansion-inputs.spec.ts tests/e2e/catalog-expansion-buttons.spec.ts tests/e2e/catalog-expansion-data-display.spec.ts tests/e2e/catalog-expansion-nav-utility.spec.ts --project=chromium-320 --project=chromium-768 --project=chromium-1024 --project=chromium-1440 --project=firefox-1440 --project=webkit-1440
npm run audit:contrast
npm run audit:tokens
npm run typecheck
```
Expected: 0 axe-core violations across all 6 browser/viewport projects,
0 new contrast/token findings, clean typecheck.

## Full success-criteria trace
See `spec.md`'s Success Criteria (SC-001–SC-005) for the complete list
this quickstart validates against.
