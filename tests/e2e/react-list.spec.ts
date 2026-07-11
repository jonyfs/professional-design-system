import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/list.html";

test.describe("Lists (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("read-only list matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("list-readonly")).toHaveScreenshot("react-list-readonly.png");
  });

  test("interactive list matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("list-interactive")).toHaveScreenshot("react-list-interactive.png");
  });

  test("interactive rows are real anchors with tabindex=0", async ({ page }) => {
    const row = page.getByTestId("list-interactive-item-jane");
    expect(await row.evaluate((el) => el.tagName)).toBe("A");
    await expect(row).toHaveAttribute("tabindex", "0");
    await expect(row).toHaveAttribute("href");
  });

  test("read-only rows are plain non-interactive divs", async ({ page }) => {
    const row = page.getByTestId("list-readonly-item-jane");
    expect(await row.evaluate((el) => el.tagName)).toBe("DIV");
  });
});
