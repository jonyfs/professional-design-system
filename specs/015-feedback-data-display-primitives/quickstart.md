# Quickstart: Feedback & Data Display Primitives

## Prerequisites

- Existing scaffold only — no new dependencies to install.

## Run the dev gallery

```bash
npm run dev
```

Open `http://localhost:5173` and confirm all ten new components appear in
the gallery.

## Validate each component

### P1 — Spinner, AspectRatio, Indicator, DataList

1. `spinner.html`: confirm the spinner rotates continuously; toggle OS
   "reduce motion" and confirm it stops but a static icon remains visible.
2. `aspect-ratio.html`: confirm embedded media renders at the declared
   ratio with no layout shift as the image loads.
3. `indicator.html`: confirm the count badge overlays the host icon
   correctly, and a count above 99 shows "99+".
4. `data-list.html`: confirm each label/value pair is a real `<dt>`/`<dd>`
   pair via the browser's accessibility tree inspector.

### P2 — Slider, Stepper, File Input

1. `slider.html`: drag the handle and use arrow keys/Home/End — confirm
   the value updates and matches the accessible value.
2. `stepper.html`: confirm the current step is visually distinct
   (`aria-current="step"`) from completed and upcoming steps.
3. `file-input.html`: click the drop zone — confirm the native file picker
   opens; select a file and confirm the filename displays.

### P3 — Timeline

1. `timeline.html`: confirm events render in chronological order with a
   visible connector between them.

### P4 — Stat/Metric Card, PinInput

1. `stat-card.html`: confirm the metric, label, and trend are all legible.
2. `pin-input.html`: type a digit in the first box — confirm focus
   advances. Paste a full code — confirm it distributes across all boxes.
   Press Backspace on an empty box — confirm focus moves to the previous
   box.

## Automated validation

```bash
npm run audit:tokens      # confirm no raw palette classes introduced
npm run audit:contrast    # confirm every new color pairing clears its WCAG floor
npx playwright test       # full visual regression + axe-core suite
```

## Expected outcomes

- All ten components render with zero axe-core violations.
- `scripts/check-contrast.mjs` confirms Slider's fill/track pairing at
  6.38:1 (R1) and Indicator's five solid-fill variants all clear AAA
  (R9: 7.68:1 / 9.07:1 / 8.31:1 / 8.72:1 / 10.31:1).
- Visual regression baselines exist at 320/768/1024/1440px for every new
  component, generated via `update-snapshots.yml` on `ubuntu-latest`
  (never locally), matching every prior feature's established process.
- No component's markup contains an inline `style="..."` attribute
  (confirmed via a CSP-violation console sweep, per research.md R8/R12).
