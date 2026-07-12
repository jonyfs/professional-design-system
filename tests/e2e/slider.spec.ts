import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Slider", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/slider/slider.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("arrow keys change the value", async ({ page }) => {
    const slider = page.getByTestId("slider-volume");
    await slider.focus();
    await expect(slider).toHaveValue("60");
    await page.keyboard.press("ArrowRight");
    await expect(slider).toHaveValue("61");
    await page.keyboard.press("ArrowLeft");
    await expect(slider).toHaveValue("60");
  });

  test("Home and End jump to min and max", async ({ page }) => {
    const slider = page.getByTestId("slider-volume");
    await slider.focus();
    await page.keyboard.press("End");
    await expect(slider).toHaveValue("100");
    await page.keyboard.press("Home");
    await expect(slider).toHaveValue("0");
  });

  test("disabled slider is not focusable and shows the disabled treatment", async ({ page }) => {
    const slider = page.getByTestId("slider-disabled");
    await expect(slider).toBeDisabled();
    const opacity = await slider.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeLessThan(1);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("slider-demo-wrapper")).toHaveScreenshot("slider-all.png");
  });
});
