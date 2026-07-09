import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

test.describe("Slide-over", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/slide-over/slide-over.html");
  });

  async function activeElementIsSafe(page: import("@playwright/test").Page) {
    return page.evaluate(() => {
      const dialogEl = document.querySelector('[data-testid="slide-over"]');
      const active = document.activeElement;
      return dialogEl?.contains(active) || active === document.body;
    });
  }

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("opening and closing produces no console/CSP errors", async ({ page }) => {
    await expectNoConsoleErrors(page, async () => {
      await page.getByTestId("slide-over-trigger").click();
      await expect(page.getByTestId("slide-over")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("slide-over")).toBeHidden();
    });
  });

  // Same gap as Modal's equivalent test (code review): a closed <dialog>
  // is display:none, so axe never actually scans the open panel otherwise.
  test("has no accessibility violations (open state)", async ({ page }, testInfo) => {
    await page.getByTestId("slide-over-trigger").click();
    await expect(page.getByTestId("slide-over")).toBeVisible();
    await expectNoA11yViolations(page, testInfo);
  });

  test("closed state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("slide-over-trigger")).toHaveScreenshot("slide-over-closed.png");
  });

  test("open state matches visual baseline (AC1)", async ({ page }) => {
    await page.getByTestId("slide-over-trigger").click();
    await expect(page.getByTestId("slide-over")).toBeVisible();
    await expect(page.getByTestId("slide-over")).toHaveScreenshot("slide-over-open.png");
  });

  test("Tab cycle never escapes the open panel", async ({ page }) => {
    await page.getByTestId("slide-over-trigger").click();
    const dialog = page.getByTestId("slide-over");
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

  test("Shift+Tab from the first focusable element wraps within the panel (Edge Case)", async ({
    page,
  }) => {
    await page.getByTestId("slide-over-trigger").click();
    const dialog = page.getByTestId("slide-over");
    await expect(dialog).toBeVisible();
    await page.getByTestId("slide-over-close").focus();
    await page.keyboard.press("Shift+Tab");
    expect(await activeElementIsSafe(page)).toBe(true);
  });

  test("Escape closes the panel and returns focus to the trigger (AC2)", async ({ page }) => {
    const trigger = page.getByTestId("slide-over-trigger");
    await trigger.click();
    await expect(page.getByTestId("slide-over")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("slide-over")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("clicking the backdrop closes the panel and returns focus to the trigger (AC2)", async ({
    page,
  }) => {
    const trigger = page.getByTestId("slide-over-trigger");
    await trigger.click();
    const dialog = page.getByTestId("slide-over");
    await expect(dialog).toBeVisible();

    // Unlike Modal (centered, always leaves a margin), the panel is
    // `w-full max-w-md` anchored to the right edge — on a viewport narrower
    // than max-w-md (e.g. 320px), the panel fills 100% of the width and
    // there is no backdrop pixel left to click. Compute the panel's actual
    // rendered box and only assert backdrop-dismissal where a real gap
    // exists to its left; a full-width panel is a legitimate, intentional
    // outcome (no dead space to reserve on a narrow viewport), not a defect.
    const panelBox = await page.getByTestId("slide-over").locator(".slide-over-panel").boundingBox();
    if (!panelBox || panelBox.x < 10) {
      test.skip(true, "Panel is full-width at this viewport — no backdrop area to click");
      return;
    }
    await page.mouse.click(panelBox.x / 2, panelBox.y + 5);
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("explicit close button closes the panel and returns focus to the trigger", async ({
    page,
  }) => {
    const trigger = page.getByTestId("slide-over-trigger");
    await trigger.click();
    await page.getByTestId("slide-over-close").click();
    await expect(page.getByTestId("slide-over")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("empty-content variant focuses the dialog itself (Edge Case, tabindex=-1)", async ({
    page,
  }) => {
    await page.getByTestId("slide-over-info-trigger").click();
    const dialog = page.getByTestId("slide-over-info");
    await expect(dialog).toBeVisible();
    const dialogIsFocused = await dialog.evaluate((el) => el === document.activeElement);
    expect(dialogIsFocused).toBe(true);
  });

  // Same gap as Modal's info variant (code review): no a11y scan, no
  // visual baseline, and no proof of dismissibility for the one variant
  // with no visible close control at all.
  test("empty-content variant has no accessibility violations", async ({ page }, testInfo) => {
    await page.getByTestId("slide-over-info-trigger").click();
    await expect(page.getByTestId("slide-over-info")).toBeVisible();
    await expectNoA11yViolations(page, testInfo);
  });

  test("empty-content variant matches visual baseline", async ({ page }) => {
    await page.getByTestId("slide-over-info-trigger").click();
    await expect(page.getByTestId("slide-over-info")).toBeVisible();
    await expect(page.getByTestId("slide-over-info")).toHaveScreenshot("slide-over-info-open.png");
  });

  test("empty-content variant is dismissible via Escape", async ({ page }) => {
    const trigger = page.getByTestId("slide-over-info-trigger");
    await trigger.click();
    await expect(page.getByTestId("slide-over-info")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("slide-over-info")).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
