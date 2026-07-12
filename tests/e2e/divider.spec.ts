import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Divider", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/divider/divider.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("semantic horizontal hr requires no ARIA", async ({ page }) => {
    const hr = page.getByTestId("divider-semantic-horizontal");
    // <hr> has an implicit "separator" role natively; no explicit role
    // attribute is required or present.
    await expect(hr).not.toHaveAttribute("role");
  });

  test("non-semantic horizontal div carries role=separator", async ({ page }) => {
    const div = page.getByTestId("divider-nonsemantic-horizontal");
    await expect(div).toHaveAttribute("role", "separator");
    await expect(div).not.toHaveAttribute("aria-orientation");
  });

  test("non-semantic vertical div carries role=separator and aria-orientation=vertical", async ({
    page,
  }) => {
    const div = page.getByTestId("divider-nonsemantic-vertical");
    await expect(div).toHaveAttribute("role", "separator");
    await expect(div).toHaveAttribute("aria-orientation", "vertical");
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("divider-demo-wrapper")).toHaveScreenshot(
      "divider-all.png",
    );
  });
});
