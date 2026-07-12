import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("DataList", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/data-list/data-list.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("uses real dl/dt/dd elements", async ({ page }) => {
    const list = page.getByTestId("data-list-demo");
    await expect(list).toHaveCount(1);
    const tagName = await list.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe("dl");
    await expect(list.locator("dt")).toHaveCount(4);
    await expect(list.locator("dd")).toHaveCount(4);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("data-list-demo")).toHaveScreenshot("data-list-all.png");
  });
});
