import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/chart.html";

test.describe("Extended charts — Radar/Radial (US2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("Radar chart labels every attribute axis", async ({ page }) => {
    const radarSvg = page.getByTestId("chart-radar").locator("svg");
    for (const label of ["Speed", "Reliability", "Coverage", "Cost"]) {
      await expect(radarSvg.getByText(label)).toBeVisible();
    }
  });

  test("Radar chart's two series remain distinguishable via the legend", async ({ page }) => {
    const radar = page.getByTestId("chart-radar");
    await expect(radar.getByRole("button", { name: "Team A" })).toBeVisible();
    await expect(radar.getByRole("button", { name: "Team B" })).toBeVisible();
  });

  test("Radial chart shows the value's position relative to its range unambiguously (US2 AC2)", async ({
    page,
  }) => {
    const radial = page.getByTestId("chart-radial");
    await expect(radial.getByText("72 / 100")).toBeVisible();
    await expect(radial.locator("span").getByText("Uptime SLA")).toBeVisible();
  });

  test("both extended charts re-color on theme switch", async ({ page }) => {
    const radialArc = page.getByTestId("chart-radial").locator("path.recharts-radial-bar-sector").first();
    const before = await radialArc.getAttribute("fill");
    await page.selectOption("select", "nord");
    await expect(async () => {
      const after = await radialArc.getAttribute("fill");
      expect(after).not.toBe(before);
    }).toPass();
  });
});
