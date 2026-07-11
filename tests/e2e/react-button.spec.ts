import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Runs against the React test harness (tests/react-harness), not the
// static HTML gallery — and deliberately targets the SAME snapshot files
// as tests/e2e/button.spec.ts (no "react-" prefix on the .png names).
// This is the actual, automated proof of SC-001 ("visually indistinguishable
// ... verified by automated visual comparison, not manual eyeballing"): if
// packages/react's Button diverges from the static reference by even one
// pixel, this test fails against the already-committed baseline, rather
// than comparing two independently-generated screenshots that merely look
// similar to the eye.
const HARNESS_URL = "http://localhost:5174/button.html";

test.describe("Button (React package, visual parity with static reference)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("primary button matches the static reference's visual baseline (default)", async ({
    page,
  }) => {
    await expect(page.getByTestId("button-primary")).toHaveScreenshot("button-primary-default.png");
  });

  test("primary button matches the static reference's visual baseline (hover)", async ({
    page,
  }) => {
    const button = page.getByTestId("button-primary");
    await button.hover();
    await expect(button).toHaveScreenshot("button-primary-hover.png");
  });

  test("primary button matches the static reference's visual baseline (focus-visible)", async ({
    page,
  }) => {
    const button = page.getByTestId("button-primary");
    await button.focus();
    await expect(button).toBeFocused();
    await expect(button).toHaveScreenshot("button-primary-focus-visible.png");
  });

  test("primary button matches the static reference's visual baseline (disabled)", async ({
    page,
  }) => {
    await expect(page.getByTestId("button-primary-disabled")).toHaveScreenshot(
      "button-primary-disabled.png",
    );
  });

  test("secondary button matches the static reference's visual baseline (default)", async ({
    page,
  }) => {
    await expect(page.getByTestId("button-secondary")).toHaveScreenshot(
      "button-secondary-default.png",
    );
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
    await button.click({ force: true }).catch(() => {
      /* Playwright may refuse to click a disabled element outright — also the expected outcome */
    });
    const clicked = await button.evaluate(
      (el) => (el as HTMLButtonElement & { __clicked?: boolean }).__clicked,
    );
    expect(clicked).toBe(false);
  });

  test("onClick fires via passthrough props when enabled", async ({ page }) => {
    // Waits for the button to actually exist before evaluating — a
    // bare page.evaluate()/querySelector() (the prior version of this
    // test) runs immediately regardless of hydration state, unlike
    // Playwright's own auto-waiting locators, so under heavy
    // concurrent test-suite load it could run before React finished
    // rendering, returning null and throwing on .addEventListener
    // (found flaky incidentally while verifying feature 013 caused no
    // regressions — a known, pre-existing issue, not introduced here).
    await page.getByTestId("button-primary").waitFor({ state: "attached" });
    const clicked = await page.evaluate(() => {
      return new Promise<boolean>((resolve) => {
        const btn = document.querySelector('[data-testid="button-primary"]') as HTMLButtonElement;
        btn.addEventListener("click", () => resolve(true), { once: true });
        btn.click();
      });
    });
    expect(clicked).toBe(true);
  });

  test("long label wraps without breaking layout (Edge Case)", async ({ page }) => {
    const wrapper = page.getByTestId("button-long-label-wrapper");
    const box = await wrapper.boundingBox();
    expect(box).not.toBeNull();
    const button = page.getByTestId("button-long-label");
    const buttonBox = await button.boundingBox();
    expect(buttonBox!.width).toBeLessThanOrEqual(box!.width + 1);
  });
});
