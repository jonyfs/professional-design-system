import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Indicator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/indicator/indicator.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("the indicator badge itself is aria-hidden", async ({ page }) => {
    const badge = page.getByTestId("indicator-count").locator(".indicator");
    await expect(badge).toHaveAttribute("aria-hidden", "true");
  });

  test("count above 99 renders as 99+ and its accessible name includes the overflowed count", async ({
    page,
  }) => {
    const wrapper = page.getByTestId("indicator-count-overflow");
    await expect(wrapper.locator(".indicator")).toHaveText("99+");
    await expect(wrapper.locator(".sr-only")).toHaveText("99+ unread notifications");
  });

  test("the host element's accessible name includes the actual count for the count variant", async ({
    page,
  }) => {
    const wrapper = page.getByTestId("indicator-count");
    await expect(wrapper.locator(".sr-only")).toHaveText("3 unread notifications");
  });

  test("the dot variant carries a status label with no number required", async ({ page }) => {
    const wrapper = page.getByTestId("indicator-dot");
    await expect(wrapper.locator(".sr-only")).toHaveText(/unread notifications/i);
  });

  test("matches visual baseline for all variants", async ({ page }) => {
    await expect(page.getByTestId("indicator-demo-wrapper")).toHaveScreenshot("indicator-all.png");
  });
});
