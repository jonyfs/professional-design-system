# Research: Feedback Primitives

## R1. De-duplication verification (already covered in spec.md, restated here for the plan record)

**Decision**: exclude "Notification" (feature 018 inventory item 47)
from this batch. Verified directly against `src/styles/tailwind.css`
(`.toast-stack { @apply fixed top-4 right-4 z-50 flex flex-col gap-3; }`)
and `src/scripts/toast.js` — a real, working stackable/dismissible
message mechanism already exists. Ship the 4 genuinely new items
instead: RingProgress, SemiCircleProgress, Notification Center,
Password Strength Meter.

## R2. CSSOM arc-value assignment (CSP compliance)

**Decision**: RingProgress/SemiCircleProgress set their SVG `<circle>`'s
`stroke-dashoffset` via direct CSSOM property assignment
(`element.style.strokeDashoffset = ...`) in a small script, mirroring
`src/scripts/progress.js`'s exact existing pattern for Progress's
fill width. **Verified, not assumed**: this project's CSP
(`style-src 'self'`, no `unsafe-inline`) blocks inline `style="..."`
HTML attributes — the same real, silent-failure class already found
and documented for Progress (feature 014) and Tooltip. Direct CSSOM
assignment is NOT subject to that restriction (confirmed by
`progress.js`'s own working implementation). No new pattern — pure
reuse of an already-proven approach.

## R3. RingProgress/SemiCircleProgress markup shape

**Decision**: an SVG with two concentric `<circle>` elements — a
track (neutral-200, full circle) and a fill (brand or semantic color,
`stroke-dasharray` set to the circle's circumference, `stroke-dashoffset`
driven by the value). `role="progressbar"` + `aria-valuenow/min/max`
on the wrapping element, exactly matching Progress's existing ARIA
pattern (`src/components/progress/progress.html`) — reusing an
established accessible pattern rather than inventing a new one.
SemiCircleProgress uses the identical mechanism with the SVG viewBox/
circle geometry constrained to a half-circle (transform: rotate,
overflow clip) rather than a separate implementation.

## R4. Notification Center composition

**Decision**: reuses Indicator's existing `.indicator-wrapper`/
`.indicator` classes for the unread-count badge on a bell icon
trigger, and Dropdown Menu's existing native Popover API pattern
(`popovertarget`/`popover="auto"`, `role="menu"` → here `role="region"`
with `aria-label`, since this is a content panel, not an action menu)
for the panel. Verified directly against `src/components/dropdown-menu/
dropdown-menu.html`'s real markup — zero new interaction/positioning
mechanism.

## R5. Password Strength Meter scoring

**Decision**: a simple, transparent heuristic for the demo (length +
character-class diversity: lowercase/uppercase/digit/symbol presence),
mapped to 4 levels (Empty/Weak/Fair/Strong) driving Progress's
existing `.progress-fill` width (0/33/66/100%) and color (neutral/
error/warning/success — all already-ratified semantic tokens). This
is a presentation-layer component demo, not a production password
policy — documented in spec.md Assumptions.

## R6. Contrast/token audit

**Decision**: zero new colors are introduced (R3's fill reuses brand/
semantic, R4 reuses Indicator's existing badge colors, R5 reuses
Progress's existing severity mapping) — no new `check-contrast.mjs`
pairings needed beyond what Progress/Indicator already verify.
Verified during implementation via a real audit run, not assumed.
