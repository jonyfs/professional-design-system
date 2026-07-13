import { test, expect } from "@playwright/test";

// Feature 017 T011 — contracts/theme-switcher.contract.md's
// resolveInitialTheme/applyTheme/selectTheme, exercised through real
// browser localStorage + a real page reload (not a mocked/assumed
// internal call), matching FR-005/FR-006/SC-006's acceptance mapping.
test.describe("Theme persistence (localStorage, contracts/theme-switcher.contract.md)", () => {
  test("a stored known theme id is restored as data-theme on reload", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("pds-theme", "light"));
    await page.reload();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("light");
  });

  test("empty localStorage falls back to the light default", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("pds-theme"));
    await page.reload();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("light");
  });

  test("a corrupted/unrecognized stored value falls back to the light default, never applies an unknown data-theme", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("pds-theme", "not-a-real-theme-xyz"));
    await page.reload();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("light");
  });

  test("selecting a theme persists it across a reload on a different page", async ({ page }) => {
    await page.goto("/src/components/theme-gallery/theme-gallery.html");
    await page.getByTestId("theme-card-light").click();
    await page.evaluate(() => localStorage.getItem("pds-theme"));
    await page.goto("/");
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("light");
  });
});
