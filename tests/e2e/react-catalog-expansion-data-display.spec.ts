import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 023 US3 — React surface. Mirrors
// catalog-expansion-data-display.spec.ts against the React harness. All 4
// components render on one combined harness page.
const HARNESS_URL = "http://localhost:5174/catalog-expansion-data-display.html";

test.describe("Catalog Expansion — Data Display (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("Avatar Group shows a +N chip only when members exceed the limit (AC1)", async ({
    page,
  }) => {
    const chip = page.getByTestId("avatar-group-overflow-chip");
    await expect(chip).toBeVisible();
    await expect(chip).toHaveText(/\+3/);

    const within = page.getByTestId("avatar-group-within");
    await expect(within.locator("text=/^\\+/")).toHaveCount(0);
  });

  test("Highlight wraps only matching substrings case-insensitively in <mark> (AC2)", async ({
    page,
  }) => {
    const marks = page.getByTestId("highlight-match").locator("mark");
    await expect(marks).toHaveCount(2);
    await expect(marks.nth(0)).toHaveText("Co");
    await expect(marks.nth(1)).toHaveText("Co");

    const noMatch = page.getByTestId("highlight-no-match").locator("mark");
    await expect(noMatch).toHaveCount(0);
  });

  test("Code inline and block variants both use a monospace font (AC3)", async ({ page }) => {
    const inlineFont = await page
      .getByTestId("code-inline")
      .evaluate((el) => getComputedStyle(el).fontFamily);
    const blockFont = await page
      .getByTestId("code-block")
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(inlineFont.toLowerCase()).toContain("mono");
    expect(blockFont.toLowerCase()).toContain("mono");
  });

  test("Color Swatch exposes a .sr-only accessible text alternative (AC4)", async ({ page }) => {
    const srOnly = page.getByTestId("color-swatch-brand").locator(".sr-only");
    await expect(srOnly).toHaveCount(1);
    const text = await srOnly.textContent();
    expect(text).toContain("#2563eb");

    const chip = page.getByTestId("color-swatch-brand").locator(".color-swatch");
    const bg = await chip.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(37, 99, 235)");
  });
});
