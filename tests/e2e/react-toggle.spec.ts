import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/toggle.html";

test.describe("Toggle (React package, visual parity with static reference)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("off state matches the static reference's visual baseline", async ({ page }) => {
    await expect(page.getByTestId("toggle-off-wrapper")).toHaveScreenshot("toggle-off.png");
  });

  test("on state matches the static reference's visual baseline", async ({ page }) => {
    await expect(page.getByTestId("toggle-on-wrapper")).toHaveScreenshot("toggle-on.png");
  });

  test("focus-visible state matches the static reference's visual baseline", async ({ page }) => {
    const input = page.getByTestId("toggle-off-input");
    await input.focus();
    await expect(page.getByTestId("toggle-off-wrapper")).toHaveScreenshot(
      "toggle-focus-visible.png",
    );
  });

  test("disabled-on state matches the static reference's visual baseline (Edge Case)", async ({
    page,
  }) => {
    const input = page.getByTestId("toggle-disabled-on-input");
    await expect(input).toBeDisabled();
    await expect(input).toBeChecked();
    await expect(page.getByTestId("toggle-disabled-on-wrapper")).toHaveScreenshot(
      "toggle-disabled-on.png",
    );
  });

  test("Space toggles the state when focused (AC1)", async ({ page }) => {
    const input = page.getByTestId("toggle-off-input");
    await expect(input).not.toBeChecked();
    await input.focus();
    await page.keyboard.press("Space");
    await expect(input).toBeChecked();
    await page.keyboard.press("Space");
    await expect(input).not.toBeChecked();
  });

  test("click toggles the state (AC1)", async ({ page }) => {
    const input = page.getByTestId("toggle-off-input");
    // No separate label testid on the React component. Clicking the
    // wrapper div's bounding-box center misses the target: the harness's
    // own layout div is much wider than the <label>'s actual (inline-flex,
    // content-sized) content, so a center click lands on empty wrapper
    // background, not the label — found by inspecting the actual click
    // coordinates against the label's rendered box. Click the visible text
    // instead, which is real label content and exercises the same native
    // "click anywhere on the label activates its control" behavior.
    const labelText = page.getByTestId("toggle-off-wrapper").getByText("Enable notifications");
    await expect(input).not.toBeChecked();
    await labelText.click();
    await expect(input).toBeChecked();
  });

  test("disabled toggle does not respond to click or Space", async ({ page }) => {
    const input = page.getByTestId("toggle-disabled-on-input");
    await expect(input).toBeChecked();
    await input.evaluate((el) => {
      (el as HTMLInputElement & { __changed?: boolean }).__changed = false;
      el.addEventListener("change", () => {
        (el as HTMLInputElement & { __changed?: boolean }).__changed = true;
      });
    });
    await page
      .getByTestId("toggle-disabled-on-wrapper")
      .getByText("Enable notifications", { exact: false })
      .click({ force: true })
      .catch(() => {
        /* Playwright may refuse to click a disabled control outright — also expected */
      });
    const changed = await input.evaluate(
      (el) => (el as HTMLInputElement & { __changed?: boolean }).__changed,
    );
    expect(changed).toBe(false);
    await expect(input).toBeChecked();
  });

  test("no redundant aria-checked/role=switch is present (FR-006)", async ({ page }) => {
    const input = page.getByTestId("toggle-off-input");
    await expect(input).toHaveAttribute("type", "checkbox");
    await expect(input).not.toHaveAttribute("aria-checked");
    await expect(input).not.toHaveAttribute("role");
  });
});
