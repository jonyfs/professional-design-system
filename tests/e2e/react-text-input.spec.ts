import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Runs against the React test harness — targets the SAME snapshot files as
// tests/e2e/text-input.spec.ts (genuine pixel-parity proof, see
// react-button.spec.ts's comment for the full rationale).
const HARNESS_URL = "http://localhost:5174/text-input.html";

test.describe("Text Input (React package, visual parity with static reference)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("default state matches the static reference's visual baseline", async ({ page }) => {
    await expect(page.getByTestId("input-default-wrapper")).toHaveScreenshot(
      "text-input-default.png",
    );
  });

  test("focus state matches the static reference's visual baseline and shows the brand ring", async ({
    page,
  }) => {
    const input = page.getByTestId("input-default");
    await input.focus();
    await expect(page.getByTestId("input-default-wrapper")).toHaveScreenshot(
      "text-input-focus.png",
    );
  });

  test("error state exposes aria-invalid and a visible, linked error message", async ({
    page,
  }) => {
    const input = page.getByTestId("input-error");
    await expect(input).toHaveAttribute("aria-invalid", "true");

    const describedBy = await input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    const errorMessage = page.locator(`[id="${describedBy}"]`);
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/.+/);

    await expect(page.getByTestId("input-error-wrapper")).toHaveScreenshot("text-input-error.png");
  });

  test("error message stays visible when a placeholder is also present (Edge Case)", async ({
    page,
  }) => {
    const input = page.getByTestId("input-error-with-placeholder");
    await expect(input).toHaveAttribute("placeholder", /.+/);
    await expect(input).toHaveAttribute("aria-invalid", "true");
    const describedBy = await input.getAttribute("aria-describedby");
    await expect(page.locator(`[id="${describedBy}"]`)).toBeVisible();
  });

  test("disabled state matches the static reference's visual baseline and blocks input", async ({
    page,
  }) => {
    const input = page.getByTestId("input-disabled");
    await expect(input).toBeDisabled();
    await expect(page.getByTestId("input-disabled-wrapper")).toHaveScreenshot(
      "text-input-disabled.png",
    );
  });
});
