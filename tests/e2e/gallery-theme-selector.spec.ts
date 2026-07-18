import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 021 — contracts/gallery-theme-selector.contract.md. Covers all
// three user stories (US1 live-restyle, US2 persistence, US3 agreement
// with the dedicated Theme Gallery page) in one file, since they share a
// single control and mostly exercise feature 017's already-tested
// persistence mechanism (tests/e2e/theme-persistence.spec.ts) rather than
// new code of their own.
test.describe("Gallery theme selector (US1 — live preview)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("lists every theme grouped by mood family", async ({ page }) => {
    const select = page.locator("#gallery-theme-select");
    await expect(select.locator("optgroup")).toHaveCount(7);
    await expect(select.locator("option")).toHaveCount(49);
  });

  test("reflects the currently active theme on load", async ({ page }) => {
    await expect(page.locator("#gallery-theme-select")).toHaveValue("light");
  });

  test("selecting a theme restyles every card with no page reload", async ({ page }) => {
    const select = page.locator("#gallery-theme-select");
    const card = page.locator("a.showcase-card").first();
    const before = await card.evaluate((el) => getComputedStyle(el).borderColor);

    await select.selectOption("dracula");

    await expect(async () => {
      const dataTheme = await page.evaluate(() => document.documentElement.dataset.theme);
      expect(dataTheme).toBe("dracula");
    }).toPass();
    const after = await card.evaluate((el) => getComputedStyle(el).borderColor);
    expect(after).not.toBe(before);
  });

  test("a card scrolled out of view also reflects the new theme", async ({ page }) => {
    const select = page.locator("#gallery-theme-select");
    const lastCard = page.locator("a.showcase-card").last();
    await lastCard.scrollIntoViewIfNeeded();
    const before = await lastCard.evaluate((el) => getComputedStyle(el).borderColor);

    await select.selectOption("nord");
    await expect(async () => {
      const after = await lastCard.evaluate((el) => getComputedStyle(el).borderColor);
      expect(after).not.toBe(before);
    }).toPass();
  });

  test("does not overflow the page at 320px (SC-004)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const bodyScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("is keyboard operable", async ({ page }) => {
    const select = page.locator("#gallery-theme-select");
    await select.focus();
    await expect(select).toBeFocused();
  });
});

test.describe("Gallery theme selector (US2 — persistence)", () => {
  test("selecting a theme persists across a reload of the gallery page", async ({ page }) => {
    await page.goto("/");
    await page.locator("#gallery-theme-select").selectOption("gruvbox");
    await page.reload();
    await expect(page.locator("#gallery-theme-select")).toHaveValue("gruvbox");
    const dataTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(dataTheme).toBe("gruvbox");
  });

  test("selecting a theme persists after navigating to a component page and back", async ({ page }) => {
    await page.goto("/");
    await page.locator("#gallery-theme-select").selectOption("tokyonight");
    await page.goto("/src/components/button/button.html");
    await page.goto("/");
    await expect(page.locator("#gallery-theme-select")).toHaveValue("tokyonight");
  });
});

test.describe("Gallery theme selector (US3 — agreement with the dedicated Theme Gallery)", () => {
  test("a theme selected on the Theme Gallery page is reflected in the new control", async ({ page }) => {
    await page.goto("/src/components/theme-gallery/theme-gallery.html");
    await page.getByTestId("theme-card-catppuccin").click();
    await page.goto("/");
    await expect(page.locator("#gallery-theme-select")).toHaveValue("catppuccin");
  });

  test("a theme selected via the new control is reflected on the Theme Gallery page", async ({ page }) => {
    await page.goto("/");
    await page.locator("#gallery-theme-select").selectOption("everforest");
    await page.goto("/src/components/theme-gallery/theme-gallery.html");
    await expect(page.getByTestId("theme-card-everforest")).toHaveAttribute("aria-pressed", "true");
  });
});
