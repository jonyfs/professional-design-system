import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("AspectRatio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/aspect-ratio/aspect-ratio.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("16:9 preset computes the correct aspect-ratio", async ({ page }) => {
    const ratio = await page
      .getByTestId("aspect-ratio-16-9")
      .evaluate((el) => getComputedStyle(el).aspectRatio);
    expect(ratio.replace(/\s/g, "")).toBe("16/9");
  });

  test("1:1 preset computes the correct aspect-ratio", async ({ page }) => {
    const ratio = await page
      .getByTestId("aspect-ratio-1-1")
      .evaluate((el) => getComputedStyle(el).aspectRatio);
    expect(ratio.replace(/\s/g, "")).toBe("1/1");
  });

  test("4:3 preset computes the correct aspect-ratio", async ({ page }) => {
    const ratio = await page
      .getByTestId("aspect-ratio-4-3")
      .evaluate((el) => getComputedStyle(el).aspectRatio);
    expect(ratio.replace(/\s/g, "")).toBe("4/3");
  });

  test("matches visual baseline for all three presets", async ({ page }) => {
    await expect(page.getByTestId("aspect-ratio-demo-wrapper")).toHaveScreenshot(
      "aspect-ratio-all.png",
    );
  });
});
