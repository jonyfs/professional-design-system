import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Toast", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/toast/toast.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("stack matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("toast-stack")).toHaveScreenshot("toast-stack.png");
  });

  test("success/error/info variants expose role=status and aria-live=polite (AC1)", async ({
    page,
  }) => {
    for (const testId of ["toast-success", "toast-error", "toast-info"]) {
      const toast = page.getByTestId(testId);
      await expect(toast).toHaveAttribute("role", "status");
      await expect(toast).toHaveAttribute("aria-live", "polite");
    }
  });

  test("appearing does not steal keyboard focus (AC3)", async ({ page }) => {
    // Toasts render statically in this demo page (no trigger button needed
    // to "appear" them — the gallery page itself is the appearance event).
    // Verify focus starts on <body> (nothing auto-focused by any toast).
    const activeTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeTag).toBe("BODY");
  });

  test("close button removes the toast from the DOM entirely (AC2)", async ({ page }) => {
    const toast = page.getByTestId("toast-success");
    await expect(toast).toBeVisible();
    await toast.getByTestId("toast-close").click();
    await expect(toast).toHaveCount(0);
  });

  test("dismissing one toast does not affect the others (Edge Case)", async ({ page }) => {
    await page.getByTestId("toast-success").getByTestId("toast-close").click();
    await expect(page.getByTestId("toast-success")).toHaveCount(0);
    await expect(page.getByTestId("toast-error")).toBeVisible();
    await expect(page.getByTestId("toast-info")).toBeVisible();
  });
});
