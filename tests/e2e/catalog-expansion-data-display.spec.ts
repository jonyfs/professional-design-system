import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 023 US3 — static surface. Data-display micro-components:
// AvatarGroup, Highlight, Code, ColorSwatch. One page per component
// (this catalog's page-per-component gallery convention).

test.describe("Avatar Group (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/avatar-group/avatar-group.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("shows a +N overflow chip only when members exceed the limit (AC1)", async ({
    page,
  }) => {
    const chip = page.getByTestId("avatar-group-overflow-chip");
    await expect(chip).toBeVisible();
    await expect(chip).toHaveText(/\+3/);
  });

  test("shows no overflow chip when members are within the limit (Edge Case)", async ({
    page,
  }) => {
    const within = page.getByTestId("avatar-group-within");
    // No "+N" chip inside the within-limit group.
    await expect(within.locator("text=/^\\+/")).toHaveCount(0);
  });
});

test.describe("Highlight (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/highlight/highlight.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("wraps only the matching substrings, case-insensitively, in <mark> (AC2)", async ({
    page,
  }) => {
    const marks = page.getByTestId("highlight-match").locator("mark");
    await expect(marks).toHaveCount(2);
    // Both matches preserve the source casing ("Co"), matched from lowercase "co".
    await expect(marks.nth(0)).toHaveText("Co");
    await expect(marks.nth(1)).toHaveText("Co");
  });

  test("renders no <mark> when nothing matches", async ({ page }) => {
    const marks = page.getByTestId("highlight-no-match").locator("mark");
    await expect(marks).toHaveCount(0);
  });
});

test.describe("Code (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/code/code.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("inline and block variants both use a monospace font (AC3)", async ({ page }) => {
    const inlineFont = await page
      .getByTestId("code-inline")
      .evaluate((el) => getComputedStyle(el).fontFamily);
    const blockFont = await page
      .getByTestId("code-block")
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(inlineFont.toLowerCase()).toContain("mono");
    expect(blockFont.toLowerCase()).toContain("mono");
  });
});

test.describe("Color Swatch (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/color-swatch/color-swatch.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("exposes an accessible text alternative via .sr-only (AC4)", async ({ page }) => {
    const srOnly = page.getByTestId("color-swatch-brand").locator(".sr-only");
    await expect(srOnly).toHaveCount(1);
    const text = await srOnly.textContent();
    expect(text).toContain("#2563eb");
  });

  test("applies the caller-supplied color to the chip background", async ({ page }) => {
    const chip = page.getByTestId("color-swatch-brand").locator(".color-swatch");
    const bg = await chip.evaluate((el) => getComputedStyle(el).backgroundColor);
    // #2563eb → rgb(37, 99, 235)
    expect(bg).toBe("rgb(37, 99, 235)");
  });
});
