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
        list: resolve(__dirname, "src/components/list/list.html"),
        table: resolve(__dirname, "src/components/table/table.html"),
        textarea: resolve(__dirname, "src/components/textarea/textarea.html"),
        divider: resolve(__dirname, "src/components/divider/divider.html"),
        kbd: resolve(__dirname, "src/components/kbd/kbd.html"),
        skeleton: resolve(__dirname, "src/components/skeleton/skeleton.html"),
        tooltip: resolve(__dirname, "src/components/tooltip/tooltip.html"),
        progress: resolve(__dirname, "src/components/progress/progress.html"),
        buttonGroup: resolve(__dirname, "src/components/button-group/button-group.html"),
        emptyState: resolve(__dirname, "src/components/empty-state/empty-state.html"),
        popover: resolve(__dirname, "src/components/popover/popover.html"),
        contextMenu: resolve(__dirname, "src/components/context-menu/context-menu.html"),
        composedExample: resolve(
          __dirname,
          "src/components/composed-example/composed-example.html",
        ),
        spinner: resolve(__dirname, "src/components/spinner/spinner.html"),
        aspectRatio: resolve(__dirname, "src/components/aspect-ratio/aspect-ratio.html"),
        indicator: resolve(__dirname, "src/components/indicator/indicator.html"),
        dataList: resolve(__dirname, "src/components/data-list/data-list.html"),
        slider: resolve(__dirname, "src/components/slider/slider.html"),
        stepper: resolve(__dirname, "src/components/stepper/stepper.html"),
        fileInput: resolve(__dirname, "src/components/file-input/file-input.html"),
        timeline: resolve(__dirname, "src/components/timeline/timeline.html"),
        statCard: resolve(__dirname, "src/components/stat-card/stat-card.html"),
        pinInput: resolve(__dirname, "src/components/pin-input/pin-input.html"),
        dashboardExample: resolve(
          __dirname,
          "src/components/dashboard-example/dashboard-example.html",
        ),
        treeView: resolve(__dirname, "src/components/tree-view/tree-view.html"),
        rating: resolve(__dirname, "src/components/rating/rating.html"),
        menubar: resolve(__dirname, "src/components/menubar/menubar.html"),
        colorInput: resolve(__dirname, "src/components/color-input/color-input.html"),
        settingsExample: resolve(
          __dirname,
          "src/components/settings-example/settings-example.html",
        ),
      },
    },
  },
  server: {
    port: 5173,
  },
});
