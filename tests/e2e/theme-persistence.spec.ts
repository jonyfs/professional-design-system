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

  test("empty localStorage falls back to the light default when the OS has no dark preference", async ({
    page,
  }) => {
    // Feature 045 — resolveInitialTheme now seeds from prefers-color-scheme
    // when nothing is stored; pin colorScheme so this test exercises the
    // no-dark-preference path deterministically, regardless of the runner's
    // own OS setting (see the two "OS prefers dark" tests below for the
    // other branch).
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("pds-theme"));
    await page.reload();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("light");
  });

  test("a corrupted/unrecognized stored value falls back to the light default, never applies an unknown data-theme", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("pds-theme", "not-a-real-theme-xyz"));
    await page.reload();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("light");
  });

  // Feature 045 (spec.md FR-004, User Story 2) — a first-time visitor with
  // no stored choice and an OS dark preference sees a dark theme by default.
  test("empty localStorage with an OS dark preference seeds the dark default (dim)", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("pds-theme"));
    await page.reload();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe("dim");
  });

  test("a stored, recognized theme choice always wins over the OS dark preference", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("pds-theme", "light"));
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
