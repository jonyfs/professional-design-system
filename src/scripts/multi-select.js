// MultiSelect behavior wiring (contracts/form-inputs.contract.md, feature
// 023 US1). Extends Combobox's exact filter/listbox/keyboard mechanics
// (combobox.js) with two differences required by the multi-select
// convention:
//   1. selecting an option ADDS it to a Set instead of replacing a single
//      value, and the options panel STAYS OPEN afterwards (a single-select
//      Combobox closes on commit);
//   2. each selection renders as a removable chip (Badge styling) above the
//      input, with a real <button aria-label="Remove {label}">.
//
// The pure add/remove/filter logic is imported from shared/multi-select so
// it is identical to the React surface (packages/react/src/MultiSelect).
import { addSelection, removeSelection, filterOptions } from "../../shared/multi-select/index.ts";

let anchorCounter = 0;

/**
 * @param {{
 *   input: HTMLInputElement,
 *   listbox: HTMLUListElement,
 *   chips: HTMLElement,
 *   options: { id: string, label: string }[],
 *   placeholder?: string,
 * }} config
 */
export function initMultiSelect({ input, listbox, chips, options, placeholder = "Select…" }) {
  const anchorName = `--multi-select-anchor-${anchorCounter++}`;
  input.style.anchorName = anchorName;
  listbox.style.positionAnchor = anchorName;

  let selectedIds = new Set();
  let query = "";
  let filtered = filterOptions(options, query);
  let activeIndex = -1;

  const optionById = new Map(options.map((option) => [option.id, option]));

  function syncPlaceholder() {
    // Empty state reuses Select/Combobox's placeholder convention (spec.md
    // Edge Cases) — the placeholder only shows while nothing is selected.
    input.placeholder = selectedIds.size === 0 ? placeholder : "";
  }

  function renderChips() {
    chips.innerHTML = "";
    selectedIds.forEach((id) => {
      const option = optionById.get(id);
      if (!option) return;
      const chip = document.createElement("span");
      chip.className =
        "inline-flex items-center gap-1 rounded-md bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-500/10";
      chip.setAttribute("data-testid", `multi-select-chip-${id}`);
      chip.append(option.label);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Remove ${option.label}`);
      remove.setAttribute("data-testid", `multi-select-chip-remove-${id}`);
      remove.className =
        "-mr-1.5 flex h-6 w-6 items-center justify-center rounded-sm text-neutral-600 hover:text-neutral-900 active:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand";
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 12 12");
      icon.setAttribute("fill", "none");
      icon.setAttribute("aria-hidden", "true");
      icon.setAttribute("class", "h-3 w-3");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M3 3l6 6M9 3l-6 6");
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("stroke-linecap", "round");
      icon.appendChild(path);
      remove.appendChild(icon);
      remove.addEventListener("click", () => {
        selectedIds = removeSelection(selectedIds, id);
        renderChips();
        renderListbox();
        syncPlaceholder();
        input.focus();
      });

      chip.appendChild(remove);
      chips.appendChild(chip);
    });
  }

  function renderListbox() {
    listbox.innerHTML = "";
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "combobox-empty";
      empty.setAttribute("data-testid", "multi-select-empty");
      empty.textContent = "No results found.";
      listbox.appendChild(empty);
      return;
    }
    filtered.forEach((option, index) => {
      const li = document.createElement("li");
      li.id = `multi-select-option-${index}`;
      li.setAttribute("role", "option");
      li.setAttribute("data-testid", `multi-select-option-${index}`);
      li.className = "combobox-option";
      const isSelected = selectedIds.has(option.id);
      // aria-selected reflects membership in the multi-select value set
      // (correct ARIA for an aria-multiselectable listbox), NOT the roving
      // active descendant. The keyboard-active option is highlighted
      // separately with the same ratified `bg-neutral-200` token Combobox
      // uses, applied directly (no new CSS class needed).
      li.setAttribute("aria-selected", String(isSelected));
      if (index === activeIndex) li.classList.add("bg-neutral-200");
      const labelSpan = document.createElement("span");
      labelSpan.textContent = option.label;
      li.appendChild(labelSpan);
      if (isSelected) {
        const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        check.setAttribute("viewBox", "0 0 16 16");
        check.setAttribute("fill", "none");
        check.setAttribute("aria-hidden", "true");
        check.setAttribute("class", "ml-auto h-4 w-4 text-brand");
        const checkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        checkPath.setAttribute("d", "M13 4.5 6.5 11 3 7.5");
        checkPath.setAttribute("stroke", "currentColor");
        checkPath.setAttribute("stroke-width", "1.75");
        checkPath.setAttribute("stroke-linecap", "round");
        checkPath.setAttribute("stroke-linejoin", "round");
        check.appendChild(checkPath);
        li.classList.add("flex", "items-center");
        li.appendChild(check);
      }
      li.addEventListener("mousedown", (event) => {
        event.preventDefault();
        toggleOption(option);
      });
      listbox.appendChild(li);
    });
  }

  function toggleOption(option) {
    selectedIds = selectedIds.has(option.id)
      ? removeSelection(selectedIds, option.id)
      : addSelection(selectedIds, option.id);
    renderChips();
    renderListbox();
    syncPlaceholder();
    // Multi-select convention: panel stays open after a selection.
    open();
  }

  function syncExpanded() {
    input.setAttribute("aria-expanded", String(listbox.matches(":popover-open")));
  }

  function open() {
    if (!listbox.matches(":popover-open")) listbox.showPopover();
    syncExpanded();
  }

  function close() {
    if (listbox.matches(":popover-open")) listbox.hidePopover();
    activeIndex = -1;
    input.setAttribute("aria-activedescendant", "");
    syncExpanded();
  }

  function setActive(index) {
    activeIndex = index;
    renderListbox();
    if (activeIndex === -1) {
      input.setAttribute("aria-activedescendant", "");
    } else {
      input.setAttribute("aria-activedescendant", `multi-select-option-${activeIndex}`);
      listbox.children[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }

  function moveActive(direction) {
    if (filtered.length === 0) return;
    if (activeIndex === -1) {
      setActive(direction === 1 ? 0 : filtered.length - 1);
      return;
    }
    setActive((activeIndex + direction + filtered.length) % filtered.length);
  }

  input.addEventListener("input", () => {
    query = input.value;
    filtered = filterOptions(options, query);
    activeIndex = -1;
    renderListbox();
    open();
  });

  input.addEventListener("focus", () => {
    filtered = filterOptions(options, query);
    renderListbox();
    open();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!listbox.matches(":popover-open")) open();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!listbox.matches(":popover-open")) open();
      moveActive(-1);
    } else if (event.key === "Enter") {
      if (activeIndex !== -1 && filtered[activeIndex]) {
        event.preventDefault();
        toggleOption(filtered[activeIndex]);
      }
    } else if (event.key === "Escape") {
      if (listbox.matches(":popover-open")) {
        event.preventDefault();
        close();
      }
    } else if (event.key === "Backspace" && input.value === "" && selectedIds.size > 0) {
      // Convenience: Backspace on an empty query removes the last chip
      // (near-universal multi-select behavior).
      const last = [...selectedIds].pop();
      selectedIds = removeSelection(selectedIds, last);
      renderChips();
      renderListbox();
      syncPlaceholder();
    }
  });

  input.addEventListener("blur", () => {
    close();
  });

  listbox.addEventListener("toggle", syncExpanded);

  syncPlaceholder();
  renderChips();
  renderListbox();
}
