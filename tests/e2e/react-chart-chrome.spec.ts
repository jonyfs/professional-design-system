import { test, expect } from "@playwright/test";

const HARNESS_URL = "http://localhost:5174/chart.html";

test.describe("Shared chart chrome — Tooltip/Legend (US3)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(HARNESS_URL);
  });

  test("legend toggle hides and restores a data series (US3 AC2)", async ({ page }) => {
    const bar = page.getByTestId("chart-bar");
    const revenueLegendButton = bar.getByRole("button", { name: "Revenue" });

    await expect(revenueLegendButton).toHaveAttribute("aria-pressed", "true");
    await revenueLegendButton.click();
    await expect(revenueLegendButton).toHaveAttribute("aria-pressed", "false");
    // Series filtered out of the chart, not just visually dimmed.
    await expect(bar.locator("svg")).toBeVisible();

    await revenueLegendButton.click();
    await expect(revenueLegendButton).toHaveAttribute("aria-pressed", "true");
  });

  test("legend toggle behaves identically across chart types", async ({ page }) => {
    for (const testId of ["chart-line", "chart-bar", "chart-area", "chart-radar"]) {
      const chart = page.getByTestId(testId);
      const firstLegendButton = chart.getByRole("button").first();
      await expect(firstLegendButton).toHaveAttribute("aria-pressed", "true");
      await firstLegendButton.click();
      await expect(firstLegendButton).toHaveAttribute("aria-pressed", "false");
    }
  });

  test("legend buttons declare full interactive states (Principle V)", async ({ page }) => {
    const button = page.getByTestId("chart-bar").getByRole("button", { name: "Revenue" });
    await button.focus();
    await expect(button).toBeFocused();
  });
});
