# Quickstart: React Port — Navigation & Disclosure Primitives

## Prerequisites

Same as feature 004 — no new dependencies.

```bash
npm install
npx playwright install --with-deps
```

## Run the React test harness

```bash
npm run dev --workspace tests/react-harness
```

Four new demo pages: `breadcrumbs.html`, `accordion.html`, `tabs.html`,
`dropdown-menu.html`.

## Validate token discipline and AAA/non-text contrast (Principle IV / II gates)

```bash
npm run audit:tokens
npm run audit:contrast
```

**Expected outcome**: both pass with zero new tokens — every class ported
into `packages/react/src/styles.css` is byte-identical to an
already-ratified static class (research.md R4).

## Run the full test suite

```bash
npm run build --workspace packages/react
npm run test:e2e
```

**Expected outcome**: all specs pass, including the four new ones
(`react-breadcrumbs.spec.ts`, `react-accordion.spec.ts`,
`react-tabs.spec.ts`, `react-dropdown-menu.spec.ts`), each asserting
pixel parity against its static reference's own approved baseline plus
every keyboard-acceptance-scenario ported from feature 005's static
specs (SC-004).

## Generating new visual regression baselines

Same process as every prior feature — **never locally, never via local
Docker**:

```bash
gh workflow run update-snapshots.yml
gh run list --workflow=update-snapshots.yml --limit 1
gh run download <run-id> -n updated-snapshots -D /tmp/updated-snapshots
# copy the new *-linux.png files into tests/e2e/react-<component>.spec.ts-snapshots/
```

## Manual validation scenarios (traceable to spec.md)

1. **Breadcrumbs parity** (User Story 1, AC1): render a 3-ancestor trail
   — pixel-identical to the static reference.
2. **Accordion exclusivity** (User Story 2, AC1-AC2): render an
   `exclusive` group of 3 — opening one closes any other open item;
   render a non-exclusive group — multiple stay open.
3. **Tabs default state + keyboard nav** (User Story 3, AC1-AC4): one tab
   selected on mount; Left/Right/Home/End move selection correctly,
   skipping a disabled tab; only the selected tab is a Tab stop.
4. **Dropdown Menu open/keyboard/close** (User Story 4, AC1-AC3): trigger
   opens the panel with focus on the first item; arrow keys move among
   items skipping a disabled one; Escape/Tab closes with focus returned
   to the trigger.

## Discoverability check (SC-003)

Same manual, human-only timing check pattern as every prior feature's
SC-005 equivalent — not automatable. Track as an outstanding manual QA
item in `tasks.md`.

## Constitution amendment reminder

This feature introduces no new Component Catalog entry (it is a pure
platform port, FR-008) — no `/speckit-constitution` catalog section is
needed. Once implementation is verified stable, still confirm the
constitution's existing Navigation & Disclosure section requires no
edits (it documents the *behavior*, which is unchanged) before
considering this feature closed.
