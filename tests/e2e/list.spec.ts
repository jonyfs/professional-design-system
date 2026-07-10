import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Lists", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/list/list.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  // --- User Story 1: read-only list ---

  test("read-only list matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("list-readonly")).toHaveScreenshot("list-readonly.png");
  });

  test("read-only rows render avatar, title, and metadata (AC1)", async ({ page }) => {
    const row = page.getByTestId("list-item-readonly-0");
    await expect(row.locator(".avatar-img, .avatar-fallback")).toBeVisible();
    await expect(row.locator(".list-row-title")).toBeVisible();
    await expect(row.locator(".list-row-metadata")).toBeVisible();
  });

  test("row with an initials-fallback avatar renders correctly (AC2)", async ({ page }) => {
    await expect(page.getByTestId("list-item-readonly-fallback").locator(".avatar-fallback")).toBeVisible();
  });

  test("metadata text passes WCAG AAA contrast (SC-001)", async ({ page }) => {
    const metadata = page.getByTestId("list-item-readonly-0").locator(".list-row-metadata");
    const color = await metadata.evaluate((el) => getComputedStyle(el).color);
    // text-neutral-600 (#4B5563), not the failing text-neutral-500 (#6B7280).
    expect(color).toBe("rgb(75, 85, 99)");
  });

  test("row with no metadata keeps the avatar vertically centered (Edge Case)", async ({ page }) => {
    const row = page.getByTestId("list-item-no-metadata");
    const avatarBox = await row.locator(".avatar-img, .avatar-fallback").boundingBox();
    const rowBox = await row.boundingBox();
    expect(avatarBox).not.toBeNull();
    expect(rowBox).not.toBeNull();
    const avatarCenter = avatarBox!.y + avatarBox!.height / 2;
    const rowCenter = rowBox!.y + rowBox!.height / 2;
    expect(Math.abs(avatarCenter - rowCenter)).toBeLessThan(2);
  });

  test("a long title truncates with an ellipsis instead of wrapping (Edge Case)", async ({ page }) => {
    const title = page.getByTestId("list-item-long-title").locator(".list-row-title");
    const overflow = await title.evaluate((el) => getComputedStyle(el).textOverflow);
    const whiteSpace = await title.evaluate((el) => getComputedStyle(el).whiteSpace);
    expect(overflow).toBe("ellipsis");
    expect(whiteSpace).toBe("nowrap");
    const box = await title.boundingBox();
    const row = page.getByTestId("list-item-long-title");
    const rowBox = await row.boundingBox();
    // The row's height must stay fixed to the normal two-line row height
    // (title + metadata line, ~65px including padding) rather than
    // growing to accommodate a wrapped title (which would be
    // considerably taller — several times a single line height).
    expect(box!.height).toBeLessThan(30);
    expect(rowBox!.height).toBeLessThan(80);
  });

  // --- User Story 2: interactive list ---

  test("interactive list matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("list-interactive")).toHaveScreenshot("list-interactive.png");
  });

  test("interactive rows are reachable via Tab in document order and show a visible focus ring (AC1)", async ({
    page,
  }) => {
    // How many stops precede the first list row (e.g. the page's "Back
    // to gallery" link) varies by engine/OS — macOS Playwright's WebKit
    // excludes plain <a> links without tabindex from the Tab order
    // entirely, while Linux's WebKit build (a different underlying
    // port) includes them, same as Chromium/Firefox (confirmed
    // empirically on both platforms, not assumed from one). Rather than
    // hardcoding a fixed Tab-press count that only holds on one platform
    // (a real bug this exact assumption caused once already), Tab
    // repeatedly until the first row is reached, then assert the
    // remaining rows follow immediately in sequence — this validates
    // "reachable, in document order" without caring how many unrelated
    // stops precede them.
    const firstRow = page.getByTestId("list-item-interactive-0");
    let reached = false;
    for (let attempt = 0; attempt < 15 && !reached; attempt++) {
      await page.keyboard.press("Tab");
      reached = await firstRow.evaluate((el) => el === document.activeElement);
    }
    expect(reached).toBe(true);

    const rows = ["list-item-interactive-0", "list-item-interactive-1", "list-item-interactive-2"];
    for (const testId of rows) {
      await expect(page.getByTestId(testId)).toBeFocused();
      const outline = await page
        .getByTestId(testId)
        .evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(outline).not.toBe("none");
      await page.keyboard.press("Tab");
    }
  });

  test("hovering an interactive row shows a background change (AC3)", async ({ page }) => {
    const row = page.getByTestId("list-item-interactive-0");
    const before = await row.evaluate((el) => getComputedStyle(el).backgroundColor);
    await row.hover();
    const after = await row.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(after).not.toBe(before);
  });

  test("interactive rows are real anchors (native link semantics, AC2)", async ({ page }) => {
    const row = page.getByTestId("list-item-interactive-0");
    expect(await row.evaluate((el) => el.tagName)).toBe("A");
    expect(await row.getAttribute("href")).toBeTruthy();
  });

  // --- User Story 3: trailing action ---

  test("trailing-action list matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("list-trailing")).toHaveScreenshot("list-trailing.png");
  });

  test("a read-only row with a trailing Badge renders correctly aligned (AC1)", async ({ page }) => {
    const row = page.getByTestId("list-item-trailing");
    await expect(row.getByText("Active")).toBeVisible();
  });

  test("an interactive row with a trailing chevron has no nested-interactive-control violation (AC2)", async ({
    page,
  }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
    const row = page.getByTestId("list-item-trailing-chevron");
    const interactiveDescendants = await row.locator("a, button").count();
    expect(interactiveDescendants).toBe(0);
  });
});
