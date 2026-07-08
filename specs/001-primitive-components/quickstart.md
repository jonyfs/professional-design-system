# Quickstart: Design System Primitive Components

## Prerequisites

- Node.js 18+
- `npm install` run at repo root (installs Vite, Tailwind CSS, Playwright,
  `@axe-core/playwright`, `wcag-contrast`)
- `npx playwright install --with-deps` (one-time browser download for
  Chromium/Firefox/WebKit)

## Run the component gallery

```bash
npm run dev
```

Opens `index.html` via Vite's dev server. All four components (Button, Text
Input, Badge, Checkbox) are linked from the gallery page, each rendered in
every documented state (default/hover/active/focus-visible/disabled or
equivalent) side by side.

## Validate token discipline (Principle IV gate)

```bash
npm run audit:tokens
```

Runs `scripts/audit-tokens.mjs` against the built markup. **Expected
outcome**: exits 0 with no raw Tailwind palette classes found (SC-004).

## Validate AAA contrast (Principle II gate)

```bash
npm run audit:contrast
```

Runs `scripts/check-contrast.mjs` against every token pairing declared in the
contracts. **Expected outcome**: exits 0, every pairing ≥ 7:1 (normal text) or
≥ 4.5:1 (large text/UI components) per WCAG 2.2 AAA (SC-003).

## Run the full test suite

```bash
npm run build
npm run test:e2e
```

Runs Playwright visual regression (320/768/1024/1440px) and
`@axe-core/playwright` accessibility scans for all four components. **Expected
outcome**: all specs pass; first run generates baseline screenshots under
`tests/e2e/__screenshots__/` for future regression comparison.

## Manual validation scenarios (traceable to spec.md)

1. **Button keyboard focus** (User Story 1): Tab to the primary Button in the
   gallery — a visible brand-token focus ring appears, no browser default
   outline.
2. **Button disabled state** (User Story 1): The disabled Button example does
   not respond to click and shows `opacity-50`/`cursor-not-allowed`.
3. **Text Input error state** (User Story 2): The error-state Text Input
   example shows the inline error message below the field, with
   `aria-invalid="true"` and an error-colored ring.
4. **Badge variants** (User Story 3): All four Badge variants render side by
   side with their designated token combination — no raw palette class in any
   of them (inspect via DevTools or `npm run audit:tokens`).
5. **Checkbox keyboard toggle** (User Story 3): Tab to the Checkbox example,
   press Space — the checked state and visual brand-token check both update.
6. **Text Input default/focus** (User Story 2, AC1): The default-state Text
   Input example shows the brand-token focus ring (`focus:ring-brand`) on
   click/tab-in, with no error styling present.
7. **Edge Case — long label wrap**: The Button/Badge long-label examples in
   the gallery wrap or truncate without breaking layout or overlapping
   neighboring elements.
8. **Edge Case — placeholder + error together**: The Text Input error example
   that also has a placeholder keeps the error message visible and dominant
   for assistive technology (verified by the `aria-describedby` link, not just
   visually).
9. **Edge Case — disabled + checked Checkbox**: The disabled-and-checked
   Checkbox example visually combines both states (`disabled:opacity-50`
   layered on the checked mark) and does not respond to click or keyboard.

## Discoverability check (SC-001)

SC-001 ("a developer can locate, copy, and correctly use any of the four
primitive components in a new screen in under 2 minutes without consulting
anyone else") is a UX timing outcome, not something a script can assert.
Validate it manually: hand a teammate unfamiliar with this feature the
gallery `index.html` and time how long it takes them to copy a working Button
into a scratch page. This is tracked as an explicit manual QA task in
`tasks.md`, not part of the automated `npm run test:e2e` gate.
