import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Popover", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/popover/popover.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("opens on trigger click and closes on Escape", async ({ page }) => {
    const trigger = page.getByTestId("popover-trigger");
    const panel = page.getByTestId("popover-panel");
    await trigger.click();
    await expect(panel).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });

  test("closes on an outside click (native light-dismiss)", async ({ page }) => {
    const trigger = page.getByTestId("popover-trigger");
    const panel = page.getByTestId("popover-panel");
    await trigger.click();
    await expect(panel).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(panel).toBeHidden();
  });

  test("focus returns to the trigger after the panel closes via Escape", async ({ page }) => {
    const trigger = page.getByTestId("popover-trigger");
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test("removing the trigger from the DOM while open closes the panel", async ({ page }) => {
    const trigger = page.getByTestId("popover-trigger");
    const panel = page.getByTestId("popover-panel");
    await trigger.click();
    await expect(panel).toBeVisible();
    await page.evaluate(() => {
      document.querySelector('[data-testid="popover-trigger"]')?.remove();
    });
    await expect(panel).toBeHidden();
  });

  test("matches visual baseline open", async ({ page }) => {
    await page.getByTestId("popover-trigger").click();
    await expect(page.getByTestId("popover-demo-wrapper")).toHaveScreenshot(
      "popover-open.png",
    );
  });
});
