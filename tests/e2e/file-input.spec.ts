import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

test.describe("File Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/file-input/file-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("the native input is reachable via Tab and carries the correct accept attribute", async ({
    page,
  }) => {
    const input = page.getByTestId("file-input-native");
    await expect(input).toHaveAttribute("accept", ".png,.jpg,.jpeg,.pdf");
    await page.getByRole("link", { name: "← Back to gallery" }).focus();
    await page.keyboard.press("Tab");
    await expect(input).toBeFocused();
  });

  test("focus-visible outline applies to the drop-zone content when the input is focused (regression: DOM order + sibling-selector fragmentation)", async ({
    page,
  }) => {
    const input = page.getByTestId("file-input-native");
    await input.focus();
    const content = page.getByTestId("file-drop-zone").locator(".file-drop-zone-content");
    const outlineStyle = await content.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outlineStyle).not.toBe("none");
  });

  test("selecting a file makes the filename visible with no CSP violations", async ({ page }) => {
    await expectNoConsoleErrors(page, async () => {
      const input = page.getByTestId("file-input-native");
      await input.setInputFiles({
        name: "invoice.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("test content"),
      });
      const filename = page.getByTestId("file-input-filename");
      await expect(filename).toBeVisible();
      await expect(filename).toHaveText("invoice.pdf");
    });
  });

  test("a disabled input dims the surrounding drop-zone content", async ({ page }) => {
    const input = page.getByTestId("file-input-native-disabled");
    await expect(input).toBeDisabled();
    const content = page.getByTestId("file-drop-zone-disabled").locator(".file-drop-zone-content");
    const opacity = await content.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeLessThan(1);
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("file-input-demo-wrapper")).toHaveScreenshot(
      "file-input-all.png",
    );
  });
});
