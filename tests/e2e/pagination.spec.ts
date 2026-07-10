import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Pagination", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/pagination/pagination.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("middle page matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("pagination")).toHaveScreenshot("pagination-middle.png");
  });

  test("first page matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("pagination-first")).toHaveScreenshot("pagination-first.png");
  });

  test("last page matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("pagination-last")).toHaveScreenshot("pagination-last.png");
  });

  test("current page carries aria-current and distinct visual treatment (AC1)", async ({
    page,
  }) => {
    const current = page.getByTestId("pagination-page-3");
    await expect(current).toHaveAttribute("aria-current", "page");
    const bg = await current.evaluate((el) => getComputedStyle(el).backgroundColor);
    const other = page.getByTestId("pagination-page-2");
    const otherBg = await other.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe(otherBg);
  });

  test("Previous is genuinely disabled on the first page (AC2)", async ({ page }) => {
    const prev = page.getByTestId("pagination-first-prev");
    await expect(prev).toBeDisabled();
  });

  test("Next is genuinely disabled on the last page (AC3)", async ({ page }) => {
    const next = page.getByTestId("pagination-last-next");
    await expect(next).toBeDisabled();
  });

  test("Previous/Next are enabled mid-range and are real navigable links, not dead buttons (code review finding)", async ({
    page,
  }) => {
    const prev = page.getByTestId("pagination-prev");
    const next = page.getByTestId("pagination-next");
    await expect(prev).toBeEnabled();
    await expect(next).toBeEnabled();
    // An enabled control MUST be a real <a href> — a plain <button> with
    // no href/handler silently does nothing on click, exactly the bug a
    // code-reviewer agent found in an earlier draft (toBeEnabled() alone
    // doesn't catch this, since a non-disabled <button> also passes it).
    await expect(prev).toHaveJSProperty("tagName", "A");
    await expect(next).toHaveJSProperty("tagName", "A");
    await expect(prev).toHaveAttribute("href", "#");
    await expect(next).toHaveAttribute("href", "#");
  });

  test("truncation shows an ellipsis for large ranges (AC4)", async ({ page }) => {
    const nav = page.getByTestId("pagination");
    await expect(nav.locator(".pagination-ellipsis")).toHaveCount(2);
  });

  test("single-total-page variant disables both controls (Edge Case)", async ({ page }) => {
    await expect(page.getByTestId("pagination-single-prev")).toBeDisabled();
    await expect(page.getByTestId("pagination-single-next")).toBeDisabled();
    await expect(page.getByTestId("pagination-single-page-1")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("ellipsis is hidden from assistive technology", async ({ page }) => {
    const ellipsis = page.locator(".pagination-ellipsis").first();
    await expect(ellipsis).toHaveAttribute("aria-hidden", "true");
  });
});
