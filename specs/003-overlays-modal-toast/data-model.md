# Phase 1 Data Model: Overlays — Modal, Slide-over, Toast

This feature ships static UI markup plus a small behavior script. The
"entities" below are the structural/state models each component must
implement, extracted from the functional requirements in `spec.md`.

## Modal

| Field | Type | Values | Notes |
|---|---|---|---|
| `state` | enum | `closed`, `open` | Backed by the native `<dialog>` element's open/closed state — `showModal()`/`close()`, not a custom class toggle |
| `trigger` | element reference | any focusable element | The element focus returns to on close — handled automatically by `<dialog>`'s native "previously focused element" restoration |
| `title` | string | any | Rendered as the dialog's heading, referenced by `aria-labelledby` |
| `hasFocusableContent` | boolean | derived | If false (Edge Case), the dialog container itself MUST be focusable (`tabindex="-1"`) so focus has somewhere valid to land |

**Validation rules**: while `state === 'open'`, focus MUST NOT reach any
element outside the dialog (FR-001, native via `showModal()`). Escape,
backdrop click (`click` target === the `<dialog>` element itself), and the
explicit close button (native `<form method="dialog">` submit) all MUST
close it (FR-005).

## Slide-over

| Field | Type | Values | Notes |
|---|---|---|---|
| `state` | enum | `closed`, `open` | Identical model to Modal — same native `<dialog>` mechanism (FR-003, research.md) |
| `side` | enum | `right` (only value shipped this slice) | Determines slide-in edge/animation direction |
| `trigger` | element reference | any focusable element | Same native focus-return as Modal |

**Validation rules**: identical to Modal's (FR-003 explicitly requires "the
same focus-trap and dismissal behavior"). Shift+Tab from the first
focusable element MUST wrap to the last, not escape the panel (Edge Case) —
native `<dialog>` behavior, verified by test rather than assumed.

## Toast

| Field | Type | Values | Notes |
|---|---|---|---|
| `state` | enum | `visible`, `dismissed` | Does NOT participate in focus trapping — deliberately not a `<dialog>` (research.md) |
| `message` | string | any | The announced content |
| `variant` | enum | `success`, `error`, `info` (this slice ships one visual treatment per the constitution's ratified Toast pattern; variant coloring follows the same status tokens as Badge) | |

**Validation rules**: MUST be exposed via `role="status"` +
`aria-live="polite"` (FR-002) so assistive technology announces it without
moving focus. Dismissing MUST remove it from the accessibility tree
(`display:none`/DOM removal, not just visual hiding) — plain visibility
tricks that leave it in the accessibility tree would fail FR-002's intent.
Multiple simultaneous toasts MUST stack without overlapping (Edge Case) —
a layout concern (flex column stack in the toast container), not a new
data field.

## Cross-cutting invariants (all three components)

- Every color token referenced MUST exist in the constitution's Base
  Semantic Palette table — no new *color* tokens are introduced by this
  feature (verified in research.md's close-button-icon correction, which
  reuses existing neutral-scale tokens, not a new one).
- Every text/background pairing MUST pass WCAG 2.2 AAA contrast (FR-006,
  SC-003); the close-icon color correction (research.md) is the one gap
  found and fixed before implementation.
- No raw Tailwind palette class may appear in shipped markup (FR-004,
  SC-004) — enforced by the existing `scripts/audit-tokens.mjs`.
- `src/scripts/overlay.js` (Modal/Slide-over's `showModal()` + backdrop-
  click wiring) contains zero styling decisions — Principle III's
  Tailwind-only mandate governs CSS, not this behavior script.
- The `::backdrop` pseudo-element (native to `<dialog>`, created by
  `showModal()`) cannot be reached by a `class="..."` attribute in HTML —
  it isn't a real DOM node. Styled instead as a plain CSS rule inside
  `@layer components`, using Tailwind's `theme()` function to resolve the
  color token rather than hardcoding a hex value — using the constitution's
  own already-ratified Modals pattern's exact token/opacity
  (`bg-neutral-500/75`, `.specify/memory/constitution.md`'s Overlays,
  Modals & Feedback section), not a different, undocumented choice (an
  earlier draft of this line used `neutral-900/50%` with no rationale —
  `/speckit-analyze` caught the silent deviation from the ratified pattern
  before implementation; corrected here to match it exactly):
  ```css
  .modal-dialog::backdrop,
  .slide-over-dialog::backdrop {
    background-color: theme('colors.neutral.500 / 75%');
  }
  ```
  `theme()` is one of Principle III's explicitly named sanctioned
  mechanisms (alongside `@apply`/`@layer`), so this isn't a parallel
  styling system — it's the same ratified `neutral-500` token, just
  referenced from a context (`::backdrop`) that arbitrary-variant HTML
  utility classes can't cleanly target. `audit-tokens.mjs`/
  `check-contrast.mjs` now also scan `tailwind.css`'s `@apply` blocks
  (research.md), but a `theme()` call inside a plain CSS property value
  (not an `@apply` rule) is a different syntax the scripts still don't
  parse — this one line remains manually verified against the allowlist
  (neutral-500 is already a ratified, AAA-checked token used elsewhere),
  rather than a scope worth building a CSS-value parser for a single
  call site.

## Full utility composition (from the constitution's ratified Overlays,
## Modals & Feedback pattern — not previously written out in any Phase 1
## doc; `/speckit-analyze` flagged this as underspecified, since `.modal-
## dialog`/`.modal-panel` had only their color-token allowlist documented)

```css
.modal-dialog {
  /* dialog element itself: reset UA padding/border, native centering kept */
  @apply p-0 border-0;
}
.modal-panel {
  @apply relative transform overflow-hidden rounded-lg bg-white px-4 pb-4
    pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg
    sm:p-6;
}
.slide-over-dialog {
  @apply p-0 border-0 fixed inset-y-0 right-0 h-full;
}
.slide-over-panel {
  @apply relative flex h-full w-full max-w-md flex-col bg-white shadow-xl
    p-6 transform transition ease-in-out duration-500;
}
```

Sourced directly from the constitution's ratified strings (Modals' dialog
box utilities; Slide-overs' "right-side entry animation... `h-full` with
`max-w-md`"), not invented — closing the gap that let the backdrop token
drift unnoticed in the first draft of this document.
