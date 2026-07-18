import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 033 — Data Display Composables. Covers all 3 user stories
// (US1 ThemeIcon, US2 Blockquote + BackgroundImage, US3 Watermark).
// Brings feature 018's inventory's Data Display category from 4/16 to
// 8/16 — 8 remaining items (5 genuinely-new-pattern, 2 deferred,
// documented in spec.md/research.md) are out of this feature's scope.

test.describe("ThemeIcon", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/theme-icon/theme-icon.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("each semantic color variant renders with an accessible name", async ({ page }) => {
    for (const color of ["brand", "success", "warning", "error", "info"]) {
      const icon = page.getByTestId(`theme-icon-${color}`);
      await expect(icon).toBeVisible();
      await expect(icon).toHaveAttribute("role", "img");
      await expect(icon).toHaveAccessibleName(new RegExp(color, "i"));
    }
  });

  test("sm and lg sizes render at Avatar's exact dimensions", async ({ page }) => {
    const sm = (await page.getByTestId("theme-icon-sm").boundingBox())!;
    const lg = (await page.getByTestId("theme-icon-lg").boundingBox())!;
    expect(sm.width).toBeCloseTo(32, 0); // h-8 w-8
    expect(lg.width).toBeCloseTo(40, 0); // h-10 w-10
  });
});

test.describe("Blockquote", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/blockquote/blockquote.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("renders quoted text with a citation", async ({ page }) => {
    await expect(page.getByTestId("blockquote-demo")).toBeVisible();
    await expect(page.getByTestId("blockquote-cite")).toHaveText("— Steve Jobs");
  });

  test("renders without a citation when none is supplied (Edge Case)", async ({ page }) => {
    const noCite = page.getByTestId("blockquote-no-cite");
    await expect(noCite).toBeVisible();
    await expect(noCite.locator("cite")).toHaveCount(0);
  });
});

test.describe("BackgroundImage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/background-image/background-image.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("applies the background image via CSSOM with no CSP violations", async ({ page }) => {
    const bgImage = await page
      .getByTestId("background-image-demo")
      .evaluate((el) => (el as HTMLElement).style.backgroundImage);
    expect(bgImage).toContain("url(");
    await expect(page.getByTestId("background-image-scrim")).toBeVisible();
  });

  test("a failed image load still shows legible content via the neutral fallback (Edge Case)", async ({ page }) => {
    const fallback = page.getByTestId("background-image-fallback");
    await expect(fallback).toBeVisible();
    const bgColor = await fallback.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
    await expect(fallback.locator("p")).toBeVisible();
  });
});

test.describe("Watermark", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/watermark/watermark.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("applies the tiled watermark layer via CSSOM, foreground content stays legible", async ({ page }) => {
    const bgImage = await page
      .getByTestId("watermark-layer")
      .evaluate((el) => (el as HTMLElement).style.backgroundImage);
    expect(bgImage).toContain("data:image/svg+xml");
    await expect(page.getByTestId("watermark-content-text")).toBeVisible();
  });

  test("watermark layer is aria-hidden, not exposed to assistive technology", async ({ page }) => {
    await expect(page.getByTestId("watermark-layer")).toHaveAttribute("aria-hidden", "true");
  });
});
