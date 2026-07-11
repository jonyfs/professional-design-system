import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/command-palette.html";

test.describe("Command Palette (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("Cmd/Ctrl+K opens the palette from an unrelated focus state and focuses the input", async ({
    page,
    browserName,
  }) => {
    await page.getByTestId("unrelated-focus-target").focus();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.press(`${modifier}+k`);
    const dialog = page.getByTestId("command-palette");
    await expect(dialog).toBeVisible();
    await expect(page.getByTestId("command-palette-input")).toBeFocused();
    void browserName;
  });

  test("typing filters actions and Enter executes the active one", async ({ page }) => {
    // Focus something first, same as every other test in this file:
    // page.goto() only waits for the 'load' event, not for React to
    // finish mounting and attach the global Cmd/Ctrl+K listener.
    // Skipping this wait was flaky specifically under heavy concurrent
    // test load (the harness dev server serving many pages at once) —
    // the keydown fired before the listener existed, so the dialog
    // never opened and everything downstream timed out. Waiting for a
    // real element to be focusable inherently waits long enough for
    // React's mount effects to have run first.
    await page.getByTestId("unrelated-focus-target").focus();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.press(`${modifier}+k`);
    const input = page.getByTestId("command-palette-input");
    await expect(page.getByTestId("command-palette")).toBeVisible();
    await input.fill("new");
    const list = page.getByTestId("command-palette-list");
    await expect(list.getByRole("option")).toHaveCount(1);
    await input.press("ArrowDown");
    await input.press("Enter");
    await expect(page.getByTestId("command-palette")).toBeHidden();
    await expect(page.getByTestId("command-palette-confirmation")).toHaveText("Executed: New Project");
  });

  test("Escape closes the palette and returns focus to where it was before opening", async ({ page }) => {
    const target = page.getByTestId("unrelated-focus-target");
    await target.focus();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.press(`${modifier}+k`);
    await expect(page.getByTestId("command-palette")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("command-palette")).toBeHidden();
    await expect(target).toBeFocused();
  });

  test("a disabled action cannot be executed", async ({ page }) => {
    // See the identical comment in "typing filters actions..." above —
    // waiting for a real element to focus first ensures React has
    // mounted and attached its global keydown listener before the
    // shortcut fires.
    await page.getByTestId("unrelated-focus-target").focus();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.press(`${modifier}+k`);
    const input = page.getByTestId("command-palette-input");
    await expect(page.getByTestId("command-palette")).toBeVisible();
    await input.fill("invite");
    const disabledAction = page.getByTestId("command-palette-list").getByRole("option", { name: /Invite/ });
    await expect(disabledAction).toHaveAttribute("aria-disabled", "true");
    await disabledAction.click({ force: true });
    await expect(page.getByTestId("command-palette")).toBeVisible();
  });
});
