# Quickstart: Layout & Structure Primitives

## Prerequisites

- Existing scaffold only — no new dependencies to install (this
  batch introduces zero new npm packages).

## Run the dev gallery

```bash
npm run dev
```

Open each new demo page directly, e.g.
`http://localhost:5173/src/components/stack/stack.html`.

## Validate User Story 1 (Stack, Group, Center)

1. Open `stack.html` — confirm items render with consistent
   `space-y-*` spacing, no hardcoded margins.
2. Open `group.html` — confirm a row of buttons wraps sensibly at
   320px and uses ratified `gap-*` spacing.
3. Open `center.html` — confirm content centers both axes within its
   container.

## Validate User Story 2 (Container, Paper)

1. Open `container.html` — confirm consistent max-width/padding
   across all 4 breakpoints (320/768/1024/1440).
2. Open `paper.html` — confirm it visually matches Card's border/
   radius/background, without Card's shadow or header/footer slots.

## Validate User Story 3 (Grid, SimpleGrid, Flex)

1. Open `grid.html` — resize through all 4 breakpoints, confirm
   column count steps 1 → 2 → configured count per research.md R3.
2. Open `simple-grid.html` — confirm identical responsive behavior
   with equal-width columns.
3. Open `flex.html` — confirm row/column arrangement via the
   `direction` prop.

## Validate User Story 4 (AppShell)

1. Open `app-shell.html` — confirm header (Navbar), sidebar
   (Sidebar), and main content regions render correctly at 1440px.
2. Resize to 768px and 320px — confirm the sidebar region stacks
   above main content (not hidden, not a drawer) per research.md R5's
   corrected scope.
3. Confirm Navbar's own native `<details>/<summary>` mobile menu
   still functions correctly inside AppShell — it is reused verbatim,
   not reimplemented.

## Automated validation

```bash
npm run audit:tokens      # confirm zero new/raw Tailwind classes
npm run audit:contrast    # confirm zero new contrast findings (no new colors introduced)
npx playwright test layout-structure-primitives   # visual + a11y across all 6 browser/viewport projects
```

## Expected outcomes

- All 9 primitives render correctly on both static HTML and React
  surfaces (SC-001).
- Zero new design tokens introduced (SC-002) — verified via
  `audit:tokens`, not assumed.
- AppShell's Navbar behavior and CSS-only sidebar reflow both work
  with zero duplicated logic (SC-004).
