# Component Contract: Modal

## Markup contract

```html
<button type="button" data-testid="modal-trigger" class="btn-primary">
  Delete item
</button>

<dialog
  id="modal-example"
  data-testid="modal"
  aria-labelledby="modal-title"
  class="modal-dialog"
>
  <div class="modal-panel">
    <div class="flex items-start justify-between gap-4">
      <h2 id="modal-title" class="text-lg font-semibold text-neutral-900">
        Delete item?
      </h2>
      <form method="dialog">
        <button
          type="submit"
          data-testid="modal-close"
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
    <p class="mt-2 text-sm text-neutral-600">
      This action cannot be undone. The item will be permanently removed.
    </p>
    <form method="dialog" class="mt-6 flex justify-end gap-3">
      <button type="submit" data-testid="modal-cancel" class="btn-secondary">
        Cancel
      </button>
      <button type="submit" data-testid="modal-confirm" class="btn-primary">
        Delete
      </button>
    </form>
  </div>
</dialog>
```

## Behavior wiring (`src/scripts/overlay.js`)

```js
export function initDialogTriggers() {
  document.querySelectorAll("[data-dialog-trigger]").forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.dialogTrigger);
    if (!(dialog instanceof HTMLDialogElement)) return;
    trigger.addEventListener("click", () => dialog.showModal());
    // Backdrop-click-to-close: a click on the dialog's own box (not a
    // descendant) only happens on ::backdrop or the dialog's own
    // (zero-width, per modal-dialog's p-0) padding — see research.md.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}
```

The trigger button carries `data-dialog-trigger="modal-example"` (the
target dialog's `id`) so `overlay.js` can wire it generically — every
Modal/Slide-over instance on a page is wired the same way, with zero
per-instance script.

## Required attributes (Principle II gate, FR-001/FR-005/FR-007)

| Behavior | Mechanism |
|---|---|
| Focus trap while open | Native — `<dialog>` + `showModal()`, enforced by the browser (research.md) |
| Focus returns to trigger on close | Native — `<dialog>`'s "previously focused element" restoration |
| Escape closes | Native — built into `<dialog>` by default |
| Backdrop click closes | `overlay.js`'s `click` listener (not native — the one thing `showModal()` doesn't do for free) |
| Explicit close button | Zero JS — `<form method="dialog"><button type="submit">` closes the nearest ancestor dialog natively |
| Background inert while open | Native — the rest of the page cannot be reached by pointer or AT while `showModal()` is active |
| `aria-labelledby` | Points at the heading `id` so assistive tech announces the dialog's purpose on open |

## Edge case — no focusable content

For a purely informational modal (no buttons/inputs inside), add
`tabindex="-1"` to the `<dialog>` element itself so focus has a valid,
non-lost target:

```html
<dialog tabindex="-1" aria-labelledby="modal-info-title" class="modal-dialog">
  <div class="modal-panel">
    <h2 id="modal-info-title" class="text-lg font-semibold text-neutral-900">
      Processing…
    </h2>
    <p class="mt-2 text-sm text-neutral-600">This will only take a moment.</p>
  </div>
</dialog>
```

## Token allowlist used

`bg-neutral-900` (backdrop, via `[&::backdrop]:bg-neutral-900/50`),
`text-neutral-900`, `text-neutral-600`, `text-neutral-500`,
`text-neutral-600` (close icon, corrected per research.md — was
`text-neutral-400`/`text-neutral-500` in the ratified catalog, which
measured 2.54:1, below the 3:1 non-text threshold). Button classes reuse
feature 001's `.btn-primary`/`.btn-secondary`. No raw palette classes
permitted (FR-004).

## Acceptance mapping

- FR-001, FR-004, FR-005, FR-006, FR-007 → this contract
- SC-002, SC-003, SC-004 → verified by `tests/e2e/modal.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
