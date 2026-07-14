import { test, expect, type Page } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

// Feature 023 — User Story 2 (button variants), STATIC surface.
// Covers ActionIcon (accessible name + visible focus), CopyButton
// (success + distinct failure states, spec.md Edge Cases), and Split Button
// (primary action + Dropdown-Menu-parity dropdown segment).

// Stubs navigator.clipboard.writeText to resolve deterministically, so the
// success path is exercised identically across Chromium/Firefox/WebKit
// without depending on per-engine clipboard-permission behaviour. The
// FAILURE path is exercised separately via the page's own forced-fail button
// (data-copy-fail), which throws before touching the clipboard at all.
async function stubClipboardSuccess(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.resolve() },
    });
  });
}

test.describe("Action Icon (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/action-icon/action-icon.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("exposes an accessible name via aria-label (AC1)", async ({ page }) => {
    // Located BY its accessible name — proves aria-label supplies it, since
    // there is no visible text label. exact:true so "Add item" doesn't also
    // match the "Add item (disabled)" sibling.
    await expect(page.getByRole("button", { name: "Add item", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "More actions", exact: true })).toBeVisible();
  });

  test("receives focus like any other button (AC1)", async ({ page }) => {
    const icon = page.getByTestId("action-icon-primary");
    await icon.focus();
    await expect(icon).toBeFocused();
  });

  test("disabled variant is not clickable", async ({ page }) => {
    await expect(page.getByTestId("action-icon-primary-disabled")).toBeDisabled();
  });
});

test.describe("Copy Button (static)", () => {
  test.beforeEach(async ({ page }) => {
    await stubClipboardSuccess(page);
    await page.goto("/src/components/copy-button/copy-button.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("shows a temporary Copied confirmation after a successful write (AC2)", async ({ page }) => {
    const button = page.getByTestId("copy-button");
    await expect(button).toContainText("Copy link");
    await button.click();
    await expect(button).toContainText("Copied");
    // The polite status region announces the outcome for screen readers.
    await expect(page.getByTestId("copy-status")).toHaveText("Copied to clipboard");
  });

  test("shows a DISTINCT failure state when the write is rejected (Edge Case)", async ({ page }) => {
    const button = page.getByTestId("copy-button-failing");
    await button.click();
    await expect(button).toContainText("Copy failed");
    await expect(button).not.toContainText("Copied");
    await expect(page.getByTestId("copy-status-failing")).toHaveText("Copy failed");
  });

  test("clicking produces no console/CSP errors", async ({ page }) => {
    await expectNoConsoleErrors(page, async () => {
      await page.getByTestId("copy-button").click();
      await expect(page.getByTestId("copy-button")).toContainText("Copied");
    });
  });
});

test.describe("Split Button (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/split-button/split-button.html");
  });

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("primary segment fires its action on click (AC3)", async ({ page }) => {
    await page.getByTestId("split-button-primary").click();
    await expect(page.getByTestId("split-button-result")).toHaveText("Ran: Save");
  });

  test("dropdown segment opens with focus on the first item and aria-expanded set (AC3)", async ({
    page,
  }) => {
    const trigger = page.getByTestId("split-button-trigger");
    await trigger.click();
    await expect(page.getByTestId("split-button-menu")).toBeVisible();
    await expect(page.getByTestId("split-item-draft")).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("dropdown opens via keyboard activation of the trigger (Edge Case)", async ({ page }) => {
    await page.getByTestId("split-button-trigger").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("split-button-menu")).toBeVisible();
    await expect(page.getByTestId("split-item-draft")).toBeFocused();
  });

  test("arrow keys move focus, wrapping and skipping disabled items (Edge Case)", async ({
    page,
  }) => {
    await page.getByTestId("split-button-trigger").click();
    await expect(page.getByTestId("split-item-draft")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("split-item-template")).toBeFocused();
    // "Save a copy" is disabled — ArrowDown must skip it and land on "Save all".
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("split-item-all")).toBeFocused();
    // Wrap back to the first item.
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("split-item-draft")).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(page.getByTestId("split-item-all")).toBeFocused();
  });

  test("selecting a menu item fires its action and closes, returning focus to trigger (AC3)", async ({
    page,
  }) => {
    const trigger = page.getByTestId("split-button-trigger");
    await trigger.click();
    await page.getByTestId("split-item-template").click();
    await expect(page.getByTestId("split-button-menu")).toBeHidden();
    await expect(page.getByTestId("split-button-result")).toHaveText("Ran: Save as template");
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes the dropdown and returns focus to the trigger (Edge Case)", async ({
    page,
  }) => {
    const trigger = page.getByTestId("split-button-trigger");
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("split-button-menu")).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
