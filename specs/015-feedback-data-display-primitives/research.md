# Phase 0 Research: Feedback & Data Display Primitives

## R1. Slider fill/track contrast — identical to Progress's existing verification

**Decision**: Slider reuses `bg-brand-dark` (#004BB3) for the filled portion of
the track against `bg-neutral-200` (#E5E7EB) for the unfilled portion —
**the identical two colors** already verified in feature 014's Progress
research (R1) at 6.38:1, clearing WCAG 1.4.11's 3:1 non-text floor. Contrast
ratios are a pure function of the two colors involved, independent of which
component uses them (the same invariance already relied on for Button
Group's active-segment text in feature 014, R2) — re-confirmed the token
values are unchanged in `shared/design-tokens.ts` before citing the number,
not simply assumed to still apply.

## R2. Native range input styling — `accent-color`, not vendor-prefixed pseudo-elements

**Decision**: Confirmed via direct `CSS.supports()` check across all three
target engines that `accent-color` is universally supported:

```
chromium: accent-color: true, ::-webkit-slider-thumb: true, ::-moz-range-thumb: false
firefox:  accent-color: true, ::-webkit-slider-thumb: false, ::-moz-range-thumb: true
webkit:   accent-color: true, ::-webkit-slider-thumb: true, ::-moz-range-thumb: false
```

`::-webkit-slider-thumb`/`::-moz-range-thumb` are each only supported in
their respective engine family — styling the thumb by hand would require
BOTH vendor-prefixed rules maintained in parallel, doubling the CSS surface
for no benefit here. `accent-color: theme(colors.brand.dark)` is a single,
standard CSS property every target engine already implements, coloring both
the track fill and the thumb consistently with zero vendor-prefix branching.

**Alternatives considered**: Hand-rolled pseudo-element thumbs (rejected —
strictly more code for a result `accent-color` already achieves natively);
a fully custom non-native slider widget (rejected outright — native
`<input type="range">` already provides drag, click-track-to-jump, and
Left/Right/Up/Down/Home/End/PageUp/PageDown keyboard support for free,
matching this project's native-elements-first principle).

## R3. Indicator positioning — plain `relative`/`absolute`, no Anchor Positioning needed

**Decision**: Built a draft composition and confirmed empirically: an
Indicator overlays its own DIRECT parent element (e.g. a badge pinned to
the corner of a bell icon it's nested inside), never a separate top-layer
element promoted elsewhere in the render tree — unlike Tooltip's `position:
fixed` popup or Popover/Dropdown Menu/Context Menu's `popover="auto"`
panels. A plain `.relative` wrapper + `.absolute` positioned child
(the same technique already used for Tooltip's own wrapper, minus the
CSS Anchor Positioning layer Tooltip additionally needs for its fixed-
position escape) is sufficient and was confirmed to position correctly in
a real render, not merely assumed from the reasoning alone.

**Alternatives considered**: CSS Anchor Positioning (rejected — solves a
problem this component doesn't have; Indicator's overlay never leaves its
parent's containing block, so there's nothing to anchor across a stacking-
context boundary).

## R4. PinInput needs a new, small JS module

**Decision**: `src/scripts/pin-input.js` is a genuinely new module — no
existing script handles multi-box focus distribution, paste-splitting, or
Backspace-driven focus retreat. Reviewed `combobox.js` for stylistic
conventions (small named `init*()` export, `querySelectorAll` over a
`data-*` attribute, no external state store) to keep the new module
consistent with this project's existing JS idiom rather than inventing a
new one, but there is no functional logic to actually share — Combobox's
filtering/roving-active-descendant model addresses a different problem
than distributing discrete character input across separate DOM elements.

## R5. AspectRatio and DataList — new-CSS-need check

**Decision**: Built draft compositions for both, matching Empty State's
precedent (feature 014) of verifying before assuming:
- **AspectRatio**: `aspect-[16/9]`/`aspect-square`/`aspect-[4/3]` (Tailwind
  utilities backed by the standard `aspect-ratio` CSS property — confirmed
  supported in all three engines via the same `CSS.supports()` sweep as
  R2) plus `overflow-hidden` are sufficient with zero new class. The
  ratio itself is a per-instance CHOICE (16:9 vs 1:1 vs 4:3), not a fixed
  design-system value, so it's expressed as a plain utility class chosen
  per usage, exactly like `max-w-*`/`gap-*` are elsewhere in this catalog
  — not a token needing central ratification.
- **DataList**: semantic `<dl>`/`<dt>`/`<dd>` with the already-ratified
  `text-sm font-medium text-neutral-900` (label) / `text-sm text-neutral-600`
  (value) pairing (identical to existing label/description conventions
  used throughout Forms and Empty State) is sufficient — no new class.

**Alternatives considered**: A dedicated `.aspect-ratio`/`.data-list` wrapper
class for either — rejected once the draft confirmed existing utilities
cover both without duplication, avoiding class waste per Constitution
guidance.

## R6. File Input's drag-and-drop scope — static visual only, explicitly deferred

**Decision**: This feature ships a native `<input type="file">` styled to
match TextInput's ratified visual language, with a drop-zone-styled
wrapper (dashed border, centered icon/copy) that is VISUAL ONLY — native
click-to-browse works via the real `<input>` underneath, but dragging a
file onto the styled wrapper does not yet do anything beyond what the
browser does natively (which, without `dragover`/`drop` handling, is
nothing). Genuine drag-and-drop (intercepting `dragenter`/`dragover`/`drop`,
toggling a visual "drag active" state, and populating the input's file
list from the dropped `DataTransfer`) is a real, meaningfully larger JS
surface than the near-zero-JS scope the rest of this batch holds to —
explicitly deferred as a documented future enhancement, not silently
dropped.

**Alternatives considered**: Implementing full drag-and-drop now — rejected
for this batch's scope; the native input's click-to-browse path already
satisfies FR-007's actual requirement ("allowing file selection... fully
keyboard-operable"), and the visual drop-zone treatment sets up the
composition correctly for a future feature to wire in the real behavior
without a markup rewrite.

## R7. Stepper's active-step treatment — Pagination's pairing transfers, but the shape differs

**Decision**: `bg-brand-dark text-white` (7.90:1, the same invariant
pairing verified repeatedly since Sidebar/Pagination/Button Group) is
reused for the current step's numbered circle. Built a draft to confirm
the surrounding shape reads correctly: unlike Pagination's flat row of
equal-weight page links, Stepper's steps are connected by a visual line
between circles whose color must ALSO be decided — `neutral-200` for the
upcoming segment and `brand-dark` for the completed segment (both
already-ratified tokens, no new pairing to verify: the connector line is
decorative/non-text, and neutral-200 and brand-dark are both
already-verified against relevant backgrounds elsewhere in this catalog).
Completed (non-current, already-passed) steps use `bg-brand-dark
text-white` as well with a checkmark glyph instead of a number, matching
the current step's proven pairing rather than inventing a third state's
color treatment.

**Implementation note (I4, a round-3 `/speckit-analyze` finding)**: the
shipped contract (`contracts/stepper.contract.md`) implements the
connector as `background-color` on a `::after` pseudo-element
(`bg-neutral-200`/`bg-brand-dark`), not `border-color` on a `border-t-2`
rule as first described above — a background-color line was simpler to
size/position precisely between circles. This is cosmetic drift only; the
contrast figures (neutral-200/brand-dark, both already-verified) are
identical either way since contrast depends on the two colors, not on
which CSS property paints them.

**Connector-line contrast, computed not assumed**: `border-brand-dark`
(completed segment) measures 7.90:1 against white — clears WCAG 1.4.11's
3:1 floor easily (contrast is colors-only; a text-AAA-clearing pairing
necessarily clears the lower non-text bar too). `border-neutral-200`
(upcoming segment) measures only **1.24:1** against white — well below
3:1. This is NOT a new violation to fix: `check-contrast.mjs`'s own
`RING_PAIRINGS` comment already documents this exact class of
already-accepted exception — purely decorative low-contrast borders
(Card's `border-neutral-200`, Divider's `border-neutral-200`, List's
`divide-neutral-200`) are deliberately out of scope for the 1.4.11 check,
since WCAG 1.4.11 only applies to boundaries "required to identify" a
UI component's state — and a step's own numbered circle/checkmark and
color already communicate its status without the connector line's help.
The connector is ornamental, the same class as every other neutral-200
divider already shipped, not a new gap.

## R8. Testing strategy carry-forward

Same Playwright visual regression (320/768/1024/1440px) + axe-core pattern
as every prior feature. New keyboard-navigation assertions:
- **Slider**: arrow keys / Home / End change the value, asserted via the
  native `input`'s `value`/`aria-valuenow`, not assumed from native
  semantics alone.
- **PinInput**: typing a digit advances focus to the next box (asserted via
  `document.activeElement`); pasting a full code distributes it correctly
  across all boxes (asserted via each box's `.value` after a real clipboard
  paste simulation); Backspace on an empty box moves focus to the previous
  box.
- **File Input**: Tab reaches the control; native file-picker invocation on
  Enter/Space is a browser-native behavior not directly assertable in
  Playwright (opening a real OS file dialog is out of test scope,
  consistent with how this project has never attempted to test native
  OS-level pickers) — the assertion instead confirms the control is
  focusable and has the correct `accept`/`type` attributes.

New visual baselines generated via `update-snapshots.yml` `workflow_dispatch`
on `ubuntu-latest` only, matching this project's established rule.

**CSP discipline carried forward from feature 014's R12 finding**: this
project's CSP (`style-src 'self'`, no `unsafe-inline`) silently blocks
inline `style="..."` HTML attributes. No component in this feature uses
one — Slider's fill is native browser rendering (no custom width to set),
Indicator's overlay position is fixed via static classes (no per-instance
coordinate), and PinInput's per-box state is managed via `.value`/focus,
never `style=`. Verified via the same CSP-violation-sweep technique used
at the end of feature 014 (a Playwright console-listener checking for
"Content Security Policy" violation text) before considering any
component's implementation complete.

## R9. Indicator's white-on-status-color contrast — a real defect caught before shipping

**Decision**: The initial draft assumed Indicator could reuse Badge's
"existing severity tokens" directly for a solid-fill badge with white
text. Computed directly rather than trusting that assumption, and found
it was wrong: Badge's actual pattern is a 5%-opacity tint background +
`text-{status}-strong` — the *base* status colors (`bg-success`,
`bg-warning`, `bg-error`, `bg-info`, `bg-neutral-500`) were never
calibrated for solid-fill-plus-white-text use, and `text-white` against
them measures 2.54:1 / 2.15:1 / 3.76:1 / 3.68:1 / 4.83:1 respectively —
four of five fail even the lower AA 4.5:1 normal-text bar, let alone this
project's AAA 7:1. Fixed by using the `-strong` variants as the solid
background instead (already ratified, calibrated for exactly this kind of
text-bearing use in Badge/Alert): `text-white` against
`success-strong`/`warning-strong`/`error-strong`/`info-strong` measures
7.68:1 / 9.07:1 / 8.31:1 / 8.72:1, and `neutral-700` (replacing
`neutral-500`) measures 10.31:1 — all comfortably AAA. Added as new
`PAIRINGS` entries in `scripts/check-contrast.mjs` (5 entries, one per
Indicator variant).

**Why this matters beyond this one component**: this is exactly the kind
of "looks like it should transfer" assumption this project's own
discipline exists to catch — Badge and Indicator both use "status colors,"
but the actual shipped Badge pattern (tint + strong-text) is a different
color RELATIONSHIP than what Indicator needed (solid + white-text), and
assuming the same *token names* would produce the same *safe pairing*
without recomputing was the mistake. Re-verify the actual computed ratio
any time a new component reuses a "similar-sounding" existing token in a
structurally different way (solid fill vs. tint, large text vs. small,
etc.), not just when the token name matches.
