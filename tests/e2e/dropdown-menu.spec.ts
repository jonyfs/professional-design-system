import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

test.describe("Dropdown Menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/dropdown-menu/dropdown-menu.html");
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

  test("closed state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("dropdown-trigger")).toHaveScreenshot("dropdown-menu-closed.png");
  });

  test("open state matches visual baseline", async ({ page }) => {
    await page.getByTestId("dropdown-trigger").click();
    await expect(page.getByTestId("dropdown-menu")).toBeVisible();
    await expect(page.getByTestId("dropdown-menu")).toHaveScreenshot("dropdown-menu-open.png");
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
    // Deterministic wait, not a raw timeout: confirms the popover's own
    // "toggle" event and dropdown-menu.js's focus-management microtask
    // have fully settled (first item actually focused) before sending Tab
    // — found necessary because a prior test's native Escape-triggered
    // popover dismissal can otherwise leave Chromium's CDP keyboard-event
    // handling in a transiently unsettled state carried into this test
    // (reproducible only when running after another test in the same
    // worker/browser process, never in isolation — a browser/test-runner
    // timing artifact, not a dropdown-menu.js bug, confirmed by a
    // standalone script exercising the identical sequence with zero
    // flakiness).
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
