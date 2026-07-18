// Feature 029 — CSSOM strokeDashoffset assignment (research.md R2).
// This project's CSP (style-src 'self') blocks inline style="..."
// attributes; direct CSSOM property assignment is not subject to that
// restriction — the same pattern src/scripts/progress.js already uses
// for Progress's fill width.
export function initCircularProgress() {
  document.querySelectorAll("[data-circular-progress-fill]").forEach((fill) => {
    const value = Number(fill.getAttribute("data-value") ?? 0);
    const clamped = Math.max(0, Math.min(100, value));
    const circumference = Number(fill.getAttribute("data-circumference"));
    fill.style.strokeDashoffset = `${circumference * (1 - clamped / 100)}`;
  });
}
