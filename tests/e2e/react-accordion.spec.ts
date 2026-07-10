import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

const HARNESS_URL = "http://localhost:5174/accordion.html";

test.describe("Accordion (React package, visual parity with static reference)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations (closed state)", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("closed state matches the static reference's visual baseline", async ({ page }) => {
    await expect(page.getByTestId("accordion")).toHaveScreenshot("react-accordion-closed.png");
  });

  test("open state matches the static reference's visual baseline", async ({ page }) => {
    await page.getByTestId("accordion-item-0").locator("summary").click();
    await expect(page.getByTestId("accordion-item-0")).toHaveScreenshot(
      "react-accordion-item-open.png",
    );
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

  test("exclusive variant closes sibling items natively (AC1, Edge Case)", async ({ page }) => {
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

  test("a non-exclusive instance is unaffected by a separate exclusive group toggling", async ({
    page,
  }) => {
    const independentItem = page.getByTestId("accordion-item-0");
    await independentItem.locator("summary").click();
    await expect(independentItem).toHaveAttribute("open", "");

    const exclusiveItem = page.getByTestId("accordion-exclusive-item-0");
    await exclusiveItem.locator("summary").click();
    await expect(exclusiveItem).toHaveAttribute("open", "");
    await expect(independentItem).toHaveAttribute("open", "");
  });

  test("two separate exclusive-mode Accordion instances don't share one native group (code review finding)", async ({
    page,
  }) => {
    // The real regression guard for the useId()-based groupName
    // (research.md R1): a test with only ONE exclusive instance plus a
    // non-exclusive one (see above) can pass even with a single
    // hardcoded group name shared by every exclusive Accordion on the
    // page, since the non-exclusive instance was never in a native
    // `name` group to begin with. Only two *exclusive* instances on the
    // same page can prove they don't fight over one shared group.
    const exclusive1Item = page.getByTestId("accordion-exclusive-item-0");
    const exclusive2Item = page.getByTestId("accordion-exclusive-2-item-0");

    await exclusive1Item.locator("summary").click();
    await expect(exclusive1Item).toHaveAttribute("open", "");

    await exclusive2Item.locator("summary").click();
    await expect(exclusive2Item).toHaveAttribute("open", "");
    // If both instances shared one native group name, opening an item in
    // the second group would have natively collapsed the first.
    await expect(exclusive1Item).toHaveAttribute("open", "");
  });
});
