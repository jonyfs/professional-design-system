import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Feature 042 — a new, standalone, PUBLISHED app (unlike
// tests/react-harness, which is explicitly dev-only/never published).
// `base` defaults to "/" for local dev; the GitHub Pages deploy
// workflow overrides it via GITHUB_PAGES_BASE so every asset resolves
// under the /showcase/ subpath of the deployed site.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES_BASE || "/",
  server: {
    port: 5175,
  },
});
