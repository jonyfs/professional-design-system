# Phase 0 Research: Recharts-Based Chart Primitives

All items below were resolvable directly from spec.md's explicit Assumptions
and this project's existing conventions — no NEEDS CLARIFICATION markers
remain in plan.md's Technical Context.

## R1: Charting library version and rendering model

- **Decision**: `recharts@^3.x` (3.9.2 at implementation time — verified via
  `npm view recharts version peerDependencies`: MIT license, peer-compatible
  with React `^18.0.0` alongside 16/17/19, `engines.node >=18`, matching this
  monorepo's Node baseline), consumed as a `packages/react` dependency (not a
  peerDependency — chart consumers should not need to separately install
  Recharts themselves).
- **Rationale**: Recharts is explicitly named in spec.md's user input and
  Assumptions. It composes chart primitives as React components
  (`<LineChart><Line/></LineChart>`) rendering to inline SVG, with a
  `<ResponsiveContainer>` wrapper that observes its parent's dimensions via
  `ResizeObserver` — satisfying FR-011/SC-006 (responsive resize) without any
  custom resize-handling code this catalog would otherwise have to write.
- **Alternatives considered**: `visx` (lower-level primitives, would require
  building chart-type composition from scratch — reintroduces the
  "substantially new interaction pattern" cost this feature exists to avoid),
  `Chart.js`/`react-chartjs-2` (Canvas-based, harder to reach FR-009's
  non-visual-equivalent requirement since Canvas has no DOM structure for
  assistive tech to traverse, and per-element focus/tooltip via keyboard is
  more work than Recharts' native `Tooltip`/keyboard-accessible active-dot
  support), hand-rolled D3/SVG (explicitly the "substantially new interaction
  pattern" this catalog has deferred Chart for since feature 014).

## R2: Theme-token color integration

- **Decision**: a new `useChartColors()` hook in `packages/react/src/hooks/`
  reads the live values of this catalog's existing `--color-*` CSS custom
  properties (`--color-brand`, `--color-success`, `--color-neutral-700`, etc.
  — see `src/styles/themes.css`) via
  `getComputedStyle(document.documentElement).getPropertyValue(name)`,
  wraps each as `rgb(${value})` (the tokens are stored as space-separated RGB
  triplets, e.g. `"0 102 255"`, per feature 017's `shared/design-tokens.ts`
  convention), and returns an ordered palette array. The hook re-reads on
  every render triggered by a `data-theme` attribute change (observed via a
  `MutationObserver` on `document.documentElement`, mirroring feature 017's
  theme-switcher wiring) so a theme-preset change re-colors every mounted
  chart without an explicit re-render call from the consumer (FR-007/SC-002).
- **Rationale**: this is the only mechanism that lets Recharts' JS color
  props (`stroke`, `fill`) stay perfectly in sync with the exact same tokens
  every other component's Tailwind `className` resolves to — no second color
  source, no hardcoded literal (Constitution Principle III/IV, see plan.md
  Constitution Check).
- **Alternatives considered**: passing Tailwind class names into Recharts
  (impossible — Recharts' color props require literal CSS color strings, not
  classes, since it renders raw `<path fill="...">`/`<rect fill="...">` SVG
  nodes it fully owns); a build-time-generated static JS color map
  (would silently go stale the moment a new theme preset is added or an
  existing token's value changes, duplicating feature 017's token source
  instead of reading it live).

## R3: Chart color palette ordering (FR-008)

- **Decision**: an 8-color ordered sequence for data-series assignment:
  `brand`, `success`, `warning`, `error`, `info`, `brand-dark`,
  `success-strong`, `info-strong` — all already-ratified tokens, chosen for
  maximum adjacent-hue separation at each step. A chart with more series than
  8 cycles the sequence (FR-008's documented fallback), remaining
  distinguishable via the shared Tooltip/Legend (FR-016) even where two
  series share a color.
- **Rationale**: reuses only tokens already ratified in the Base Semantic
  Palette (Constitution Principle IV) — no new token is introduced by this
  feature. 8 covers the "up to at least 6" floor FR-008 requires with margin.
- **Alternatives considered**: a wider palette requiring new tokens (rejected
  — Constitution Principle IV requires justifying any new token, and 8
  existing tokens already clear FR-008's bar); an unordered/random assignment
  (rejected — deterministic ordering is required for legend-color consistency
  across re-renders of the same dataset).

## R4: Non-visual data equivalent (FR-009)

- **Decision**: every chart component renders a visually-hidden (`sr-only`
  equivalent — this project's existing pattern for screen-reader-only
  content) `<table>` alongside the SVG, built from the same dataset prop,
  with one row per data point and one column per series (plus the axis/
  category value). The SVG itself gets `role="img"` with an `aria-label`
  summarizing the chart's purpose, and `aria-describedby` pointing at the
  hidden table's id.
- **Rationale**: a real `<table>` is natively navigable by every screen
  reader with zero custom ARIA scripting, and is the same "text-based
  summary or equivalent data table" FR-009 asks for verbatim. Reuses this
  catalog's already-ratified data-table markup (`.data-table` classes from
  feature 012) rather than inventing new table markup.
- **Alternatives considered**: an `aria-live` summary string only (rejected —
  loses per-point/per-series granularity a full table preserves); Recharts'
  built-in `accessibilityLayer` prop alone (evaluated but insufficient by
  itself — it improves keyboard-focusable data points but does not produce a
  linked tabular equivalent, so this feature layers the hidden `<table>` on
  top of it rather than replacing it).

## R5: Reduced-motion handling (FR-013)

- **Decision**: every chart passes `isAnimationActive={!prefersReducedMotion}`
  to its Recharts child elements, where `prefersReducedMotion` comes from
  this catalog's existing `useReducedMotion`-equivalent check (a
  `window.matchMedia('(prefers-reduced-motion: reduce)')` read, consistent
  with this project's established reduced-motion convention referenced in
  the web coding-style rules).
- **Rationale**: Recharts' own `isAnimationActive` prop is the documented,
  built-in way to disable entrance/transition animation per element — no
  custom animation-interception code needed.
- **Alternatives considered**: CSS `prefers-reduced-motion` media query
  overriding Recharts' inline animation styles (rejected — Recharts drives
  animation via internal JS/requestAnimationFrame state, not CSS transitions,
  so a CSS override alone would not reliably stop it).

