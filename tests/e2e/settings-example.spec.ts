import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Settings Example (SC-003 composed page)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/settings-example/settings-example.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("composes Rating, ColorInput, Card, and Divider using only already-shipped classes", async ({
    page,
  }) => {
    const wrapper = page.getByTestId("settings-example-wrapper");
    await expect(wrapper).toHaveClass(/\bcard\b/);
    await expect(wrapper.locator(".rating")).toHaveCount(1);
    await expect(wrapper.locator(".color-input")).toHaveCount(1);
    await expect(wrapper.locator(".divider")).toHaveCount(1);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("settings-example-wrapper")).toHaveScreenshot(
      "settings-example-all.png",
    );
  });
});
