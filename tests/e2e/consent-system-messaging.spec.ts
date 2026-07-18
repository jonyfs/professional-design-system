import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 030 — Consent & System Messaging Primitives. Covers all 3
// user stories (US1 Session Timeout Modal, US2 system-status banners,
// US3 Dark Mode Toggle). Closes feature 018's inventory's Consent &
// System Messaging category from 0% to 5/5.

test.describe("Session Timeout Modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/session-timeout-modal/session-timeout-modal.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("opening the trigger starts a live, updating countdown", async ({ page }) => {
    await page.getByTestId("session-timeout-trigger").click();
    const dialog = page.getByTestId("session-timeout-dialog");
    await expect(dialog).toBeVisible();
    await expect(page.getByTestId("session-timeout-countdown")).toHaveText("30s");
    await page.waitForTimeout(2100);
    const text = await page.getByTestId("session-timeout-countdown").textContent();
    const seconds = parseInt(text ?? "0", 10);
    expect(seconds).toBeLessThan(30);
    expect(seconds).toBeGreaterThan(0);
  });

  test("reaching zero shows the expired state", async ({ page }) => {
    test.setTimeout(45000);
    await page.getByTestId("session-timeout-trigger").click();
    await expect(page.getByTestId("session-timeout-expired")).toBeVisible({ timeout: 35000 });
    await expect(page.getByTestId("session-timeout-countdown")).toBeHidden();
  });

  test("Stay signed in closes the modal without navigating away", async ({ page }) => {
    await page.getByTestId("session-timeout-trigger").click();
    await expect(page.getByTestId("session-timeout-dialog")).toBeVisible();
    await page.getByTestId("session-timeout-stay").click();
    await expect(page.getByTestId("session-timeout-dialog")).toBeHidden();
    await expect(page).toHaveURL(/session-timeout-modal\.html/);
  });

  test("re-triggering after closing restarts the countdown from 30s (no stray interval)", async ({ page }) => {
    await page.getByTestId("session-timeout-trigger").click();
    await page.waitForTimeout(1100);
    await page.getByTestId("session-timeout-stay").click();
    await expect(page.getByTestId("session-timeout-dialog")).toBeHidden();

    await page.getByTestId("session-timeout-trigger").click();
    await expect(page.getByTestId("session-timeout-countdown")).toHaveText("30s");
  });
});

test.describe("Offline Banner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/offline-banner/offline-banner.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("is hidden while online", async ({ page }) => {
    await expect(page.getByTestId("offline-banner")).toBeHidden();
  });

  test("appears when connectivity is lost and disappears when it returns", async ({ page, context }) => {
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));
    await expect(page.getByTestId("offline-banner")).toBeVisible();

    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event("online")));
    await expect(page.getByTestId("offline-banner")).toBeHidden();
  });

  test("has no dismiss control", async ({ page, context }) => {
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));
    const banner = page.getByTestId("offline-banner");
    await expect(banner).toBeVisible();
    await expect(banner.locator("button")).toHaveCount(0);
    await context.setOffline(false);
  });
});

test.describe("2FA Reminder Banner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/two-factor-reminder-banner/two-factor-reminder-banner.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("renders a persistent notice with an action, no dismiss control", async ({ page }) => {
    const banner = page.getByTestId("two-factor-reminder-banner");
    await expect(banner).toBeVisible();
    await expect(page.getByTestId("two-factor-reminder-action")).toBeVisible();
    await expect(banner.locator("button")).toHaveCount(0);
  });
});

test.describe("Maintenance / Announcement Bar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/maintenance-banner/maintenance-banner.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("renders full-width and non-dismissible", async ({ page }) => {
    const banner = page.getByTestId("maintenance-banner");
    await expect(banner).toBeVisible();
    await expect(banner.locator("button")).toHaveCount(0);
    const bannerBox = (await banner.boundingBox())!;
    const viewportSize = page.viewportSize()!;
    expect(bannerBox.width).toBeGreaterThan(viewportSize.width * 0.9);
  });
});

test.describe("Dark Mode Toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/dark-mode-toggle/dark-mode-toggle.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("toggling on applies and persists the dim theme", async ({ page }) => {
    // Clicks the label, not the visually-hidden checkbox directly — the
    // overlapping .toggle-track span intercepts pointer events aimed at
    // the sr-only input itself, matching this catalog's existing
    // toggle.spec.ts precedent (clicks toggle-off-label, not the input).
    await page.getByTestId("dark-mode-toggle-label").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dim");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dim");
    await expect(page.getByTestId("dark-mode-toggle")).toBeChecked();
  });

  test("toggling off returns to the light theme", async ({ page }) => {
    await page.getByTestId("dark-mode-toggle-label").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dim");
    await page.getByTestId("dark-mode-toggle-label").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("selecting a 3rd theme via the page's theme picker shows the toggle as off, not a false positive", async ({ page }) => {
    await page.getByTestId("gallery-theme-select").selectOption("synthwave");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "synthwave");
    await expect(page.getByTestId("dark-mode-toggle")).not.toBeChecked();
  });
});
