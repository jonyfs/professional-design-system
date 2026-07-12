import { test, expect } from "@playwright/test";
import { expectNoConsoleErrors } from "./a11y-helper";

// Feature 016 polish task T028 — the hard lesson from feature 014's
// research.md R12 (carried forward through feature 015's T065): this
// project's CSP (`style-src 'self'`, no `unsafe-inline`) silently blocks
// inline `style="..."` attributes authored in markup. Every new page in
// this feature is swept for zero CSP console violations. The additional
// "no [style] attribute at all" check only applies to the three
// zero-JavaScript components (tree-view, rating, color-input) — Menubar
// legitimately reuses dropdown-menu.js's CSSOM `anchor-name` assignment
// (`trigger.style.anchorName = ...`), the SAME endorsed, CSP-compliant
// pattern Dropdown Menu/Combobox/Progress already use (direct CSSOM
// property assignment is NOT the same as an inline `style="..."`
// attribute authored in HTML, even though both end up rendering as a
// `style` attribute in the live DOM) — Dropdown Menu's own spec never
// asserts a `[style]` count for exactly this reason, matched here.
const ZERO_JS_PAGES = ["tree-view", "rating", "color-input", "settings-example"];
const ALL_PAGES = ["tree-view", "rating", "menubar", "color-input", "settings-example"];

test.describe("Feature 016 CSP-violation sweep", () => {
  for (const name of ALL_PAGES) {
    test(`${name}.html has zero CSP violations`, async ({ page }) => {
      await expectNoConsoleErrors(page, async () => {
        await page.goto(`/src/components/${name}/${name}.html`);
      });
    });
  }

  for (const name of ZERO_JS_PAGES) {
    test(`${name}.html (zero-JS) has no inline style attributes`, async ({ page }) => {
      await page.goto(`/src/components/${name}/${name}.html`);
      const inlineStyleCount = await page.locator("[style]").count();
      expect(inlineStyleCount).toBe(0);
    });
  }
});
