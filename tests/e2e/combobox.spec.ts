import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

test.describe("Combobox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/combobox/combobox.html");
  });

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("closed state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("combobox-input")).toHaveScreenshot("combobox-closed.png");
  });

  test("open state matches visual baseline", async ({ page }) => {
    await expectNoConsoleErrors(page, async () => {
      await page.getByTestId("combobox-input").fill("ar");
      await expect(page.getByTestId("combobox-listbox")).toBeVisible();
    });
    await expect(page.getByTestId("combobox-listbox")).toHaveScreenshot("combobox-open.png");
  });

  test("has no accessibility violations (open state)", async ({ page }, testInfo) => {
    await page.getByTestId("combobox-input").fill("ar");
    await expect(page.getByTestId("combobox-listbox")).toBeVisible();
    await expectNoA11yViolations(page, testInfo);
  });

  test("typing narrows the listbox to matching options and highlights the match (FR-002)", async ({
    page,
  }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("bra");
    const listbox = page.getByTestId("combobox-listbox");
    await expect(listbox.getByRole("option")).toHaveCount(1);
    await expect(listbox.getByRole("option").first()).toContainText("Brazil");
    await expect(listbox.locator("mark")).toHaveText("Bra");
  });

  test("ArrowDown/ArrowUp move aria-activedescendant among filtered options, wrapping (FR-003)", async ({
    page,
  }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("a"); // matches many countries
    const listbox = page.getByTestId("combobox-listbox");
    await expect(listbox.getByRole("option").first()).toBeVisible();

    await input.press("ArrowDown");
    const firstActive = await input.getAttribute("aria-activedescendant");
    expect(firstActive).toBeTruthy();

    await input.press("ArrowUp");
    // wraps to the last option when moving up from the first
    const wrappedActive = await input.getAttribute("aria-activedescendant");
    expect(wrappedActive).not.toBe(firstActive);
  });

  test("Enter commits the active option and closes the listbox (FR-003)", async ({ page }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("brazil");
    await input.press("ArrowDown");
    await input.press("Enter");
    await expect(input).toHaveValue("Brazil");
    await expect(page.getByTestId("combobox-listbox")).toBeHidden();
  });

  test("Escape closes the listbox without changing the input's value (FR-003)", async ({ page }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("brazil");
    await expect(page.getByTestId("combobox-listbox")).toBeVisible();
    await input.press("Escape");
    await expect(page.getByTestId("combobox-listbox")).toBeHidden();
    await expect(input).toHaveValue("brazil");
  });

  test("a non-matching query shows the No results state (FR-004)", async ({ page }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("zzzznotacountry");
    await expect(page.getByTestId("combobox-empty")).toBeVisible();
    await expect(page.getByTestId("combobox-empty")).toHaveText("No results found.");
  });

  test("a disabled option is skipped during arrow-key traversal and is not selectable (FR-005, Edge Case)", async ({
    page,
  }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("aus"); // matches "Australia" and "Austria (unavailable)"
    const listbox = page.getByTestId("combobox-listbox");
    await expect(listbox.getByRole("option")).toHaveCount(2);
    const disabledOption = listbox.getByRole("option", { name: /Austria/ });
    await expect(disabledOption).toHaveAttribute("aria-disabled", "true");

    // Arrow-key traversal should only ever land on the enabled option.
    await input.press("ArrowDown");
    await input.press("ArrowDown");
    await input.press("ArrowDown");
    const activeId = await input.getAttribute("aria-activedescendant");
    const activeEl = page.locator(`#${activeId}`);
    await expect(activeEl).not.toHaveAttribute("aria-disabled", "true");

    // Clicking the disabled option directly must not commit it.
    await disabledOption.click({ force: true });
    await expect(input).not.toHaveValue("Austria");
  });
});
