import { test, expect } from "@playwright/test";

// Feature 017 T026/T041 — visual regression baselines for the
// representative component sample under each new theme (contracts/
// theme-gallery.contract.md's preview region), proving the pipeline
// generalizes beyond the pre-existing "light" theme (already covered by
// this catalog's ~48 pre-existing per-component baselines).
const NEW_THEMES = [
  // Phase 4 (P1 pilot batch)
  "corporate",
  "forest",
  "nord",
  "dracula",
  "business",
  // Phase 5 (P2 batch)
  "cosmo",
  "flatly",
  "litera",
  "lumen",
  "zephyr",
  "silk",
  "winter",
  "cupcake",
  "sandstone",
  "garden",
  "autumn",
  "lemonade",
  "caramellatte",
  // Phase 6 (P3 batch)
  "everforest",
  "gruvbox",
  "aqua",
  "emerald",
  "slate",
  "spacelab",
  "cerulean",
  "quartz",
  "journal",
  "dim",
  "night",
  "darkly",
  "cyborg",
  // Phase 7 (P4 batch)
  "superhero",
  "abyss",
  "synthwave",
  "cyberpunk",
  "tokyonight",
  "halloween",
  "luxury",
  "retro",
  "coffee",
  "rosepine",
  "catppuccin",
  // Feature 027 — Claude-Design-inspired batch 2
  "aurora",
  "obsidian",
  "linen",
  "graphite",
  "nebula",
  // Feature 036 — Prism (cross-collection synthesis)
  "prism",
];

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
