// Feature 031 (research.md R2/R3) — one shared, rAF-throttled scroll
// listener drives both primitives, avoiding two independent scroll
// handlers on the same page (this project's performance rules warn
// against scroll-handler churn). Back-to-Top's threshold logic is
// scoped to what it itself needs — NOT a standalone, separately
// reusable "Affix" primitive (a different inventory category).
const THRESHOLD = 400;
let ticking = false;

function computeScrollPercent() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) return 0; // no scrollable content — never NaN/negative
  return Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100));
}

export function initScrollFeedback() {
  const backToTop = document.getElementById("back-to-top");
  const progressFill = document.getElementById("scroll-progress-fill");
  if (!backToTop && !progressFill) return;

  function render() {
    if (backToTop) {
      backToTop.style.display = window.scrollY > THRESHOLD ? "" : "none";
    }
    if (progressFill) {
      // CSSOM assignment (this project's CSP), same pattern as progress.js.
      progressFill.style.width = `${computeScrollPercent()}%`;
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(render);
        ticking = true;
      }
    },
    { passive: true },
  );

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  render(); // correct initial state, not just after the first scroll event
}
