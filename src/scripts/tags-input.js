// Feature 039 (research.md R2) — freeform multi-value entry. No fixed
// option list, so shared/multi-select/index.ts's filterOptions does
// not apply; a fresh array is always produced, never mutating the
// existing tag list in place (matches shared/multi-select's own
// immutability discipline).
export function initTagsInputs() {
  document.querySelectorAll("[data-tags-input]").forEach((container) => {
    const field = container.querySelector("[data-tags-input-field]");
    const tagList = container.querySelector("[data-tags-input-list]");
    const hiddenInput = container.querySelector("[data-tags-input-value]");
    if (!field || !tagList || !hiddenInput) return;

    let tags = (hiddenInput.value ? hiddenInput.value.split(",") : []).filter(Boolean);

    function sync() {
      hiddenInput.value = tags.join(",");
      hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
      tagList.innerHTML = "";
      tags.forEach((tag, index) => {
        const chip = document.createElement("span");
        chip.className = "tags-input-tag";
        chip.dataset.testid = `tags-input-tag-${index}`;
        chip.textContent = tag;
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "tags-input-tag-remove";
        removeBtn.setAttribute("aria-label", `Remove ${tag}`);
        removeBtn.textContent = "×";
        removeBtn.addEventListener("click", () => {
          tags = tags.filter((_, i) => i !== index);
          sync();
          field.focus();
        });
        chip.appendChild(removeBtn);
        tagList.appendChild(chip);
      });
    }

    function commitValue(raw) {
      const value = raw.trim();
      if (value && !tags.includes(value)) {
        tags = [...tags, value];
        sync();
      }
      field.value = "";
    }

    field.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        commitValue(field.value);
      } else if (e.key === "Backspace" && field.value === "" && tags.length > 0) {
        tags = tags.slice(0, -1);
        sync();
      }
    });

    field.addEventListener("paste", (e) => {
      const text = e.clipboardData?.getData("text") ?? "";
      if (/[,\n]/.test(text)) {
        e.preventDefault();
        text.split(/[,\n]/).forEach((part) => commitValue(part));
      }
    });

    sync();
  });
}
