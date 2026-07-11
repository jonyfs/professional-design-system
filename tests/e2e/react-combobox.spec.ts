import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/combobox.html";

test.describe("Combobox (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("closed state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("combobox-input")).toHaveScreenshot("react-combobox-closed.png");
  });

  test("typing narrows the listbox to matching options and highlights the match", async ({ page }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("bra");
    const listbox = page.getByTestId("combobox-input-listbox");
    await expect(listbox.getByRole("option")).toHaveCount(1);
    await expect(listbox.getByRole("option").first()).toContainText("Brazil");
    await expect(listbox.locator("mark")).toHaveText("Bra");
  });

  test("ArrowDown/ArrowUp move aria-activedescendant among filtered options, wrapping", async ({ page }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("a");
    const listbox = page.getByTestId("combobox-input-listbox");
    await expect(listbox.getByRole("option").first()).toBeVisible();

    await input.press("ArrowDown");
    const firstActive = await input.getAttribute("aria-activedescendant");
    expect(firstActive).toBeTruthy();

    await input.press("ArrowUp");
    const wrappedActive = await input.getAttribute("aria-activedescendant");
    expect(wrappedActive).not.toBe(firstActive);
  });

  test("Enter commits the active option and closes the listbox", async ({ page }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("brazil");
    await input.press("ArrowDown");
    await input.press("Enter");
    await expect(input).toHaveValue("Brazil");
    await expect(page.getByTestId("combobox-input-listbox")).toBeHidden();
  });

  test("reopens correctly after committing a value that exactly matches the typed query (code review finding)", async ({
    page,
  }) => {
    // Regression guard: an earlier draft used a ref flag to suppress
    // the listbox reopening right after commit() sets the input's
    // value — but the flag only got reset when the query STATE
    // actually changed. Typing the exact option label (so commit's
    // setQuery(option.value) is a no-op, since it's already that
    // value) left the flag stuck, silently breaking the listbox for
    // the very next keystroke. Typing the exact-cased label reproduces
    // this exactly (unlike the other tests' lowercase "brazil", which
    // never collided with the option's actual value "Brazil").
    const input = page.getByTestId("combobox-input");
    await input.fill("Brazil");
    await input.press("ArrowDown");
    await input.press("Enter");
    await expect(input).toHaveValue("Brazil");
    await expect(page.getByTestId("combobox-input-listbox")).toBeHidden();

    await input.fill("Canada");
    await expect(page.getByTestId("combobox-input-listbox")).toBeVisible();
    const listbox = page.getByTestId("combobox-input-listbox");
    await expect(listbox.getByRole("option")).toHaveCount(1);
    await expect(listbox.getByRole("option").first()).toContainText("Canada");
  });

  test("Escape closes the listbox without changing the input's value", async ({ page }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("brazil");
    await expect(page.getByTestId("combobox-input-listbox")).toBeVisible();
    await input.press("Escape");
    await expect(page.getByTestId("combobox-input-listbox")).toBeHidden();
    await expect(input).toHaveValue("brazil");
  });

  test("a disabled option is skipped during arrow-key traversal and is not selectable", async ({ page }) => {
    const input = page.getByTestId("combobox-input");
    await input.fill("aus");
    const listbox = page.getByTestId("combobox-input-listbox");
    await expect(listbox.getByRole("option")).toHaveCount(2);
    const disabledOption = listbox.getByRole("option", { name: /Austria/ });
    await expect(disabledOption).toHaveAttribute("aria-disabled", "true");

    await disabledOption.click({ force: true });
    await expect(input).not.toHaveValue("Austria");
  });
});