## R6: Radial ("gauge-style") chart implementation

- **Decision**: built on Recharts' `RadialBarChart`/`RadialBar` with a single
  data point representing the current value against a defined domain/range,
  plus a centered text label — not a from-scratch SVG arc.
- **Rationale**: `RadialBarChart` is Recharts' own documented primitive for
  exactly this "value within a range" shape, avoiding a hand-rolled arc-path
  calculation.
- **Alternatives considered**: a custom SVG `<circle>` with computed
  `stroke-dasharray` (rejected — reinvents what `RadialBarChart` already
  provides, adds maintenance surface for no benefit).

## R7: Shared Tooltip/Legend as chart-type-independent components (US3)

- **Decision**: `ChartTooltip` and `ChartLegend` are thin wrapper components
  around Recharts' own `<Tooltip content={...}>` / `<Legend content={...}>`
  custom-content injection points, styled with this catalog's existing
  Tailwind tokens (not Recharts' default inline styles), and passed
  identically into all 6 chart types.
- **Rationale**: Recharts explicitly supports custom `content` renderers for
  both, which is the documented extension point for exactly this
  "consistent across every chart type" requirement (FR-014/FR-015) — no
  chart type needs its own bespoke tooltip/legend implementation.
- **Alternatives considered**: each chart type styling Recharts' default
  Tooltip/Legend independently (rejected — directly contradicts US3's
  "identical regardless of which chart type" requirement and would drift
  over time, the same class of duplication this catalog's own
  `shared/design-tokens.ts` extraction (feature 004) was created to avoid).
