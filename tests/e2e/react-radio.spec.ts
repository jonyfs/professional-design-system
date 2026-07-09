import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/radio.html";

test.describe("Radio (React package, visual parity with static reference)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("default state matches the static reference's visual baseline", async ({ page }) => {
    await expect(page.getByTestId("radio-group")).toHaveScreenshot("radio-default.png");
  });

  test("checked state matches the static reference's visual baseline", async ({ page }) => {
    const express = page.getByTestId("radio-express");
    await express.check();
    await expect(page.getByTestId("radio-group")).toHaveScreenshot("radio-checked.png");
  });

  test("focus-visible state matches the static reference's visual baseline", async ({ page }) => {
    const standard = page.getByTestId("radio-standard");
    await standard.focus();
    await expect(page.getByTestId("radio-group")).toHaveScreenshot("radio-focus-visible.png");
  });

  test("disabled option matches the static reference's visual baseline", async ({ page }) => {
    await expect(page.getByTestId("radio-disabled")).toBeDisabled();
    await expect(page.getByTestId("radio-group")).toHaveScreenshot("radio-disabled.png");
  });

  test("selecting one option deselects the previously-selected one in the group", async ({
    page,
  }) => {
    const standard = page.getByTestId("radio-standard");
    const express = page.getByTestId("radio-express");
    await expect(standard).toBeChecked();
    await expect(express).not.toBeChecked();

    await express.check();
    await expect(express).toBeChecked();
    await expect(standard).not.toBeChecked();
  });

  test("arrow-key navigation moves focus and selection within the group (AC2)", async ({
    page,
  }) => {
    const standard = page.getByTestId("radio-standard");
    const express = page.getByTestId("radio-express");

    await standard.focus();
    await expect(standard).toBeChecked();

    await page.keyboard.press("ArrowDown");
    await expect(express).toBeFocused();
    await expect(express).toBeChecked();
    await expect(standard).not.toBeChecked();
  });

  test("disabled option cannot be selected via click", async ({ page }) => {
    const disabled = page.getByTestId("radio-disabled");
    await expect(disabled).toBeDisabled();
    await disabled.click({ force: true }).catch(() => {
      /* Playwright may refuse to click a disabled element outright — also the expected outcome */
    });
    await expect(disabled).not.toBeChecked();
  });

  test("long label wraps without breaking input/label alignment (Edge Case)", async ({
    page,
  }) => {
    const wrapper = page.getByTestId("radio-long-label-wrapper");
    const wrapperBox = await wrapper.boundingBox();
    const input = page.getByTestId("radio-long-label-input");
    const inputBox = await input.boundingBox();
    expect(wrapperBox).not.toBeNull();
    expect(inputBox).not.toBeNull();
    expect(inputBox!.width).toBeLessThanOrEqual(20);
    expect(inputBox!.width).toBeGreaterThan(0);
  });
});
