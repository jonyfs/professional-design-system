// Feature 031 (research.md R4) — reuses Popover's positioning
// mechanism per step; the sequencing (exactly one step open at a time,
// Next/Previous/Skip, step indicator) is the only genuinely new logic.
let anchorCounter = 0;

export function initOnboardingTour() {
  const steps = Array.from(document.querySelectorAll("[data-tour-step]"));
  const startButton = document.getElementById("tour-start");
  if (!steps.length || !startButton) return;

  steps.forEach((panel) => {
    const target = document.getElementById(panel.dataset.tourTarget);
    if (!target) return;
    const anchorName = `--tour-anchor-${anchorCounter++}`;
    target.style.anchorName = anchorName;
    panel.style.positionAnchor = anchorName;
  });

  function showStep(index) {
    steps.forEach((panel) => panel.hidePopover());
    if (index < 0 || index >= steps.length) return;
    const panel = steps[index];
    const indicator = panel.querySelector("[data-tour-indicator]");
    if (indicator) indicator.textContent = `${index + 1} of ${steps.length}`;
    panel.showPopover();
    panel.querySelector("[data-tour-next], [data-tour-finish]")?.focus();
  }

  startButton.addEventListener("click", () => showStep(0));

  steps.forEach((panel, index) => {
    panel.querySelector("[data-tour-next]")?.addEventListener("click", () => showStep(index + 1));
    panel.querySelector("[data-tour-prev]")?.addEventListener("click", () => showStep(index - 1));
    panel
      .querySelector("[data-tour-skip], [data-tour-finish]")
      ?.addEventListener("click", () => showStep(-1));
  });
}
