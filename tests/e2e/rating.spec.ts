import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Rating", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/rating/rating.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("the real numeric value renders as visible text", async ({ page }) => {
    const fractional = page.getByTestId("rating-fractional");
    await expect(fractional.locator(".rating-value")).toHaveText("4.2 out of 5");
  });

  test("star icons are aria-hidden", async ({ page }) => {
    const fractional = page.getByTestId("rating-fractional");
    await expect(fractional.locator(".rating-stars")).toHaveAttribute("aria-hidden", "true");
  });

  test("a whole-number example shows exactly 5 filled stars and no false partial star", async ({
    page,
  }) => {
    const whole = page.getByTestId("rating-whole");
    await expect(whole.locator(".rating-value")).toHaveText("5 out of 5");
    await expect(whole.locator(".rating-star-filled")).toHaveCount(5);
    await expect(whole.locator(".rating-star-empty")).toHaveCount(0);
  });

  test("the fractional example rounds to the nearest whole star for the visual only", async ({
    page,
  }) => {
    const fractional = page.getByTestId("rating-fractional");
    await expect(fractional.locator(".rating-star-filled")).toHaveCount(4);
    await expect(fractional.locator(".rating-star-empty")).toHaveCount(1);
  });

  test("matches visual baseline for both examples", async ({ page }) => {
    await expect(page.getByTestId("rating-demo-wrapper")).toHaveScreenshot("rating-all.png");
  });
});
