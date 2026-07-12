import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Kbd", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/kbd/kbd.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("renders a real <kbd> element with the mono font applied", async ({ page }) => {
    const kbd = page.getByTestId("kbd-example").first();
    const tagName = await kbd.evaluate((el) => el.tagName);
    expect(tagName).toBe("KBD");
    const fontFamily = await kbd.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fontFamily.toLowerCase()).toContain("mono");
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("kbd-demo-wrapper")).toHaveScreenshot("kbd-all.png");
  });
});
