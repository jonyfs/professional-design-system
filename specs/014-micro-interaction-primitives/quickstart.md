# Quickstart: Micro-Interaction & Utility Primitives

## Prerequisites

- Existing scaffold only — no new dependencies to install.
- `npm install` (if not already done for this repo).

## Run the dev gallery

```bash
npm run dev
```

Open `http://localhost:5173` and confirm all ten new components appear in
the gallery, each linking to its own demo page
(`src/components/<name>/<name>.html`).

## Validate each component

### P1 — Textarea, Divider, Kbd, Skeleton

1. Open `textarea.html`: confirm the field grows vertically only when
   dragged from its resize handle, never horizontally.
2. Open `divider.html`: confirm both horizontal (`<hr>`) and vertical
   (`role="separator"` div) variants render correctly inside a flex row.
3. Open `kbd.html`: confirm the `⌘K` example renders in a monospace face,
   visually distinct from surrounding body text.
4. Open `skeleton.html`: confirm all four presets (text/avatar-sm/avatar-lg/card)
   pulse gently; toggle OS-level "reduce motion" and confirm the pulse
   stops but the placeholder remains visible.

### P2 — Tooltip, Progress, Button Group, Empty State

1. Open `tooltip.html`: hover an icon-only trigger — label appears after a
   short delay. Tab to the same trigger via keyboard — identical label
   appears with no mouse involvement.
2. Open `progress.html`: confirm the fill visually represents the given
   percentage and run `scripts/check-contrast.mjs` to confirm the fill/track
   pairing clears 3:1.
3. Open `button-group.html`: click each segment — confirm only one is ever
   active; use arrow keys while focused inside the group — confirm the
   active segment changes without any JavaScript console errors.
4. Open `empty-state.html`: confirm the composition (icon + heading +
   description + action) reads clearly with no data present.

### P3 — Popover

1. Open `popover.html`: click the trigger — a panel of free-form content
   appears. Click outside it — it closes. Reopen it, press Escape — it
   closes.
2. Resize the browser so the trigger sits near the right edge — confirm the
   panel repositions to stay fully on-screen.

### P4 — Context Menu

1. Open `context-menu.html`: right-click the designated element — confirm
   the browser's native context menu does NOT appear, and this component's
   menu appears at the cursor.
2. Right-click near the viewport's right/bottom edge — confirm the menu
   flips inward rather than rendering off-screen.
3. With the menu open, press arrow keys — confirm focus moves between menu
   items the same way it does in the existing Dropdown Menu demo.

## Automated validation

```bash
npm run audit:tokens      # confirm no raw palette classes introduced
npm run audit:contrast    # confirm every new color pairing clears its WCAG floor
npx playwright test       # full visual regression + axe-core suite
```

## Expected outcomes

- All ten components render with zero axe-core violations.
- `scripts/check-contrast.mjs` confirms Progress's fill/track pairing at
  6.38:1 (R1) and Button Group's active-segment text at 7.90:1 (R2).
- Visual regression baselines exist at 320/768/1024/1440px for every new
  component, generated via `update-snapshots.yml` on `ubuntu-latest` (never
  locally), matching every prior feature's established process.
- `npm run build` succeeds with the new `mono` font-family token (R3)
  correctly reflected in the compiled Tailwind output.
