// Feature 034 (research.md R3) — every row/button is a real,
// natively focusable/activatable element (checkbox + button); no
// custom keyboard-handling layer is needed for FR-003's keyboard
// operability requirement.
export function initPickLists() {
  document.querySelectorAll("[data-pick-list]").forEach((container) => {
    const source = container.querySelector("[data-pick-list-source]");
    const destination = container.querySelector("[data-pick-list-destination]");
    const moveRight = container.querySelector("[data-pick-list-move-right]");
    const moveLeft = container.querySelector("[data-pick-list-move-left]");
    const moveAllRight = container.querySelector("[data-pick-list-move-all-right]");
    const moveAllLeft = container.querySelector("[data-pick-list-move-all-left]");

    function moveChecked(from, to) {
      from.querySelectorAll("input[type=checkbox]:checked").forEach((checkbox) => {
        checkbox.checked = false;
        to.appendChild(checkbox.closest("[data-pick-list-row]"));
      });
      updateEmptyStates();
    }

    function moveAll(from, to) {
      Array.from(from.querySelectorAll("[data-pick-list-row]")).forEach((row) => to.appendChild(row));
      updateEmptyStates();
    }

    function updateEmptyStates() {
      [source, destination].forEach((panel) => {
        const empty = panel.querySelector("[data-pick-list-empty]");
        const hasRows = panel.querySelectorAll("[data-pick-list-row]").length > 0;
        if (empty) empty.hidden = hasRows;
      });
    }

    moveRight?.addEventListener("click", () => moveChecked(source, destination));
    moveLeft?.addEventListener("click", () => moveChecked(destination, source));
    moveAllRight?.addEventListener("click", () => moveAll(source, destination));
    moveAllLeft?.addEventListener("click", () => moveAll(destination, source));
    updateEmptyStates();
  });
}
