import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Navbar / Header", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/navbar/navbar.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("navbar")).toHaveScreenshot("navbar.png");
  });

  test("full nav visible, hamburger hidden at wide viewports (AC1)", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["chromium-1024", "chromium-1440", "firefox-1440", "webkit-1440"].includes(
        testInfo.project.name,
      ),
      "Only relevant at wide (lg+) breakpoints",
    );
    await expect(page.getByTestId("navbar-full-nav")).toBeVisible();
    await expect(page.getByTestId("navbar-mobile-menu")).toBeHidden();
  });

  test("hamburger visible, full nav hidden at narrow viewports (AC2)", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["chromium-320", "chromium-768"].includes(testInfo.project.name),
      "Only relevant at narrow (below lg) breakpoints",
    );
    await expect(page.getByTestId("navbar-mobile-menu")).toBeVisible();
    await expect(page.getByTestId("navbar-full-nav")).toBeHidden();
  });

  test("mobile menu trigger has an accessible name and adequate touch target (AC2)", async ({
    page,
  }, testInfo) => {
    test.skip(
      !["chromium-320", "chromium-768"].includes(testInfo.project.name),
      "Only relevant at narrow (below lg) breakpoints",
    );
    const trigger = page.getByTestId("navbar-mobile-menu").locator("summary");
    await expect(trigger).toHaveAttribute("aria-label", "Menu");
    const box = await trigger.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("stays pinned to the viewport top during scroll (AC3)", async ({ page }) => {
    const navbar = page.getByTestId("navbar");
    const position = await navbar.evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("sticky");
    await page.mouse.wheel(0, 800);
    await expect(navbar).toBeInViewport();
  });

  test("mobile menu opens via keyboard activation", async ({ page }, testInfo) => {
    test.skip(
      !["chromium-320", "chromium-768"].includes(testInfo.project.name),
      "Only relevant at narrow (below lg) breakpoints",
    );
    const details = page.getByTestId("navbar-mobile-menu");
    const summary = details.locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("navbar-mobile-panel")).toBeVisible();
  });

  test("opening the mobile menu then resizing to wide hides it regardless of open state (Edge Case)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    const details = page.getByTestId("navbar-mobile-menu");
    await details.locator("summary").click();
    await expect(page.getByTestId("navbar-mobile-panel")).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(details).toBeHidden();
    await expect(page.getByTestId("navbar-full-nav")).toBeVisible();
  });
});
