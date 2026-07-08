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
      },
    },
  },
  server: {
    port: 5173,
  },
});
