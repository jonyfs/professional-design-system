import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/navbar.html";

test.describe("Navbar (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("navbar")).toHaveScreenshot("react-navbar.png");
  });

  test("mobile menu is a native details/summary disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    const menu = page.getByTestId("navbar-mobile-menu");
    expect(await menu.evaluate((el) => el.tagName)).toBe("DETAILS");
    expect(await menu.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false);
    await page.locator('[data-testid="navbar-mobile-menu"] summary').click();
    expect(await menu.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true);
  });
});
