import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 028 — Layout & Structure Primitives. Covers all 4 user
// stories (US1 spacing, US2 surface, US3 grid, US4 AppShell) since
// each primitive's own demo page is small and they share no state.

test.describe("Stack", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/stack/stack.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("stack-sm children have smaller spacing than stack-lg", async ({ page }) => {
    const smFirst = page.getByTestId("stack-sm").locator("p").nth(0);
    const smSecond = page.getByTestId("stack-sm").locator("p").nth(1);
    const lgFirst = page.getByTestId("stack-lg").locator("p").nth(0);
    const lgSecond = page.getByTestId("stack-lg").locator("p").nth(1);

    const smGap = (await smSecond.boundingBox())!.y - (await smFirst.boundingBox())!.y;
    const lgGap = (await lgSecond.boundingBox())!.y - (await lgFirst.boundingBox())!.y;
    expect(lgGap).toBeGreaterThan(smGap);
  });
});

test.describe("Group", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/group/group.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("buttons lay out in a horizontal row", async ({ page }) => {
    const wrapper = page.getByTestId("group-buttons");
    await expect(wrapper).toHaveCSS("flex-direction", "row");
  });

  test("chips wrap without horizontal overflow at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});

test.describe("Center", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/center/center.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("content is centered both axes within its container", async ({ page }) => {
    const container = page.getByTestId("center-demo");
    const content = container.locator("span");
    const containerBox = (await container.boundingBox())!;
    const contentBox = (await content.boundingBox())!;

    const leftGap = contentBox.x - containerBox.x;
    const rightGap = containerBox.x + containerBox.width - (contentBox.x + contentBox.width);
    expect(Math.abs(leftGap - rightGap)).toBeLessThan(2);

    const topGap = contentBox.y - containerBox.y;
    const bottomGap = containerBox.y + containerBox.height - (contentBox.y + contentBox.height);
    expect(Math.abs(topGap - bottomGap)).toBeLessThan(2);
  });
});

test.describe("Container", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/container/container.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("stays within the ratified max-width at 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const box = (await page.getByTestId("container-demo").boundingBox())!;
    expect(box.width).toBeLessThanOrEqual(1024 + 48); // max-w-5xl (1024px) + px-6*2
  });
});

test.describe("Paper", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/paper/paper.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("shares Card's border/radius/background but not its shadow", async ({ page }) => {
    const paper = page.getByTestId("paper-demo");
    const card = page.getByTestId("card-comparison");

    const paperStyle = await paper.evaluate((el) => {
      const s = getComputedStyle(el);
      return { borderColor: s.borderColor, borderRadius: s.borderRadius, background: s.backgroundColor, shadow: s.boxShadow };
    });
    const cardStyle = await card.evaluate((el) => {
      const s = getComputedStyle(el);
      return { borderColor: s.borderColor, borderRadius: s.borderRadius, background: s.backgroundColor, shadow: s.boxShadow };
    });

    expect(paperStyle.borderColor).toBe(cardStyle.borderColor);
    expect(paperStyle.borderRadius).toBe(cardStyle.borderRadius);
    expect(paperStyle.background).toBe(cardStyle.background);
    expect(paperStyle.shadow).toBe("none");
    expect(cardStyle.shadow).not.toBe("none");
  });
});

test.describe("Grid", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/grid/grid.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("reflows to 1 column below 768px and 3 columns at 1024px+", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const item1Mobile = (await page.getByTestId("grid-item-1").boundingBox())!;
    const item2Mobile = (await page.getByTestId("grid-item-2").boundingBox())!;
    expect(Math.abs(item1Mobile.x - item2Mobile.x)).toBeLessThan(2); // stacked, same x

    await page.setViewportSize({ width: 1440, height: 900 });
    const item1Wide = (await page.getByTestId("grid-item-1").boundingBox())!;
    const item2Wide = (await page.getByTestId("grid-item-2").boundingBox())!;
    expect(item1Wide.x).not.toBeCloseTo(item2Wide.x, 0); // side by side
  });
});

test.describe("SimpleGrid", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/simple-grid/simple-grid.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("items are equal width at 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const itemA = (await page.getByTestId("simple-grid-item-1").boundingBox())!;
    const itemB = (await page.getByTestId("simple-grid-item-2").boundingBox())!;
    expect(Math.abs(itemA.width - itemB.width)).toBeLessThan(2);
  });
});

test.describe("Flex", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/flex/flex.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("row demo lays out horizontally, column demo vertically", async ({ page }) => {
    await expect(page.getByTestId("flex-row-demo")).toHaveCSS("flex-direction", "row");
    await expect(page.getByTestId("flex-col-demo")).toHaveCSS("flex-direction", "column");
  });
});

test.describe("AppShell", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/app-shell/app-shell.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("header, sidebar, and main position correctly at 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const header = (await page.getByTestId("navbar").boundingBox())!;
    const sidebar = (await page.getByTestId("sidebar").boundingBox())!;
    const main = (await page.getByTestId("app-shell-main").boundingBox())!;

    expect(header.y).toBeLessThan(sidebar.y);
    expect(sidebar.x).toBeLessThan(main.x); // sidebar left of main
  });

  test("sidebar stacks above main content below 1024px", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    const sidebar = (await page.getByTestId("sidebar").boundingBox())!;
    const main = (await page.getByTestId("app-shell-main").boundingBox())!;
    expect(sidebar.y).toBeLessThan(main.y); // sidebar above main
    expect(Math.abs(sidebar.x - main.x)).toBeLessThan(2); // same horizontal position (stacked)
  });

  test("Navbar's native mobile menu still functions inside AppShell", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    const summary = page.getByTestId("navbar-mobile-menu").locator("summary");
    await summary.click();
    await expect(page.getByTestId("navbar-mobile-panel")).toBeVisible();
  });

  test("no horizontal overflow at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
