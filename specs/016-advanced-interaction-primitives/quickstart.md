# Quickstart: Advanced Interaction Primitives

## Prerequisites

- Existing scaffold only — no new dependencies to install.

## Run the dev gallery

```bash
npm run dev
```

Open `http://localhost:5173` and confirm all four new components appear in
the gallery.

## Validate each component

### P1 — TreeView

1. `tree-view.html`: confirm at least 3 levels of nesting render; confirm
   a leaf node shows no disclosure triangle; collapse the top-level
   branch, re-expand it, and confirm a nested branch's own
   expanded/collapsed state was preserved throughout.

### P2 — Rating

1. `rating.html`: confirm the real numeric value ("4.2 out of 5") renders
   as visible text; confirm star icons are `aria-hidden` via the
   browser's accessibility tree inspector.

### P3 — Menubar

1. `menubar.html`: Tab to the "File" trigger; press Right arrow twice —
   confirm focus lands on "View" with no panel opened; press Enter —
   confirm the "View" panel opens and focus moves to its first item;
   press Escape — confirm the panel closes and focus returns to "View";
   press Left arrow while a panel is open — confirm the previous
   trigger's panel opens in its place (at most one panel open at a time).

### P4 — ColorInput

1. `color-input.html`: Tab to the input — confirm a visible focus ring;
   press Enter/Space (or click) — confirm the native OS color picker
   opens; confirm the input's `value` updates after a selection.

## Automated validation

```bash
npm run audit:tokens      # confirm no raw palette classes introduced
npm run audit:contrast    # confirm every new color pairing clears its WCAG floor
npx playwright test       # full visual regression + axe-core suite
```

## Expected outcomes

- All four components render with zero axe-core violations.
- TreeView's expand/collapse state is verified via real keyboard
  interaction, not assumed from native `<details>` behavior alone.
- Menubar's roving-tabindex and at-most-one-panel-open invariant are
  verified via real keyboard simulation across Left/Right/Down/Enter/
  Escape.
- Visual regression baselines exist at 320/768/1024/1440px for every new
  component, generated via `update-snapshots.yml` on `ubuntu-latest`
  (never locally), matching every prior feature's established process —
  re-check `gh run list` before assuming the GitHub Actions billing block
  from features 014/015 has cleared.
- No component's markup contains an inline `style="..."` attribute
  (confirmed via a CSP-violation console sweep, matching feature 015's
  T065 precedent).
