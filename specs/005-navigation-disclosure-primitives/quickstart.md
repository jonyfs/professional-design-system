# Quickstart: Navigation & Disclosure Primitives

## Prerequisites

Same as features 001-004 — no new dependencies. If you haven't already:

```bash
npm install
npx playwright install --with-deps
```

## Run the component gallery

```bash
npm run dev
```

Breadcrumbs and Accordion each get their own gallery card with zero
`<script>` tags. Tabs' demo page loads `src/scripts/tabs.js`; Dropdown
Menu's loads `src/scripts/dropdown-menu.js`.

## Validate token discipline and AAA/non-text contrast (Principle IV / II gates)

```bash
npm run audit:tokens
npm run audit:contrast
```

**Expected outcome**: both pass with zero script changes needed — unlike
feature 003 (which found and fixed real pre-existing gaps), research.md R3
verified upfront that all four components render entirely within the
already-ratified Base Semantic Palette. If either script fails during
implementation, treat it as a real finding requiring investigation, not
evidence the audit scripts need adjusting — the same discipline established
for every prior feature.

## Run the full test suite

```bash
npm run build
npm run test:e2e
```

**Expected outcome**: all specs pass, including the four new ones
(`breadcrumbs.spec.ts`, `accordion.spec.ts`, `tabs.spec.ts`,
`dropdown-menu.spec.ts`) alongside every existing spec from features
001-004 (the static gallery suite and the React harness suite — this
feature does not touch `packages/react/`, so the React suite's continued
pass confirms zero regression, not new coverage). New assertions to watch:
Tabs' roving-tabindex/arrow-key navigation, Dropdown Menu's Escape/outside-
click/item-selection dismissal (exercising the real native Popover API,
not a mock), and Accordion's native `<details>` toggle behavior including
the `exclusive`-variant's shared-`name` mutual exclusivity.

## Generating new visual regression baselines

Same process as every prior feature — **never locally, never via local
Docker**:

```bash
gh workflow run update-snapshots.yml
gh run list --workflow=update-snapshots.yml --limit 1
gh run download <run-id> -n updated-snapshots -D /tmp/updated-snapshots
# copy the new *-linux.png files into tests/e2e/<component>.spec.ts-snapshots/
```

Per research.md R4: `update-snapshots.yml` builds `packages/react` before
running (a feature-004 fix) — a no-op for this feature's own baselines
since it doesn't touch `packages/react/`, but confirm the workflow still
completes successfully end-to-end regardless.

## Manual validation scenarios (traceable to spec.md)

1. **Breadcrumbs navigation** (User Story 1, AC1-AC3): render a 3-level
   trail — every ancestor is a working link, the current page is plain
   text with `aria-current="page"`, and the trail lives in its own `<nav
   aria-label="Breadcrumb">` distinct from primary navigation.
2. **Accordion toggle** (User Story 2, AC1-AC2): click a collapsed item's
   summary — content expands and the chevron rotates; click again — it
   collapses and the chevron returns.
3. **Accordion independence** (AC3): open one Accordion item, then another
   — both remain open (unless viewing the `exclusive` variant, where
   opening the second closes the first natively via the shared `name`
   attribute).
4. **Accordion state announced** (AC4): with a screen reader running,
   navigate to a collapsed trigger — its collapsed state is announced;
   activate it — the expanded state is announced.
5. **Tabs default state** (User Story 3, AC1): load the Tabs demo page —
   exactly one tab is selected and only its panel is visible.
6. **Tabs click-to-switch** (AC2): click an unselected tab — it becomes
   selected, its panel becomes visible, the previous panel hides.
7. **Tabs arrow-key navigation** (AC3): focus a tab, press Right/Left
   repeatedly — focus and selection move between tabs, wrapping at the
   ends, with no intermediate Tab-key presses required.
8. **Tabs Home/End** (AC4): with a tab focused, press Home then End —
   focus jumps to the first, then last, tab.
9. **Dropdown Menu open + first-item focus** (User Story 4, AC1): click
   the trigger — the menu opens and focus lands on the first item.
10. **Dropdown Menu arrow-key navigation** (AC2): with the menu open,
    press Down/Up repeatedly — focus moves between items, wrapping at the
    ends, skipping the disabled "Archive" item.
11. **Dropdown Menu selection** (AC3): activate a menu item — its action
    fires, the menu closes, and focus returns to the trigger.
12. **Dropdown Menu Escape** (AC4): with the menu open, press Escape — it
    closes without firing any action, focus returns to the trigger.
13. **Dropdown Menu outside click** (AC5): with the menu open, click
    elsewhere on the page — it closes without firing any action.

## Discoverability check (SC-004)

Same manual, human-only timing check as every prior feature — not
automatable. Track as an outstanding manual QA item in `tasks.md`.

## Constitution amendment reminder

Unlike features 001-003 (which implemented against a pre-existing ratified
Component Catalog entry), Accordion, Tabs, and Dropdown Menu have no
catalog entry to build against — this feature's `data-model.md`/
`contracts/*.md` propose the patterns to build. Once implementation is
verified stable, run `/speckit-constitution` to ratify a new "Navigation &
Disclosure" Component Catalog section (MINOR version bump — new guidance
added, not a correction) reflecting what actually shipped, per the
sequence noted in `data-model.md`. Do not skip this — an unratified
pattern that ships and is never folded back into the constitution is
exactly the kind of catalog/reality drift `/speckit-analyze` has caught in
every prior feature.
