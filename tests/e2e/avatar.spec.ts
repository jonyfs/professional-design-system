import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Avatar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/avatar/avatar.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("all variants match visual baseline", async ({ page }) => {
    await expect(page.locator("body")).toHaveScreenshot("avatar-all-variants.png");
  });

  test("image variant has non-empty alt text (AC1)", async ({ page }) => {
    const img = page.getByTestId("avatar-image-lg");
    const alt = await img.getAttribute("alt");
    expect(alt).toBeTruthy();
  });

  test("fallback variant has an accessible name (AC2)", async ({ page }) => {
    const fallback = page.getByTestId("avatar-fallback-lg");
    const ariaLabel = await fallback.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
  });

  test("both variants render as a perfect circle at every size (AC3)", async ({ page }) => {
    for (const testId of [
      "avatar-image-lg",
      "avatar-fallback-lg",
      "avatar-image-sm",
      "avatar-fallback-sm",
    ]) {
      const el = page.getByTestId(testId);
      const box = await el.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeCloseTo(box!.height, 0);
      const borderRadius = await el.evaluate((node) => getComputedStyle(node).borderRadius);
      expect(borderRadius).not.toBe("0px");
    }
  });

  test("single-word name renders a single initial (Edge Case)", async ({ page }) => {
    await expect(page.getByTestId("avatar-fallback-single")).toHaveText("M");
  });
});
