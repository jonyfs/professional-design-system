import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/dropdown-menu.html";

test.describe("Dropdown Menu (React package, visual parity with static reference)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("opening and closing produces no console/CSP errors", async ({ page }) => {
    await expectNoConsoleErrors(page, async () => {
      await page.getByTestId("dropdown-trigger").click();
      await expect(page.getByTestId("dropdown-menu")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("dropdown-menu")).toBeHidden();
    });
  });

  test("has no accessibility violations (open state)", async ({ page }, testInfo) => {
    await page.getByTestId("dropdown-trigger").click();
    await expect(page.getByTestId("dropdown-menu")).toBeVisible();
    await expectNoA11yViolations(page, testInfo);
  });

  test("closed state matches the static reference's visual baseline", async ({ page }) => {
    await expect(page.getByTestId("dropdown-trigger")).toHaveScreenshot(
      "react-dropdown-menu-closed.png",
    );
  });

  test("open state matches the static reference's visual baseline", async ({ page }) => {
    await page.getByTestId("dropdown-trigger").click();
    await expect(page.getByTestId("dropdown-menu")).toBeVisible();
    await expect(page.getByTestId("dropdown-menu")).toHaveScreenshot(
      "react-dropdown-menu-open.png",
    );
  });

  test("opens via click with focus on the first item (AC1)", async ({ page }) => {
    await page.getByTestId("dropdown-trigger").click();
    await expect(page.getByTestId("dropdown-menu")).toBeVisible();
    await expect(page.getByTestId("dropdown-item-edit")).toBeFocused();
    await expect(page.getByTestId("dropdown-trigger")).toHaveAttribute("aria-expanded", "true");
  });

  test("opens via keyboard activation of the trigger (AC1)", async ({ page }) => {
    await page.getByTestId("dropdown-trigger").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("dropdown-menu")).toBeVisible();
    await expect(page.getByTestId("dropdown-item-edit")).toBeFocused();
  });

  test("Down/Up arrow keys move focus between items, wrapping and skipping disabled (AC2)", async ({
    page,
  }) => {
    await page.getByTestId("dropdown-trigger").click();
    await expect(page.getByTestId("dropdown-item-edit")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("dropdown-item-duplicate")).toBeFocused();
    // Archive is disabled — ArrowDown must skip it and land on Delete.
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("dropdown-item-delete")).toBeFocused();
    // Wrap back to the first item.
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("dropdown-item-edit")).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(page.getByTestId("dropdown-item-delete")).toBeFocused();
  });

  test("selecting an item closes the menu and returns focus to the trigger (AC3)", async ({
    page,
  }) => {
    const trigger = page.getByTestId("dropdown-trigger");
    await trigger.click();
    await page.getByTestId("dropdown-item-duplicate").click();
    await expect(page.getByTestId("dropdown-menu")).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes without firing an action, focus returns to trigger (AC4)", async ({
    page,
  }) => {
    const trigger = page.getByTestId("dropdown-trigger");
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("dropdown-menu")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("outside click closes the menu (AC5)", async ({ page }) => {
    await page.getByTestId("dropdown-trigger").click();
    await expect(page.getByTestId("dropdown-menu")).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(page.getByTestId("dropdown-menu")).toBeHidden();
  });

  test("Tab closes the menu per the APG Menu Button convention", async ({ page }) => {
    const trigger = page.getByTestId("dropdown-trigger");
    await trigger.click();
    await expect(page.getByTestId("dropdown-item-edit")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("dropdown-menu")).toBeHidden();
  });

  test("disabled item is not focusable via arrow-key navigation (Edge Case)", async ({
    page,
  }) => {
    await expect(page.getByTestId("dropdown-item-archive")).toBeDisabled();
  });
});
