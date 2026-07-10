// Combobox behavior wiring (contracts/combobox.contract.md). Native
// <datalist> was verified insufficient (research.md R1) — this is a
// from-scratch WAI-ARIA 1.2 combobox. The Popover API provides top-layer
// rendering plus native Escape-to-close and light-dismiss (research.md
// R2); this module adds everything else: filtering, aria-activedescendant
// roving "focus" (real DOM focus never leaves the input), and Enter/blur
// commit handling.
export function initCombobox({ input, listbox, options }) {
  let query = "";
  let filtered = [];
  let activeIndex = -1;

  function matches(option) {
    return option.label.toLowerCase().includes(query.toLowerCase());
  }

  function highlight(label) {
    if (!query) return label;
    const start = label.toLowerCase().indexOf(query.toLowerCase());
    if (start === -1) return label;
    const end = start + query.length;
    const before = label.slice(0, start);
    const match = label.slice(start, end);
    const after = label.slice(end);
    const span = document.createElement("span");
    span.append(before, Object.assign(document.createElement("mark"), { textContent: match }), after);
    return span;
  }

  function render() {
    listbox.innerHTML = "";
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "combobox-empty";
      empty.setAttribute("data-testid", "combobox-empty");
      empty.textContent = "No results found.";
      listbox.appendChild(empty);
      return;
    }
    filtered.forEach((option, index) => {
      const li = document.createElement("li");
      li.id = `combobox-option-${index}`;
      li.setAttribute("role", "option");
      li.setAttribute("data-testid", `combobox-option-${index}`);
      li.className = "combobox-option";
      if (option.disabled) li.setAttribute("aria-disabled", "true");
      if (index === activeIndex) li.setAttribute("aria-selected", "true");
      const content = highlight(option.label);
      if (typeof content === "string") {
        li.textContent = content;
      } else {
        li.appendChild(content);
      }
      li.addEventListener("mousedown", (event) => {
        event.preventDefault();
        if (option.disabled) return;
        commit(option);
      });
      listbox.appendChild(li);
    });
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

  function commit(option) {
    input.value = option.value;
    close();
  }

  function setActive(index) {
    activeIndex = index;
    render();
    if (activeIndex === -1) {
      input.setAttribute("aria-activedescendant", "");
    } else {
      input.setAttribute("aria-activedescendant", `combobox-option-${activeIndex}`);
      listbox.children[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }

  function enabledIndices() {
    return filtered.reduce((acc, option, index) => {
      if (!option.disabled) acc.push(index);
      return acc;
    }, []);
  }

  function moveActive(direction) {
    const enabled = enabledIndices();
    if (enabled.length === 0) return;
    const currentPos = enabled.indexOf(activeIndex);
    let nextPos;
    if (currentPos === -1) {
      nextPos = direction === 1 ? 0 : enabled.length - 1;
    } else {
      nextPos = (currentPos + direction + enabled.length) % enabled.length;
    }
    setActive(enabled[nextPos]);
  }

  input.addEventListener("input", () => {
    query = input.value;
    filtered = options.filter(matches);
    activeIndex = -1;
    render();
    if (query) {
      open();
    } else {
      close();
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      if (!listbox.matches(":popover-open")) return;
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      if (!listbox.matches(":popover-open")) return;
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Enter") {
      if (activeIndex !== -1 && !filtered[activeIndex]?.disabled) {
        event.preventDefault();
        commit(filtered[activeIndex]);
      }
    } else if (event.key === "Escape") {
      if (listbox.matches(":popover-open")) {
        event.preventDefault();
        close();
      }
    }
  });

  input.addEventListener("blur", () => {
    // Supplements the Popover API's own light-dismiss for the case focus
    // moves via Tab rather than a pointer interaction outside the panel.
    close();
  });

  listbox.addEventListener("toggle", syncExpanded);
}
