import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Skeleton", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/skeleton/skeleton.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("all four presets are aria-hidden", async ({ page }) => {
    for (const id of [
      "skeleton-text",
      "skeleton-avatar-sm",
      "skeleton-avatar-lg",
      "skeleton-card",
    ]) {
      await expect(page.getByTestId(id)).toHaveAttribute("aria-hidden", "true");
    }
  });

  test("animate-pulse is applied by default", async ({ page }) => {
    const el = page.getByTestId("skeleton-text");
    const animation = await el.evaluate((node) => getComputedStyle(node).animationName);
    expect(animation).not.toBe("none");
  });

  test("motion-reduce:animate-none overrides the pulse when reduced motion is preferred", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const el = page.getByTestId("skeleton-text");
    const animation = await el.evaluate((node) => getComputedStyle(node).animationName);
    expect(animation).toBe("none");
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("skeleton-demo-wrapper")).toHaveScreenshot(
      "skeleton-all.png",
    );
  });
});
