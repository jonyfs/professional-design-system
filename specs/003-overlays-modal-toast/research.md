# Phase 0 Research: Overlays — Modal, Slide-over, Toast

## Decision: Native `<dialog>` + `showModal()` for Modal and Slide-over, not a hand-rolled focus-trap script

**Rationale**: The spec's own Assumptions section deliberately left this
undecided rather than guessing, per this project's "verify, don't assume"
precedent (features 001/002 both shipped defects from unverified
assumptions caught only by later `/speckit-analyze` passes or code review —
this decision is exactly the kind of thing to get right before writing a
single line of component markup).

The HTML `<dialog>` element, opened via its `.showModal()` method, provides
**natively, per the HTML Living Standard, in every target browser
(Chrome, Firefox, Safari 15.4+, Edge)**:

- **Focus trapping**: while a dialog is open via `showModal()`, Tab/
  Shift+Tab cannot move focus to anything outside the dialog — enforced by
  the browser itself, not by application script watching every keydown.
- **Focus return**: when `.close()` is called, focus is automatically
  restored to whatever element had focus immediately before `showModal()`
  was called (the "previously focused element" per spec) — again, native,
  not scripted.
- **Escape-to-close**: built in by default; no keydown listener needed.
- **Backdrop**: the `::backdrop` pseudo-element is created automatically
  and can be styled with plain CSS (`::backdrop { @apply ... }` via
  Tailwind's arbitrary-selector support), covering the rest of the page.
- **Background inertness**: while `showModal()` is active, the rest of the
  page is inert to both pointer and assistive-technology interaction
  (satisfies FR-007) — again native, not achieved via manual
  `aria-hidden`/`inert` attribute management on every sibling.

What `<dialog>` does **not** provide for free, and this feature must add
with a small script (`src/scripts/overlay.js`):

1. **Opening**: `showModal()` must be called from a script — a plain
   `<button>` referencing the dialog by ID has no purely-declarative way to
   open it in the target browser matrix (the newer HTML Invoker Commands
   API — `command="show-modal" commandfor="..."` — exists in the spec but
   was not yet reliably supported across all four target evergreen browsers
   at the time of this research, so it is not relied upon here; revisit in
   a future feature once support is universal).
2. **Backdrop-click-to-close**: not automatic — `showModal()` alone does
   not close the dialog when the user clicks outside its content. Requires
   one `click` listener checking `event.target === dialogElement` (a click
   on the dialog's own padding/backdrop area, not on its content, since
   clicks on descendant content never have the dialog itself as
   `event.target`).

Everything else — including the explicit close button — needs **no JS at
all**: a `<form method="dialog">` wrapping a `<button type="submit">`
closes the nearest ancestor `<dialog>` natively (a standard, well-known
HTML pattern), satisfying FR-005's "explicit close control" with zero
script.

**Alternatives considered**:

- **Hand-rolled focus-trap script** (enumerate focusable descendants,
  intercept Tab/Shift+Tab, manage `aria-hidden` on siblings manually) — the
  common pre-`<dialog>` approach, and still what many older component
  libraries use. Rejected: strictly more code, more edge cases (dynamically
  added/removed focusable elements, iframe content, shadow DOM), and more
  ways to get Principle II's NON-NEGOTIABLE requirement subtly wrong,
  compared to relying on browser-native, spec-mandated behavior already
  shipped and tested by every browser vendor.
- **A third-party focus-trap library** (e.g. `focus-trap`) — rejected per
  Principle VII's skill/dependency vetting spirit: adding a dependency for
  something the platform now provides natively is exactly the kind of
  unjustified complexity this project's Complexity Tracking process exists
  to catch. No new dependency needed here at all.
- **CSS-only checkbox-hack modals** (a hidden checkbox + `:checked` sibling
  selectors toggling visibility) — rejected outright: cannot trap focus,
  cannot restore focus to the trigger, and cannot make the backdrop
  properly inert to assistive technology — fails Principle II's NON-
  NEGOTIABLE requirement structurally, not just imperfectly.

## Decision: Slide-over reuses the same `<dialog>` mechanism as Modal

**Rationale**: FR-003 requires Slide-over to have "the same focus-trap and
dismissal behavior as Modal." Since that behavior is native to `<dialog>`
itself (not something Modal's markup adds on top), Slide-over gets it for
free by also being a `<dialog>` — the only difference is Tailwind classes
controlling position/animation (anchored to a screen edge, sliding in)
instead of centered. No second focus-trap mechanism, no code duplication
beyond CSS.

## Decision: Toast does NOT use `<dialog>` — it is explicitly non-modal

**Rationale**: FR-002 requires Toast to announce itself without moving
keyboard focus or blocking background interaction — the opposite of what
`<dialog>`/`showModal()` is for. Toast is a plain positioned `<div
role="status" aria-live="polite">`, dismissible via a plain `<button>` —
this is NOT the same kind of complexity `<dialog>` solves, it is a trivial
DOM removal with no focus semantics to get right, so it does not need
`overlay.js`'s dialog-specific wiring at all.

**Correction (caught before finalizing this decision)**: the first draft
of this decision used an inline `onclick="..."` attribute for the dismiss
button. That directly contradicts this project's own CSP guidance
(`rules/web/security.md`: nonce-based CSP, `script-src` without
`'unsafe-inline'`) — an inline event-handler attribute requires
`unsafe-inline` (or per-attribute nonces, which HTML doesn't support for
`on*` attributes) to execute under such a policy. Corrected to a small,
separate `src/scripts/toast.js` using `addEventListener` (same
externalized-script pattern as `overlay.js`, kept in its own file to avoid
implying Toast shares Modal/Slide-over's dialog-specific mechanism, which
it deliberately does not).

**Alternatives considered**: `<dialog>` without `showModal()` (i.e., the
non-modal `.show()` method) — considered, since it does avoid focus
trapping; rejected because `.show()` still requires the same "open via
script" limitation as `showModal()` with none of the native backdrop/
inertness benefit that justifies `<dialog>` for Modal/Slide-over, so it
buys nothing over a plain `<div>` for this specific, simpler use case.

## Decision: close-button icon color corrected from `text-neutral-400` to `text-neutral-500`/`text-neutral-600`

**Rationale**: The ratified Component Catalog's Overlays pattern for
Toasts/modals specifies an "explicit close button... (`text-neutral-400
hover:text-neutral-500`)". Checked before reuse, per this feature's own
"verify, don't assume" mandate (and the precedent of features 001/002
both finding real, previously-undiscovered contrast gaps in the ratified
catalog before implementation): `text-neutral-400` (#9CA3AF) measures
**2.54:1** against a white page — below even the 3:1 WCAG 1.4.11 non-text
threshold for an icon button understood as a "graphical object required to
understand content" (a close affordance), let alone the 7:1 AAA text
threshold if treated as text.

**Decision**: use `text-neutral-500` (4.83:1, clears 3:1) as the resting
close-icon color and `text-neutral-600` (7.56:1) on hover, instead of the
ratified pattern's `text-neutral-400`/`text-neutral-500`. Both are
already-ratified tokens — no new token, no constitution amendment beyond
correcting this one catalog line (same PATCH-level correction pattern as
feature 002's Toggle-track-ring fix in v1.3.4).

**Alternatives considered**: Keeping `text-neutral-400` and adding a
background/ring to compensate — rejected as unnecessary complexity when a
simple token swap within the already-ratified neutral scale fully resolves
the gap.

## Resolved unknowns

Both Assumptions-section open questions (focus-trap mechanism for Modal/
Slide-over; whether Toast needs a script) are resolved above. No
`NEEDS CLARIFICATION` remains for Phase 1.
