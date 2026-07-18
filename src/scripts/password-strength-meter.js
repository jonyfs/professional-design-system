// Feature 029 — simple, transparent heuristic (research.md R5): length
// + character-class diversity, mapped to 4 levels driving Progress's
// existing fill mechanism. A presentation-layer demo, not a production
// password policy.
export function scorePassword(value) {
  if (!value) return { level: "empty", score: 0 };
  let classes = 0;
  if (/[a-z]/.test(value)) classes++;
  if (/[A-Z]/.test(value)) classes++;
  if (/[0-9]/.test(value)) classes++;
  if (/[^a-zA-Z0-9]/.test(value)) classes++;

  const lengthScore = Math.min(value.length / 12, 1);
  const classScore = classes / 4;
  const score = Math.round(((lengthScore + classScore) / 2) * 100);

  const level = score < 34 ? "weak" : score < 67 ? "fair" : "strong";
  return { level, score };
}

const LEVEL_LABEL = { empty: "", weak: "Weak", fair: "Fair", strong: "Strong" };

export function initPasswordStrengthMeter() {
  document.querySelectorAll("[data-password-strength-input]").forEach((input) => {
    const fill = document.querySelector(`[data-password-strength-fill="${input.id}"]`);
    const label = document.querySelector(`[data-password-strength-label="${input.id}"]`);
    input.addEventListener("input", () => {
      const { level, score } = scorePassword(input.value);
      // CSSOM assignment, not inline style="..." (this project's CSP,
      // same pattern as progress.js/ring-progress.js).
      fill.style.width = `${score}%`;
      fill.dataset.level = level;
      label.textContent = LEVEL_LABEL[level];
    });
  });
}
