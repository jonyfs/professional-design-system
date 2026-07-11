import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/card.html";

test.describe("Card (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("default state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("card-default")).toHaveScreenshot("react-card-default.png");
  });

  test("hover elevation increases shadow with no layout shift (AC2)", async ({ page }) => {
    const card = page.getByTestId("card-elevated");
    const boxBefore = await card.boundingBox();
    const shadowBefore = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    await card.hover();
    const boxAfter = await card.boundingBox();
    const shadowAfter = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadowAfter).not.toBe(shadowBefore);
    expect(boxAfter!.width).toBe(boxBefore!.width);
    expect(boxAfter!.height).toBe(boxBefore!.height);
  });
});
