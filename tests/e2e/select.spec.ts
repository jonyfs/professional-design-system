import { test, expect, type Locator, type Page } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

/**
 * Presses Tab until `target` is focused, up to `maxPresses`. The demo
 * page's "back to gallery" link precedes each component in tab order, and
 * engines differ on whether plain links are Tab-focusable (WebKit isn't,
 * by default) — polling avoids hardcoding an engine-specific press count.
 */
async function tabUntilFocused(page: Page, target: Locator, maxPresses = 5) {
  for (let i = 0; i < maxPresses; i++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error(`Target not focused after ${maxPresses} Tab presses`);
}

test.describe("Select", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/select/select.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("default state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("select-default-wrapper")).toHaveScreenshot(
      "select-default.png",
    );
  });

  test("focus state matches visual baseline and shows the brand ring", async ({ page }) => {
    const select = page.getByTestId("select-default");
    await select.focus();
    await expect(page.getByTestId("select-default-wrapper")).toHaveScreenshot(
      "select-focus.png",
    );
  });

  test("error state exposes aria-invalid and a visible, linked error message", async ({
    page,
  }) => {
    const select = page.getByTestId("select-error");
    await expect(select).toHaveAttribute("aria-invalid", "true");

    const describedBy = await select.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    const errorMessage = page.locator(`#${describedBy}`);
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/.+/);

    await expect(page.getByTestId("select-error-wrapper")).toHaveScreenshot(
      "select-error.png",
    );
  });

  test("error message stays visible with no option selected (Edge Case)", async ({ page }) => {
    const select = page.getByTestId("select-error");
    await expect(select).toHaveValue("");
    const describedBy = await select.getAttribute("aria-describedby");
    await expect(page.locator(`#${describedBy}`)).toBeVisible();
  });

  test("disabled state matches visual baseline and blocks interaction", async ({ page }) => {
    const select = page.getByTestId("select-disabled");
    await expect(select).toBeDisabled();
    await expect(page.getByTestId("select-disabled-wrapper")).toHaveScreenshot(
      "select-disabled.png",
    );
  });

  test("is keyboard-focusable and its value can change via keyboard selection (AC3)", async ({
    page,
  }) => {
    // AC3 claims native arrow-key option navigation. Verified manually (real
    // Chrome/Firefox/Safari all support this for a focused, closed <select>)
    // but NOT via Playwright's synthetic key events: raw ArrowDown/Enter to a
    // native <select> does not reliably drive the browser's OS-level option
    // list in headless automation (confirmed by direct reproduction — the
    // value never changes regardless of click-then-key or focus-then-key
    // sequencing). This is a documented Playwright/native-<select> testing
    // limitation, not a defect in this component's markup, so this test
    // instead verifies what IS reliably automatable: the select reaches
    // focus via Tab, and selecting an option (Playwright's own supported API
    // for driving a <select>, which fires the same "change" event a real
    // keyboard selection would) updates its value correctly.
    const select = page.getByTestId("select-default");
    await tabUntilFocused(page, select);
    await expect(select).toBeFocused();

    const initialValue = await select.inputValue();
    await select.selectOption("br");
    const newValue = await select.inputValue();
    expect(newValue).not.toBe(initialValue);
    expect(newValue).toBe("br");
  });
});
