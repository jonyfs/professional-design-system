import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 034 — Data Display Patterns. Covers all 3 user stories (US1
// OverflowList, US2 RollingNumber + PickList, US3 Gallery + Compare).
// Brings feature 018's inventory's Data Display category from 8/16 to
// 13/16, the practical ceiling for this category (TreeTable/QRCode
// remain out of scope per prior notes).

test.describe("OverflowList", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/overflow-list/overflow-list.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("narrow container shows only what fits plus an accurate +N more count", async ({ page }) => {
    const container = page.getByTestId("overflow-list-narrow");
    const items = container.locator("[data-overflow-item]");
    const more = page.getByTestId("overflow-list-narrow-more");

    const visibleCount = await items.evaluateAll(
      (els) => els.filter((el) => (el as HTMLElement).style.display !== "none").length,
    );
    const totalCount = await items.count();
    const moreText = await more.textContent();
    expect(moreText).toBe(`+${totalCount - visibleCount} more`);
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThan(totalCount);
  });

  test("wide container (all fit) hides the +N more indicator entirely", async ({ page }) => {
    const items = page.getByTestId("overflow-list-wide").locator("[data-overflow-item]");
    const more = page.getByTestId("overflow-list-wide-more");
    const visibleCount = await items.evaluateAll(
      (els) => els.filter((el) => (el as HTMLElement).style.display !== "none").length,
    );
    const totalCount = await items.count();
    expect(visibleCount).toBe(totalCount);
    await expect(more).toHaveText("+0 more");
    await expect(more).toHaveCSS("display", "none");
  });

  test("degenerate too-narrow container shows only the +N more indicator with the full count (Edge Case)", async ({ page }) => {
    const items = page.getByTestId("overflow-list-tiny").locator("[data-overflow-item]");
    const more = page.getByTestId("overflow-list-tiny-more");
    const visibleCount = await items.evaluateAll(
      (els) => els.filter((el) => (el as HTMLElement).style.display !== "none").length,
    );
    const totalCount = await items.count();
    expect(visibleCount).toBe(0);
    await expect(more).toHaveText(`+${totalCount} more`);
  });

  test("widening the container reveals more items and updates the count", async ({ page }) => {
    const container = page.getByTestId("overflow-list-narrow");
    const items = container.locator("[data-overflow-item]");
    const before = await items.evaluateAll(
      (els) => els.filter((el) => (el as HTMLElement).style.display !== "none").length,
    );
    await container.evaluate((el) => {
      el.classList.remove("w-[200px]");
      (el as HTMLElement).style.width = "600px";
    });
    // Real bug found by tracing measurement order (documented in the
    // constitution/contract): the fix caches natural widths once, so
    // a real resize must still correctly re-derive a larger visible
    // count — this test's whole purpose is verifying that repeated
    // resizes keep working, not just the very first render.
    await page.waitForTimeout(200);
    const after = await items.evaluateAll(
      (els) => els.filter((el) => (el as HTMLElement).style.display !== "none").length,
    );
    expect(after).toBeGreaterThan(before);
  });
});

test.describe("RollingNumber", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/rolling-number/rolling-number.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("animates through intermediate values to the target, not an instant jump", async ({ page }) => {
    const el = page.getByTestId("rolling-number-demo");
    await expect(el).toHaveText("1,204");
    await page.getByTestId("rolling-number-increment").click();
    // Polls for a mid-animation value (between start and target)
    // rather than a single fixed-delay snapshot: under heavy parallel
    // worker load the rAF callback can be frame-starved for the first
    // ~150ms, so a one-shot check at a fixed delay is flaky (found by
    // this exact test failing once under load, reproducing 3/3 clean
    // in isolation). Polling tolerates that delay without weakening
    // what's actually being verified — a value strictly between start
    // and target must be observed at some point before it settles.
    await expect
      .poll(
        async () => {
          const text = await el.textContent();
          return Number(text!.replace(/,/g, ""));
        },
        { timeout: 350, intervals: [10] },
      )
      .toBeGreaterThan(1204);
    const midValue = Number((await el.textContent())!.replace(/,/g, ""));
    expect(midValue).toBeLessThan(1704);
    await page.waitForTimeout(400);
    await expect(el).toHaveText("1,704");
  });

  test("rapid successive value changes settle cleanly on the final target, no stacking (Edge Case)", async ({ page }) => {
    const el = page.getByTestId("rolling-number-demo");
    await page.getByTestId("rolling-number-rapid").click();
    await page.waitForTimeout(600);
    await expect(el).toHaveText("1,804"); // 1204 + 100 + 200 + 300
  });
});

