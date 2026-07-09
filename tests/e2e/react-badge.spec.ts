import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/badge.html";

test.describe("Badge (React package, visual parity with static reference)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("all four variants match the static reference's visual baseline side by side", async ({
    page,
  }) => {
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
