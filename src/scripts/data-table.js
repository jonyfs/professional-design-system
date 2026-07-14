// Static-HTML DataTable wiring (contracts/core-table.contract.md,
// selection-bulk-actions.contract.md, crud-operations.contract.md).
// Reuses the exact same shared/data-table/ pure functions the React
// DataTable consumes — no algorithm hand-typed twice (research.md,
// mirroring feature 019's shared/validators/ precedent).
import {
  applyFilter,
  applySort,
  clearSelection,
  emptySelection,
  isFilterActive,
  pageCount,
  paginate,
  selectAllMatching,
  selectPage,
  toggleRow,
  toggleSort,
} from "../../shared/data-table/index.ts";
import { wireDialogClose } from "./overlay.js";

function el(tag, className, children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const child of children ?? []) {
    if (child === null || child === undefined) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function svgIcon(pathD) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("class", "h-4 w-4");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
}

const EDIT_ICON_PATH =
  "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z";
const DELETE_ICON_PATH = "M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z";

function sortIcon(direction) {
  if (direction === "asc") return "▲";
  if (direction === "desc") return "▼";
  return "↕";
}

export function initDataTable(container, config) {
  const { columns, ariaLabel, pageSize = 10, bulkActions = [], crud = {}, fields, onCreate, onEdit, onDelete } =
    config;
  let rows = [...config.rows];
  let sortState = [];
  let filterState = { globalQuery: "", columnFilters: {} };
  let page = 1;
  let selection = emptySelection();
  let hiddenColumnIds = new Set();
  // render() tears down and rebuilds the whole subtree on every state
  // change (container.innerHTML = ""), which would otherwise reset the
  // native <details> open/closed state on every checkbox toggle inside
  // it — tracked here and restored after each rebuild.
  let columnsMenuOpen = false;
  let editingRowId = null;
  let formMode = null; // "create" | "edit" | null

  const editableFields = fields ?? columns.filter((c) => c.id !== "actions").map((c) => ({ id: c.id, label: c.label }));

  const statusId = `${container.id}-status`;
  const status = el("p", "sr-only", [""]);
  status.id = statusId;
  status.setAttribute("aria-live", "polite");

  function announce(message) {
    status.textContent = message;
  }

  function currentPipeline() {
    const filtered = applyFilter(rows, filterState, columns);
    const sorted = applySort(filtered, sortState, columns);
    const total = pageCount(sorted.length, pageSize);
    const currentPage = Math.min(page, total);
    const pageRows = paginate(sorted, currentPage, pageSize);
    return { filtered, sorted, total, currentPage, pageRows };
  }

  function render() {
    container.innerHTML = "";
    const { sorted, total, currentPage, pageRows } = currentPipeline();
    const visibleColumns = columns.filter((c) => !hiddenColumnIds.has(c.id));
    const pageRowIds = pageRows.map((r) => r.id);
    const allMatchingIds = sorted.map((r) => r.id);
    const hasMoreThanOnePage = sorted.length > pageSize;

    container.appendChild(status);

    // --- top bar: search + add record ---
    const topBar = el("div", "mb-3 flex flex-wrap items-center justify-between gap-3");
    const search = el("input", null, []);
    search.type = "search";
    search.setAttribute("aria-label", "Search");
    search.placeholder = "Search…";
    search.value = filterState.globalQuery;
    search.className =
      "block w-full max-w-xs rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-600 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6";
    search.addEventListener("input", () => {
      filterState = { ...filterState, globalQuery: search.value };
      page = 1;
      render();
    });
    topBar.appendChild(search);

    const rightGroup = el("div", "flex items-center gap-3", []);
    // Column visibility (FR-013) — native <details>/<summary> disclosure,
    // this catalog's zero-JS-friendly convention (Accordion).
    const columnsDetails = el("details", "relative", []);
    columnsDetails.open = columnsMenuOpen;
    columnsDetails.addEventListener("toggle", () => {
      columnsMenuOpen = columnsDetails.open;
    });
    const summary = el("summary", "cursor-pointer list-none rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand", ["Columns"]);
    const columnsMenu = el("div", "absolute left-0 z-10 mt-1 w-48 rounded-md border border-neutral-200 bg-neutral-50 p-2 shadow-lg sm:left-auto sm:right-0", []);
    for (const column of columns) {
      const label = el("label", "flex items-center gap-2 rounded-sm px-2 py-1 text-sm text-neutral-900 hover:bg-neutral-100", []);
      const checkbox = el("input", "h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand", []);
      checkbox.type = "checkbox";
      checkbox.checked = !hiddenColumnIds.has(column.id);
      checkbox.addEventListener("change", () => {
        hiddenColumnIds.has(column.id) ? hiddenColumnIds.delete(column.id) : hiddenColumnIds.add(column.id);
        render();
      });
      label.append(checkbox, column.label);
      columnsMenu.appendChild(label);
    }
    columnsDetails.append(summary, columnsMenu);
    rightGroup.appendChild(columnsDetails);

    if (crud.create) {
      const addButton = el("button", "btn-primary", ["Add record"]);
      addButton.type = "button";
      addButton.addEventListener("click", () => {
        formMode = "create";
        editingRowId = null;
        openForm(addButton);
      });
      rightGroup.appendChild(addButton);
    }
    topBar.appendChild(rightGroup);
    container.appendChild(topBar);

    // --- bulk toolbar ---
    if (selection.ids.size > 0) {
      const toolbar = el("div", "mb-2 flex items-center gap-3 rounded-md border border-neutral-200 bg-neutral-100 px-4 py-2", []);
      toolbar.setAttribute("role", "region");
      toolbar.setAttribute("aria-label", "Bulk actions");
      toolbar.appendChild(el("span", "text-sm font-medium text-neutral-900", [`${selection.ids.size} selected`]));
      const btnGroup = el("div", "flex items-center gap-2", []);
      for (const action of bulkActions) {
        const btn = el(
          "button",
          "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed",
          [action.label],
        );
        btn.type = "button";
        btn.addEventListener("click", () => {
          const ids = [...selection.ids];
          const run = () => {
            action.onTrigger?.(ids);
            announce(`${action.label} applied to ${ids.length} row${ids.length === 1 ? "" : "s"}`);
            selection = clearSelection();
            render();
          };
          if (action.requiresConfirmation) {
            openConfirm(`Apply "${action.label}" to ${ids.length} selected row(s)? This cannot be undone.`, run, btn);
          } else {
            run();
          }
        });
        btnGroup.appendChild(btn);
      }
      toolbar.appendChild(btnGroup);
      container.appendChild(toolbar);
    }

    // --- table or empty state ---
    if (pageRows.length === 0) {
      const filtered = isFilterActive(filterState);
      const empty = el("div", "flex flex-col items-center gap-3 py-12 text-center", [
        (() => {
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("aria-hidden", "true");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("fill", "none");
          svg.setAttribute("class", "h-10 w-10 text-neutral-400");
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", "M3 3v18h18M7 15l4-4 3 3 5-6");
          path.setAttribute("stroke", "currentColor");
          path.setAttribute("stroke-width", "1.5");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-linejoin", "round");
          svg.appendChild(path);
          return svg;
        })(),
        el("p", "text-sm font-semibold text-neutral-900", [filtered ? "No results match your filters" : "No data yet"]),
      ]);
      container.appendChild(empty);
    } else {
      const wrapper = el("div", "data-table-wrapper", []);
      wrapper.tabIndex = 0;
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", ariaLabel);
      const table = el("table", "data-table", []);
      table.setAttribute("aria-describedby", statusId);

      const thead = el("thead", null, []);
      const headerRow = el("tr", null, []);
      const selectAllTh = el("th", "data-table-header-cell", []);
      selectAllTh.setAttribute("scope", "col");
      const selectAllCheckbox = el("input", "h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand", []);
      selectAllCheckbox.type = "checkbox";
      selectAllCheckbox.setAttribute("aria-label", hasMoreThanOnePage ? "Select this page" : "Select all");
      selectAllCheckbox.checked = pageRowIds.length > 0 && pageRowIds.every((id) => selection.ids.has(id));
      selectAllCheckbox.addEventListener("change", () => {
        selection = pageRowIds.every((id) => selection.ids.has(id)) ? clearSelection() : selectPage(selection, pageRowIds);
        render();
      });
      selectAllTh.appendChild(selectAllCheckbox);
      headerRow.appendChild(selectAllTh);

      for (const column of visibleColumns) {
        const th = el("th", "data-table-header-cell", []);
        th.setAttribute("scope", "col");
        if (column.sortable === false) {
          th.textContent = column.label;
        } else {
          const entry = sortState.find((e) => e.columnId === column.id);
          th.setAttribute("aria-sort", entry ? (entry.direction === "asc" ? "ascending" : "descending") : "none");
          const btn = el(
            "button",
            "inline-flex items-center gap-1 hover:text-neutral-900 active:text-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            [column.label, " ", el("span", null, [sortIcon(entry?.direction)])],
          );
          btn.type = "button";
          btn.addEventListener("click", () => {
            sortState = toggleSort(sortState, column.id);
            const next = sortState.find((e) => e.columnId === column.id);
            announce(next ? `Sorted by ${column.id}, ${next.direction}ending` : `Sort removed for ${column.id}`);
            render();
          });
          th.appendChild(btn);
        }
        headerRow.appendChild(th);
      }
      if (crud.edit || crud.delete) {
        const actionsTh = el("th", "data-table-header-cell", ["Actions"]);
        actionsTh.setAttribute("scope", "col");
        headerRow.appendChild(actionsTh);
      }
      thead.appendChild(headerRow);

      if (visibleColumns.some((c) => c.filterable !== false)) {
        const filterRow = el("tr", null, []);
        filterRow.appendChild(el("td", "data-table-cell", []));
        for (const column of visibleColumns) {
          const td = el("td", "data-table-cell", []);
          if (column.filterable !== false) {
            const input = el("input", "block w-full rounded-md border-0 py-1 text-xs text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-brand", []);
            input.type = "text";
            input.setAttribute("aria-label", `Filter ${column.label}`);
            input.value = filterState.columnFilters[column.id] ?? "";
            input.addEventListener("input", () => {
              filterState = { ...filterState, columnFilters: { ...filterState.columnFilters, [column.id]: input.value } };
              page = 1;
              render();
            });
            td.appendChild(input);
          }
          filterRow.appendChild(td);
        }
        if (crud.edit || crud.delete) filterRow.appendChild(el("td", "data-table-cell", []));
        thead.appendChild(filterRow);
      }
      table.appendChild(thead);

      const tbody = el("tbody", "divide-y divide-neutral-200 bg-neutral-50", []);
      for (const row of pageRows) {
        const tr = el("tr", null, []);
        const selTd = el("td", "data-table-cell", []);
        const checkbox = el("input", "h-4 w-4 rounded-sm border-neutral-300 text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand", []);
        checkbox.type = "checkbox";
        checkbox.setAttribute("aria-label", `Select row ${row.id}`);
        checkbox.checked = selection.ids.has(row.id);
        checkbox.addEventListener("change", () => {
          selection = toggleRow(selection, row.id);
          render();
        });
        selTd.appendChild(checkbox);
        tr.appendChild(selTd);

        for (const column of visibleColumns) {
          tr.appendChild(el("td", "data-table-cell", [String(row[column.id] ?? "")]));
        }

        if (crud.edit || crud.delete) {
          const actionsTd = el("td", "data-table-cell", []);
          const actionsGroup = el("div", "flex items-center justify-end gap-1", []);
          if (crud.edit) {
            const editBtn = el("button", "inline-flex items-center justify-center rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed", [svgIcon(EDIT_ICON_PATH)]);
            editBtn.type = "button";
            editBtn.setAttribute("aria-label", "Edit row");
            editBtn.addEventListener("click", () => {
              formMode = "edit";
              editingRowId = row.id;
              openForm(editBtn);
            });
            actionsGroup.appendChild(editBtn);
          }
          if (crud.delete) {
            const deleteBtn = el("button", "inline-flex items-center justify-center rounded-md p-1.5 text-neutral-600 hover:bg-error/5 hover:text-error-strong active:bg-error/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed", [svgIcon(DELETE_ICON_PATH)]);
            deleteBtn.type = "button";
            deleteBtn.setAttribute("aria-label", "Delete row");
            deleteBtn.addEventListener("click", () => {
              openConfirm(
                "This action cannot be undone.",
                () => {
                  rows = rows.filter((r) => r.id !== row.id);
                  onDelete?.(row.id);
                  announce("Record deleted");
                  render();
                },
                deleteBtn,
              );
            });
            actionsGroup.appendChild(deleteBtn);
          }
          actionsTd.appendChild(actionsGroup);
          tr.appendChild(actionsTd);
        }
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      wrapper.appendChild(table);
      container.appendChild(wrapper);
    }

    // --- pagination ---
    if (total > 1) {
      const nav = el("nav", "pagination-nav mt-4", []);
      nav.setAttribute("aria-label", "Table pagination");
      const prevBtn = el("button", "pagination-control", ["Previous"]);
      prevBtn.type = "button";
      prevBtn.disabled = currentPage <= 1;
      prevBtn.addEventListener("click", () => {
        page = currentPage - 1;
        render();
      });
      const nextBtn = el("button", "pagination-control", ["Next"]);
      nextBtn.type = "button";
      nextBtn.disabled = currentPage >= total;
      nextBtn.addEventListener("click", () => {
        page = currentPage + 1;
        render();
      });
      nav.append(prevBtn, el("span", "text-sm text-neutral-600", [`Page ${currentPage} of ${total}`]), nextBtn);
      container.appendChild(nav);
    }

    // --- page-vs-all-matching selection scope link ---
    if (sorted.length > pageSize && selection.ids.size > 0) {
      const link = el(
        "button",
        "mt-2 text-xs font-medium text-brand hover:text-brand-dark",
        [
          selection.scope === "all-matching"
            ? `Select this page only (${pageRowIds.length})`
            : `Select all ${allMatchingIds.length} matching rows`,
        ],
      );
      link.type = "button";
      link.addEventListener("click", () => {
        selection = selection.scope === "all-matching" ? selectPage(selection, pageRowIds) : selectAllMatching(selection, allMatchingIds);
        render();
      });
      container.appendChild(link);
    }
  }

  // --- CRUD dialog (create/edit) ---
  const formDialog = document.createElement("dialog");
  formDialog.className = "modal-dialog";
  const formPanel = el("div", "modal-panel", []);
  formDialog.appendChild(formPanel);
  document.body.appendChild(formDialog);
  wireDialogClose(formDialog);

  function fieldValue(rowId, fieldId) {
    if (!rowId) return "";
    const row = rows.find((r) => r.id === rowId);
    return row ? String(row[fieldId] ?? "") : "";
  }

  function openForm(triggerEl) {
    formDialog._lastTrigger = triggerEl;
    formPanel.innerHTML = "";
    formPanel.appendChild(el("h2", "text-lg font-semibold text-neutral-900", [formMode === "create" ? "Add record" : "Edit record"]));
    const form = el("form", "mt-4 space-y-4", []);
    const inputs = {};
    for (const field of editableFields) {
      const wrapper = el("div", "space-y-1", []);
      const label = el("label", "text-sm font-medium text-neutral-900", [field.label]);
      const input = el("input", "block w-full rounded-md border-0 bg-neutral-50 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6", []);
      input.type = "text";
      const inputId = `${statusId}-field-${field.id}`;
      input.id = inputId;
      label.htmlFor = inputId;
      input.value = fieldValue(editingRowId, field.id);
      const errorP = el("p", "hidden text-xs text-error-strong mt-1 font-medium", []);
      errorP.setAttribute("aria-live", "polite");
      wrapper.append(label, input, errorP);
      form.appendChild(wrapper);
      inputs[field.id] = { input, errorP, initialValue: input.value };
    }

    // FR-018: warn before discarding unsaved input rather than closing
    // silently — swaps the form body for a discard-confirm step instead
    // of stacking a second dialog.
    function isDirty() {
      return Object.values(inputs).some(({ input, initialValue }) => input.value !== initialValue);
    }
    function attemptClose() {
      if (isDirty()) {
        showDiscardConfirm();
      } else {
        formDialog.close();
      }
    }
    function showDiscardConfirm() {
      const overlay = el("div", "space-y-4", [
        el("p", "text-sm text-neutral-600", ["Discard unsaved changes?"]),
      ]);
      const keepBtn = el("button", "btn-secondary", ["Keep editing"]);
      keepBtn.type = "button";
      keepBtn.addEventListener("click", () => openForm(triggerEl));
      const discardBtn = el("button", "btn-primary", ["Discard"]);
      discardBtn.type = "button";
      discardBtn.addEventListener("click", () => formDialog.close());
      overlay.appendChild(el("div", "flex justify-end gap-3", [keepBtn, discardBtn]));
      formPanel.innerHTML = "";
      formPanel.appendChild(overlay);
    }
    formDialog.oncancel = (event) => {
      if (isDirty()) {
        event.preventDefault();
        showDiscardConfirm();
      }
    };

    const actions = el("div", "flex justify-end gap-3", []);
    const cancelBtn = el("button", "btn-secondary", ["Cancel"]);
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", () => attemptClose());
    const submitBtn = el("button", "btn-primary", [formMode === "create" ? "Add" : "Save"]);
    submitBtn.type = "submit";
    actions.append(cancelBtn, submitBtn);
    form.appendChild(actions);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = {};
      let hasError = false;
      for (const field of editableFields) {
        const { input, errorP } = inputs[field.id];
        values[field.id] = input.value;
        if (field.required && !input.value.trim()) {
          errorP.textContent = `${field.label} is required.`;
          errorP.classList.remove("hidden");
          input.setAttribute("aria-invalid", "true");
          hasError = true;
        } else {
          errorP.textContent = "";
          errorP.classList.add("hidden");
          input.removeAttribute("aria-invalid");
        }
      }
      if (hasError) return;

      if (formMode === "create") {
        const newRow = { id: `row-${Date.now()}`, ...values };
        rows = [...rows, newRow];
        onCreate?.(values);
        announce("Record created");
      } else if (formMode === "edit" && editingRowId) {
        rows = rows.map((r) => (r.id === editingRowId ? { ...r, ...values } : r));
        onEdit?.(editingRowId, values);
        announce("Record updated");
      }
      formDialog.close();
      render();
    });

    formPanel.appendChild(form);
    formDialog.showModal();
  }

  // --- Confirm dialog (bulk actions + delete) ---
  const confirmDialog = document.createElement("dialog");
  confirmDialog.className = "modal-dialog";
  const confirmPanel = el("div", "modal-panel", []);
  confirmDialog.appendChild(confirmPanel);
  document.body.appendChild(confirmDialog);
  wireDialogClose(confirmDialog);

  function openConfirm(message, onConfirm, triggerEl) {
    confirmDialog._lastTrigger = triggerEl;
    confirmPanel.innerHTML = "";
    confirmPanel.appendChild(el("p", "text-sm text-neutral-600", [message]));
    const actions = el("div", "mt-4 flex justify-end gap-3", []);
    const cancelBtn = el("button", "btn-secondary", ["Cancel"]);
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", () => confirmDialog.close());
    const confirmBtn = el("button", "btn-primary", ["Confirm"]);
    confirmBtn.type = "button";
    confirmBtn.addEventListener("click", () => {
      confirmDialog.close();
      onConfirm();
    });
    actions.append(cancelBtn, confirmBtn);
    confirmPanel.appendChild(actions);
    confirmDialog.showModal();
  }

  render();
}
