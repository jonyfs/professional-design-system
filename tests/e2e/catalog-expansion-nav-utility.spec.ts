import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 023 — User Story 4 (Navigation & Disclosure Utilities), static
// surface. Covers NavLink (aria-current + Sidebar-matching active
// treatment), Anchor (styled inline link), Collapse (independence between
// sibling instances), and Spoiler (Show more/less + the no-control edge
// case for content that fits). spec.md US4 AC1-AC4, FR-011..FR-014.

test.describe("NavLink (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/nav-link/nav-link.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("the current page carries aria-current='page' (AC1)", async ({ page }) => {
    await expect(page.getByTestId("nav-link-overview")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("non-current links do not carry aria-current (AC1)", async ({ page }) => {
    for (const id of [
      "nav-link-installation",
      "nav-link-usage",
      "nav-link-api",
    ]) {
      await expect(page.getByTestId(id)).not.toHaveAttribute("aria-current", "page");
    }
  });

  test("only the current link gets the Sidebar active-item treatment (AC1)", async ({
    page,
  }) => {
    const current = page.getByTestId("nav-link-overview");
    const other = page.getByTestId("nav-link-installation");

    const currentBg = await current.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    const otherBg = await other.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );

    // The active item paints a solid brand-dark background; a non-active
    // item has a transparent resting background.
    expect(currentBg).not.toBe("rgba(0, 0, 0, 0)");
    expect(currentBg).not.toBe(otherBg);
    expect(otherBg).toBe("rgba(0, 0, 0, 0)");
  });

  test("the active NavLink's treatment is pixel-identical to Sidebar's active item", async ({
    page,
  }) => {
    // NavLink's .nav-link[aria-current] @apply rules are byte-identical to
    // Sidebar's .sidebar-item[aria-current] — the computed active
    // background must match Sidebar's (research.md R6).
    const navLinkBg = await page
      .getByTestId("nav-link-overview")
      .evaluate((el) => getComputedStyle(el).backgroundColor);

    await page.goto("/src/components/sidebar/sidebar.html");
    const sidebarBg = await page
      .getByTestId("sidebar-item-dashboard")
      .evaluate((el) => getComputedStyle(el).backgroundColor);

    expect(navLinkBg).toBe(sidebarBg);
  });
});

test.describe("Anchor (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/anchor/anchor.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("renders as a real link with an href and the ratified link token (AC2)", async ({
    page,
  }) => {
    const anchor = page.getByTestId("anchor-inline");
    await expect(anchor).toHaveAttribute("href", "#");
    // The .anchor token is underlined by default (a styled inline link,
    // not an unstyled browser default).
    const decoration = await anchor.evaluate(
      (el) => getComputedStyle(el).textDecorationLine,
    );
    expect(decoration).toContain("underline");
  });
});

test.describe("Collapse (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/collapse/collapse.html");
  });

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("summary click toggles the single instance open and closed", async ({ page }) => {
    const collapse = page.getByTestId("collapse-0");
    await expect(collapse).not.toHaveAttribute("open", "");
    await collapse.locator("summary").click();
    await expect(collapse).toHaveAttribute("open", "");
    await collapse.locator("summary").click();
    await expect(collapse).not.toHaveAttribute("open", "");
  });

  test("keyboard activation toggles the instance", async ({ page }) => {
    const collapse = page.getByTestId("collapse-0");
    await collapse.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(collapse).toHaveAttribute("open", "");
  });

  test("two Collapse instances are fully independent — opening one does not affect the other (AC3)", async ({
    page,
  }) => {
    const first = page.getByTestId("collapse-0");
    const second = page.getByTestId("collapse-1");

    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open", "");
    await expect(second).not.toHaveAttribute("open", "");

    // Opening the second must NOT close the first (unlike Accordion's
    // grouped, mutually-exclusive behavior).
    await second.locator("summary").click();
    await expect(second).toHaveAttribute("open", "");
    await expect(first).toHaveAttribute("open", "");
  });
});

test.describe("Spoiler (static)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/spoiler/spoiler.html");
  });

  test("has no accessibility violations (collapsed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("long content shows a 'Show more' control while collapsed (AC4)", async ({
    page,
  }) => {
    const details = page.getByTestId("spoiler-long");
    await expect(details).toHaveAttribute("data-truncatable", "true");

    const toggle = page.getByTestId("spoiler-long-toggle");
    await expect(toggle).toBeVisible();
    await expect(toggle.getByText("Show more")).toBeVisible();
    await expect(toggle.getByText("Show less")).toBeHidden();
  });

  test("expanding long content swaps to a 'Show less' control (AC4)", async ({ page }) => {
    const details = page.getByTestId("spoiler-long");
    await page.getByTestId("spoiler-long-summary").click();
    await expect(details).toHaveAttribute("open", "");

    const toggle = page.getByTestId("spoiler-long-toggle");
    await expect(toggle.getByText("Show less")).toBeVisible();
    await expect(toggle.getByText("Show more")).toBeHidden();
  });

  test("re-collapsing long content returns to 'Show more' (AC4)", async ({ page }) => {
    const summary = page.getByTestId("spoiler-long-summary");
    await summary.click();
    await summary.click();
    const details = page.getByTestId("spoiler-long");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(page.getByTestId("spoiler-long-toggle").getByText("Show more")).toBeVisible();
  });

  test("short content shows NO control at all (spec.md US4 edge case)", async ({
    page,
  }) => {
    const details = page.getByTestId("spoiler-short");
    // The measurement decided nothing overflows.
    await expect(details).toHaveAttribute("data-truncatable", "false");
    // ...so the control is hidden entirely.
    await expect(page.getByTestId("spoiler-short-toggle")).toBeHidden();
  });
});
