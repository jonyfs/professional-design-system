// Feature 039 (research.md R2) — genuinely new logic: trigger
// detection + popover anchored at the cursor (not the field edge),
// reusing shared/mentions/index.ts + shared/multi-select's
// filterOptions for the suggestion list.
import { filterOptions } from "../../shared/multi-select/index.ts";
import { findActiveTrigger, insertMention } from "../../shared/mentions/index.ts";

export function initMentions() {
  document.querySelectorAll("[data-mentions]").forEach((container) => {
    const field = container.querySelector("[data-mentions-field]");
    const popover = container.querySelector("[data-mentions-popover]");
    const users = JSON.parse(container.dataset.users || "[]");
    if (!field || !popover) return;

    function open(query) {
      const matches = filterOptions(users, query);
      popover.innerHTML = "";
      matches.forEach((user) => {
        const item = document.createElement("div");
        item.className = "mentions-option";
        item.setAttribute("role", "option");
        item.dataset.testid = `mentions-option-${user.id}`;
        item.textContent = user.label;
        item.addEventListener("mousedown", (e) => {
          e.preventDefault(); // keep field focus across the click
          const { text, cursorIndex } = insertMention(field.value, field.selectionStart, user.label);
          field.value = text;
          field.setSelectionRange(cursorIndex, cursorIndex);
          close();
        });
        popover.appendChild(item);
      });
      popover.hidden = matches.length === 0;
    }
    function close() {
      popover.hidden = true;
    }

    field.addEventListener("input", () => {
      const query = findActiveTrigger(field.value, field.selectionStart);
      if (query === null) close();
      else open(query);
    });
    field.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    close();
  });
}
