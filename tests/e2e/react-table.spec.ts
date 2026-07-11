import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/table.html";

test.describe("Table (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("baseline table matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("table-baseline")).toHaveScreenshot("react-table-baseline.png");
  });

  test("zebra-striped table matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("table-zebra")).toHaveScreenshot("react-table-zebra.png");
  });

  test("uses real semantic table markup with scope=col headers", async ({ page }) => {
    const table = page.getByTestId("table-baseline");
    expect(await table.evaluate((el) => el.tagName)).toBe("TABLE");
    const headers = table.locator("th");
    const count = await headers.count();
    for (let i = 0; i < count; i++) {
      await expect(headers.nth(i)).toHaveAttribute("scope", "col");
    }
  });

  test("every even-indexed zebra row has a distinct background", async ({ page }) => {
    const rows = page.getByTestId("table-zebra").locator("tbody tr");
    const colors = [
      await rows.nth(0).evaluate((el) => getComputedStyle(el).backgroundColor),
      await rows.nth(1).evaluate((el) => getComputedStyle(el).backgroundColor),
    ];
    expect(colors[0]).not.toBe(colors[1]);
  });
});
