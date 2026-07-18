# Research: Data Display Patterns

## R1: OverflowList uses ResizeObserver + a measure-then-render pass, reusing Badge's chip styling

**Decision**: A `ResizeObserver` on the container triggers a
recomputation: render all items invisibly (or measure via a hidden
clone), determine how many fit before the "+N more" chip's own width,
then render only that many plus the chip. Items reuse Badge's exact
chip styling (`.badge`-equivalent utility composition, this catalog's
existing convention per Badge's own markup) — no new visual language.

**Rationale**: This catalog has zero prior `ResizeObserver` usage —
genuinely new infrastructure, but the measurement technique (render
everything once off-screen/hidden to get natural widths, then decide
the cutoff) is a standard, well-established layout technique, not
inventing anything exotic.

## R2: RollingNumber reuses the `requestAnimationFrame` throttling pattern already established, applied to a value tween instead of a scroll listener

**Decision**: On value change, `requestAnimationFrame` steps the
*displayed* value from its current position toward the new target
over a fixed duration (e.g. 400ms), formatting via
`toLocaleString()`/`Intl.NumberFormat` for thousands separators — no
new dependency. A new animation request cancels any in-flight one
(`cancelAnimationFrame`) before starting, satisfying spec.md's Edge
Case (rapid successive value changes must not stack).

**Rationale**: This catalog already established the
rAF-throttle-a-callback pattern for scroll listeners (Scroll Progress
Bar, Affix, feature 031/032) — RollingNumber applies the identical
technique to animate a numeric tween instead of gating a scroll
handler, not a new category of technique.

## R3: PickList/Transfer composes two List instances + move buttons, reusing List's exact row markup

**Decision**: Two `.list` containers (source/destination) side by
side, each listing `.list-row-interactive`-style items (reusing List's
existing checkbox-free clickable-row convention) with a checkbox per
row for multi-select, and 4 move buttons between them (`>`, `>>`, `<`,
`<<`) reusing `.action-icon`. Keyboard operability: every row and move
button is a real, natively focusable/activatable element (checkbox +
button), not a custom keyboard-handling layer — the existing List
markup already provides this.

**Rationale**: Verified directly against `list.html`'s real
`.list`/`.list-row` classes — the dual-list structure is pure
composition of List instances, no new list-rendering mechanism.

## R4: Gallery reuses Modal's exact `<dialog>` focus-trap mechanism, adds only image-cycling state

**Decision**: A single full-screen `<dialog>` (new `.gallery-dialog`
class, `w-screen h-screen` instead of Modal's centered `max-w-lg`)
wired via the SAME `overlay.js` `initDialogTriggers()`/
`wireDialogClose()` this catalog already established (feature 003) —
zero new focus-trap/dismissal logic. The only new logic is a
current-index state cycling which image's `src` is shown, with
Previous/Next (`.action-icon`) disabled at the sequence's ends per
spec.md's Edge Case (a single-image gallery has both disabled).

**Rationale**: Matches this catalog's single-mechanism-per-behavior
discipline (Slide-over/Bottom Sheet/Session Timeout Modal/Onboarding
Tour all reuse an existing overlay mechanism rather than each
reimplementing focus-trapping).

## R5: Compare's divider is a native `<input type="range">`, styled invisibly, driving a CSS `clip-path`

**Decision**: An `<input type="range" min="0" max="100">` — this
catalog's exact existing `.slider` component (feature 002) — is
layered transparently over the image comparison area; its `value`
(read on `input` events) sets the "after" image layer's
`clip-path: inset(0 ${100 - value}% 0 0)` via CSSOM (this project's
CSP). A visible divider line/handle is a separate, purely decorative
element positioned at the same percentage, driven by the same value.

**Rationale**: Reusing a native range input gives full keyboard
operability (arrow keys, Home/End, Page Up/Down) for free — this
catalog's own `.slider` component already established this exact
input type and its accent-color styling; Compare doesn't need a
custom keyboard-handling layer, only a visual pairing with an image
clip effect. Clamping to 0-100% is native `<input type="range">`
behavior (spec.md Edge Case), not logic this feature needs to write.

## Summary

All 5 primitives compose already-established mechanisms — List (feature 011),
Modal's `<dialog>` (feature 003), the native `<input type="range">`
(feature 002/Slider), and the rAF-throttle pattern (features 031/032)
— with 2 genuinely new techniques introduced: `ResizeObserver`-driven
measurement (OverflowList) and rAF-driven value tweening
(RollingNumber). Zero new design tokens, zero new dependencies.
