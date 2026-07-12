import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

test.describe("Timeline", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/timeline/timeline.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("uses a real ol and real time[datetime] elements", async ({ page }) => {
    const list = page.getByTestId("timeline-multi");
    const tagName = await list.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe("ol");
    await expect(list.locator("time[datetime]")).toHaveCount(3);
  });

  test("single-event timeline renders without a dangling connector", async ({ page }) => {
    const list = page.getByTestId("timeline-single");
    await expect(list.locator(".timeline-item")).toHaveCount(1);
    const hasConnector = await list
      .locator(".timeline-item")
      .first()
      .evaluate((el) => getComputedStyle(el, "::before").content !== "none");
    expect(hasConnector).toBe(false);
  });

  test("long-description event wraps within timeline-content without overflow", async ({
    page,
  }) => {
    const content = page.getByTestId("timeline-long-description").locator(".timeline-content").first();
    const overflow = await content.evaluate((el) => {
      return el.scrollWidth <= el.clientWidth + 1;
    });
    expect(overflow).toBe(true);
  });

  test("matches visual baseline for all three examples", async ({ page }) => {
    await expect(page.getByTestId("timeline-demo-wrapper")).toHaveScreenshot("timeline-all.png");
  });
});
