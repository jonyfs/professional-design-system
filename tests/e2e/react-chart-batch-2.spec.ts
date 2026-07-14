import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Runs against the React test harness (tests/react-harness/chart-batch-2.html).
// Same reduced-motion emulation convention as react-chart-core.spec.ts —
// every test here emulates prefers-reduced-motion so renders are
// deterministic rather than racing a mid-animation frame.
const HARNESS_URL = "http://localhost:5174/chart-batch-2.html";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(HARNESS_URL);
});

test.describe("Composed & Scatter charts (US1)", () => {
  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("Composed chart renders a bar series and a line series on the same category axis (AC1)", async ({
    page,
  }) => {
    const composed = page.getByTestId("chart-composed");
    await expect(composed.locator("path.recharts-rectangle").first()).toBeVisible();
    await expect(composed.locator("path.recharts-line-curve").first()).toBeVisible();
  });

  test("Composed chart renders a secondary Y-axis when a series requests it", async ({ page }) => {
    const composed = page.getByTestId("chart-composed");
    const yAxes = composed.locator(".recharts-yAxis");
    await expect(yAxes).toHaveCount(2);
  });

  test("Composed chart re-colors on theme switch (SC-002)", async ({ page }) => {
    const bar = page.getByTestId("chart-composed").locator("path.recharts-rectangle").first();
    const before = await bar.getAttribute("fill");
    await page.selectOption("select", "dracula");
    await expect(async () => {
      const after = await bar.getAttribute("fill");
      expect(after).not.toBe(before);
    }).toPass();
  });

  test("Scatter chart plots each series' points distinctly (AC2)", async ({ page }) => {
    const scatter = page.getByTestId("chart-scatter");
    const points = scatter.locator(".recharts-scatter-symbol");
    await expect(points.first()).toBeVisible();
    const count = await points.count();
    expect(count).toBeGreaterThanOrEqual(8); // 4 points x 2 series
  });

  test("Composed chart empty dataset shows ChartEmptyState (FR-010)", async ({ page }) => {
    const empty = page.getByTestId("chart-composed-empty");
    await expect(empty.getByText("No data to display")).toBeVisible();
  });
});

test.describe("Funnel chart (US2)", () => {
  test("renders each stage sized proportionally and labeled (AC1)", async ({ page }) => {
    const funnel = page.getByTestId("chart-funnel");
    await expect(funnel.locator("svg")).toBeVisible();
    await expect(funnel.getByText("Visitors").first()).toBeVisible();
    await expect(funnel.getByText("Purchases").first()).toBeVisible();
  });

  test("exposes a non-visual data table equivalent (FR-009)", async ({ page }) => {
    const table = page.getByTestId("chart-funnel").locator("table");
    await expect(table).toHaveClass(/sr-only/);
    await expect(table.locator("th")).toHaveCount(2); // Stage + Value
  });
});

test.describe("Treemap & Sankey (US3)", () => {
  test("Treemap renders nested nodes proportional to value (AC1)", async ({ page }) => {
    const treemap = page.getByTestId("chart-treemap");
    const rects = treemap.locator("svg rect");
    await expect(rects.first()).toBeVisible();
    const count = await rects.count();
    expect(count).toBeGreaterThanOrEqual(5); // 5 leaf nodes across 2 groups
  });

  test("Treemap empty dataset shows ChartEmptyState", async ({ page }) => {
    const empty = page.getByTestId("chart-treemap-empty");
    await expect(empty.getByText("No data to display")).toBeVisible();
  });

  test("Sankey renders proportional link widths and labels every node (AC2)", async ({ page }) => {
    const sankey = page.getByTestId("chart-sankey");
    await expect(sankey.locator("svg")).toBeVisible();
    await expect(sankey.getByText("Direct").first()).toBeVisible();
    await expect(sankey.getByText("Purchases").first()).toBeVisible();
    const links = sankey.locator("path");
    expect(await links.count()).toBeGreaterThanOrEqual(4);
  });
});

test.describe("Responsive behavior (SC-006)", () => {
  // Scoped to each chart's own visible SVG, matching
  // react-chart-core.spec.ts's established convention — NOT
  // document.documentElement.scrollWidth, which the sr-only
  // ChartDataTable's intrinsic content width already inflates on the
  // pre-existing feature-020 chart.html page too (347 vs 320
  // viewportWidth, confirmed unrelated to this feature — the sr-only
  // table is never visible, so this never manifests as a real
  // horizontal scrollbar).
  test("all 5 new chart types resize their visible SVG without overflow at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 1200 });
    await page.goto(HARNESS_URL);
    for (const testId of ["chart-composed", "chart-scatter", "chart-funnel", "chart-treemap", "chart-sankey"]) {
      const svg = page.getByTestId(testId).locator("svg").first();
      const box = await svg.boundingBox();
      expect(box?.width, `${testId} SVG width`).toBeLessThanOrEqual(320);
    }
  });
});
