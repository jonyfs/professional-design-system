import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Dashboard Example (SC-003 composed page)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/dashboard-example/dashboard-example.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("composes Stat Card, Indicator, Avatar, and Divider using only already-shipped classes", async ({
    page,
  }) => {
    const wrapper = page.getByTestId("dashboard-example-wrapper");
    await expect(wrapper.locator(".card")).toHaveCount(2);
    await expect(wrapper.locator(".indicator-wrapper")).toHaveCount(1);
    await expect(wrapper.locator(".avatar-fallback")).toHaveCount(1);
    await expect(wrapper.locator(".divider")).toHaveCount(1);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("dashboard-example-wrapper")).toHaveScreenshot(
      "dashboard-example-all.png",
    );
  });
});
