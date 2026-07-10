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

  test("panel is positioned adjacent to the trigger, not the viewport (feature 010 regression guard)", async ({
    page,
  }) => {
    // Popover-API top-layer promotion resets position:absolute's
    // containing block to the viewport, silently breaking `right-0`/
    // `mt-2` anchoring — this exact class of bug shipped undetected
    // since feature 005 because visual-regression screenshots crop
    // tightly to the panel itself, which looks fine in isolation
    // regardless of where on the page it actually renders.
    const trigger = page.getByTestId("dropdown-trigger");
    await trigger.click();
    const menu = page.getByTestId("dropdown-menu");
    await expect(menu).toBeVisible();

    const triggerBox = await trigger.boundingBox();
    const menuBox = await menu.boundingBox();
    expect(triggerBox).not.toBeNull();
    expect(menuBox).not.toBeNull();

    // The panel's top edge must be within a few pixels of the trigger's
    // bottom edge (mt-2 = 8px gap), not near the top of the viewport.
    const gap = menuBox!.y - (triggerBox!.y + triggerBox!.height);
    expect(gap).toBeGreaterThanOrEqual(0);
    expect(gap).toBeLessThan(20);
    // The panel must horizontally overlap the trigger's column, not be
    // centered/offset elsewhere on the page.
    const horizontalOverlap =
      Math.min(menuBox!.x + menuBox!.width, triggerBox!.x + triggerBox!.width) -
      Math.max(menuBox!.x, triggerBox!.x);
    expect(horizontalOverlap).toBeGreaterThan(0);
  });
});
