import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

test.describe("Progress", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/progress/progress.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("fill width is applied via script with no CSP violations (regression: inline style attributes are blocked by this project's style-src 'self')", async ({
    page,
  }) => {
    await expectNoConsoleErrors(page, async () => {
      const width = await page
        .getByTestId("progress-determinate")
        .locator("[data-progress-fill]")
        .evaluate((el) => (el as HTMLElement).style.width);
      expect(width).toBe("60%");
    });
  });

  test("determinate progress exposes correct ARIA value attributes", async ({ page }) => {
    const bar = page.getByTestId("progress-determinate");
    await expect(bar).toHaveAttribute("role", "progressbar");
    await expect(bar).toHaveAttribute("aria-valuenow", "60");
    await expect(bar).toHaveAttribute("aria-valuemin", "0");
    await expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  test("indeterminate progress omits aria-valuenow", async ({ page }) => {
    const bar = page.getByTestId("progress-indeterminate");
    await expect(bar).toHaveAttribute("role", "progressbar");
    await expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  test("matches visual baseline for both states", async ({ page }) => {
    await expect(page.getByTestId("progress-demo-wrapper")).toHaveScreenshot(
      "progress-all.png",
    );
  });
});
