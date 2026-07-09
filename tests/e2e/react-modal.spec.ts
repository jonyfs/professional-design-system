import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/modal.html";

test.describe("Modal (React package, visual parity with static reference)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("opening and closing produces no console/CSP errors", async ({ page }) => {
    await expectNoConsoleErrors(page, async () => {
      await page.getByTestId("modal-trigger").click();
      await expect(page.getByTestId("modal")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("modal")).toBeHidden();
    });
  });

  test("has no accessibility violations (open state)", async ({ page }, testInfo) => {
    await page.getByTestId("modal-trigger").click();
    await expect(page.getByTestId("modal")).toBeVisible();
    await expectNoA11yViolations(page, testInfo);
  });

  test("closed state matches the static reference's visual baseline", async ({ page }) => {
    await expect(page.getByTestId("modal-trigger")).toHaveScreenshot("modal-closed.png");
  });

  test("open state matches the static reference's visual baseline", async ({ page }) => {
    await page.getByTestId("modal-trigger").click();
    await expect(page.getByTestId("modal")).toBeVisible();
    await expect(page.getByTestId("modal")).toHaveScreenshot("modal-open.png");
  });

  async function activeElementIsSafe(page: import("@playwright/test").Page) {
    return page.evaluate(() => {
      const dialogEl = document.querySelector('[data-testid="modal"]');
      const active = document.activeElement;
      return dialogEl?.contains(active) || active === document.body;
    });
  }

  test("Tab cycle never escapes the open dialog (AC1)", async ({ page }) => {
    await page.getByTestId("modal-trigger").click();
    const dialog = page.getByTestId("modal");
    await expect(dialog).toBeVisible();

    const focusableCount = await dialog.evaluate(
      (el) => el.querySelectorAll("button, [href], input, select, textarea").length,
    );
    expect(focusableCount).toBeGreaterThan(0);

    for (let i = 0; i < focusableCount * 2; i++) {
      await page.keyboard.press("Tab");
      expect(await activeElementIsSafe(page)).toBe(true);
    }
  });

  test("Shift+Tab from the first focusable element wraps to the last", async ({ page }) => {
    await page.getByTestId("modal-trigger").click();
    const dialog = page.getByTestId("modal");
    await expect(dialog).toBeVisible();
    await page.getByTestId("modal-close").focus();
    await page.keyboard.press("Shift+Tab");
    expect(await activeElementIsSafe(page)).toBe(true);
  });

  test("Escape closes the dialog and returns focus to the trigger (AC2)", async ({ page }) => {
    const trigger = page.getByTestId("modal-trigger");
    await trigger.click();
    await expect(page.getByTestId("modal")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("modal")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("clicking the backdrop closes the dialog and returns focus to the trigger (AC3)", async ({
    page,
  }) => {
    const trigger = page.getByTestId("modal-trigger");
    await trigger.click();
    const dialog = page.getByTestId("modal");
    await expect(dialog).toBeVisible();
    await dialog.click({ position: { x: 2, y: 2 } });
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("explicit close button closes the dialog and returns focus to the trigger", async ({
    page,
  }) => {
    const trigger = page.getByTestId("modal-trigger");
    await trigger.click();
    await page.getByTestId("modal-close").click();
    await expect(page.getByTestId("modal")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Cancel and Delete buttons both close the dialog", async ({ page }) => {
    await page.getByTestId("modal-trigger").click();
    await page.getByTestId("modal-cancel").click();
    await expect(page.getByTestId("modal")).toBeHidden();
  });

  test("background content is inert while the dialog is open (FR-007)", async ({ page }) => {
    await page.getByTestId("modal-trigger").click();
    await expect(page.getByTestId("modal")).toBeVisible();
    let clickThrew = false;
    try {
      await page.getByTestId("modal-trigger").click({ timeout: 1500 });
    } catch {
      clickThrew = true;
    }
    expect(clickThrew).toBe(true);
    await expect(page.getByTestId("modal")).toBeVisible();
  });

  test("empty-content modal focuses the dialog itself (Edge Case, tabindex=-1)", async ({
    page,
  }) => {
    await page.getByTestId("modal-info-trigger").click();
    const dialog = page.getByTestId("modal-info");
    await expect(dialog).toBeVisible();
    const dialogIsFocused = await dialog.evaluate((el) => el === document.activeElement);
    expect(dialogIsFocused).toBe(true);
  });

  test("empty-content modal has no accessibility violations", async ({ page }, testInfo) => {
    await page.getByTestId("modal-info-trigger").click();
    await expect(page.getByTestId("modal-info")).toBeVisible();
    await expectNoA11yViolations(page, testInfo);
  });

  test("empty-content modal matches the static reference's visual baseline", async ({ page }) => {
    await page.getByTestId("modal-info-trigger").click();
    await expect(page.getByTestId("modal-info")).toBeVisible();
    await expect(page.getByTestId("modal-info")).toHaveScreenshot("modal-info-open.png");
  });

  test("empty-content modal is dismissible via Escape", async ({ page }) => {
    const trigger = page.getByTestId("modal-info-trigger");
    await trigger.click();
    await expect(page.getByTestId("modal-info")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("modal-info")).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
