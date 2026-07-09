// Modal/Slide-over behavior wiring (contracts/modal.contract.md,
// contracts/slide-over.contract.md). Native <dialog> + showModal() already
// provides focus trapping, Escape-to-close, and background inertness in
// every target browser (research.md) — this file adds backdrop-click-to-
// close (showModal() doesn't do that for free) plus an explicit focus-
// return safeguard.
//
// Focus-return-to-trigger is *specified* natively (the "previously focused
// element" restoration), and Chromium/Firefox implement it — but real
// cross-browser Playwright testing (not just reading the spec) found
// WebKit does not restore focus on dialog close, leaving it on <body>.
// Principle II's focus-return mandate is NON-NEGOTIABLE, so this can't be
// left to a browser-by-browser native guarantee that doesn't universally
// hold. Explicitly re-focusing the trigger on the dialog's `close` event
// is a no-op reinforcement where native restoration already worked
// (Chromium/Firefox) and the actual fix where it didn't (WebKit).
export function initDialogTriggers() {
  document.querySelectorAll("[data-dialog-trigger]").forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.dialogTrigger);
    if (!(dialog instanceof HTMLDialogElement)) return;
    trigger.addEventListener("click", () => dialog.showModal());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => trigger.focus());
  });
}
