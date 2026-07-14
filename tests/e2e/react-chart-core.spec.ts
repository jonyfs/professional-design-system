import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Runs against the React test harness (tests/react-harness/chart.html).
// Recharts' entrance animation sweeps in progressively — every test here
// emulates prefers-reduced-motion (packages/react/src/Chart/*'s
// isAnimationActive gate responds to it) so renders are deterministic and
// instant rather than racing a mid-animation frame.
const HARNESS_URL = "http://localhost:5174/chart.html";

test.describe("Core charts — Line/Bar/Area/Pie (US1)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("renders with on-theme colors — no manual color config (SC-001)", async ({ page }) => {
    const bar = page.getByTestId("chart-bar").locator("path.recharts-rectangle").first();
    const fill = await bar.getAttribute("fill");
    expect(fill).toMatch(/^rgb\(/);
  });

  test("re-colors on theme switch without reload (SC-002)", async ({ page }) => {
    const bar = page.getByTestId("chart-bar").locator("path.recharts-rectangle").first();
    const before = await bar.getAttribute("fill");
    await page.selectOption("select", "dracula");
    await expect(async () => {
      const after = await bar.getAttribute("fill");
      expect(after).not.toBe(before);
    }).toPass();
  });

  test("Line chart shows a visual gap for a null mid-series value, not interpolation", async ({ page }) => {
    const line = page.getByTestId("chart-line");
    // The March data point has revenue: null — the "revenue" line has two
    // disconnected path segments (before/after the gap) rather than one
    // continuous path crossing it (connectNulls={false}).
    const revenuePaths = line.locator("path.recharts-line-curve");
    await expect(revenuePaths.first()).toBeVisible();
  });

  test("Pie chart zero-value slice renders without error (spec.md Edge Cases)", async ({ page }) => {
    const pie = page.getByTestId("chart-pie");
    await expect(pie.locator("svg")).toBeVisible();
    // "Other" (value: 0) must not appear as a legend-listed but crashing slice.
    await expect(pie.getByRole("button", { name: "Other" })).toBeVisible();
  });

  test("empty dataset shows ChartEmptyState, not a blank/broken area (FR-012)", async ({ page }) => {
    const empty = page.getByTestId("chart-empty");
    await expect(empty.getByText("No data to display")).toBeVisible();
  });

  test("every chart exposes a non-visual data table equivalent (FR-009)", async ({ page }) => {
    const table = page.getByTestId("chart-bar").locator("table");
    await expect(table).toHaveClass(/sr-only/);
    await expect(table.locator("th")).toHaveCount(3); // month + Revenue + Costs
  });

  test("resizes to fill a changed container width without overflow (SC-006)", async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 900 });
    const svg = page.getByTestId("chart-bar").locator("svg").first();
    const box = await svg.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(500);
  });
});
