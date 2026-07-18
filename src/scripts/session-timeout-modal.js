// Feature 030 — this catalog's first setInterval-driven display
// (research.md R1/R2). Ships only the countdown Session Timeout Modal
// itself needs — NOT a standalone, separately reusable "Countdown
// Timer" primitive (that's inventory item 92, a different category,
// explicitly out of this feature's scope).
//
// Wires the dialog directly (not through overlay.js's
// initDialogTriggers() generic per-trigger loop) since the trigger
// needs its own click handler to start the countdown — but still
// reuses wireDialogClose() for backdrop-click-to-close and the
// WebKit focus-return safeguard every other dialog in this catalog
// gets, rather than re-deriving that behavior here.
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
