import { test, expect } from "@playwright/test";
import { expectNoConsoleErrors } from "./a11y-helper";

// Feature 015 polish task T065 — the hard lesson from feature 014's
// research.md R12: this project's CSP (`style-src 'self'`, no
// `unsafe-inline`) silently blocks inline `style="..."` attributes. Every
// new page in this feature is swept for zero CSP console violations and
// zero inline `style="..."` attributes in its own markup.
const PAGES = [
  "spinner",
  "aspect-ratio",
  "indicator",
  "data-list",
  "slider",
  "stepper",
  "file-input",
  "timeline",
  "stat-card",
  "pin-input",
  "dashboard-example",
];

test.describe("Feature 015 CSP-violation sweep", () => {
  for (const name of PAGES) {
    test(`${name}.html has zero CSP violations and no inline style attributes`, async ({
      page,
    }) => {
      await expectNoConsoleErrors(page, async () => {
        await page.goto(`/src/components/${name}/${name}.html`);
      });
      const inlineStyleCount = await page.locator("[style]").count();
      expect(inlineStyleCount).toBe(0);
    });
  }
});
