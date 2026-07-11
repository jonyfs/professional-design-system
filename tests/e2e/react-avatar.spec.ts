import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/avatar.html";

test.describe("Avatar (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.locator("body")).toHaveScreenshot("react-avatar-all-variants.png");
  });

  test("image variant has non-empty alt text", async ({ page }) => {
    const alt = await page.getByTestId("avatar-image-lg").getAttribute("alt");
    expect(alt).toBeTruthy();
  });

  test("fallback variant has an accessible name", async ({ page }) => {
    const ariaLabel = await page.getByTestId("avatar-fallback-lg").getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
  });

  test("single-word name renders a single initial (Edge Case)", async ({ page }) => {
    await expect(page.getByTestId("avatar-fallback-single")).toHaveText("M");
  });
});
