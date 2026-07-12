// PinInput behavior wiring (contracts/pin-input.contract.md, research.md
// R4). No existing script handles multi-box focus distribution, so this
// is a genuinely new module: per-box numeric filtering + auto-advance,
// Backspace-retreat on an empty box, and paste-splitting across the
// remaining boxes (non-numeric content rejected, excess length
// truncated).
export function initPinInputs() {
  document.querySelectorAll("[data-pin-input]").forEach((group) => {
    const boxes = Array.from(group.querySelectorAll("[data-pin-box]"));
    boxes.forEach((box, i) => {
      box.addEventListener("input", () => {
        box.value = box.value.replace(/[^0-9]/g, "").slice(0, 1);
        if (box.value && boxes[i + 1]) boxes[i + 1].focus();
      });
      box.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !box.value && boxes[i - 1]) {
          boxes[i - 1].focus();
        }
      });
      box.addEventListener("paste", (event) => {
        event.preventDefault();
        const digits = (event.clipboardData?.getData("text") ?? "")
          .replace(/[^0-9]/g, "")
          .slice(0, boxes.length - i);
        digits.split("").forEach((digit, offset) => {
          if (boxes[i + offset]) boxes[i + offset].value = digit;
        });
        (boxes[i + digits.length] ?? boxes[boxes.length - 1]).focus();
      });
    });
  });
}
