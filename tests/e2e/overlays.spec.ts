import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 032 — Overlays. Covers all 3 user stories (US1 Affix, US2
// LoadingOverlay, US3 Bottom Sheet). Closes feature 018's inventory's
// Overlays category from 0% to 3/6 (Drawer, Dialog Manager, Popover
// Combobox variant explicitly excluded — de-duplication/out-of-scope
// findings documented in spec.md/research.md).

test.describe("Affix", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/affix/affix.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("is not pinned before scrolling past its natural position", async ({ page }) => {
    const demo = page.getByTestId("affix-demo");
    await expect(demo).not.toHaveClass(/affix-pinned/);
  });

  test("pins after scrolling past its natural position and un-pins when scrolled back", async ({ page }) => {
    const demo = page.getByTestId("affix-demo");
    const naturalTop = (await demo.boundingBox())!.y;

    await page.evaluate((y) => window.scrollTo({ top: y + 50 }), naturalTop);
    await page.waitForTimeout(150);
    await expect(demo).toHaveClass(/affix-pinned/);

    await page.evaluate(() => window.scrollTo({ top: 0 }));
    await page.waitForTimeout(150);
    await expect(demo).not.toHaveClass(/affix-pinned/);
  });

  test("pinning inserts a placeholder so the page does not jump", async ({ page }) => {
    const demo = page.getByTestId("affix-demo");
    const naturalTop = (await demo.boundingBox())!.y;
    const endBefore = (await page.getByTestId("affix-content-end").boundingBox())!.y;

    await page.evaluate((y) => window.scrollTo({ top: y + 50 }), naturalTop);
    await page.waitForTimeout(150);

    // The demo element itself is now fixed (out of flow), but the
    // placeholder holding its former space means everything AFTER it
    // (relative to the scrolled viewport) shouldn't have jumped by
    // more than the scroll amount itself — verified by checking total
    // document height is unaffected by the pin/unpin transition.
    const scrollHeightPinned = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.evaluate(() => window.scrollTo({ top: 0 }));
    await page.waitForTimeout(150);
    const scrollHeightUnpinned = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(scrollHeightPinned).toBe(scrollHeightUnpinned);
    expect(endBefore).toBeGreaterThan(0);
  });
});

test.describe("LoadingOverlay", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/loading-overlay/loading-overlay.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("is hidden by default with aria-busy false", async ({ page }) => {
    await expect(page.getByTestId("loading-overlay")).toBeHidden();
    await expect(page.getByTestId("loading-overlay-container")).toHaveAttribute("aria-busy", "false");
  });

  test("toggling shows the overlay, sets aria-busy, and blocks the underlying button", async ({ page }) => {
    await page.getByTestId("loading-overlay-toggle").click();
    await expect(page.getByTestId("loading-overlay")).toBeVisible();
    await expect(page.getByTestId("loading-overlay-container")).toHaveAttribute("aria-busy", "true");

    // The inner button is covered by the overlay (higher stacking) —
    // a real click attempt should hit the overlay, not the button.
    const inner = page.getByTestId("loading-overlay-inner-button");
    const box = (await inner.boundingBox())!;
    const elementAtPoint = await page.evaluate(
      ({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        return el?.getAttribute("data-testid") ?? el?.tagName ?? null;
      },
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    );
    expect(elementAtPoint).not.toBe("loading-overlay-inner-button");
  });

  test("toggling again hides the overlay and restores interactivity", async ({ page }) => {
    await page.getByTestId("loading-overlay-toggle").click();
    await expect(page.getByTestId("loading-overlay")).toBeVisible();
    await page.getByTestId("loading-overlay-toggle").click();
    await expect(page.getByTestId("loading-overlay")).toBeHidden();
    await expect(page.getByTestId("loading-overlay-container")).toHaveAttribute("aria-busy", "false");
    await page.getByTestId("loading-overlay-inner-button").click();
  });
});

test.describe("Bottom Sheet", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/bottom-sheet/bottom-sheet.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("opens anchored to the bottom edge", async ({ page }) => {
    await page.getByTestId("bottom-sheet-trigger").click();
    const sheet = page.getByTestId("bottom-sheet");
    await expect(sheet).toBeVisible();
    const box = (await sheet.boundingBox())!;
    const viewportSize = page.viewportSize()!;
    expect(box.y + box.height).toBeCloseTo(viewportSize.height, 0);
  });

  test("Escape closes and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByTestId("bottom-sheet-trigger");
    await trigger.click();
    await expect(page.getByTestId("bottom-sheet")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("bottom-sheet")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("backdrop click closes the sheet", async ({ page }) => {
    await page.getByTestId("bottom-sheet-trigger").click();
    const dialog = page.getByTestId("bottom-sheet");
    await expect(dialog).toBeVisible();

    // Unlike Slide-over (a full-height side column, so the horizontal
    // gap to its left is outside the <dialog> box), Bottom Sheet is
    // full-WIDTH but content-sized in height (bottom-0, max-h only,
    // no h-full) — the actual gap outside the <dialog> element's own
    // rendered box is ABOVE the panel, not beside it. Clicking there
    // hits the ::backdrop pseudo-element (event.target === dialog),
    // not a coordinate near the dialog's own top-left corner (which
    // lands inside the panel itself).
    const panelBox = (await dialog.boundingBox())!;
    await page.mouse.click(page.viewportSize()!.width / 2, panelBox.y / 2);
    await expect(dialog).toBeHidden();
  });

  test("explicit close button dismisses it", async ({ page }) => {
    await page.getByTestId("bottom-sheet-trigger").click();
    await page.getByTestId("bottom-sheet-close").click();
    await expect(page.getByTestId("bottom-sheet")).toBeHidden();
  });

  test("overflowing content scrolls internally rather than being clipped", async ({ page }) => {
    await page.getByTestId("bottom-sheet-long-trigger").click();
    const sheet = page.getByTestId("bottom-sheet-long");
    await expect(sheet).toBeVisible();
    const overflow = await sheet.evaluate((el) => {
      const panel = el.querySelector(".bottom-sheet-panel") as HTMLElement;
      return panel.scrollHeight > panel.clientHeight;
    });
    expect(overflow).toBe(true);
  });
});
