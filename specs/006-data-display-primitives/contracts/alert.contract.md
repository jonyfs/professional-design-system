# Component Contract: Alert / Banner

## Markup contract

```html
<div data-testid="alert-success" class="alert alert-success">
  <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 shrink-0 text-success-strong" aria-hidden="true">
    <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
  </svg>
  <p class="flex-1 text-sm font-medium text-neutral-900">
    Your changes have been saved successfully.
  </p>
</div>

<div data-testid="alert-error" class="alert alert-error">
  <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 shrink-0 text-error-strong" aria-hidden="true">
    <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd" />
  </svg>
  <p class="flex-1 text-sm font-medium text-neutral-900">
    Something went wrong while processing your request.
  </p>
</div>

<div data-testid="alert-warning" class="alert alert-warning">
  <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 shrink-0 text-warning-strong" aria-hidden="true">
    <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
  </svg>
  <p class="flex-1 text-sm font-medium text-neutral-900">
    Your subscription will expire in 3 days.
  </p>
</div>

<div data-testid="alert-info" class="alert alert-info">
  <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 shrink-0 text-info-strong" aria-hidden="true">
    <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
  </svg>
  <p class="flex-1 text-sm font-medium text-neutral-900">
    A new version of this page is available.
  </p>
</div>

<!-- Dismissible variant -->
<div data-testid="alert-dismissible" class="alert alert-info" data-alert>
  <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 shrink-0 text-info-strong" aria-hidden="true">
    <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
  </svg>
  <p class="flex-1 text-sm font-medium text-neutral-900">
    You can dismiss this notice.
  </p>
  <button
    type="button"
    data-testid="alert-dismiss"
    aria-label="Dismiss"
    class="close-icon-btn"
  >
    <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  </button>
</div>
```

Note: no `role`/`aria-live` attribute anywhere — deliberate (FR-011,
data-model.md). Unlike Toast, this is static page content, perceivable by
normal top-to-bottom page reading, not a dynamically-announced
notification.

## Behavior wiring (`src/scripts/alert.js`)

```js
// Alert/Banner dismiss wiring (contracts/alert.contract.md). Deliberately
// NOT a reuse of toast.js — toast.js hardcodes a [role="status"] ancestor
// selector, and Alert/Banner has no such role (research.md R1: this is
// static page content, not a live-region announcement).
export function initAlertDismissal() {
  document.querySelectorAll("[data-alert]").forEach((alert) => {
    const dismissButton = alert.querySelector("[data-testid='alert-dismiss']");
    dismissButton?.addEventListener("click", () => alert.remove());
  });
}
```

## Required attributes (Principle II gate, FR-006/FR-007/FR-008/FR-011)

| Behavior | Mechanism |
|---|---|
| Severity visually distinguishable without reading text (SC-001) | Distinct background/ring color + distinct icon per severity |
| No live-region/announcement semantics | No `role`/`aria-live` attribute anywhere on `.alert` |
| Dismissal removes from DOM/a11y tree | `alert.js`'s `.remove()` call — not a visibility/display toggle |
| Non-dismissible variant has no dismiss control | The default markup (first four examples above) simply omits the `<button>` entirely — not a hidden or disabled one |
| Dismiss button state completeness | Reuses `.close-icon-btn` verbatim (feature 003) — no new interactive class introduced, so no new Principle V surface to declare incorrectly |

## Edge cases

- **Long message text wrapping (spec.md Edge Case)**: `.alert`'s
  `items-start` (not `items-center`) alignment keeps the icon and dismiss
  button pinned to the top of the message block regardless of how many
  lines the message wraps to — verified visually during implementation
  with an intentionally long message in the gallery demo.
- **Independent dismissal state (spec.md Edge Case)**: `alert.js` wires
  each `[data-alert]` instance independently (`querySelectorAll(...).forEach`)
  — dismissing one has no effect on any other instance's DOM node.
- **Keyboard-only dismissal (spec.md Edge Case)**: the dismiss button is a
  native `<button>`, focusable and activatable via Enter/Space by default,
  with `.close-icon-btn`'s existing `focus-visible:outline` treatment.

## Token allowlist used

`bg-success/5 ring-success/20 text-success-strong` (success — verbatim
from Badge's ratified pattern), `bg-error/5 ring-error/10 text-error-strong`
(error — verbatim from Badge), `bg-warning/5 ring-warning/10
text-warning-strong` (warning — verbatim from Badge), `bg-info/5
ring-info/20 text-info-strong` (info — follows the identical formula as
the other three severities; `info-strong` was added to
`shared/design-tokens.ts` by this feature, since `status.info` existed
but had no `-strong` text-safe variant — `/speckit-analyze` caught an
earlier draft bypassing the ratified `status.info` token in favor of
`brand-light`/`brand-dark`, which broke structural consistency with
success/error/warning; see data-model.md), `text-neutral-900` (message,
matching Toast's message treatment). `.close-icon-btn` reused verbatim (feature
003) for the dismiss button. No raw palette classes (FR-009).

## Acceptance mapping

- FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-014 → this contract
- SC-001, SC-002, SC-003, SC-004 → verified by `tests/e2e/alert.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
