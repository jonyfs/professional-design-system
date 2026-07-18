# Research: Overlays

## R1: Drawer excluded — verified identical to Slide-over, not assumed

**Decision**: No standalone "Drawer" component ships. Reading
`src/styles/tailwind.css`'s real `.slide-over-dialog` class directly
(`fixed inset-y-0 right-0 h-full w-full max-w-md`) confirms Slide-over
already IS a right-anchored drawer — a generic "Drawer" with no
further qualification is the same component under a different name.

**Rationale**: Matches this catalog's established de-duplication
discipline (Notification vs. Toast in feature 029, NativeSelect vs.
Select flagged in feature 018's own inventory notes).

## R2: Affix is genuinely new infrastructure, not a retrofit of Back-to-Top

**Decision**: Affix is a general-purpose scroll-threshold pinning
primitive — wraps an arbitrary element, switches it to `position:
fixed` once scrolled past its natural document position, and inserts
a same-size placeholder to prevent a layout jump when pinning engages.
Feature 031's Back-to-Top Button keeps its own minimal, already-
shipped, already-tested inline threshold logic unchanged (spec.md
Assumptions) — this feature does not retrofit it to consume Affix.

**Rationale**: Back-to-Top's logic is a one-off (show/hide a fixed
button past a fixed threshold, no placeholder/layout-shift concern
since the button was never in document flow to begin with). Affix
solves a different, harder problem (pinning an in-flow element
without it jumping the content below it) — conflating the two would
either under-power Affix or over-engineer Back-to-Top for no reason.

## R3: LoadingOverlay reuses Spinner verbatim, adds container-scoped positioning + a11y state

**Decision**: The overlay itself is a new `.loading-overlay` class
(`absolute inset-0` positioned against a `.loading-overlay-container`
ancestor that gets `position: relative` from a paired class) — the
Spinner inside it is the exact existing `.spinner`/`.spinner-lg`
markup, unchanged. The overlay sets `aria-busy="true"` on its
container and the overlay panel itself carries `role="status"` with
an `aria-live="polite"` visually-hidden "Loading" label — the visual
blocking comes for free from DOM stacking (an opaque/semi-opaque
element positioned on top of the container's content natively
intercepts pointer events without needing `pointer-events` tricks),
but the ACCESSIBLE non-interactive state needs the explicit
`aria-busy` (research.md finding: a sighted user sees the block
immediately from the overlay's presence, but a screen reader user
navigating by DOM order would otherwise still land on the underlying
content's interactive elements — `aria-busy="true"` on the container,
verified against WAI-ARIA's busy state semantics, is the correct
signal here, not a new invention).

## R4: Bottom Sheet reuses Slide-over's exact `<dialog>` mechanism, different anchor geometry

**Decision**: Same native `<dialog>` + `overlay.js`'s
`initDialogTriggers()`/`wireDialogClose()` (research.md, feature 003)
— zero new JS. Only new CSS: `.bottom-sheet-dialog` (`fixed inset-x-0
bottom-0 w-full max-h-[80vh]`, vs. Slide-over's `inset-y-0 right-0
h-full w-full max-w-md`) and `.bottom-sheet-panel` (adds
`overflow-y-auto` for the edge case where content exceeds the max
height, absent from Slide-over's own panel since Slide-over's
full-height panel doesn't have the same internal-scroll need by
default).

**Rationale**: Verified directly against `slide-over.html`/
`tailwind.css` — the ONLY difference needed is anchor edge + max-height
vs. full-height, confirming this is a geometry variant, not a new
interaction mechanism (the same reasoning Slide-over itself used
against Modal in feature 003).

## Summary

Affix and LoadingOverlay are the 2 genuinely new mechanisms in this
batch (scroll-threshold pinning, container-scoped blocking overlay);
Bottom Sheet is a pure CSS geometry variant of Slide-over. Zero new
design tokens, zero new dependencies.
