import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/breadcrumbs.html";

test.describe("Breadcrumbs (React package, visual parity with static reference)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("default trail matches the static reference's visual baseline", async ({ page }) => {
    await expect(page.getByTestId("breadcrumbs")).toHaveScreenshot("breadcrumbs-default.png");
  });

  test("single-entry variant matches the static reference's visual baseline (Edge Case)", async ({
    page,
  }) => {
    await expect(page.getByTestId("breadcrumbs-single")).toHaveScreenshot(
      "breadcrumbs-single.png",
    );
  });

  test("ancestor links are present in hierarchical order and keyboard-focusable (AC1)", async ({
    page,
  }) => {
    const nav = page.getByTestId("breadcrumbs");
    const links = nav.locator("a");
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveText("Home");
    await expect(links.nth(1)).toHaveText("Category");
    await links.nth(0).focus();
    await expect(links.nth(0)).toBeFocused();
  });

  test("current page renders as non-interactive text with aria-current (AC1)", async ({ page }) => {
    const current = page.getByTestId("breadcrumbs").getByText("Current Page");
    await expect(current).toHaveAttribute("aria-current", "page");
    const tagName = await current.evaluate((el) => el.tagName);
    expect(tagName).toBe("SPAN");
  });

  test("lives in a nav landmark distinct from primary navigation (AC2)", async ({ page }) => {
    const nav = page.getByTestId("breadcrumbs");
    await expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
    const tagName = await nav.evaluate((el) => el.tagName);
    expect(tagName).toBe("NAV");
  });

  test("single-entry trail still renders the nav wrapper (Edge Case)", async ({ page }) => {
    const nav = page.getByTestId("breadcrumbs-single");
    await expect(nav).toBeVisible();
    await expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
  });
});
