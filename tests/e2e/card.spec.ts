import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Card", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/card/card.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("default state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("card-default")).toHaveScreenshot("card-default.png");
  });

  test("elevated hover state matches visual baseline", async ({ page }) => {
    const card = page.getByTestId("card-elevated");
    await card.hover();
    await expect(card).toHaveScreenshot("card-elevated-hover.png");
  });

  test("composed state (Avatar + Badge) matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("card-composed")).toHaveScreenshot("card-composed.png");
  });

  test("renders as a visually-distinct container (AC1)", async ({ page }) => {
    const card = page.getByTestId("card-default");
    const borderWidth = await card.evaluate((el) => getComputedStyle(el).borderWidth);
    const boxShadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(borderWidth).not.toBe("0px");
    expect(boxShadow).not.toBe("none");
  });

  test("hover elevation increases shadow with no layout shift (AC2)", async ({ page }) => {
    const card = page.getByTestId("card-elevated");
    const boxBefore = await card.boundingBox();
    const shadowBefore = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    await card.hover();
    const boxAfter = await card.boundingBox();
    const shadowAfter = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadowAfter).not.toBe(shadowBefore);
    expect(boxAfter!.width).toBe(boxBefore!.width);
    expect(boxAfter!.height).toBe(boxBefore!.height);
  });

  test("composes Avatar and Badge with no visual conflicts (AC3)", async ({ page }) => {
    const card = page.getByTestId("card-composed");
    await expect(card.locator(".avatar-img")).toBeVisible();
    await expect(card.getByText("Active")).toBeVisible();
  });
});
