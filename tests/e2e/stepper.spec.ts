import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Stepper", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/stepper/stepper.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("aria-current=step is present on the current step only, in the mid-sequence example", async ({
    page,
  }) => {
    const stepper = page.getByTestId("stepper-mid");
    await expect(stepper.locator('[aria-current="step"]')).toHaveCount(1);
    await expect(stepper.locator('[aria-current="step"]')).toContainText("Shipping");
  });

  test("first-step boundary example has zero completed steps", async ({ page }) => {
    const stepper = page.getByTestId("stepper-first");
    await expect(stepper.locator(".stepper-step-completed")).toHaveCount(0);
    await expect(stepper.locator('[aria-current="step"]')).toHaveCount(1);
    await expect(stepper.locator(".stepper-step-upcoming")).toHaveCount(2);
  });

  test("last-step boundary example has zero upcoming steps", async ({ page }) => {
    const stepper = page.getByTestId("stepper-last");
    await expect(stepper.locator(".stepper-step-upcoming")).toHaveCount(0);
    await expect(stepper.locator('[aria-current="step"]')).toHaveCount(1);
    await expect(stepper.locator(".stepper-step-completed")).toHaveCount(2);
  });

  test("matches visual baseline for all three sequence states", async ({ page }) => {
    await expect(page.getByTestId("stepper-demo-wrapper")).toHaveScreenshot("stepper-all.png");
  });
});
