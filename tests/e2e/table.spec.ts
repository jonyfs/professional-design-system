import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Table", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/table/table.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  // --- User Story 1: baseline table ---

  test("baseline table matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("table-baseline")).toHaveScreenshot("table-baseline.png");
  });

  test("header cells use scope=col (AC1)", async ({ page }) => {
    const headers = page.getByTestId("table-baseline").locator("th");
    const count = await headers.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(headers.nth(i)).toHaveAttribute("scope", "col");
    }
  });

  test("header text passes WCAG AAA contrast (SC-001)", async ({ page }) => {
    const header = page.getByTestId("table-baseline").locator("th").first();
    const color = await header.evaluate((el) => getComputedStyle(el).color);
    // text-neutral-600 (#4B5563) — 7.23:1 against bg-neutral-50.
    expect(color).toBe("rgb(75, 85, 99)");
  });

  test("cell text passes WCAG AAA contrast (SC-001)", async ({ page }) => {
    const cell = page.getByTestId("table-baseline").locator("td").first();
    const color = await cell.evaluate((el) => getComputedStyle(el).color);
    // text-neutral-900 (#111827).
    expect(color).toBe("rgb(17, 24, 39)");
  });

  test("real table semantics are used, not a div grid (AC2)", async ({ page }) => {
    const table = page.getByTestId("table-baseline");
    expect(await table.evaluate((el) => el.tagName)).toBe("TABLE");
    await expect(table.locator("thead")).toBeVisible();
    await expect(table.locator("tbody")).toBeVisible();
  });

  test("an empty cell keeps row height/alignment consistent (Edge Case)", async ({ page }) => {
    const emptyRow = page.getByTestId("table-row-empty-cell");
    const populatedRow = page.getByTestId("table-baseline").locator("tbody tr").first();
    const emptyBox = await emptyRow.boundingBox();
    const populatedBox = await populatedRow.boundingBox();
    expect(emptyBox).not.toBeNull();
    expect(populatedBox).not.toBeNull();
    expect(Math.abs(emptyBox!.height - populatedBox!.height)).toBeLessThan(2);
  });

  test("long cell content truncates with an ellipsis (Edge Case)", async ({ page }) => {
    const cell = page.getByTestId("table-cell-long-content");
    const overflow = await cell.evaluate((el) => getComputedStyle(el).textOverflow);
    const whiteSpace = await cell.evaluate((el) => getComputedStyle(el).whiteSpace);
    expect(overflow).toBe("ellipsis");
    expect(whiteSpace).toBe("nowrap");
  });

  test("the table scrolls horizontally rather than breaking layout at 320px (Edge Case)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const wrapper = page.getByTestId("table-baseline-wrapper");
    const overflowX = await wrapper.evaluate((el) => getComputedStyle(el).overflowX);
    expect(overflowX).toBe("auto");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(320);
  });

  // --- User Story 2: zebra-striped table ---

  test("zebra-striped table matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("table-zebra")).toHaveScreenshot("table-zebra.png");
  });

  test("every even-indexed row has a distinct background (AC1)", async ({ page }) => {
    const rows = page.getByTestId("table-zebra").locator("tbody tr");
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(4);
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(await rows.nth(i).evaluate((el) => getComputedStyle(el).backgroundColor));
    }
    // Adjacent rows (0-indexed) must alternate — row 0 and row 1 differ.
    expect(colors[0]).not.toBe(colors[1]);
    expect(colors[1]).toBe(colors[3]);
  });

  // --- User Story 3: trailing action ---

  test("trailing-action table matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("table-trailing")).toHaveScreenshot("table-trailing.png");
  });

  test("a row with a trailing Badge cell renders correctly (AC1)", async ({ page }) => {
    const row = page.getByTestId("table-row-badge");
    await expect(row.getByText("Active")).toBeVisible();
  });

  test("a row with a trailing link cell has no nested-interactive-control violation (AC2)", async ({
    page,
  }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
    const cell = page.getByTestId("table-cell-edit-link");
    const interactiveDescendants = await cell.locator("a, button").count();
    expect(interactiveDescendants).toBe(1);
    const link = cell.locator("a");
    expect(await link.textContent()).toBeTruthy();
  });
});
