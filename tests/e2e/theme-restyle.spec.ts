import { test, expect } from "@playwright/test";

// Feature 017 T026 — visual regression baselines for the representative
// component sample under each of the 5 new P1 pilot themes (contracts/
// theme-gallery.contract.md's preview region), proving the pipeline
// generalizes beyond the pre-existing "light" theme (already covered by
// this catalog's ~48 pre-existing per-component baselines).
const NEW_THEMES = ["corporate", "forest", "nord", "dracula", "business"];

test.describe("Theme restyle visual regression (P1 pilot batch)", () => {
  for (const themeId of NEW_THEMES) {
    test(`${themeId} theme restyles the preview region and matches its visual baseline`, async ({
      page,
    }) => {
      await page.goto("/src/components/theme-gallery/theme-gallery.html");
      await page.getByTestId(`theme-card-${themeId}`).click();
      await expect(page.getByTestId("theme-preview-region")).toHaveScreenshot(
        `theme-preview-${themeId}.png`,
      );
    });
  }
});
