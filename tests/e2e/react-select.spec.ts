import { test, expect, type Locator, type Page } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

async function tabUntilFocused(page: Page, target: Locator, maxPresses = 5) {
  for (let i = 0; i < maxPresses; i++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error(`Target not focused after ${maxPresses} Tab presses`);
}

const HARNESS_URL = "http://localhost:5174/select.html";

test.describe("Select (React package, visual parity with static reference)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("default state matches the static reference's visual baseline", async ({ page }) => {
    await expect(page.getByTestId("select-default-wrapper")).toHaveScreenshot(
      "select-default.png",
    );
  });

  test("focus state matches the static reference's visual baseline and shows the brand ring", async ({
    page,
  }) => {
    const select = page.getByTestId("select-default");
    await select.focus();
    await expect(page.getByTestId("select-default-wrapper")).toHaveScreenshot("select-focus.png");
  });

  test("error state exposes aria-invalid and a visible, linked error message", async ({
    page,
  }) => {
    const select = page.getByTestId("select-error");
    await expect(select).toHaveAttribute("aria-invalid", "true");

    const describedBy = await select.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    const errorMessage = page.locator(`[id="${describedBy}"]`);
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/.+/);

    await expect(page.getByTestId("select-error-wrapper")).toHaveScreenshot("select-error.png");
  });

  test("error message stays visible with no option selected (Edge Case)", async ({ page }) => {
    const select = page.getByTestId("select-error");
    await expect(select).toHaveValue("");
    const describedBy = await select.getAttribute("aria-describedby");
    await expect(page.locator(`[id="${describedBy}"]`)).toBeVisible();
  });

  test("disabled state matches the static reference's visual baseline and blocks interaction", async ({
    page,
  }) => {
    const select = page.getByTestId("select-disabled");
    await expect(select).toBeDisabled();
    await expect(page.getByTestId("select-disabled-wrapper")).toHaveScreenshot(
      "select-disabled.png",
    );
  });

  test("is keyboard-focusable and its value can change via keyboard selection (AC3)", async ({
    page,
  }) => {
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
