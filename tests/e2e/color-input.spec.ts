import { test, expect, type Page, type Locator } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// The site-wide theme selector (feature 025) adds its own tab stop between
// the back-link and each page's component demo, so a single Tab press is no
// longer a safe assumption — retry like button.spec.ts/select.spec.ts do.
async function tabUntilFocused(page: Page, target: Locator, maxPresses = 5) {
  for (let i = 0; i < maxPresses; i++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error(`Target not focused after ${maxPresses} Tab presses`);
}

test.describe("ColorPicker/ColorInput", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/color-input/color-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("is reachable via Tab", async ({ page, browserName }) => {
    // Confirmed empirically (isolated from this component, a bare
    // `<input type="color">` with nothing else on the page): this
    // WebKit build excludes color inputs from the natural Tab sequence
    // specifically, even though the element still accepts focus via a
    // direct `.focus()` call or a real click — a genuine engine
    // limitation, not a defect in this component's markup/CSS, matching
    // the class of accepted cross-engine limitation already documented
    // for PinInput's Firefox clipboard-event gap (feature 015).
    test.skip(browserName === "webkit", "WebKit excludes input[type=color] from the Tab sequence");
    const input = page.getByTestId("color-input-accent");
    await page.getByRole("link", { name: "← Back to gallery" }).focus();
    await tabUntilFocused(page, input);
    await expect(input).toBeFocused();
  });

  test("focus-visible ring applies when focused", async ({ page }) => {
    const input = page.getByTestId("color-input-accent");
    await input.focus();
    const outlineOrRing = await input.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(outlineOrRing).not.toBe("none");
  });

  test("a disabled example cannot be focused", async ({ page }) => {
    const input = page.getByTestId("color-input-disabled");
    await expect(input).toBeDisabled();
  });

  test("the value attribute is a valid 7-character hex color string", async ({ page }) => {
    const input = page.getByTestId("color-input-accent");
    const value = await input.inputValue();
    expect(value).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("color-input-demo-wrapper")).toHaveScreenshot(
      "color-input-all.png",
    );
  });
});
