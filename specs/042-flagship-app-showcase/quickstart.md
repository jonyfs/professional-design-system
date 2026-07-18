# Quickstart: Flagship App Showcase

## Prerequisites

- Repo installed (`npm install`); `packages/react` built at least once (`npm run build --workspace packages/react`).

## Validate locally

1. `cd showcase && npm install && npm run dev`
2. Open the printed local URL — confirm the dashboard renders: sidebar, navbar, metric cards, chart, data table, notifications panel.
3. Exercise real interactions: open the command palette (Cmd/Ctrl+K), open the user dropdown menu, sort/paginate the data table, dismiss a toast, toggle dark mode.
4. Confirm the theme switcher (if present) re-colors every element correctly.
5. Resize to 320px — confirm no horizontal overflow, sidebar collapses appropriately.

## Validate the homepage link

1. Open the main site's `index.html` — confirm the new "See it as a real app" link is present and navigates to the showcase.
2. From the showcase, confirm a link back to the homepage exists.

## Validate the deploy

1. `GITHUB_PAGES_BASE=/professional-design-system/showcase/ npm run build --prefix showcase` — confirm `showcase/dist/index.html`'s asset paths are correctly prefixed.
2. Confirm `chart.html`'s previously-broken `localhost:5174` link now points at a real, reachable path in the built output.

## Full regression

`npx playwright test tests/e2e/flagship-showcase.spec.ts` — then the full suite — confirm zero regressions to any other page or component.
