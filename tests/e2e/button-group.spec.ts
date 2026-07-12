import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Button Group", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/button-group/button-group.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("carries role=group with an accessible name", async ({ page }) => {
    const group = page.getByTestId("button-group");
    await expect(group).toHaveAttribute("role", "group");
    await expect(group).toHaveAttribute("aria-label", /.+/);
  });

  test("only one segment can be checked at a time", async ({ page }) => {
    const list = page.getByTestId("vm-list");
    const grid = page.getByTestId("vm-grid");
    await expect(list).toBeChecked();
    await expect(grid).not.toBeChecked();
    // Click the visible label (the real user interaction), not the
    // visually-hidden radio input directly.
    await page.getByTestId("vm-grid-label").click();
    await expect(grid).toBeChecked();
    await expect(list).not.toBeChecked();
  });

  test("arrow keys move the checked segment between enabled options, skipping the disabled one", async ({
    page,
  }) => {
    const list = page.getByTestId("vm-list");
    await list.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("vm-grid")).toBeChecked();
    // vm-table is disabled — native radio-group arrow navigation skips
    // disabled options entirely, wrapping back to the first enabled one.
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("vm-list")).toBeChecked();
  });

  test("disabled segment cannot be checked", async ({ page }) => {
    const disabledInput = page.getByTestId("vm-table");
    await expect(disabledInput).toBeDisabled();
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("button-group-demo-wrapper")).toHaveScreenshot(
      "button-group-all.png",
    );
  });
});
