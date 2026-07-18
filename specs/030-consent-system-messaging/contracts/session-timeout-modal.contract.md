# Contract: Session Timeout Modal

## `src/scripts/session-timeout-modal.js`

```js
// Feature 030 — this catalog's first setInterval-driven display
// (research.md R1/R2). Ships only the countdown Session Timeout Modal
// itself needs — NOT a standalone, separately reusable "Countdown
// Timer" primitive (that's inventory item 92, a different category,
// explicitly out of this feature's scope).
//
// Wires the dialog directly (not through overlay.js's
// initDialogTriggers() generic per-trigger loop, since the trigger
// needs its own click handler to start the countdown) but still
// reuses wireDialogClose() for backdrop-click-to-close and the
// WebKit focus-return safeguard every other dialog in this catalog
// already gets.
import { wireDialogClose } from "./overlay.js";

const START_SECONDS = 30;

export function initSessionTimeoutModal() {
  const dialog = document.getElementById("session-timeout-dialog");
  const trigger = document.getElementById("session-timeout-trigger");
  const countdownEl = document.getElementById("session-timeout-countdown");
  const expiredEl = document.getElementById("session-timeout-expired");
  const stayButton = document.getElementById("session-timeout-stay");
  if (!dialog || !trigger || !countdownEl || !expiredEl || !stayButton) return;

  let remaining = START_SECONDS;
  let intervalId = null;

  function render() {
    countdownEl.textContent = `${remaining}s`;
    countdownEl.hidden = remaining <= 0;
    expiredEl.hidden = remaining > 0;
  }

  function stopCountdown() {
    if (intervalId !== null) clearInterval(intervalId);
    intervalId = null;
  }

  function startCountdown() {
    remaining = START_SECONDS;
    render();
    stopCountdown();
    intervalId = setInterval(() => {
      remaining -= 1;
      render();
      if (remaining <= 0) stopCountdown();
    }, 1000);
  }

  trigger.addEventListener("click", () => {
    dialog._lastTrigger = trigger;
    startCountdown();
    dialog.showModal();
  });
  dialog.addEventListener("close", stopCountdown);
  stayButton.addEventListener("click", () => dialog.close());
  wireDialogClose(dialog);
}
```

## Static HTML usage

Reuses Modal's exact `<dialog class="modal-dialog">`/`.modal-panel`
mechanism and `overlay.js`'s `wireDialogClose()` verbatim (a plain
`data-dialog-trigger` button would also work, but this component needs
its OWN click handler to start the countdown, so it wires the dialog
directly rather than through `initDialogTriggers()`'s generic loop):

```html
<button type="button" id="session-timeout-trigger" data-testid="session-timeout-trigger" class="btn-secondary">
  Simulate session timeout warning
</button>

<dialog id="session-timeout-dialog" data-testid="session-timeout-dialog" aria-labelledby="session-timeout-title" class="modal-dialog">
  <div class="modal-panel">
    <h2 id="session-timeout-title" class="text-lg font-semibold text-neutral-900">Session about to expire</h2>
    <p class="mt-2 text-sm text-neutral-600">
      You'll be signed out in
      <span id="session-timeout-countdown" data-testid="session-timeout-countdown" aria-live="polite">30s</span>
      <span id="session-timeout-expired" data-testid="session-timeout-expired" aria-live="polite" hidden>You have been signed out.</span>
    </p>
    <div class="mt-4 flex gap-3">
      <button type="button" id="session-timeout-stay" data-testid="session-timeout-stay" class="btn-primary">Stay signed in</button>
      <form method="dialog"><button type="submit" data-testid="session-timeout-logout" class="btn-secondary">Log out now</button></form>
    </div>
  </div>
</dialog>
```

## React wrapper shape

```tsx
import { useEffect, useRef, useState } from "react";
import { Modal } from "../Modal/Modal";

export interface SessionTimeoutModalProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  startSeconds?: number;
}
export function SessionTimeoutModal({ open, onClose, onLogout, startSeconds = 30 }: SessionTimeoutModalProps) {
  const [remaining, setRemaining] = useState(startSeconds);
  useEffect(() => {
    if (!open) return;
    setRemaining(startSeconds);
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [open, startSeconds]);

  return (
    <Modal open={open} onClose={onClose} title="Session about to expire">
      <p className="mt-2 text-sm text-neutral-600">
        {remaining > 0 ? (
          <span aria-live="polite">You'll be signed out in {remaining}s</span>
        ) : (
          <span aria-live="polite">You have been signed out.</span>
        )}
      </p>
      <div className="mt-4 flex gap-3">
        <button type="button" className="btn-primary" onClick={onClose}>Stay signed in</button>
        <button type="button" className="btn-secondary" onClick={onLogout}>Log out now</button>
      </div>
    </Modal>
  );
}
```

## Acceptance mapping

- FR-001, spec.md US1 Acceptance Scenarios 1-2 → the markup/script above
- spec.md Edge Case (countdown reaches zero) → the `expiredEl`/expired-state branch
