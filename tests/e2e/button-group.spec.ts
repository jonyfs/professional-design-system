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

  test("arrow keys move the checked segment between enabled options, never landing on the disabled one", async ({
    page,
  }) => {
    const list = page.getByTestId("vm-list");
    await list.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("vm-grid")).toBeChecked();
    // vm-table (the 3rd, disabled option) is never checked by arrow-key
    // navigation in any engine. What happens on a FURTHER ArrowRight past
    // the last enabled option genuinely differs by engine — confirmed
    // empirically, not assumed: Chromium/Firefox wrap back to the first
    // enabled option (vm-list), while WebKit's native radio-group
    // navigation simply stays on the last enabled option (vm-grid)
    // instead of wrapping past the disabled one. Both are legitimate
    // native browser behaviors for a disabled radio in a group — this
    // project has zero JavaScript here by design (research.md R2), so
    // the assertion only covers the one behavior guaranteed identical
    // across all three engines: the disabled option itself is never
    // reachable/checked.
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("vm-table")).not.toBeChecked();
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
