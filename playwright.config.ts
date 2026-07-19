import { defineConfig, devices } from "@playwright/test";

// Breakpoints per rules/web/testing.md: 320, 768, 1024, 1440.
const breakpoints = {
  320: { width: 320, height: 800 },
  768: { width: 768, height: 900 },
  1024: { width: 1024, height: 900 },
  1440: { width: 1440, height: 960 },
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Feature 043: in CI, each sharded job reports via "blob" so the
  // merge-reports job in .github/workflows/ci.yml can combine every
  // shard into one aggregated HTML report — see research.md R2.
  reporter: process.env.CI ? "blob" : "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "npm run dev",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
    },
    {
      // React test harness (feature 004) — a separate Vite dev server on
      // its own port, since it's an independent workspace package, not
      // part of the static site's vite.config.ts multi-page build.
      // react-*.spec.ts files construct absolute http://localhost:5174
      // URLs rather than relying on the shared `use.baseURL` above.
      command: "npm run dev --workspace tests/react-harness",
      url: "http://localhost:5174",
      reuseExistingServer: !process.env.CI,
    },
    {
      // Flagship App Showcase (feature 042) — its own standalone,
      // PUBLISHED workspace (unlike the dev-only react-harness above),
      // same "separate Vite dev server, absolute URLs" pattern.
      // flagship-showcase.spec.ts constructs absolute
      // http://localhost:5175 URLs rather than the shared baseURL.
      command: "npm run dev --workspace showcase",
      url: "http://localhost:5175",
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [
    {
      name: "chromium-320",
      use: { ...devices["Desktop Chrome"], viewport: breakpoints[320] },
    },
    {
      name: "chromium-768",
      use: { ...devices["Desktop Chrome"], viewport: breakpoints[768] },
    },
    {
      name: "chromium-1024",
      use: { ...devices["Desktop Chrome"], viewport: breakpoints[1024] },
    },
    {
      name: "chromium-1440",
      use: { ...devices["Desktop Chrome"], viewport: breakpoints[1440] },
    },
    {
      name: "firefox-1440",
      use: { ...devices["Desktop Firefox"], viewport: breakpoints[1440] },
    },
    {
      name: "webkit-1440",
      use: { ...devices["Desktop Safari"], viewport: breakpoints[1440] },
    },
  ],
});
