// Progress fill-width wiring (contracts/progress.contract.md, feature 014).
// Percentage values are inherently dynamic (0-100, not a small bounded
// set like Tooltip's anchor pairings), so a pre-declared numbered CSS
// class set isn't practical here. This project's CSP (`style-src 'self'`,
// no `unsafe-inline`) blocks inline `style="width: 60%"` HTML attributes
// outright — confirmed empirically, the same real, silent failure class
// found in Tooltip's markup — but does NOT block direct CSSOM property
// assignment (`element.style.width = ...`), which is not subject to the
// style-src-attr check browsers apply to the parsed `style` attribute.
// Reads the target percentage from `data-value` rather than hardcoding it
// in markup, so this stays a thin, declarative wiring layer.
export function initProgressBars() {
  document.querySelectorAll("[data-progress-fill]").forEach((fill) => {
    const value = fill.getAttribute("data-value");
    if (value !== null) fill.style.width = `${value}%`;
  });
}
