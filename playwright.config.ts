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
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
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
