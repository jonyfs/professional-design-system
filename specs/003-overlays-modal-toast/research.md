# Phase 0 Research: Overlays — Modal, Slide-over, Toast

## Decision: Native `<dialog>` + `showModal()` for Modal and Slide-over, not a hand-rolled focus-trap script

**Rationale**: The spec's own Assumptions section deliberately left this
undecided rather than guessing, per this project's "verify, don't assume"
precedent (features 001/002 both shipped defects from unverified
assumptions caught only by later `/speckit-analyze` passes or code review —
this decision is exactly the kind of thing to get right before writing a
single line of component markup).

The HTML `<dialog>` element, opened via its `.showModal()` method,
**per the HTML Living Standard's dialog-focusing steps and top-layer/
modal-dialog algorithm**, is specified to provide:

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

These are cross-engine-aligned behaviors as of a few years ago (Chrome,
Firefox, and Safari 15.4+ all shipped conforming implementations), not
decades-old, universally battle-tested platform features — engine-specific
edge cases (dynamically-mutated content, unusual focus-order DOM
structures) are plausible in principle. This project does not take the
spec's guarantee on faith: the plan's Testing section runs real
Chrome/Firefox/Safari Playwright keyboard-navigation assertions against
the actual shipped markup, so any engine-specific gap would surface as a
failing test, not a silent assumption.

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
- **A third-party focus-trap library** (e.g. `focus-trap`) — rejected via
  Principle III's "resolved... before being considered an exception" spirit
  (Complexity Tracking exists precisely to catch an unjustified dependency
  when the platform already solves the problem) — **not** Principle VII,
  which governs the AI agent adopting external *skills*/marketplace plugins
  for itself, not vetting runtime npm dependencies for the shipped product;
  an earlier draft of this document conflated the two. No new dependency
  needed here at all.
- **CSS-only checkbox-hack modals** (a hidden checkbox + `:checked` sibling
  selectors toggling visibility) — rejected outright: cannot trap focus,
  cannot restore focus to the trigger, and cannot make the backdrop
  properly inert to assistive technology — fails Principle II's NON-
  NEGOTIABLE requirement structurally, not just imperfectly.

## Decision: extend `audit-tokens.mjs`/`check-contrast.mjs` to also scan `tailwind.css`, fixed now rather than deferred

**Rationale**: `/speckit-analyze` found that both scripts only ever parsed
`.html` files' `class="..."` attributes — never `tailwind.css`'s `@apply`
rules. Since this feature's contracts push new colors (the close-icon
correction) into a shared `close-icon-btn` `@apply` class rather than
literal HTML utilities, that color would have shipped with zero tooling
verification, contradicting this project's repeated "verified by tooling,
not just documented" standard (feature 002's `RING_PAIRINGS` precedent).

**Decision**: fix the scripts immediately (both now also extract and scan
every `@apply ...;` block in `tailwind.css`), rather than opening a
`tasks.md` polish item to fix it later. Running the extended scripts
against the *existing* `tailwind.css` (before writing a single line of this
feature's own component code) immediately surfaced two real, previously-
unverified gaps that predate this feature and have shipped since feature
001:

1. `hover:shadow-md` in `.btn-primary` — `audit-tokens.mjs`'s
   `NON_COLOR_SUFFIXES` set had every shadow-size keyword except `md`
   (an easy miss: the font-size scale it was copied from has no `md` step,
   but the shadow scale does), so this class was silently treated as an
   unrecognized color token whenever the script actually looked at it — it
   just never had looked, until now. Fixed by adding `"md"` to the set.
2. `text-brand-dark` in `.back-link`/`.demo-link` — never had a `PAIRINGS`
   entry in `check-contrast.mjs`. Computed: **7.90:1** against white,
   comfortably clearing the 7:1 AAA threshold — a real verification gap,
   not a contrast defect. Added the missing entry.

Both fixes are committed as part of this feature's Phase 0, verified via
`npm run audit:tokens && npm run audit:contrast` passing clean, before any
Modal/Slide-over/Toast markup exists. This retroactively closes the
enforcement gap for the close-icon-btn color correction (and every future
`@layer components` class) rather than leaving it as a documented,
unenforced exception.

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

**Correction (caught before finalizing this decision, and a factual error
corrected again by `/speckit-analyze`)**: the first draft of this decision
used an inline `onclick="..."` attribute for the dismiss button, then
justified removing it by citing "this project's own CSP guidance
(`rules/web/security.md`)". That citation was wrong: `rules/web/security.md`
is the assistant's own global instructions, not a file in this repository,
and — verified directly — **this static-site project ships no
Content-Security-Policy at all**: no `<meta http-equiv="Content-Security-
Policy">`, no hosting-config headers, nothing in the constitution about CSP.
There was no actual policy to contradict.

The externalized-script decision itself is still correct on its own
merits (no inline handler needed, more testable, keeps event wiring in one
auditable place) — it just isn't enforcing an existing policy, because none
existed. Since this feature ships the project's **first** `<script>` tags,
it is the natural point to add a real, minimal CSP rather than continue to
have none: `default-src 'self'; script-src 'self'; style-src 'self';
object-src 'none'; base-uri 'self';` via a `<meta http-equiv=
"Content-Security-Policy">` tag added to every page's `<head>` (verified
no inline `style="..."` attributes exist anywhere in the project, so
`style-src 'self'` needs no `'unsafe-inline'` exception). Tracked as an
explicit task in `tasks.md`'s Polish phase, applied project-wide (all ten
HTML pages), not just the three new ones — a security improvement this
feature triggers, not scope creep limited to Modal/Slide-over/Toast alone.
Corrected to a small, separate `src/scripts/toast.js` using
`addEventListener` (same externalized-script pattern as `overlay.js`, kept
in its own file to avoid implying Toast shares Modal/Slide-over's
dialog-specific mechanism, which it deliberately does not).

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
