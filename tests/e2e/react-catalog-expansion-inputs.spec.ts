import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 023 User Story 1 — React surface. Mirrors
// catalog-expansion-inputs.spec.ts against the React harness pages
// (http://localhost:5174/<name>.html), asserting identical behavior on both
// surfaces (spec.md SC-003).

test.describe("NumberInput (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5174/number-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("increment/decrement steppers adjust the value by step (US1 AC1)", async ({ page }) => {
    const wrapper = page.getByTestId("number-input-wrapper");
    const input = wrapper.getByTestId("number-input");
    await expect(input).toHaveValue("5");
    await wrapper.getByTestId("number-input-increment").click();
    await expect(input).toHaveValue("6");
    await wrapper.getByTestId("number-input-decrement").click();
    await wrapper.getByTestId("number-input-decrement").click();
    await expect(input).toHaveValue("4");
  });

  test("a typed out-of-bounds value clamps on blur, not per keystroke (Edge Case)", async ({
    page,
  }) => {
    const input = page.getByTestId("number-input-wrapper").getByTestId("number-input");
    await input.fill("999");
    await expect(input).toHaveValue("999");
    await input.blur();
    await expect(input).toHaveValue("10");

    await input.fill("-5");
    await input.blur();
    await expect(input).toHaveValue("0");
  });

  test("each stepper disables individually at its bound (contract)", async ({ page }) => {
    const wrapper = page.getByTestId("number-input-wrapper");
    const input = wrapper.getByTestId("number-input");
    const increment = wrapper.getByTestId("number-input-increment");
    const decrement = wrapper.getByTestId("number-input-decrement");

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

test.describe("PasswordInput (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5174/password-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("toggle flips type and updates aria-label to the next action (US1 AC2)", async ({ page }) => {
    const wrapper = page.getByTestId("password-input-wrapper");
    const input = wrapper.getByTestId("password-input");
    const toggle = wrapper.getByTestId("password-input-toggle");

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
    const wrapper = page.getByTestId("password-input-wrapper");
    const input = wrapper.getByTestId("password-input");
    await input.fill("MyPa55word");
    await input.evaluate((el: HTMLInputElement) => el.setSelectionRange(2, 6));

    await wrapper.getByTestId("password-input-toggle").click();

    await expect(input).toHaveValue("MyPa55word");
    const selection = await input.evaluate((el: HTMLInputElement) => ({
      start: el.selectionStart,
      end: el.selectionEnd,
    }));
    expect(selection).toEqual({ start: 2, end: 6 });
  });
});

test.describe("MultiSelect (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5174/multi-select.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("shows the placeholder while nothing is selected (Edge Case)", async ({ page }) => {
    await expect(page.getByTestId("multi-select")).toHaveAttribute("placeholder", "Select…");
  });

  test("typing filters the options case-insensitively (reuses Combobox filter)", async ({ page }) => {
    const input = page.getByTestId("multi-select");
    await input.fill("re");
    const listbox = page.getByTestId("multi-select-listbox");
    const options = listbox.getByRole("option");
    await expect(options.first()).toBeVisible();
    for (const text of await options.allTextContents()) {
      expect(text.toLowerCase()).toContain("re");
    }
  });

  test("selecting options adds removable chips and keeps the panel open (US1 AC3)", async ({
    page,
  }) => {
    const input = page.getByTestId("multi-select");
    await input.click();
    const listbox = page.getByTestId("multi-select-listbox");
    await expect(listbox).toBeVisible();

    await listbox.getByRole("option", { name: "React", exact: true }).click();
    await expect(listbox).toBeVisible();
    await expect(page.getByTestId("multi-select-chip-react")).toBeVisible();

    await listbox.getByRole("option", { name: "Vue", exact: true }).click();
    await expect(listbox).toBeVisible();
    await expect(page.getByTestId("multi-select-chip-vue")).toBeVisible();
  });

  test("removing a chip updates the selection immediately (US1 AC3)", async ({ page }) => {
    const input = page.getByTestId("multi-select");
    await input.click();
    const listbox = page.getByTestId("multi-select-listbox");
    await listbox.getByRole("option", { name: "React", exact: true }).click();
    await expect(page.getByTestId("multi-select-chip-react")).toBeVisible();

    await page.getByTestId("multi-select-chip-remove-react").click();
    await expect(page.getByTestId("multi-select-chip-react")).toHaveCount(0);
    await expect(page.getByTestId("multi-select")).toHaveAttribute("placeholder", "Select…");
  });

  test("a non-matching query shows the empty state", async ({ page }) => {
    const input = page.getByTestId("multi-select");
    await input.fill("zzzznotaframework");
    await expect(page.getByTestId("multi-select-empty")).toBeVisible();
  });
});
