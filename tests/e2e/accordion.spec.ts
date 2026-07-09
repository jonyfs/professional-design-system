import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Accordion / Disclosure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/accordion/accordion.html");
  });

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("closed state matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("accordion")).toHaveScreenshot("accordion-closed.png");
  });

  test("open state matches visual baseline", async ({ page }) => {
    await page.getByTestId("accordion-item-0").locator("summary").click();
    await expect(page.getByTestId("accordion-item-0")).toHaveScreenshot("accordion-item-open.png");
  });

  test("has no accessibility violations (open state)", async ({ page }, testInfo) => {
    await page.getByTestId("accordion-item-0").locator("summary").click();
    await expectNoA11yViolations(page, testInfo);
  });

  test("click toggles the item open and closed (AC1/AC2)", async ({ page }) => {
    const item = page.getByTestId("accordion-item-0");
    await expect(item).not.toHaveAttribute("open", "");
    await item.locator("summary").click();
    await expect(item).toHaveAttribute("open", "");
    await item.locator("summary").click();
    await expect(item).not.toHaveAttribute("open", "");
  });

  test("keyboard activation toggles the item (AC1)", async ({ page }) => {
    const item = page.getByTestId("accordion-item-0");
    await item.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(item).toHaveAttribute("open", "");
  });

  test("independent items do not affect each other (AC3)", async ({ page }) => {
    const item0 = page.getByTestId("accordion-item-0");
    const item1 = page.getByTestId("accordion-item-1");
    await item0.locator("summary").click();
    await expect(item0).toHaveAttribute("open", "");
    await item1.locator("summary").click();
    await expect(item0).toHaveAttribute("open", "");
    await expect(item1).toHaveAttribute("open", "");
  });

  test("exclusive variant closes sibling items natively (Edge Case)", async ({ page }) => {
    const item0 = page.getByTestId("accordion-exclusive-item-0");
    const item1 = page.getByTestId("accordion-exclusive-item-1");
    await item0.locator("summary").click();
    await expect(item0).toHaveAttribute("open", "");
    await item1.locator("summary").click();
    await expect(item1).toHaveAttribute("open", "");
    await expect(item0).not.toHaveAttribute("open", "");
  });

  test("chevron rotates with open state", async ({ page }) => {
    const chevron = page.getByTestId("accordion-item-0").locator(".accordion-chevron");
    const beforeTransform = await chevron.evaluate((el) => getComputedStyle(el).transform);
    await page.getByTestId("accordion-item-0").locator("summary").click();
    const afterTransform = await chevron.evaluate((el) => getComputedStyle(el).transform);
    expect(afterTransform).not.toBe(beforeTransform);
  });
});
