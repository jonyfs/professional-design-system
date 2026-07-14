// NumberInput behavior wiring (contracts/form-inputs.contract.md, feature
// 023 US1). Reuses TextInput's exact shell; adds two <button> steppers and
// native-`<input type="number">` clamping. Design decisions:
//   - Clamping to [min, max] happens ONLY on blur when the user has typed a
//     value directly (spec.md Edge Cases) — clamping on every keystroke
//     would fight the caret while the user is mid-entry.
//   - A stepper click always clamps immediately, since that is a discrete,
//     committed step (not mid-typing).
//   - Each stepper disables individually at its own bound (increment at
//     `max`, decrement at `min`), matching the contract.

/**
 * @param {{ input: HTMLInputElement, incrementBtn: HTMLButtonElement, decrementBtn: HTMLButtonElement }} refs
 */
export function initNumberInput({ input, incrementBtn, decrementBtn }) {
  const step = Number.parseFloat(input.step) || 1;
  const hasMin = input.min !== "";
  const hasMax = input.max !== "";
  const min = hasMin ? Number.parseFloat(input.min) : null;
  const max = hasMax ? Number.parseFloat(input.max) : null;

  function readValue() {
    if (input.value === "") return null;
    const parsed = Number.parseFloat(input.value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function clamp(value) {
    let next = value;
    if (min !== null && next < min) next = min;
    if (max !== null && next > max) next = max;
    return next;
  }

  function setValue(value) {
    input.value = String(value);
    syncSteppers();
  }

  function syncSteppers() {
    const value = readValue();
    if (value === null) {
      incrementBtn.disabled = false;
      decrementBtn.disabled = false;
      return;
    }
    incrementBtn.disabled = max !== null && value >= max;
    decrementBtn.disabled = min !== null && value <= min;
  }

  function nudge(direction) {
    if (input.disabled) return;
    const base = readValue();
    const start = base === null ? (min !== null ? min : 0) : base;
    const next = base === null ? clamp(start) : clamp(start + direction * step);
    setValue(next);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  incrementBtn.addEventListener("click", () => nudge(1));
  decrementBtn.addEventListener("click", () => nudge(-1));

  input.addEventListener("input", syncSteppers);

  input.addEventListener("blur", () => {
    const value = readValue();
    if (value === null) {
      syncSteppers();
      return;
    }
    const clamped = clamp(value);
    if (clamped !== value) {
      setValue(clamped);
      input.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      syncSteppers();
    }
  });

  syncSteppers();
}
