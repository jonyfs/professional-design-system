import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 026 established this redesigned root gallery's categorization
// and quick-jump navigation; feature 037 replaced the flat text-only
// card grid with live-rendered component snapshot cards (a bento grid,
// whole-card links, a "proof wall" hero) — this spec now covers both
// layers, plus zero-regression guarantees (every component's own
// markup/behavior is untouched by this presentation-layer redesign).
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
    await expect(stats.getByText("components", { exact: true })).toBeVisible();
    await expect(stats.getByText(/surfaces each/)).toBeVisible();
    await expect(stats.getByText(/contrast target/)).toBeVisible();
    await expect(stats.getByText(/curated themes/)).toBeVisible();
  });

  test("stages a live 'proof wall' of real components, not a placeholder image", async ({ page }) => {
    const wall = page.locator("section").first().locator("[inert]").first();
    await expect(wall.getByText("Card title")).toBeVisible();
    await expect(wall.locator(".progress-track")).toBeVisible();
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
    ["layout", "Layout & Structure"],
    ["consent-messaging", "Consent & System Messaging"],
  ] as const;

  for (const [id, label] of CATEGORIES) {
    test(`quick-jump nav link for "${label}" navigates to its section`, async ({ page }) => {
      await page.getByRole("link", { name: label, exact: true }).click();
      await expect(page.locator(`#${id}`)).toBeInViewport();
    });
  }

  test("all 123 components remain present and reachable (SC-002)", async ({ page }) => {
    const cards = page.locator("a.showcase-card");
    await expect(cards).toHaveCount(123);
  });

  test("every card shows a real live preview, not a text-only description (feature 037 FR-001)", async ({ page }) => {
    const cards = page.locator("a.showcase-card");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const preview = cards.nth(i).locator(".showcase-card-preview");
      await expect(preview).toBeAttached();
      await expect(preview.locator("*").first()).toBeAttached();
    }
  });

  test("large/wide-tier components (Data Table, Chart, Command Palette, Theme Gallery) get a bigger bento cell", async ({
    page,
  }) => {
    for (const name of ["Data Table", "Chart", "Command Palette", "Theme Gallery"]) {
      const card = page.locator("a.showcase-card", { has: page.getByText(name, { exact: true }) });
      await expect(card).toHaveClass(/showcase-card-large/);
    }
  });

  test("every card's preview content is inert — zero focusable/AT-exposed descendants (research.md R6)", async ({ page }) => {
    const firstPreview = page.locator("a.showcase-card .showcase-card-preview").first();
    await expect(firstPreview).toHaveAttribute("inert", "");
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
  test("every component card link still resolves to its own page", async ({ page }) => {
    const firstCard = page.locator("a.showcase-card").first();
    const href = await firstCard.getAttribute("href");
    expect(href).toMatch(/^\/src\/components\//);
  });

  test("clicking a card navigates to that exact component's demo page (US2)", async ({ page }) => {
    const card = page.locator("a.showcase-card", { has: page.getByText("Button", { exact: true }) }).first();
    await card.click();
    await expect(page).toHaveURL(/\/src\/components\/button\/button\.html$/);
  });

  test("a card is keyboard-reachable and activatable via Enter (US2, SC-002)", async ({ page }) => {
    const card = page.locator("a.showcase-card", { has: page.getByText("Anchor", { exact: true }) }).first();
    await card.focus();
    await expect(card).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/src\/components\/anchor\/anchor\.html$/);
  });
});
