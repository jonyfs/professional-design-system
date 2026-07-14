# Component Contract: Shared Chart Chrome — User Story 3 + Cross-Cutting

## Components
`useChartColors` (hook), `ChartTooltip`, `ChartLegend`, `ChartDataTable`,
`ChartEmptyState`.

## useChartColors()
- Returns `{ palette: string[]; colorForSlot(slot: number): string }`.
- `palette` is the 8-entry ordered array from research.md R3, each value a
  literal `rgb(r g b)` string read live via `getComputedStyle` from this
  catalog's `--color-*` custom properties (research.md R2) — never a
  hardcoded literal.
- Internally subscribes to a `MutationObserver` on
  `document.documentElement`'s `data-theme` attribute and triggers a
  re-render of all consuming charts on change (FR-007/SC-002).

## ChartTooltip
- Props: `active`, `payload`, `label` (Recharts' standard custom-`content`
  tooltip signature) — consumed identically by all 6 chart types via each
  chart's `<Tooltip content={<ChartTooltip />}>` (research.md R7).
- Markup: a small card (reuses this catalog's existing Card/Popover surface
  tokens — `bg-neutral-50`, `border-neutral-200`, `rounded-md`) listing each
  currently-visible series' `label` and exact value for the hovered/focused
  point (FR-014).
- Keyboard: reachable via Recharts' built-in keyboard-focusable active-dot
  behavior — no additional custom key handling required.

## ChartLegend
- Props: `payload` (Recharts' standard custom-`content` legend signature).
- Markup: one real `<button>` per `DataSeries` entry (Constitution Principle
  V — MUST declare `hover:`, `active:`, `focus-visible:outline
  focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-brand`, and `disabled:opacity-50
  disabled:cursor-not-allowed`), showing a color swatch (from
  `useChartColors().colorForSlot`) and the series `label`.
- Behavior: clicking/activating a button toggles that `DataSeries.visible`
  and re-renders the owning chart with that series filtered; the button's
  own visual state reflects hidden (dimmed, not removed) vs. shown (FR-015,
  spec.md US3 AC2).

## ChartDataTable
- Renders `.data-table`/`.data-table-header-cell`/`.data-table-cell`
  markup (feature 012's ratified classes) wrapped in an `sr-only` container,
  one header per visible `DataSeries.label` plus the axis/category column,
  one row per `data` entry (data-model.md ChartDataTable, research.md R4).
- `id` matches the owning chart's `aria-describedby` reference.

## ChartEmptyState
- Renders a centered message (reuses this catalog's existing empty-state
  text/icon convention) in place of the SVG/table pair whenever the owning
  chart's `data.length === 0` (FR-012) — no chart type renders a blank or
  broken area instead.

## Acceptance mapping
- Spec.md US3 AC1–AC2 → `ChartTooltip`/`ChartLegend` above.
- FR-009, FR-010, FR-012, FR-014, FR-015, FR-016 → this contract.
