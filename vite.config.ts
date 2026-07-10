import { resolve } from "node:path";
import { defineConfig } from "vite";

// Multi-page static build: the gallery index links out to each component's
// own standalone HTML page (so a developer can open/copy a single component
// page in isolation, per each user story's "Independent Test" requirement).
export default defineConfig({
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        button: resolve(__dirname, "src/components/button/button.html"),
        textInput: resolve(__dirname, "src/components/text-input/text-input.html"),
        badge: resolve(__dirname, "src/components/badge/badge.html"),
        checkbox: resolve(__dirname, "src/components/checkbox/checkbox.html"),
        radio: resolve(__dirname, "src/components/radio/radio.html"),
        select: resolve(__dirname, "src/components/select/select.html"),
        toggle: resolve(__dirname, "src/components/toggle/toggle.html"),
        modal: resolve(__dirname, "src/components/modal/modal.html"),
        toast: resolve(__dirname, "src/components/toast/toast.html"),
        slideOver: resolve(__dirname, "src/components/slide-over/slide-over.html"),
        breadcrumbs: resolve(__dirname, "src/components/breadcrumbs/breadcrumbs.html"),
        accordion: resolve(__dirname, "src/components/accordion/accordion.html"),
        tabs: resolve(__dirname, "src/components/tabs/tabs.html"),
        dropdownMenu: resolve(__dirname, "src/components/dropdown-menu/dropdown-menu.html"),
        avatar: resolve(__dirname, "src/components/avatar/avatar.html"),
        card: resolve(__dirname, "src/components/card/card.html"),
        alert: resolve(__dirname, "src/components/alert/alert.html"),
        pagination: resolve(__dirname, "src/components/pagination/pagination.html"),
        sidebar: resolve(__dirname, "src/components/sidebar/sidebar.html"),
        navbar: resolve(__dirname, "src/components/navbar/navbar.html"),
        combobox: resolve(__dirname, "src/components/combobox/combobox.html"),
        commandPalette: resolve(__dirname, "src/components/command-palette/command-palette.html"),
      },
    },
  },
  server: {
    port: 5173,
  },
});
