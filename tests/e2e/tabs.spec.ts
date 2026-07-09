import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

test.describe("Tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/tabs/tabs.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("switching tabs produces no console/CSP errors", async ({ page }) => {
    await expectNoConsoleErrors(page, async () => {
      await page.getByTestId("tab-reviews").click();
      await expect(page.getByTestId("panel-reviews")).toBeVisible();
    });
  });

  test("default state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("tabs")).toHaveScreenshot("tabs-default.png");
  });

  test("selected state matches visual baseline", async ({ page }) => {
    await page.getByTestId("tab-reviews").click();
    await expect(page.getByTestId("tabs")).toHaveScreenshot("tabs-reviews-selected.png");
  });

  test("exactly one tab selected and one panel visible on load (AC1)", async ({ page }) => {
    await expect(page.getByTestId("tab-details")).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("tab-reviews")).toHaveAttribute("aria-selected", "false");
    await expect(page.getByTestId("tab-shipping")).toHaveAttribute("aria-selected", "false");
    await expect(page.getByTestId("panel-details")).toBeVisible();
    await expect(page.getByTestId("panel-reviews")).toBeHidden();
    await expect(page.getByTestId("panel-shipping")).toBeHidden();
  });

  test("clicking an unselected tab switches the panel (AC2)", async ({ page }) => {
    await page.getByTestId("tab-reviews").click();
    await expect(page.getByTestId("tab-reviews")).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("tab-details")).toHaveAttribute("aria-selected", "false");
    await expect(page.getByTestId("panel-reviews")).toBeVisible();
    await expect(page.getByTestId("panel-details")).toBeHidden();
  });

  test("only the selected tab is in the Tab order (roving tabindex, FR-005)", async ({
    page,
  }) => {
    await expect(page.getByTestId("tab-details")).toHaveAttribute("tabindex", "0");
    await expect(page.getByTestId("tab-reviews")).toHaveAttribute("tabindex", "-1");
    await expect(page.getByTestId("tab-shipping")).toHaveAttribute("tabindex", "-1");
    await page.getByTestId("tab-reviews").click();
    await expect(page.getByTestId("tab-reviews")).toHaveAttribute("tabindex", "0");
    await expect(page.getByTestId("tab-details")).toHaveAttribute("tabindex", "-1");
  });

  test("Right/Left arrow keys move focus and selection, wrapping at the ends (AC3)", async ({
    page,
  }) => {
    await page.getByTestId("tab-details").focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("tab-reviews")).toBeFocused();
    await expect(page.getByTestId("tab-reviews")).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("tab-shipping")).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("tab-details")).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByTestId("tab-shipping")).toBeFocused();
  });

  test("Home/End jump to the first/last tab (AC4)", async ({ page }) => {
    await page.getByTestId("tab-reviews").focus();
    await page.keyboard.press("End");
    await expect(page.getByTestId("tab-shipping")).toBeFocused();
    await page.keyboard.press("Home");
    await expect(page.getByTestId("tab-details")).toBeFocused();
  });
});
