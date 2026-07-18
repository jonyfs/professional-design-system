import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 042 — a single, coherent, realistic SaaS dashboard screen
// composed from real, already-shipped components (not a component
// grid, per spec.md FR-001). Its own standalone Vite dev server runs on
// http://localhost:5175 (playwright.config.ts), same "absolute URL,
// separate webServer entry" pattern as tests/react-harness.
const SHOWCASE_URL = "http://localhost:5175/";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(SHOWCASE_URL);
});

test.describe("A single realistic dashboard, not a component grid (US1)", () => {
  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("composes at least 15 distinct real components in one screen (FR-001/FR-002/SC-001)", async ({ page }) => {
    // Sidebar is intentionally hidden below the lg breakpoint (FR-008's
    // own no-overflow requirement) — this check is about overall
    // composition, not responsive behavior, so force a wide viewport.
    await page.setViewportSize({ width: 1440, height: 960 });
    await expect(page.locator("[data-testid='showcase-sidebar']")).toBeVisible();
    await expect(page.locator("[data-testid='showcase-navbar']")).toBeVisible();
    await expect(page.locator("[data-testid='showcase-org-switcher']")).toBeVisible();
    await expect(page.locator("[data-testid='showcase-user-avatar']")).toBeVisible();
    await expect(page.locator("[data-testid='showcase-notifications-trigger']")).toBeVisible();
    await expect(page.locator("[data-testid='showcase-dark-toggle']")).toBeVisible();
    await expect(page.locator("[data-testid='showcase-theme-select']")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(page.getByRole("tablist")).toBeVisible();
    await expect(page.getByRole("region", { name: "Customer accounts" })).toBeVisible();
    await expect(page.locator("svg.recharts-surface")).toBeVisible();
    await expect(page.getByText("Monthly Recurring Revenue")).toBeVisible();
    await expect(page.getByRole("button", { name: "View account details" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Send weekly report" })).toBeVisible();
  });

  test("metrics, table rows, and notifications are clearly fictional, not a real backend (FR-009)", async ({ page }) => {
    await expect(page.getByRole("cell", { name: "Northwind Traders", exact: true })).toBeVisible();
    await expect(page.getByText("Acme Inc").first()).toBeVisible();
  });
});

test.describe("Real, triggerable interactions (FR-003)", () => {
  test("dropdown menu (user avatar) opens a real menu panel", async ({ page }) => {
    await page.locator("[data-testid='showcase-user-menu-trigger']").click();
    await expect(page.locator("[data-testid='showcase-user-menu-panel']")).toBeVisible();
  });

  test("notification center opens with real fictional notifications", async ({ page }) => {
    await page.locator("[data-testid='showcase-notifications-trigger']").click();
    await expect(page.locator("[data-testid='showcase-notifications-panel']")).toBeVisible();
    await expect(page.getByText("Northwind Traders upgraded to the Pro plan")).toBeVisible();
  });

  test("toast appears after triggering an action and can be dismissed", async ({ page }) => {
    await page.getByRole("button", { name: "Send weekly report" }).click();
    const toast = page.getByRole("status").filter({ hasText: "Report sent to the team" });
    await expect(toast).toBeVisible();
    await toast.getByRole("button").click();
    await expect(toast).not.toBeVisible();
  });

  test("modal opens with real account details and closes", async ({ page }) => {
    await page.getByRole("button", { name: "View account details" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Northwind Traders — account details")).toBeVisible();
    await page.locator("[data-testid='showcase-modal-close']").click();
    await expect(dialog).not.toBeVisible();
  });

  test("command palette opens via Cmd/Ctrl+K and executes a real action", async ({ page }) => {
    // Focus a known element first (established convention, see
    // tests/e2e/command-palette.spec.ts's openViaShortcut helper) rather
    // than relying on whatever the browser's default focus happens to be.
    // The back-link (unlike Sidebar) is visible at every breakpoint.
    await page.getByRole("link", { name: /Component catalog/ }).focus();
    await page.keyboard.press("ControlOrMeta+k");
    const palette = page.locator("[data-testid='showcase-command-palette']");
    await expect(palette).toBeVisible();
    await page.keyboard.type("team");
    // Wait for the filtered list to actually settle on the single "Go to
    // team" match before navigating it — otherwise ArrowDown can land on
    // a stale (pre-filter) list and Enter executes the wrong action.
    await expect(palette.getByText("Go to customers")).not.toBeVisible();
    await expect(palette.getByText("Go to team")).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.locator("#team")).toBeInViewport();
  });

  test("switching tabs shows the Team panel's real components", async ({ page }) => {
    await page.getByRole("tab", { name: "Team" }).click();
    await expect(page.getByText("Jane Ito")).toBeVisible();
    await expect(page.getByText("Marco Reyes")).toBeVisible();
  });

  test("team pagination navigates between pages", async ({ page }) => {
    await page.getByRole("tab", { name: "Team" }).click();
    const panel = page.getByRole("tabpanel");
    await expect(panel.getByText("Jane Ito")).toBeVisible();
    const pagination = page.locator("[data-testid='showcase-team-pagination']");
    await pagination.getByRole("button", { name: "2" }).click();
    await expect(panel.getByText("Jane Ito")).not.toBeVisible();
    await expect(panel.getByText("Priya Nair")).toBeVisible();
  });
});

test.describe("Theming (FR-004)", () => {
  test("re-colors correctly across the full 119-theme catalog via the real theme switcher", async ({ page }) => {
    const select = page.locator("[data-testid='showcase-theme-select']");
    await expect(select.locator("option")).toHaveCount(119);
    await select.selectOption("dim");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dim");
    await select.selectOption("light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("DarkModeToggle stays in sync with the same underlying theme state", async ({ page }) => {
    // The input is visually hidden (peer sr-only) — its wrapping <label>
    // is the real click target (same convention as tests/e2e/toggle.spec.ts).
    await page.getByText("Dark mode").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dim");
    await expect(page.locator("[data-testid='showcase-theme-select']")).toHaveValue("dim");
  });
});

test.describe("Wayfinding between the catalog and the showcase (FR-006/SC-003)", () => {
  test("the showcase links back to the component catalog", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /Component catalog/ });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/index.html");
  });
});

test.describe("Responsive — no horizontal overflow (FR-008/SC-005)", () => {
  for (const width of [320, 768, 1024, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(SHOWCASE_URL);
      // Recharts (LineChart) measures its container via ResizeObserver
      // and redraws asynchronously after first paint — on a narrow
      // viewport, checking scrollWidth before that callback fires can
      // transiently catch the chart at its pre-resize width (WebKit
      // reproduced this intermittently; waiting for the chart's own
      // <svg> to settle at its final width avoids the race).
      await page.waitForFunction(
        (vw) => {
          const svg = document.querySelector("svg.recharts-surface");
          return !svg || svg.getBoundingClientRect().width <= vw;
        },
        width,
      );
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
    });
  }
});
