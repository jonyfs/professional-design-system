import { test, expect } from "@playwright/test";

// Feature 025 — verifies feature 017/021's already-shipped theme
// mechanism now works on every static gallery page, not just index.html
// and theme-gallery.html. Tests a representative sample spanning this
// catalog's Component Catalog categories (research.md R3) rather than
// all 77 pages exhaustively — the risk is a missed/malformed page, which
// scripts/check-theme-rollout.mjs catches completely and directly;
// Playwright here proves the shared mechanism actually behaves correctly
// end-to-end on a representative cross-section.
const SAMPLE_PAGES = [
  "/src/components/button/button.html", // Application & Navigation-adjacent
  "/src/components/text-input/text-input.html", // Forms & Inputs
  "/src/components/avatar/avatar.html", // Data Display & Listings
  "/src/components/toast/toast.html", // Overlays & Feedback
  "/src/components/combobox/combobox.html", // Advanced Forms & Interaction
];

test.describe("Theme persists across navigation (US1)", () => {
  test("selecting a theme on one page and navigating to another applies it before first paint", async ({
    page,
  }) => {
    await page.goto(SAMPLE_PAGES[0]);
    await page.selectOption("#gallery-theme-select", "dracula");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dracula");

    for (const url of SAMPLE_PAGES.slice(1)) {
      await page.goto(url);
      // data-theme is set by theme-switcher.js's <head>-level bootstrap,
      // before this assertion ever runs — no flash-of-default to catch
      // directly, but a wrong/missing theme would show here immediately.
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dracula");
    }
  });

  test("a page loaded with no prior selection falls back to the default theme", async ({ page, context }) => {
    await context.clearCookies();
    await page.addInitScript(() => localStorage.clear());
    await page.goto(SAMPLE_PAGES[2]);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});

test.describe("Selector available on every page (US2)", () => {
  for (const url of SAMPLE_PAGES) {
    test(`${url} has a populated, functional theme selector`, async ({ page }) => {
      await page.goto(url);
      const select = page.locator("#gallery-theme-select");
      await expect(select).toBeVisible();
      const optionCount = await select.locator("option").count();
      expect(optionCount).toBeGreaterThan(1);

      await select.selectOption("nord");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "nord");
    });
  }
});
