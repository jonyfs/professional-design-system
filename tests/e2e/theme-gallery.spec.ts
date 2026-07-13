import { test, expect } from "@playwright/test";

// Feature 017 T014 — contracts/theme-gallery.contract.md, matching FR-001,
// FR-003, FR-004, SC-001, SC-004, SC-005's acceptance mapping.
test.describe("Theme Gallery", () => {
  test("the light theme's card renders with the correct data-theme-id", async ({ page }) => {
    await page.goto("/src/components/theme-gallery/theme-gallery.html");
    const card = page.getByTestId("theme-card-light");
    await expect(card).toHaveAttribute("data-theme-id", "light");
  });

  test("clicking a theme card sets aria-pressed=true on it and false on every other card", async ({
    page,
  }) => {
    await page.goto("/src/components/theme-gallery/theme-gallery.html");
    const lightCard = page.getByTestId("theme-card-light");
    await lightCard.click();

    const cards = page.locator('[data-testid^="theme-card-"]');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const testId = await card.getAttribute("data-testid");
      await expect(card).toHaveAttribute(
        "aria-pressed",
        testId === "theme-card-light" ? "true" : "false",
      );
    }
  });

  test("the preview region's representative components reflect the selected theme's tokens", async ({
    page,
  }) => {
    await page.goto("/src/components/theme-gallery/theme-gallery.html");
    await page.getByTestId("theme-card-light").click();

    const primaryButton = page.getByTestId("theme-preview-button-primary");
    const bg = await primaryButton.evaluate((el) => getComputedStyle(el).backgroundColor);
    // light theme's brand-dark: rgb(0 75 179) per themes.css.
    expect(bg).toBe("rgb(0, 75, 179)");
  });

  test("swatch colors render with zero CSP violations (CSSOM assignment, never an inline style=\"...\" HTML attribute)", async ({
    page,
  }) => {
    // A style="..." attribute present in the SERVED HTML source is what
    // this project's CSP (style-src 'self', no 'unsafe-inline') blocks —
    // NOT the `style` attribute the DOM reflects after a live
    // `element.style.backgroundColor = ...` CSSOM assignment (that
    // reflection is expected and CSP-exempt; asserting its absence would
    // be asserting the wrong thing). The real check is: no CSP violation
    // was ever reported while this page ran.
    const cspViolations: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && msg.text().includes("Content Security Policy")) {
        cspViolations.push(msg.text());
      }
    });

    await page.goto("/src/components/theme-gallery/theme-gallery.html");
    await page.waitForSelector('[data-testid^="theme-card-"]');
    expect(cspViolations).toEqual([]);

    // Confirm the SERVED HTML SOURCE itself never authors style="..." —
    // the swatch spans' style attribute only exists because CSSOM set it
    // at runtime, not because it shipped in markup.
    const response = await page.goto("/src/components/theme-gallery/theme-gallery.html");
    const html = (await response?.text()) ?? "";
    expect(html).not.toMatch(/style="/);
  });

  test("each mood-family section has a real heading labeled via aria-labelledby", async ({
    page,
  }) => {
    await page.goto("/src/components/theme-gallery/theme-gallery.html");
    const sections = page.locator("section[aria-labelledby]");
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      const headingId = await section.getAttribute("aria-labelledby");
      await expect(page.locator(`#${headingId}`)).toHaveText(/.+/);
    }
  });
});