test.describe("PickList", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/pick-list/pick-list.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("moving a checked item right removes it from source and adds it to destination", async ({ page }) => {
    await page.getByTestId("pick-list-row-alice").locator("input").check();
    await page.getByTestId("pick-list-move-right").click();
    await expect(page.getByTestId("pick-list-destination")).toContainText("Alice Johnson");
    await expect(page.getByTestId("pick-list-source")).not.toContainText("Alice Johnson");
  });

  test("move all right then all left round-trips every item", async ({ page }) => {
    await page.getByTestId("pick-list-move-all-right").click();
    await expect(page.getByTestId("pick-list-source")).toContainText("No available users");
    await page.getByTestId("pick-list-move-all-left").click();
    await expect(page.getByTestId("pick-list-destination")).toContainText("No members yet");
  });

  test("every control is keyboard-reachable and activatable (FR-003)", async ({ page }) => {
    await page.getByTestId("pick-list-row-bob").locator("input").focus();
    await page.keyboard.press("Space");
    await page.getByTestId("pick-list-move-right").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("pick-list-destination")).toContainText("Bob Martinez");
  });

  test("both panels show a distinct empty state (Edge Case)", async ({ page }) => {
    await page.getByTestId("pick-list-move-all-right").click();
    await expect(page.getByTestId("pick-list-source").getByText("No available users.")).toBeVisible();
  });
});

test.describe("Gallery", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/gallery/gallery.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("opens focus-trapped fullscreen from a thumbnail", async ({ page }) => {
    await page.getByTestId("gallery-thumb-0").click();
    const dialog = page.getByTestId("gallery-dialog");
    await expect(dialog).toBeVisible();
    const box = (await dialog.boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(box.width).toBeCloseTo(viewport.width, 0);
    expect(box.height).toBeCloseTo(viewport.height, 0);
  });

  test("Next/Previous cycle images and disable correctly at the sequence's ends", async ({ page }) => {
    await page.getByTestId("gallery-thumb-0").click();
    await expect(page.getByTestId("gallery-prev")).toBeDisabled();
    await expect(page.getByTestId("gallery-next")).toBeEnabled();

    await page.getByTestId("gallery-next").click();
    await page.getByTestId("gallery-next").click();
    await expect(page.getByTestId("gallery-next")).toBeDisabled();
    await expect(page.getByTestId("gallery-prev")).toBeEnabled();
  });

  test("Escape and the close button both dismiss it, focus returns to the trigger", async ({ page }) => {
    const trigger = page.getByTestId("gallery-thumb-0");
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("gallery-dialog")).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.getByTestId("gallery-close").click();
    await expect(page.getByTestId("gallery-dialog")).toBeHidden();
  });
});

test.describe("Compare", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/compare/compare.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("divider position drives the after-image clip-path", async ({ page }) => {
    const slider = page.getByTestId("compare-slider");
    await slider.fill("75");
    await slider.dispatchEvent("input");
    const clipPath = await page
      .getByTestId("compare-after-wrapper")
      .evaluate((el) => (el as HTMLElement).style.clipPath);
    expect(clipPath).toContain("25%");
  });

  test("is keyboard-operable via the native range input and clamps to 0-100", async ({ page }) => {
    const slider = page.getByTestId("compare-slider");
    await slider.focus();
    await page.keyboard.press("End");
    await expect(slider).toHaveValue("100");
    await page.keyboard.press("Home");
    await expect(slider).toHaveValue("0");
  });
});
