import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Badge", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/badge/badge.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("all four variants match the visual baseline side by side", async ({ page }) => {
    await expect(page.getByTestId("badge-variants-row")).toHaveScreenshot("badge-variants.png");
  });

  const variants = ["success", "error", "warning", "neutral"] as const;
  for (const variant of variants) {
    test(`${variant} badge is present and visible`, async ({ page }) => {
      await expect(page.getByTestId(`badge-${variant}`)).toBeVisible();
    });
  }

  test("long label wraps without breaking layout (Edge Case)", async ({ page }) => {
    const wrapper = page.getByTestId("badge-long-label-wrapper");
    const badge = page.getByTestId("badge-long-label");
    const wrapperBox = await wrapper.boundingBox();
    const badgeBox = await badge.boundingBox();
    expect(wrapperBox).not.toBeNull();
    expect(badgeBox).not.toBeNull();
    expect(badgeBox!.width).toBeLessThanOrEqual(wrapperBox!.width + 1);
  });
});
