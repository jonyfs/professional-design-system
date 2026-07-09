import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

test.describe("Alert / Banner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/alert/alert.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("dismissing an alert produces no console/CSP errors", async ({ page }) => {
    await expectNoConsoleErrors(page, async () => {
      const alert = page.getByTestId("alert-dismissible-1");
      await alert.locator("button").click();
      await expect(alert).toHaveCount(0);
    });
  });

  test("all severity variants match visual baseline", async ({ page }) => {
    await expect(page.getByTestId("alert-stack")).toHaveScreenshot("alert-stack.png");
  });

  test("no role=status/aria-live/role=alert anywhere (FR-011)", async ({ page }) => {
    const liveRegionCount = await page.evaluate(() => {
      return document.querySelectorAll(
        '.alert[role="status"], .alert[aria-live], .alert[role="alert"]',
      ).length;
    });
    expect(liveRegionCount).toBe(0);
  });

  test("dismissal removes the node from the DOM entirely, not just hides it (AC2)", async ({
    page,
  }) => {
    const alert = page.getByTestId("alert-dismissible-1");
    await expect(alert).toBeVisible();
    await alert.locator("button").click();
    await expect(alert).toHaveCount(0);
  });

  test("dismiss button is keyboard-activatable via Enter", async ({ page }) => {
    const alert = page.getByTestId("alert-dismissible-1");
    await alert.locator("button").focus();
    await page.keyboard.press("Enter");
    await expect(alert).toHaveCount(0);
  });

  test("dismissing one alert does not affect another (Edge Case)", async ({ page }) => {
    const alert1 = page.getByTestId("alert-dismissible-1");
    const alert2 = page.getByTestId("alert-dismissible-2");
    await alert1.locator("button").click();
    await expect(alert1).toHaveCount(0);
    await expect(alert2).toBeVisible();
  });

  test("non-dismissible default variant has zero close buttons (AC3)", async ({ page }) => {
    for (const testId of ["alert-success", "alert-error", "alert-warning", "alert-info"]) {
      const alert = page.getByTestId(testId);
      await expect(alert.locator("button")).toHaveCount(0);
    }
  });

  test("long message keeps icon/dismiss button top-aligned (Edge Case)", async ({ page }) => {
    const alert = page.getByTestId("alert-long-message");
    const alignItems = await alert.evaluate((el) => getComputedStyle(el).alignItems);
    expect(alignItems).toBe("flex-start");
  });
});
