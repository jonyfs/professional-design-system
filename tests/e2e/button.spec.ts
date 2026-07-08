import { test, expect, type Locator, type Page } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

/**
 * Presses Tab until `target` is focused, up to `maxPresses`. WebKit does not
 * make plain `<a>` links Tab-focusable by default (unlike Chromium/Firefox),
 * so the number of presses needed to reach a given element varies by engine
 * — polling avoids hardcoding a browser-specific tab-order assumption.
 */
async function tabUntilFocused(page: Page, target: Locator, maxPresses = 5) {
  for (let i = 0; i < maxPresses; i++) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error(`Target not focused after ${maxPresses} Tab presses`);
}

test.describe("Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/button/button.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("primary button matches visual baseline (default)", async ({ page }) => {
    await expect(page.getByTestId("button-primary")).toHaveScreenshot("button-primary-default.png");
  });

  test("primary button matches visual baseline (hover)", async ({ page }) => {
    const button = page.getByTestId("button-primary");
    await button.hover();
    await expect(button).toHaveScreenshot("button-primary-hover.png");
  });

  test("primary button matches visual baseline (focus-visible)", async ({ page }) => {
    const button = page.getByTestId("button-primary");
    await tabUntilFocused(page, button);
    await expect(button).toBeFocused();
    await expect(button).toHaveScreenshot("button-primary-focus-visible.png");
  });

  test("primary button matches visual baseline (disabled)", async ({ page }) => {
    await expect(page.getByTestId("button-primary-disabled")).toHaveScreenshot(
      "button-primary-disabled.png",
    );
  });

  test("secondary button matches visual baseline (default)", async ({ page }) => {
    await expect(page.getByTestId("button-secondary")).toHaveScreenshot(
      "button-secondary-default.png",
    );
  });

  test("Tab reveals a visible focus ring with no default browser outline", async ({ page }) => {
    const button = page.getByTestId("button-primary");
    await tabUntilFocused(page, button);
    await expect(button).toBeFocused();
    const outlineStyle = await button.evaluate((el) => getComputedStyle(el).outlineStyle);
    // The brand focus-visible outline is drawn via Tailwind's `outline` utility
    // (outlineStyle: solid), never the browser default (which would also be
    // "solid" but with outline-color "invert"/auto) — assert width/offset are
    // explicitly set rather than left at the browser default of 0.
    const outlineWidth = await button.evaluate((el) => getComputedStyle(el).outlineWidth);
    expect(outlineStyle).toBe("solid");
    expect(outlineWidth).not.toBe("0px");
  });

  test("disabled button does not respond to click", async ({ page }) => {
    const button = page.getByTestId("button-primary-disabled");
    await expect(button).toBeDisabled();
    await button.evaluate((el) => {
      (el as HTMLButtonElement & { __clicked?: boolean }).__clicked = false;
      el.addEventListener("click", () => {
        (el as HTMLButtonElement & { __clicked?: boolean }).__clicked = true;
      });
    });
    // A native disabled button never dispatches "click", even force-clicked.
    await button.click({ force: true }).catch(() => {
      /* Playwright may refuse to click a disabled element outright — also the expected outcome */
    });
    const clicked = await button.evaluate(
      (el) => (el as HTMLButtonElement & { __clicked?: boolean }).__clicked,
    );
    expect(clicked).toBe(false);
  });

  test("Enter activates a focused, enabled button (FR-006)", async ({ page }) => {
    const button = page.getByTestId("button-primary");
    // Attach the listener and wait for it to be registered before pressing
    // Enter, so there's no race between listener setup and the keypress.
    await button.evaluate((el) => {
      (el as HTMLButtonElement & { __activated?: boolean }).__activated = false;
      el.addEventListener("click", () => {
        (el as HTMLButtonElement & { __activated?: boolean }).__activated = true;
      });
    });
    await button.focus();
    await page.keyboard.press("Enter");
    const activated = await button.evaluate(
      (el) => (el as HTMLButtonElement & { __activated?: boolean }).__activated,
    );
    expect(activated).toBe(true);
  });

  test("long label wraps without breaking layout", async ({ page }) => {
    const wrapper = page.getByTestId("button-long-label-wrapper");
    const box = await wrapper.boundingBox();
    expect(box).not.toBeNull();
    // The constrained demo wrapper caps width; the button must not overflow it.
    const button = page.getByTestId("button-long-label");
    const buttonBox = await button.boundingBox();
    expect(buttonBox!.width).toBeLessThanOrEqual(box!.width + 1);
  });
});
