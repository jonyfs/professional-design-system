import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Spinner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/spinner/spinner.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("both sizes expose role=status and an accessible name", async ({ page }) => {
    for (const id of ["spinner-sm", "spinner-lg"]) {
      const el = page.getByTestId(id);
      await expect(el).toHaveAttribute("role", "status");
      await expect(el).toHaveAttribute("aria-label", "Loading");
    }
  });

  test("animate-spin is applied by default", async ({ page }) => {
    const el = page.getByTestId("spinner-lg");
    const animation = await el.evaluate((node) => getComputedStyle(node).animationName);
    expect(animation).not.toBe("none");
  });

  test("motion-reduce:animate-none overrides the spin when reduced motion is preferred", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const el = page.getByTestId("spinner-lg");
    const animation = await el.evaluate((node) => getComputedStyle(node).animationName);
    expect(animation).toBe("none");
  });

  test("matches visual baseline for both sizes", async ({ page }) => {
    await expect(page.getByTestId("spinner-demo-wrapper")).toHaveScreenshot("spinner-all.png");
  });
});
