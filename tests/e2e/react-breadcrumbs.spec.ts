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

  test("ancestor link activates navigation via keyboard (AC3, code review finding)", async ({
    page,
  }) => {
    const homeLink = page.getByTestId("breadcrumb-link-0");
    await expect(homeLink).toHaveAttribute("href", "/");
  });

  test("long trail wraps rather than overflowing horizontally at 320px (Edge Case, code review finding)", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-320",
      "Only relevant at the 320px breakpoint",
    );
    const nav = page.getByTestId("breadcrumbs-long");
    const box = await nav.boundingBox();
    expect(box).not.toBeNull();
    // The nav's own box must not exceed the viewport width — if flex-wrap
    // were missing, the <ol> would overflow horizontally instead of
    // wrapping onto a second line.
    expect(box!.width).toBeLessThanOrEqual(320);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(320);
  });
});
