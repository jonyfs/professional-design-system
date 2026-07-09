# Component Contract: Toast

## Markup contract

```html
<div
  role="status"
  aria-live="polite"
  data-testid="toast-success"
  class="toast toast-success"
>
  <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 shrink-0" aria-hidden="true">
    <path
      fill-rule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
      clip-rule="evenodd"
    />
  </svg>
  <p class="flex-1 text-sm font-medium text-neutral-900">
    Changes saved successfully.
  </p>
  <button
    type="button"
    data-testid="toast-close"
    aria-label="Dismiss notification"
    class="toast-close-btn"
  >
    <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true">
      <path
        d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
      />
    </svg>
  </button>
</div>
```

## Behavior wiring (`src/scripts/toast.js`)

```js
export function initToastDismissal() {
  document.querySelectorAll("[data-testid='toast-close']").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest('[role="status"]')?.remove();
    });
  });
}
```

A separate file from `overlay.js` deliberately — Toast has no dialog/
focus-trap semantics to wire (research.md), so sharing a file would
misleadingly imply it does. No inline `onclick` attributes anywhere (would
require relaxing this project's CSP `script-src` to `unsafe-inline` — see
`rules/web/security.md` — an unjustified security regression for a trivial
DOM removal).

## Required attributes (FR-002)

| Requirement | Mechanism |
|---|---|
| Announced without stealing focus | `role="status"` + `aria-live="polite"` — screen readers announce it; nothing moves keyboard focus |
| Dismissible | `toast.js`'s `click` listener removing the toast from the DOM entirely (not just visually hidden — genuinely gone from the accessibility tree) |
| Does not block background interaction | No backdrop, no `<dialog>` — a plain positioned element; page content remains fully interactive underneath/around it |

## Variants (constitution's ratified status tokens, same mapping as Badge)

| Variant | Icon color | Notes |
|---|---|---|
| success | `text-success-strong` | Reuses feature 001's AAA-safe status text token |
| error | `text-error-strong` | Same |
| info | `text-brand-dark` | Reuses the AAA-safe Button fill token (7.90:1 vs white, already verified) for the icon color |

## Token allowlist used

`text-neutral-900` (message text), `text-success-strong`/
`text-error-strong`/`text-brand-dark` (icon per variant), `text-neutral-500`
`hover:text-neutral-600` (close icon, same correction as Modal/Slide-over
— research.md). `bg-white`, `shadow-lg`, `ring-1 ring-neutral-900/5` for
the toast surface (matching the constitution's existing "Toasts/banners"
catalog entry, which is not AAA-affected since it's a background/border,
not text). No raw palette classes permitted (FR-004). No new tokens.

## Edge case — multiple simultaneous toasts

The demo page stacks toasts in a `<div class="toast-stack">` container
(`fixed top-4 right-4 z-50 flex flex-col gap-3`, per the constitution's
existing Toasts/banners position pattern) so multiple instances stack
vertically without overlapping, each independently dismissible.

## Acceptance mapping

- FR-002, FR-004, FR-005, FR-006 → this contract
- SC-002, SC-003, SC-004 → verified by `tests/e2e/toast.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
