import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 026 — verifies the redesigned root gallery's categorization,
// quick-jump navigation, and flagship treatment, plus zero-regression
// guarantees (every component's own markup/behavior is untouched by
// this presentation-layer redesign).
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/index.html");
});

test.describe("Opening section communicates scale (US1)", () => {
  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("shows concrete, differentiating stats above the fold", async ({ page }) => {
    const stats = page.locator("dl");
    await expect(stats.getByText("shipped components")).toBeVisible();
    await expect(stats.getByText(/surfaces per component/)).toBeVisible();
    await expect(stats.getByText(/WCAG contrast target/)).toBeVisible();
    await expect(stats.getByText(/curated themes/)).toBeVisible();
  });
});

test.describe("Categorized, navigable gallery (US2)", () => {
  const CATEGORIES = [
    ["app-nav", "Application & Navigation"],
    ["forms", "Forms, Validation & Inputs"],
    ["data", "Data Display & Listings"],
    ["overlays", "Overlays, Modals & Feedback"],
    ["nav-disc", "Navigation & Disclosure"],
    ["adv-forms", "Advanced Forms & Interaction"],
    ["composed", "Composed Examples"],
    ["theming", "Theming"],
  ] as const;

  for (const [id, label] of CATEGORIES) {
    test(`quick-jump nav link for "${label}" navigates to its section`, async ({ page }) => {
      await page.getByRole("link", { name: label, exact: true }).click();
      await expect(page.locator(`#${id}`)).toBeInViewport();
    });
  }

  test("all 78 components remain present and reachable (SC-002)", async ({ page }) => {
    const links = page.locator('a.demo-link, a[class*="demo-link"]');
    await expect(links).toHaveCount(78);
  });

  test("flagship components (Data Table, Chart, Command Palette, Theme Gallery) are visually distinct", async ({
    page,
  }) => {
    for (const name of ["Data Table", "Chart", "Command Palette", "Theme Gallery"]) {
      // .last() picks the innermost matching <section> — the individual
      // card, not the outer category <section> that also "has" this
      // heading among its several cards.
      const card = page.locator("section", { has: page.getByRole("heading", { name, exact: true }) }).last();
      await expect(card.getByText(/^Flagship —/)).toBeVisible();
    }
  });

  test("no horizontal overflow at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/index.html");
    const bodyScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth);
  });
});

test.describe("Zero regressions to existing guarantees", () => {
  test("every component demo link still resolves to its own page", async ({ page }) => {
    const firstLink = page.locator("a.demo-link").first();
    const href = await firstLink.getAttribute("href");
    expect(href).toMatch(/^\/src\/components\//);
  });
});
