import { applyMask, MASK_PRESETS } from "../../shared/input-mask/index.ts";

export function initInputMasks() {
  document.querySelectorAll("[data-input-mask]").forEach((field) => {
    const preset = field.dataset.inputMask;
    const pattern = MASK_PRESETS[preset] ?? field.dataset.inputMaskPattern;
    if (!pattern) return;

    field.addEventListener("input", () => {
      const digits = field.value.replace(/\D/g, "");
      field.value = applyMask(pattern, digits);
    });
  });
}
