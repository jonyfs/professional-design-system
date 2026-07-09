# Component Contract: Slide-over

## Markup contract

```html
<button type="button" data-testid="slide-over-trigger" class="btn-primary">
  View details
</button>

<dialog
  id="slide-over-example"
  data-testid="slide-over"
  aria-labelledby="slide-over-title"
  class="slide-over-dialog"
>
  <div class="slide-over-panel">
    <div class="flex items-start justify-between gap-4">
      <h2 id="slide-over-title" class="text-lg font-semibold text-neutral-900">
        Order details
      </h2>
      <form method="dialog">
        <button
          type="submit"
          data-testid="slide-over-close"
          aria-label="Close"
          class="close-icon-btn"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true">
            <path
              d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
            />
          </svg>
        </button>
      </form>
    </div>
    <p class="mt-4 text-sm text-neutral-600">
      Order #1042 — placed 2026-07-08, currently in transit.
    </p>
  </div>
</dialog>
```

Same `data-dialog-trigger="slide-over-example"` wiring as Modal — this
component intentionally reuses `overlay.js`'s `initDialogTriggers()`
verbatim (research.md: "no second focus-trap mechanism, no code
duplication beyond CSS").

## Required attributes (Principle II gate, FR-003/FR-005/FR-007)

Identical mechanism table to `modal.contract.md` — native `<dialog>` +
`showModal()` provides focus trap, focus return, Escape-close, and
background inertness; `overlay.js` adds only backdrop-click-to-close; the
close button needs zero JS via `<form method="dialog">`.

**The only difference from Modal is layout/animation**, expressed purely
via Tailwind classes on `.slide-over-dialog`/`.slide-over-panel` (anchored
to the right edge, `translate-x` transition sliding in from off-screen)
instead of `.modal-dialog`/`.modal-panel`'s centered layout — no new
behavior, no new script.

## Edge case — Shift+Tab wraps within the panel

Native `<dialog>` focus-trap behavior already wraps Shift+Tab from the
first focusable element to the last (and Tab from the last back to the
first) — verified by test, not assumed, same as Modal.

The close button reuses `close-icon-btn` verbatim — see
`modal.contract.md`'s "Required classes — `close-icon-btn`" table for the
full resting/hover/active/focus-visible/disabled state set (not repeated
here to avoid the two contracts drifting out of sync).

## Token allowlist used

Same as `modal.contract.md`: `neutral-900` (backdrop dimming, via
`.slide-over-dialog::backdrop`'s `theme()` rule), `text-neutral-900`,
`text-neutral-600`, `text-neutral-500`/`text-neutral-600` (close icon
resting/hover, via `close-icon-btn`). No raw palette classes permitted
(FR-004). No new tokens.

## Acceptance mapping

- FR-003, FR-004, FR-005, FR-006, FR-007 → this contract
- SC-002, SC-003, SC-004 → verified by `tests/e2e/slide-over.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
