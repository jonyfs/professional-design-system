import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/pagination.html";

test.describe("Pagination (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("pagination")).toHaveScreenshot("react-pagination.png");
  });

  test("Previous/Next are genuinely disabled buttons at boundaries", async ({ page }) => {
    const firstPrev = page.getByTestId("pagination-first-prev");
    expect(await firstPrev.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(firstPrev).toBeDisabled();

    const lastNext = page.getByTestId("pagination-last-next");
    expect(await lastNext.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(lastNext).toBeDisabled();
  });

  test("clicking a page number advances the current page", async ({ page }) => {
    const active = page.getByTestId("pagination-page-3");
    await expect(active).toHaveAttribute("aria-current", "page");
    await page.getByTestId("pagination-next").click();
    await expect(page.getByTestId("pagination-page-4")).toHaveAttribute("aria-current", "page");
  });

  test("single page renders both controls disabled (Edge Case)", async ({ page }) => {
    await expect(page.getByTestId("pagination-single-prev")).toBeDisabled();
    await expect(page.getByTestId("pagination-single-next")).toBeDisabled();
  });
});
