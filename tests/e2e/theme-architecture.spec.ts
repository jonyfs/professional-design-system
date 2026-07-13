import { test, expect } from "@playwright/test";

// Feature 017 T001 — proves the CSS-custom-property theme mechanism
// (research.md R1) before any theme-consuming feature (gallery,
// switcher) exists. Uses a throwaway "poc-test" theme block declared
// ONLY in this test's own fixture page, never shipped in themes.css.
test.describe("Theme architecture (CSS custom properties)", () => {
  test("switching data-theme restyles a representative component sample with zero markup changes", async ({
    page,
  }) => {
    await page.goto("/tests/e2e/fixtures/theme-architecture-poc.html");

    const button = page.getByTestId("poc-button");
    const before = await button.evaluate((el) => getComputedStyle(el).backgroundColor);

    await page.evaluate(() => {
      document.documentElement.dataset.theme = "poc-test";
    });

    const after = await button.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(after).not.toBe(before);
  });

  test("opacity-modifier utilities (bg-success/5) still compute the correct alpha-blended color under a non-default theme", async ({
    page,
  }) => {
    await page.goto("/tests/e2e/fixtures/theme-architecture-poc.html");

    await page.evaluate(() => {
      document.documentElement.dataset.theme = "poc-test";
    });

    const badge = page.getByTestId("poc-badge");
    const bg = await badge.evaluate((el) => getComputedStyle(el).backgroundColor);
    // poc-test's success token is 22 163 74 (a distinct throwaway value
    // from "light"'s 16 185 129) at 5% alpha.
    expect(bg).toBe("rgba(22, 163, 74, 0.05)");
  });
});
