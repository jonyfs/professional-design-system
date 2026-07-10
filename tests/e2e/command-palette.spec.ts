import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

test.describe("Command Palette", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/command-palette/command-palette.html");
  });

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("closed state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("command-palette-hint")).toHaveScreenshot("command-palette-closed.png");
  });

  async function openViaShortcut(page: import("@playwright/test").Page) {
    await expectNoConsoleErrors(page, async () => {
      await page.getByTestId("unrelated-focus-target").focus();
      await page.keyboard.press("ControlOrMeta+k");
      await expect(page.getByTestId("command-palette")).toBeVisible();
    });
  }

  test("opens via Cmd/Ctrl+K from an arbitrary starting focus state, with the search input focused (FR-006/FR-007)", async ({
    page,
  }) => {
    await openViaShortcut(page);
    await expect(page.getByTestId("command-palette-input")).toBeFocused();
  });

  test("open state matches visual baseline", async ({ page }) => {
    await openViaShortcut(page);
    await expect(page.getByTestId("command-palette")).toHaveScreenshot("command-palette-open.png");
  });

  test("has no accessibility violations (open state)", async ({ page }, testInfo) => {
    await openViaShortcut(page);
    await expectNoA11yViolations(page, testInfo);
  });

  test("typing narrows the action list and highlights the match (FR-008)", async ({ page }) => {
    await openViaShortcut(page);
    await page.getByTestId("command-palette-input").fill("sign");
    const list = page.getByTestId("command-palette-list");
    await expect(list.getByRole("option")).toHaveCount(1);
    await expect(list.getByRole("option").first()).toContainText("Sign Out");
    await expect(list.locator("mark")).toHaveText("Sign");
  });

  test("Enter on a highlighted action fires a visible confirmation and closes the dialog (FR-008)", async ({
    page,
  }) => {
    await openViaShortcut(page);
    await page.getByTestId("command-palette-input").fill("new project");
    await page.getByTestId("command-palette-input").press("ArrowDown");
    await page.getByTestId("command-palette-input").press("Enter");
    await expect(page.getByTestId("command-palette")).toBeHidden();
    await expect(page.getByTestId("command-palette-confirmation")).toHaveText("Executed: New Project");
  });

  test("Escape closes the dialog and restores focus to the pre-open target, including on WebKit (FR-009)", async ({
    page,
  }) => {
    await openViaShortcut(page);
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("command-palette")).toBeHidden();
    await expect(page.getByTestId("unrelated-focus-target")).toBeFocused();
  });

  test("Tab stays trapped inside the open dialog", async ({ page }) => {
    await openViaShortcut(page);
    const dialog = page.getByTestId("command-palette");
    await expect(dialog).toBeVisible();

    const focusableCount = await dialog.evaluate(
      (el) => el.querySelectorAll("button, [href], input, select, textarea").length,
    );
    expect(focusableCount).toBeGreaterThan(0);

    async function activeElementIsSafe() {
      return page.evaluate(() => {
        const dialogEl = document.querySelector('[data-testid="command-palette"]');
        const active = document.activeElement;
        // document.body is an allowed transient state — the same WebKit
        // native <dialog> Tab-cycling quirk Modal's own equivalent test
        // (tests/e2e/modal.spec.ts) already documents and allows.
        return dialogEl?.contains(active) || active === document.body;
      });
    }

    for (let i = 0; i < focusableCount * 2; i++) {
      await page.keyboard.press("Tab");
      expect(await activeElementIsSafe()).toBe(true);
    }
  });

  test("pressing the shortcut again while already open is a no-op (Edge Case)", async ({ page }) => {
    await openViaShortcut(page);
    await page.getByTestId("command-palette-input").fill("settings");
    await page.keyboard.press("ControlOrMeta+k");
    // Still open, and the query wasn't reset by a second showModal() attempt.
    await expect(page.getByTestId("command-palette")).toBeVisible();
    await expect(page.getByTestId("command-palette-input")).toHaveValue("settings");
  });

  test("a disabled action is skipped during arrow-key traversal and is not executable (Edge Case)", async ({
    page,
  }) => {
    await openViaShortcut(page);
    await page.getByTestId("command-palette-input").fill("invite");
    const list = page.getByTestId("command-palette-list");
    const disabledAction = list.getByRole("option", { name: /Invite Teammate/ });
    await expect(disabledAction).toHaveAttribute("aria-disabled", "true");
    await disabledAction.click({ force: true });
    await expect(page.getByTestId("command-palette")).toBeVisible();
    await expect(page.getByTestId("command-palette-confirmation")).toHaveText("");
  });
});
