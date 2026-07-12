import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("TreeView", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/tree-view/tree-view.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("renders at least 4 levels of nesting", async ({ page }) => {
    const depth = await page.evaluate(() => {
      let deepest = 0;
      document.querySelectorAll("li").forEach((li) => {
        let depth = 0;
        let el: HTMLElement | null = li;
        while (el) {
          if (el.tagName === "UL") depth++;
          el = el.parentElement;
        }
        deepest = Math.max(deepest, depth);
      });
      return deepest;
    });
    expect(depth).toBeGreaterThanOrEqual(4);
  });

  test("a leaf node renders no disclosure triangle", async ({ page }) => {
    const leaf = page.getByTestId("tree-leaf-readme");
    await expect(leaf.locator("details")).toHaveCount(0);
    await expect(leaf.locator("summary")).toHaveCount(0);
  });

  test("Enter toggles the focused summary's open state", async ({ page }) => {
    const summary = page.getByTestId("tree-summary-components");
    const details = page.getByTestId("tree-details-components");
    await expect(details).not.toHaveAttribute("open", "");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(details).not.toHaveAttribute("open", "");
  });

  test("Space toggles the focused summary's open state", async ({ page }) => {
    const summary = page.getByTestId("tree-summary-components");
    const details = page.getByTestId("tree-details-components");
    await summary.focus();
    await page.keyboard.press(" ");
    await expect(details).toHaveAttribute("open", "");
  });

  test("collapsing a parent branch preserves a nested child branch's own state", async ({
    page,
  }) => {
    const srcDetails = page.getByTestId("tree-details-src");
    const formDetails = page.getByTestId("tree-details-form");

    // "form" starts collapsed, nested two levels inside "src".
    await expect(formDetails).not.toHaveAttribute("open", "");

    // Open "components" (form's parent), then "form" itself, then collapse
    // the top-level "src" branch, then re-expand it — "form" must still be
    // open (its own state, not reset by an ancestor's collapse/re-expand).
    await page.getByTestId("tree-summary-components").click();
    await page.getByTestId("tree-summary-form").click();
    await expect(formDetails).toHaveAttribute("open", "");

    await page.getByTestId("tree-summary-src").click();
    await expect(srcDetails).not.toHaveAttribute("open", "");

    await page.getByTestId("tree-summary-src").click();
    await expect(srcDetails).toHaveAttribute("open", "");
    await expect(formDetails).toHaveAttribute("open", "");
  });

  test("matches visual baseline, including all levels expanded at 320px", async ({
    page,
  }) => {
    await page.getByTestId("tree-summary-components").click();
    await page.getByTestId("tree-summary-form").click();
    await expect(page.getByTestId("tree-view-demo")).toHaveScreenshot("tree-view-all.png");
  });
});
