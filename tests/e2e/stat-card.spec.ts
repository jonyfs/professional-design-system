import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Stat/Metric Card", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/stat-card/stat-card.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("the metric, label, and trend are all present as real text", async ({ page }) => {
    const positive = page.getByTestId("stat-card-positive");
    await expect(positive).toContainText("Monthly Revenue");
    await expect(positive).toContainText("$48,200");
    await expect(positive).toContainText("12%");

    const negative = page.getByTestId("stat-card-negative");
    await expect(negative).toContainText("Churn Rate");
    await expect(negative).toContainText("3.4%");
    await expect(negative).toContainText("0.6%");
  });

  test("matches visual baseline for both trend directions", async ({ page }) => {
    await expect(page.getByTestId("stat-card-demo-wrapper")).toHaveScreenshot("stat-card-all.png");
  });
});
