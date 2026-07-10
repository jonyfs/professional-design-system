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
      },
    },
  },
  server: {
    port: 5174,
  },
});
