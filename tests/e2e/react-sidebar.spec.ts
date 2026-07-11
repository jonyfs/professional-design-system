import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/sidebar.html";

test.describe("Sidebar (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("light theme matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("sidebar-light")).toHaveScreenshot("react-sidebar-light.png");
  });

  test("dark theme matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("sidebar-dark")).toHaveScreenshot("react-sidebar-dark.png");
  });

  test("items are real, keyboard-focusable anchors with aria-current on the active item", async ({ page }) => {
    const dashboard = page.getByTestId("sidebar-light-item-dashboard");
    expect(await dashboard.evaluate((el) => el.tagName)).toBe("A");
    await expect(dashboard).toHaveAttribute("aria-current", "page");
    await expect(dashboard).toHaveAttribute("href");
  });
});
