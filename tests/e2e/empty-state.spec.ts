import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Empty State", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/empty-state/empty-state.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("icon is decorative", async ({ page }) => {
    const icon = page.getByTestId("empty-state-icon");
    await expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  test("heading is a real heading element", async ({ page }) => {
    const heading = page.getByTestId("empty-state-heading");
    const tagName = await heading.evaluate((el) => el.tagName);
    expect(["H2", "H3"]).toContain(tagName);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("empty-state-demo-wrapper")).toHaveScreenshot(
      "empty-state-all.png",
    );
  });
});
