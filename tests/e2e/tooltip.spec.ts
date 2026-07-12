import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

test.describe("Tooltip", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/tooltip/tooltip.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("anchor-name is applied with no CSP violations (regression: inline style attributes are blocked by this project's style-src 'self')", async ({
    page,
  }) => {
    await expectNoConsoleErrors(page, async () => {
      const anchorName = await page
        .getByTestId("tooltip-default-trigger")
        .evaluate((el) => getComputedStyle(el).getPropertyValue("anchor-name"));
      expect(anchorName.trim()).not.toBe("none");
    });
  });

  test("is hidden by default", async ({ page }) => {
    const tooltip = page.getByTestId("tooltip-default-label");
    await expect(tooltip).toHaveCSS("opacity", "0");
  });

  test("becomes visible on hover", async ({ page }) => {
    await page.getByTestId("tooltip-default-trigger").hover();
    const tooltip = page.getByTestId("tooltip-default-label");
    await expect(tooltip).toHaveCSS("opacity", "1");
  });

  test("becomes visible on keyboard focus, not just mouse hover", async ({ page }) => {
    await page.getByTestId("tooltip-default-trigger").focus();
    const tooltip = page.getByTestId("tooltip-default-label");
    await expect(tooltip).toHaveCSS("opacity", "1");
  });

  test("hovering the wrapper of a disabled trigger still reveals the label", async ({
    page,
  }) => {
    await page.getByTestId("tooltip-disabled-wrapper").hover();
    const tooltip = page.getByTestId("tooltip-disabled-label");
    await expect(tooltip).toHaveCSS("opacity", "1");
  });

  test("matches visual baseline hidden and revealed", async ({ page }) => {
    // Full-page screenshot, not the wrapper's own bounding box: the
    // tooltip is `position: fixed` (escapes normal containment for
    // element-scoped screenshots) and renders above its trigger via
    // anchor positioning, outside the wrapper div's box.
    await expect(page).toHaveScreenshot("tooltip-hidden.png");
    await page.getByTestId("tooltip-default-trigger").hover();
    await expect(page).toHaveScreenshot("tooltip-revealed.png");
  });
});
