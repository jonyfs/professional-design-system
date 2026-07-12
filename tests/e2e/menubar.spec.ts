import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Menubar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/menubar/menubar.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("Left/Right arrow keys move focus between top-level triggers without opening a panel", async ({
    page,
  }) => {
    const fileTrigger = page.getByTestId("menubar-file-trigger");
    const editTrigger = page.getByTestId("menubar-edit-trigger");
    const viewTrigger = page.getByTestId("menubar-view-trigger");

    await fileTrigger.focus();
    await page.keyboard.press("ArrowRight");
    await expect(editTrigger).toBeFocused();
    await expect(editTrigger).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ArrowRight");
    await expect(viewTrigger).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(fileTrigger).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(viewTrigger).toBeFocused();
    await expect(viewTrigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Down opens the focused trigger's panel and moves focus to its first item", async ({
    page,
  }) => {
    const fileTrigger = page.getByTestId("menubar-file-trigger");
    const filePanel = page.getByTestId("menubar-file-panel");
    await fileTrigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(filePanel).toBeVisible();
    await expect(fileTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(filePanel.locator('[role="menuitem"]').first()).toBeFocused();
  });

  test("Enter opens the focused trigger's panel", async ({ page }) => {
    const fileTrigger = page.getByTestId("menubar-file-trigger");
    const filePanel = page.getByTestId("menubar-file-panel");
    await fileTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(filePanel).toBeVisible();
  });

  test("Escape closes the open panel and returns focus to its trigger", async ({ page }) => {
    const fileTrigger = page.getByTestId("menubar-file-trigger");
    const filePanel = page.getByTestId("menubar-file-panel");
    await fileTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(filePanel).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(filePanel).toBeHidden();
    await expect(fileTrigger).toBeFocused();
  });

  test("arrow-navigating to a sibling while a panel is open auto-switches which panel is open (at most one open at a time)", async ({
    page,
  }) => {
    const fileTrigger = page.getByTestId("menubar-file-trigger");
    const editTrigger = page.getByTestId("menubar-edit-trigger");
    const filePanel = page.getByTestId("menubar-file-panel");
    const editPanel = page.getByTestId("menubar-edit-panel");

    await fileTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(filePanel).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(editTrigger).toBeFocused();
    await expect(filePanel).toBeHidden();
    await expect(editPanel).toBeVisible();
  });

  test("Home/End jump to the first/last trigger", async ({ page }) => {
    const fileTrigger = page.getByTestId("menubar-file-trigger");
    const viewTrigger = page.getByTestId("menubar-view-trigger");

    await fileTrigger.focus();
    await page.keyboard.press("End");
    await expect(viewTrigger).toBeFocused();

    await page.keyboard.press("Home");
    await expect(fileTrigger).toBeFocused();
  });

  test("a rapid second ArrowRight fired before the first transition settles is safely ignored, never leaving a corrupted focus/panel state (code review finding, HIGH)", async ({
    page,
  }) => {
    const fileTrigger = page.getByTestId("menubar-file-trigger");
    const editTrigger = page.getByTestId("menubar-edit-trigger");
    const filePanel = page.getByTestId("menubar-file-panel");
    const editPanel = page.getByTestId("menubar-edit-panel");
    const viewPanel = page.getByTestId("menubar-view-panel");

    await fileTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(filePanel).toBeVisible();

    // Fire two ArrowRight keydowns back-to-back with no await between them
    // (and no waitForTimeout), so the first transition's queued Popover
    // "toggle" callback has not yet had a chance to run before the second
    // keydown is dispatched. Traced empirically: dropdown-menu.js's own
    // unconditional close-time `trigger.focus()` (reused unmodified) fires
    // as part of the FIRST transition's queued toggle event regardless of
    // any staleness guard menubar.js applies to its own reaction — so a
    // 2nd keypress that started its own independent transition before the
    // 1st's chain fully resolved could still be clobbered afterwards.
    // menubar.js's fix is to ignore a new arrow-key press outright while
    // an earlier transition is still resolving (`settledGeneration !==
    // generation`), rather than trying to race dropdown-menu.js's
    // unmodifiable close-handler after the fact — so the correct,
    // deterministic outcome here is that the 2nd press is dropped and the
    // 1st press's own target (Edit) remains the final, uncorrupted state.
    await page.keyboard.down("ArrowRight");
    await page.keyboard.up("ArrowRight");
    await page.keyboard.down("ArrowRight");
    await page.keyboard.up("ArrowRight");

    await expect(editTrigger).toBeFocused();
    await expect(filePanel).toBeHidden();
    await expect(editPanel).toBeVisible();
    await expect(viewPanel).toBeHidden();
  });

  test("matches visual baseline, including a screenshot with a panel open", async ({ page }) => {
    await expect(page.getByTestId("menubar")).toHaveScreenshot("menubar-closed.png");
    await page.getByTestId("menubar-file-trigger").click();
    await expect(page.getByTestId("menubar-file-panel")).toBeVisible();
    await expect(page.locator("body")).toHaveScreenshot("menubar-open.png");
  });
});
