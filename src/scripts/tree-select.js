// Feature 039 (research.md R1/R2) — reuses TreeView's native
// <details>/<summary> disclosure verbatim; the selection layer (which
// single node is committed) is genuinely new.
export function initTreeSelects() {
  document.querySelectorAll("[data-tree-select]").forEach((container) => {
    const trigger = container.querySelector("[data-tree-select-trigger]");
    const panel = container.querySelector("[data-tree-select-panel]");
    const hiddenInput = container.querySelector("[data-tree-select-value]");
    if (!trigger || !panel) return;

    function commit(node, label) {
      if (hiddenInput) {
        hiddenInput.value = node;
        hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      trigger.textContent = label;
      panel.querySelectorAll("[aria-selected]").forEach((el) => el.removeAttribute("aria-selected"));
      const selectedEl = panel.querySelector(`[data-node-id="${node}"]`);
      selectedEl?.setAttribute("aria-selected", "true");
      close();
    }

    function open() {
      panel.hidden = false;
    }
    function close() {
      panel.hidden = true;
    }

    panel.querySelectorAll("[data-node-selectable]").forEach((leaf) => {
      leaf.addEventListener("click", () => commit(leaf.dataset.nodeId, leaf.textContent.trim()));
      leaf.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          commit(leaf.dataset.nodeId, leaf.textContent.trim());
        }
      });
    });

    trigger.addEventListener("click", () => (panel.hidden ? open() : close()));
    trigger.addEventListener("keydown", (e) => e.key === "Escape" && close());
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) close();
    });

    close();
  });
}
