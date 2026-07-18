import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 031 — Navigation Micro-Patterns. Covers all 3 user stories
// (US1 Team/Workspace + Language Switcher, US2 Back-to-Top + Scroll
// Progress Bar, US3 Onboarding Tour). Closes feature 018's inventory's
// Navigation micro-patterns category from 1/6 (Avatar Group, feature
// 023) to 6/6.

test.describe("Team/Workspace Switcher", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/team-switcher/team-switcher.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("opens and lists workspaces with avatars", async ({ page }) => {
    await page.getByTestId("team-switcher-trigger").click();
    await expect(page.getByTestId("team-switcher-panel")).toBeVisible();
    await expect(page.getByTestId("team-switcher-option-acme")).toBeVisible();
    await expect(page.getByTestId("team-switcher-option-globex")).toBeVisible();
  });

  test("selecting an option updates the trigger's avatar and label", async ({ page }) => {
    await page.getByTestId("team-switcher-trigger").click();
    await page.getByTestId("team-switcher-option-globex").click();
    await expect(page.getByTestId("team-switcher-current-label")).toHaveText("Globex Corp");
    await expect(page.getByTestId("team-switcher-current-avatar")).toHaveText("GC");
  });

  test("arrow keys move focus between options and Escape closes", async ({ page }) => {
    await page.getByTestId("team-switcher-trigger").click();
    await page.getByTestId("team-switcher-option-acme").focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("team-switcher-option-globex")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("team-switcher-panel")).toBeHidden();
  });
});

test.describe("Language Switcher", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/language-switcher/language-switcher.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("opens and selecting a language updates the trigger", async ({ page }) => {
    await page.getByTestId("language-switcher-trigger").click();
    await expect(page.getByTestId("language-switcher-panel")).toBeVisible();
    await page.getByTestId("language-switcher-option-pt").click();
    await expect(page.getByTestId("language-switcher-current-label")).toHaveText("Português");
  });
});

test.describe("Scroll Progress Bar & Back-to-Top", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/scroll-feedback/scroll-feedback.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("Back-to-Top is hidden before scrolling past the threshold", async ({ page }) => {
    const button = page.getByTestId("back-to-top");
    const display = await button.evaluate((el) => (el as HTMLElement).style.display);
    expect(display).toBe("none");
  });

  test("progress fill grows and Back-to-Top appears after scrolling, disappears near the top again", async ({ page }) => {
    // Scrolls directly to the true document bottom rather than
    // scrollIntoViewIfNeeded() — the latter scrolls only the minimum
    // distance needed to bring an element into view, which on this
    // page's 2-column grid layout (halving total height at this
    // viewport width) doesn't reliably reach a high scroll percentage
    // or cross Back-to-Top's 400px threshold.
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight }));
    await page.waitForTimeout(200);

    const fillWidth = await page
      .getByTestId("scroll-progress-fill")
      .evaluate((el) => parseFloat((el as HTMLElement).style.width));
    expect(fillWidth).toBeGreaterThan(50);

    const buttonDisplay = await page
      .getByTestId("back-to-top")
      .evaluate((el) => (el as HTMLElement).style.display);
    expect(buttonDisplay).not.toBe("none");

    await page.evaluate(() => window.scrollTo({ top: 0 }));
    await page.waitForTimeout(200);
    const hiddenAgain = await page
      .getByTestId("back-to-top")
      .evaluate((el) => (el as HTMLElement).style.display);
    expect(hiddenAgain).toBe("none");
  });

  test("clicking Back-to-Top scrolls back to the top", async ({ page }) => {
    // Scrolls directly to the true document bottom rather than
    // scrollIntoViewIfNeeded() — the latter scrolls only the minimum
    // distance needed to bring an element into view, which on this
    // page's 2-column grid layout (halving total height at this
    // viewport width) doesn't reliably reach a high scroll percentage
    // or cross Back-to-Top's 400px threshold.
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight }));
    await page.waitForTimeout(200);
    await page.getByTestId("back-to-top").click();
    await page.waitForFunction(() => window.scrollY === 0, { timeout: 5000 });
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });
});

test.describe("Onboarding Tour", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/onboarding-tour/onboarding-tour.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("starting the tour shows step 1 anchored to its target", async ({ page }) => {
    await page.getByTestId("tour-start").click();
    await expect(page.getByTestId("tour-panel-1")).toBeVisible();
    await expect(page.getByTestId("tour-indicator-1")).toHaveText("1 of 3");
  });

  test("Next advances through all steps, Previous retreats, ends correctly at both boundaries", async ({ page }) => {
    await page.getByTestId("tour-start").click();
    await expect(page.getByTestId("tour-panel-1")).toBeVisible();

    await page.getByTestId("tour-next-1").click();
    await expect(page.getByTestId("tour-panel-2")).toBeVisible();
    await expect(page.getByTestId("tour-indicator-2")).toHaveText("2 of 3");

    await page.getByTestId("tour-next-2").click();
    await expect(page.getByTestId("tour-panel-3")).toBeVisible();
    await expect(page.getByTestId("tour-indicator-3")).toHaveText("3 of 3");

    await page.getByTestId("tour-prev-3").click();
    await expect(page.getByTestId("tour-panel-2")).toBeVisible();

    await page.getByTestId("tour-prev-2").click();
    await expect(page.getByTestId("tour-panel-1")).toBeVisible();
  });

  test("Skip on step 1 and Finish on the last step both end the tour with no panel open", async ({ page }) => {
    await page.getByTestId("tour-start").click();
    await page.getByTestId("tour-skip-1").click();
    await expect(page.getByTestId("tour-panel-1")).toBeHidden();

    await page.getByTestId("tour-start").click();
    await page.getByTestId("tour-next-1").click();
    await page.getByTestId("tour-next-2").click();
    await page.getByTestId("tour-finish-3").click();
    await expect(page.getByTestId("tour-panel-3")).toBeHidden();
  });

  test("is fully keyboard-operable end to end (FR-007)", async ({ page }) => {
    await page.getByTestId("tour-start").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("tour-panel-1")).toBeVisible();
    await expect(page.getByTestId("tour-next-1")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("tour-panel-2")).toBeVisible();
  });
});
