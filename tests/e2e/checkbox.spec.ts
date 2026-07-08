import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Checkbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/checkbox/checkbox.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("unchecked state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("checkbox-unchecked-wrapper")).toHaveScreenshot(
      "checkbox-unchecked.png",
    );
  });

  test("checked state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("checkbox-checked-wrapper")).toHaveScreenshot(
      "checkbox-checked.png",
    );
  });

  test("focus-visible state matches visual baseline", async ({ page }) => {
    const checkbox = page.getByTestId("checkbox-unchecked");
    await checkbox.focus();
    await expect(page.getByTestId("checkbox-unchecked-wrapper")).toHaveScreenshot(
      "checkbox-focus-visible.png",
    );
  });

  test("disabled and disabled+checked states match visual baseline", async ({ page }) => {
    await expect(page.getByTestId("checkbox-disabled")).toBeDisabled();
    await expect(page.getByTestId("checkbox-disabled-checked")).toBeDisabled();
    await expect(page.getByTestId("checkbox-disabled-checked")).toBeChecked();
    await expect(page.getByTestId("checkbox-disabled-wrapper")).toHaveScreenshot(
      "checkbox-disabled.png",
    );
  });

  test("Space toggles the checked state when focused (FR-006)", async ({ page }) => {
    const checkbox = page.getByTestId("checkbox-unchecked");
    await expect(checkbox).not.toBeChecked();
    await checkbox.focus();
    await page.keyboard.press("Space");
    await expect(checkbox).toBeChecked();
    await page.keyboard.press("Space");
    await expect(checkbox).not.toBeChecked();
  });

  test("native checked state is correctly exposed without redundant ARIA", async ({ page }) => {
    const checkbox = page.getByTestId("checkbox-unchecked");
    await expect(checkbox).toHaveAttribute("type", "checkbox");
    // Per FR-007's correction: native semantics only, no aria-checked attribute.
    await expect(checkbox).not.toHaveAttribute("aria-checked");
  });
});
