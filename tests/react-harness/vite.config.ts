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
      },
    },
  },
  server: {
    port: 5174,
  },
});
