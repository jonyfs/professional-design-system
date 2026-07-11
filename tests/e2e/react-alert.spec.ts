import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/alert.html";

test.describe("Alert (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("alert-stack")).toHaveScreenshot("react-alert-stack.png");
  });

  test("non-dismissible alert renders no dismiss control", async ({ page }) => {
    const dismiss = page.locator('[data-testid="alert-non-dismissible"] button');
    await expect(dismiss).toHaveCount(0);
  });

  test("dismiss removes the alert from the rendered tree (not merely hides it)", async ({ page }) => {
    const alert1 = page.getByTestId("alert-dismissible-1");
    const alert2 = page.getByTestId("alert-dismissible-2");
    await expect(alert1).toBeVisible();
    await expect(alert2).toBeVisible();

    await page.getByTestId("alert-dismissible-1-dismiss").click();
    await expect(alert1).toHaveCount(0);
    // Dismissing one must not affect the other.
    await expect(alert2).toBeVisible();
  });
});
