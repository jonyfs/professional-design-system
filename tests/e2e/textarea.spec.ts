import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Textarea", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/textarea/textarea.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("default state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("textarea-default-wrapper")).toHaveScreenshot(
      "textarea-default.png",
    );
  });

  test("only resizes vertically, never horizontally", async ({ page }) => {
    const textarea = page.getByTestId("textarea-default");
    const resize = await textarea.evaluate((el) => getComputedStyle(el).resize);
    expect(resize).toBe("vertical");
  });

  test("error state exposes aria-invalid and a visible, linked error message", async ({
    page,
  }) => {
    const textarea = page.getByTestId("textarea-error");
    await expect(textarea).toHaveAttribute("aria-invalid", "true");
    const describedBy = await textarea.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const errorMessage = page.locator(`#${describedBy}`);
    await expect(errorMessage).toBeVisible();
    await expect(page.getByTestId("textarea-error-wrapper")).toHaveScreenshot(
      "textarea-error.png",
    );
  });

  test("disabled state matches visual baseline and blocks input", async ({ page }) => {
    const textarea = page.getByTestId("textarea-disabled");
    await expect(textarea).toBeDisabled();
    await expect(page.getByTestId("textarea-disabled-wrapper")).toHaveScreenshot(
      "textarea-disabled.png",
    );
  });
});
