import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

// Feature 023 User Story 1 — static surface. Covers NumberInput,
// PasswordInput, and MultiSelect against their standalone gallery pages.
// No visual-baseline assertions here (behavioral + a11y only), so the
// spec is self-contained and needs no committed screenshots.

test.describe("NumberInput (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/number-input/number-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("increment/decrement steppers adjust the value by step (US1 AC1)", async ({ page }) => {
    const input = page.getByTestId("number-input");
    await expect(input).toHaveValue("5");
    await page.getByTestId("number-input-increment").click();
    await expect(input).toHaveValue("6");
    await page.getByTestId("number-input-decrement").click();
    await page.getByTestId("number-input-decrement").click();
    await expect(input).toHaveValue("4");
  });

  test("a typed out-of-bounds value clamps to the nearest bound on blur, not per keystroke (Edge Case)", async ({
    page,
  }) => {
    const input = page.getByTestId("number-input");
    await input.fill("999");
    // Still the raw typed value while focused — clamping must not fight the caret.
    await expect(input).toHaveValue("999");
    await input.blur();
    await expect(input).toHaveValue("10");

    await input.fill("-5");
    await input.blur();
    await expect(input).toHaveValue("0");
  });

  test("each stepper disables individually at its bound (contract)", async ({ page }) => {
    const input = page.getByTestId("number-input");
    const increment = page.getByTestId("number-input-increment");
    const decrement = page.getByTestId("number-input-decrement");

    await input.fill("10");
    await input.blur();
    await expect(increment).toBeDisabled();
    await expect(decrement).toBeEnabled();

    await input.fill("0");
    await input.blur();
    await expect(decrement).toBeDisabled();
    await expect(increment).toBeEnabled();
  });
});

test.describe("PasswordInput (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/password-input/password-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("toggle flips type and updates aria-label to the next action (US1 AC2)", async ({ page }) => {
    const input = page.getByTestId("password-input");
    const toggle = page.getByTestId("password-input-toggle");

    await expect(input).toHaveAttribute("type", "password");
    await expect(toggle).toHaveAttribute("aria-label", "Show password");

    await toggle.click();
    await expect(input).toHaveAttribute("type", "text");
    await expect(toggle).toHaveAttribute("aria-label", "Hide password");

    await toggle.click();
    await expect(input).toHaveAttribute("type", "password");
    await expect(toggle).toHaveAttribute("aria-label", "Show password");
  });

  test("toggling preserves the typed value and caret/selection (US1 AC2)", async ({ page }) => {
    const input = page.getByTestId("password-input");
    await input.fill("MyPa55word");
    // Place a selection in the middle of the value.
    await input.evaluate((el: HTMLInputElement) => el.setSelectionRange(2, 6));

    await page.getByTestId("password-input-toggle").click();

    await expect(input).toHaveValue("MyPa55word");
    const selection = await input.evaluate((el: HTMLInputElement) => ({
      start: el.selectionStart,
      end: el.selectionEnd,
    }));
    expect(selection).toEqual({ start: 2, end: 6 });
  });
});

test.describe("MultiSelect (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/multi-select/multi-select.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("shows the placeholder while nothing is selected (Edge Case)", async ({ page }) => {
    await expect(page.getByTestId("multi-select-input")).toHaveAttribute("placeholder", "Select…");
    await expect(page.getByTestId("multi-select-chips")).toBeEmpty();
  });

  test("typing filters the options case-insensitively (reuses Combobox filter)", async ({ page }) => {
    const input = page.getByTestId("multi-select-input");
    await input.fill("re");
    const listbox = page.getByTestId("multi-select-listbox");
    // "React", "Preact", "Ember" all contain "re" case-insensitively.
    const options = listbox.getByRole("option");
    await expect(options.first()).toBeVisible();
    for (const text of await options.allTextContents()) {
      expect(text.toLowerCase()).toContain("re");
    }
  });

  test("selecting options adds removable chips and keeps the panel open (US1 AC3)", async ({
    page,
  }) => {
    await expectNoConsoleErrors(page, async () => {
      const input = page.getByTestId("multi-select-input");
      await input.click();
      const listbox = page.getByTestId("multi-select-listbox");
      await expect(listbox).toBeVisible();

      await listbox.getByRole("option", { name: "React", exact: true }).click();
      // Panel stays open after a selection (multi-select convention).
      await expect(listbox).toBeVisible();
      await expect(page.getByTestId("multi-select-chip-react")).toBeVisible();

      await listbox.getByRole("option", { name: "Vue", exact: true }).click();
      await expect(listbox).toBeVisible();
      await expect(page.getByTestId("multi-select-chip-vue")).toBeVisible();
    });
  });

  test("removing a chip updates the selection immediately (US1 AC3)", async ({ page }) => {
    const input = page.getByTestId("multi-select-input");
    await input.click();
    const listbox = page.getByTestId("multi-select-listbox");
    await listbox.getByRole("option", { name: "React", exact: true }).click();
    await expect(page.getByTestId("multi-select-chip-react")).toBeVisible();

    await page.getByTestId("multi-select-chip-remove-react").click();
    await expect(page.getByTestId("multi-select-chip-react")).toHaveCount(0);
    // With nothing selected, the placeholder returns.
    await expect(page.getByTestId("multi-select-input")).toHaveAttribute("placeholder", "Select…");
  });

  test("a non-matching query shows the empty state", async ({ page }) => {
    const input = page.getByTestId("multi-select-input");
    await input.fill("zzzznotaframework");
    await expect(page.getByTestId("multi-select-empty")).toBeVisible();
  });
});
