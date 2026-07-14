import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 023 — User Story 4, React surface. Mirrors
// catalog-expansion-nav-utility.spec.ts against the React harness
// (localhost:5174), proving identical behavior on both surfaces (SC-003).

const HARNESS = (name: string) => `http://localhost:5174/${name}.html`;

test.describe("NavLink (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS("nav-link"));
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

    expect(currentBg).not.toBe("rgba(0, 0, 0, 0)");
    expect(currentBg).not.toBe(otherBg);
    expect(otherBg).toBe("rgba(0, 0, 0, 0)");
  });

  test("the active NavLink matches the React Sidebar's active item", async ({ page }) => {
    const navLinkBg = await page
      .getByTestId("nav-link-overview")
      .evaluate((el) => getComputedStyle(el).backgroundColor);

    await page.goto(HARNESS("sidebar"));
    const sidebarBg = await page
      .getByTestId("sidebar-light-item-dashboard")
      .evaluate((el) => getComputedStyle(el).backgroundColor);

    expect(navLinkBg).toBe(sidebarBg);
  });
});

test.describe("Anchor (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS("anchor"));
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("renders as a real link with an href and the ratified link token (AC2)", async ({
    page,
  }) => {
    const anchor = page.getByTestId("anchor-inline");
    await expect(anchor).toHaveAttribute("href", "#");
    const decoration = await anchor.evaluate(
      (el) => getComputedStyle(el).textDecorationLine,
    );
    expect(decoration).toContain("underline");
  });
});

test.describe("Collapse (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS("collapse"));
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

    await second.locator("summary").click();
    await expect(second).toHaveAttribute("open", "");
    await expect(first).toHaveAttribute("open", "");
  });
});

test.describe("Spoiler (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS("spoiler"));
  });

  test("has no accessibility violations (collapsed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("long content shows a 'Show more' control while collapsed (AC4)", async ({
    page,
  }) => {
    const details = page.getByTestId("spoiler-long");
    await expect(details).toHaveAttribute("data-truncatable", "true");

    const toggle = details.locator(".spoiler-toggle");
    await expect(toggle).toBeVisible();
    await expect(toggle.getByText("Show more")).toBeVisible();
    await expect(toggle.getByText("Show less")).toBeHidden();
  });

  test("expanding long content swaps to a 'Show less' control (AC4)", async ({ page }) => {
    const details = page.getByTestId("spoiler-long");
    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open", "");

    const toggle = details.locator(".spoiler-toggle");
    await expect(toggle.getByText("Show less")).toBeVisible();
    await expect(toggle.getByText("Show more")).toBeHidden();
  });

  test("short content shows NO control at all (spec.md US4 edge case)", async ({
    page,
  }) => {
    const details = page.getByTestId("spoiler-short");
    await expect(details).toHaveAttribute("data-truncatable", "false");
    await expect(details.locator(".spoiler-toggle")).toBeHidden();
  });
});
