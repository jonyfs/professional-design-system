// Feature 039 (research.md R1) — reuses combobox.js's single-select
// commit semantics with shared/multi-select/index.ts's filterOptions
// for narrowing. Lighter than Combobox: one committed value, no
// multi-select chip list.
import { filterOptions } from "../../shared/multi-select/index.ts";

export function initAutocompletes() {
  document.querySelectorAll("[data-autocomplete]").forEach((container) => {
    const field = container.querySelector("[data-autocomplete-field]");
    const listbox = container.querySelector("[data-autocomplete-listbox]");
    const options = JSON.parse(container.dataset.options || "[]");
    if (!field || !listbox) return;

    function render(filtered) {
      listbox.innerHTML = "";
      if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.className = "autocomplete-empty";
        empty.textContent = "No results";
        listbox.appendChild(empty);
        return;
      }
      filtered.forEach((option) => {
        const item = document.createElement("div");
        item.className = "autocomplete-option";
        item.setAttribute("role", "option");
        item.dataset.testid = `autocomplete-option-${option.id}`;
        item.textContent = option.label;
        item.addEventListener("click", () => commit(option));
        listbox.appendChild(item);
      });
    }

    function commit(option) {
      field.value = option.label;
      field.dataset.selectedId = option.id;
      close();
      field.dispatchEvent(new CustomEvent("autocomplete-commit", { detail: option, bubbles: true }));
    }

    function open() {
      listbox.hidden = false;
      field.setAttribute("aria-expanded", "true");
    }
    function close() {
      listbox.hidden = true;
      field.setAttribute("aria-expanded", "false");
    }

    field.addEventListener("input", () => {
      render(filterOptions(options, field.value));
      open();
    });
    field.addEventListener("focus", () => {
      render(filterOptions(options, field.value));
      open();
    });
    field.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) close();
    });

    close();
  });
}
