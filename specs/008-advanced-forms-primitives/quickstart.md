# Quickstart: Advanced Forms Primitives

## Prerequisites

Same as every prior feature — no new dependencies.

```bash
npm install
npx playwright install --with-deps
```

## Run the component gallery

```bash
npm run dev
```

Both demo pages load `src/scripts/combobox.js` /
`src/scripts/command-palette.js` respectively — this project's 3rd and
4th JS modules, after `overlay.js`/`toast.js` (003) and `tabs.js`/
`dropdown-menu.js` (005).

## Validate token discipline and AAA/non-text contrast (Principle IV / II gates)

```bash
npm run audit:tokens
npm run audit:contrast
```

**Expected outcome**: `audit:tokens` passes with zero new tokens (every
color used is already ratified — research.md R4). `audit:contrast`
requires two new `PAIRINGS` entries recording this feature's own usage of
`text-neutral-900`-on-white and `text-neutral-600`-on-white — add these
as part of implementation, per this project's established discipline of
registering every text/background usage.

## Run the full test suite

```bash
npm run build
npm run test:e2e
```

**Expected outcome**: all specs pass, including the two new ones
(`combobox.spec.ts`, `command-palette.spec.ts`). `npm run build` MUST
produce both new pages in `dist/src/components/` — confirm via `ls`.

## Generating new visual regression baselines

Same process as every prior feature — **never locally, never via local
Docker**:

```bash
gh workflow run update-snapshots.yml
gh run list --workflow=update-snapshots.yml --limit 1
gh run download <run-id> -n updated-snapshots -D /tmp/updated-snapshots
# copy the new *-linux.png files into tests/e2e/<component>.spec.ts-snapshots/
```

## Manual validation scenarios (traceable to spec.md)

1. **Combobox filter-as-you-type** (User Story 1, AC1): type a partial
   country name — the listbox narrows to matches, each highlighting the
   matched substring.
2. **Combobox keyboard navigation** (AC2): ArrowDown/ArrowUp move
   `aria-activedescendant` among filtered options, wrapping at both ends.
3. **Combobox commit** (AC3): Enter on a highlighted option fills the
   input and closes the listbox.
4. **Combobox cancel** (AC4): Escape closes the listbox without changing
   the input's value.
5. **Combobox no-results** (AC5): a non-matching query shows the "No
   results" state rather than an empty/absent popup.
6. **Command Palette global shortcut** (User Story 2, AC1): press Cmd/
   Ctrl+K from an unrelated focus state anywhere on the page — the dialog
   opens with its search input immediately focused.
7. **Command Palette filter** (AC2): type a partial action name — the
   list narrows to matches.
8. **Command Palette execute** (AC3): Enter on a highlighted action fires
   a visible confirmation and closes the dialog.
9. **Command Palette cancel + focus return** (AC4): Escape closes the
   dialog and returns focus to the pre-open focus target, including on
   WebKit (`overlay.js`'s explicit refocus safeguard, not a native
   guarantee).
10. **Command Palette focus trap** (AC5): Tab repeatedly while open —
    focus never escapes the dialog.

## Discoverability check (SC-005)

Same manual, human-only timing check as every prior feature — not
automatable. Track as an outstanding manual QA item in `tasks.md`.

## Constitution amendment reminder

Neither Combobox nor Command Palette has a pre-existing ratified entry —
both are wholly new "Advanced Forms" catalog additions, unlike feature
007's Sidebar/Navbar corrections. Once implementation is verified stable,
run `/speckit-constitution` to add both to a new "Advanced Forms &
Interaction" (or equivalent) Component Catalog section (MINOR version
bump) — do not skip this step.
