// Feature 039 (research.md R2) — validates on every change; a
// non-blocking, always-editable error state (never prevents further
// typing).
export function initJsonInputs() {
  document.querySelectorAll("[data-json-input]").forEach((field) => {
    const errorEl = document.querySelector(`[data-json-input-error-for="${field.id}"]`);

    function validate() {
      if (!field.value.trim()) {
        field.removeAttribute("aria-invalid");
        if (errorEl) errorEl.textContent = "";
        return;
      }
      try {
        JSON.parse(field.value);
        field.removeAttribute("aria-invalid");
        if (errorEl) errorEl.textContent = "";
      } catch (e) {
        field.setAttribute("aria-invalid", "true");
        if (errorEl) errorEl.textContent = e.message;
      }
    }

    field.addEventListener("input", validate);
    validate();
  });
}
