// Command Palette behavior wiring (contracts/command-palette.contract.md).
// Reuses <dialog> + showModal() for the chrome and overlay.js's
// wireDialogClose(dialog) for backdrop-click-close + WebKit-safe
// close-time refocus (research.md R3) — this module adds the global
// Cmd/Ctrl+K shortcut and independently implements the same filter/
// arrow-key/aria-activedescendant model as combobox.js (data-model.md's
// explicit decision not to extract a third shared module).
import { wireDialogClose } from "./overlay.js";

export function initCommandPalette({ dialog, input, list, confirmation, actions }) {
  let query = "";
  let filtered = [];
  let activeIndex = -1;

  function matches(action) {
    return action.label.toLowerCase().includes(query.toLowerCase());
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
    list.innerHTML = "";
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "command-palette-empty";
      empty.setAttribute("data-testid", "command-palette-empty");
      empty.textContent = "No results found.";
      list.appendChild(empty);
      return;
    }
    filtered.forEach((action, index) => {
      const li = document.createElement("li");
      li.id = `command-palette-action-${index}`;
      li.setAttribute("role", "option");
      li.setAttribute("data-testid", `command-palette-action-${index}`);
      li.className = "command-palette-action";
      if (action.disabled) li.setAttribute("aria-disabled", "true");
      if (index === activeIndex) li.setAttribute("aria-selected", "true");
      const content = highlight(action.label);
      if (typeof content === "string") {
        li.textContent = content;
      } else {
        li.appendChild(content);
      }
      li.addEventListener("mousedown", (event) => {
        event.preventDefault();
        if (action.disabled) return;
        execute(action);
      });
      list.appendChild(li);
    });
  }

  function execute(action) {
    confirmation.textContent = `Executed: ${action.label}`;
    dialog.close();
  }

  function resetFilter() {
    query = "";
    filtered = actions.filter(matches);
    activeIndex = -1;
    render();
  }

  function setActive(index) {
    activeIndex = index;
    render();
    if (activeIndex === -1) {
      input.setAttribute("aria-activedescendant", "");
    } else {
      input.setAttribute("aria-activedescendant", `command-palette-action-${activeIndex}`);
      list.children[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }

  function enabledIndices() {
    return filtered.reduce((acc, action, index) => {
      if (!action.disabled) acc.push(index);
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
    filtered = actions.filter(matches);
    activeIndex = -1;
    render();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Enter") {
      if (activeIndex !== -1 && !filtered[activeIndex]?.disabled) {
        event.preventDefault();
        execute(filtered[activeIndex]);
      }
    }
  });

  dialog.addEventListener("close", () => {
    input.value = "";
  });

  wireDialogClose(dialog);

  document.addEventListener("keydown", (event) => {
    const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    if (!isShortcut) return;
    event.preventDefault();
    if (document.querySelector("dialog[open]")) return;
    dialog._lastTrigger = document.activeElement;
    confirmation.textContent = "";
    resetFilter();
    dialog.showModal();
  });
}
