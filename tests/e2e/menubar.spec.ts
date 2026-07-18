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

    // Real cross-environment finding (traced with a standalone repro
    // script, not assumed): Playwright's keyboard.down()/up() each incur
    // their own separate CDP round-trip. On this catalog's local macOS
    // dev environment that round-trip is slow enough that both key
    // events land before the native Popover "toggle" event (observed
    // resolving in under 1ms) fires — reproducing the intended race. On
    // Linux (this catalog's CI, and any Docker-based run), the same
    // round-trip is fast enough relative to the native toggle that the
    // FIRST transition can fully settle before the SECOND keydown is
    // even dispatched — at that point menubar.js's guard correctly
    // treats it as a legitimate, separate keypress (not a race) and
    // advances a second time, landing on View instead of Edit. That is
    // NOT a corrupted state (exactly one trigger focused, exactly one
    // matching panel open) — it just isn't the specific race this test
    // means to exercise. Dispatching both keydowns synchronously inside
    // a single page.evaluate() (confirmed via the same repro script to
    // reliably reproduce the guard engaging, unlike keyboard.down/up)
    // removes the two separate CDP round-trips entirely, so the race
    // is deterministic regardless of platform.
    await page.evaluate(() => {
      const menubar = document.querySelector("[data-menubar]");
      menubar?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
      menubar?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });

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
