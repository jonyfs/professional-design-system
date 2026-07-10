import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Sidebar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/sidebar/sidebar.html");
  });

  // Both the light and dark theme demos render on this same page, so
  // this single scan already exercises both — feature 005/006's lesson
  // (a ratified-but-never-tested pattern must be verified, not assumed
  // correct because a sibling theme passes) is satisfied by both themes
  // being present in the scanned DOM, not by a second, identical test.
  test("has no accessibility violations (both themes)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("light theme matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("sidebar-light")).toHaveScreenshot("sidebar-light.png");
  });

  test("dark theme matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("sidebar-dark")).toHaveScreenshot("sidebar-dark.png");
  });

  test("exactly one item marked active per theme (AC1)", async ({ page }) => {
    const lightActive = page.getByTestId("sidebar-light").locator('[aria-current="page"]');
    const darkActive = page.getByTestId("sidebar-dark").locator('[aria-current="page"]');
    await expect(lightActive).toHaveCount(1);
    await expect(darkActive).toHaveCount(1);
  });

  test("hover state is distinct from resting and active states (AC2)", async ({ page }) => {
    const inactive = page.getByTestId("sidebar-item-projects");
    const restingBg = await inactive.evaluate((el) => getComputedStyle(el).backgroundColor);
    const activeBg = await page
      .getByTestId("sidebar-item-dashboard")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    await inactive.hover();
    // toHaveCSS auto-retries until the assertion passes (or times out),
    // which is the deterministic way to wait for a post-hover style
    // recalculation/repaint — a raw getComputedStyle() read immediately
    // after .hover() can observe stale, pre-repaint styles (found via a
    // standalone script: the same read succeeded reliably with a 200ms
    // wait, confirming this is a timing artifact, not a real CSS bug).
    await expect(inactive).not.toHaveCSS("background-color", restingBg);
    await expect(inactive).not.toHaveCSS("background-color", activeBg);
  });

  test("long item label wraps rather than overflowing (Edge Case)", async ({ page }) => {
    const item = page.getByTestId("sidebar-item-long-label");
    const sidebarBox = await page.getByTestId("sidebar-light").boundingBox();
    const itemBox = await item.boundingBox();
    expect(itemBox).not.toBeNull();
    expect(sidebarBox).not.toBeNull();
    expect(itemBox!.width).toBeLessThanOrEqual(sidebarBox!.width);
  });
});
