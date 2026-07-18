// Feature 030 — this catalog's first use of the native online/offline
// events (research.md R3). No polling, no server ping.
//
// Real bug found by running this against a live browser, not assumed:
// the native `hidden` attribute does NOT reliably hide `.alert` — its
// `@apply flex` gives it an author-origin `display: flex` declaration,
// which the CSS cascade lets win over the browser's UA-origin
// `[hidden] { display: none }` default regardless of selector
// specificity (author styles always outrank UA styles as a cascade
// origin). Every prior use of `.alert`/Toast in this catalog only ever
// permanently removes the element on dismiss (alert.js/toast.js both
// call `.remove()`), so this collision never surfaced before — Offline
// Banner is the first component that needs to show/hide the SAME
// element repeatedly. Fixed via direct CSSOM `style.display`
// assignment (the same pattern `src/scripts/progress.js` already uses
// for this project's CSP), which — being inline style — outranks any
// class-based `display` declaration.
export function initOfflineBanner() {
  const banner = document.getElementById("offline-banner");
  if (!banner) return;

  function render() {
    banner.style.display = navigator.onLine ? "none" : "";
  }

  window.addEventListener("online", render);
  window.addEventListener("offline", render);
  render(); // correct initial state on load, not just after the first transition
}
