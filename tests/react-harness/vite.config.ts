import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev-only harness (never published) — a small Vite+React app that renders
// each packages/react component so the existing Playwright spec pattern
// (tests/e2e/<name>.spec.ts) can point at the React-rendered version.
// One HTML entry per component, same "independent page per component"
// precedent as the static site's own vite.config.ts.
export default defineConfig({
  root: ".",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        button: resolve(__dirname, "button.html"),
        textInput: resolve(__dirname, "text-input.html"),
        badge: resolve(__dirname, "badge.html"),
        checkbox: resolve(__dirname, "checkbox.html"),
        radio: resolve(__dirname, "radio.html"),
        select: resolve(__dirname, "select.html"),
        toggle: resolve(__dirname, "toggle.html"),
        modal: resolve(__dirname, "modal.html"),
        toast: resolve(__dirname, "toast.html"),
        slideOver: resolve(__dirname, "slide-over.html"),
        breadcrumbs: resolve(__dirname, "breadcrumbs.html"),
        accordion: resolve(__dirname, "accordion.html"),
        tabs: resolve(__dirname, "tabs.html"),
        dropdownMenu: resolve(__dirname, "dropdown-menu.html"),
        pagination: resolve(__dirname, "pagination.html"),
        sidebar: resolve(__dirname, "sidebar.html"),
        navbar: resolve(__dirname, "navbar.html"),
        avatar: resolve(__dirname, "avatar.html"),
        card: resolve(__dirname, "card.html"),
        list: resolve(__dirname, "list.html"),
        table: resolve(__dirname, "table.html"),
        alert: resolve(__dirname, "alert.html"),
        combobox: resolve(__dirname, "combobox.html"),
        commandPalette: resolve(__dirname, "command-palette.html"),
        chart: resolve(__dirname, "chart.html"),
        chartBatch2: resolve(__dirname, "chart-batch-2.html"),
        localizedInputs: resolve(__dirname, "localized-inputs.html"),
        dataTable: resolve(__dirname, "data-table.html"),
        numberInput: resolve(__dirname, "number-input.html"),
        passwordInput: resolve(__dirname, "password-input.html"),
        multiSelect: resolve(__dirname, "multi-select.html"),
        actionIcon: resolve(__dirname, "action-icon.html"),
        copyButton: resolve(__dirname, "copy-button.html"),
        splitButton: resolve(__dirname, "split-button.html"),
        catalogExpansionDataDisplay: resolve(__dirname, "catalog-expansion-data-display.html"),
        navLink: resolve(__dirname, "nav-link.html"),
        anchor: resolve(__dirname, "anchor.html"),
        collapse: resolve(__dirname, "collapse.html"),
        spoiler: resolve(__dirname, "spoiler.html"),
        layoutStructurePrimitives: resolve(__dirname, "layout-structure-primitives.html"),
        feedbackPrimitives: resolve(__dirname, "feedback-primitives.html"),
        consentSystemMessaging: resolve(__dirname, "consent-system-messaging.html"),
        navigationMicroPatterns: resolve(__dirname, "navigation-micro-patterns.html"),
        overlays: resolve(__dirname, "overlays.html"),
        dataDisplayComposables: resolve(__dirname, "data-display-composables.html"),
        dataDisplayPatterns: resolve(__dirname, "data-display-patterns.html"),
        socialLoginButtons: resolve(__dirname, "social-login-buttons.html"),
        advancedFormInputs: resolve(__dirname, "advanced-form-inputs.html"),
      },
    },
  },
  server: {
    port: 5174,
  },
});
