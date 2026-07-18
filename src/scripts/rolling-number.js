// Feature 034 (research.md R2) — applies this catalog's established
// rAF-throttle pattern (Scroll Progress Bar/Affix, features 031/032)
// to a numeric tween instead of a scroll-gated callback. A new
// animation always cancels any in-flight one first (spec.md Edge
// Case: rapid successive value changes must not stack/queue).
const DURATION_MS = 400;

export function initRollingNumbers() {
  document.querySelectorAll("[data-rolling-number]").forEach((el) => {
    let currentValue = Number(el.dataset.rollingNumber) || 0;
    let animationFrameId = null;
    el.textContent = currentValue.toLocaleString();

    function animateTo(target) {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      const start = currentValue;
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min(1, (now - startTime) / DURATION_MS);
        currentValue = Math.round(start + (target - start) * progress);
        el.textContent = currentValue.toLocaleString();
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          animationFrameId = null;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    }

    // Exposed for the demo page's own trigger buttons.
    el._rollingNumberSetValue = animateTo;
  });
}
