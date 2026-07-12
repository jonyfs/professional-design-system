import { test, expect } from "@playwright/test";
import { expectNoA11yViolations, expectNoConsoleErrors } from "./a11y-helper";

test.describe("PinInput", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/pin-input/pin-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("typing a digit advances focus to the next box", async ({ page }) => {
    const box0 = page.getByTestId("pin-box-0");
    const box1 = page.getByTestId("pin-box-1");
    await box0.focus();
    await page.keyboard.type("5");
    await expect(box0).toHaveValue("5");
    await expect(box1).toBeFocused();
  });

  test("pasting a full code distributes correctly across all boxes", async ({ page, browserName }) => {
    // Firefox does not honor a script-constructed ClipboardEvent's
    // `clipboardData` init property (confirmed empirically: `getData`
    // always returns "" for a synthetic event, even though real
    // user-initiated paste events carry real clipboardData in every
    // engine, including Firefox) — a test-simulation limitation, not a
    // pin-input.js defect, matching feature 014's precedent of adjusting
    // a test for a genuine cross-engine simulation difference rather than
    // the implementation (Button Group's keyboard-nav WebKit fix).
    test.skip(browserName === "firefox", "Firefox does not support synthetic ClipboardEvent.clipboardData");
    await expectNoConsoleErrors(page, async () => {
      await page.getByTestId("pin-box-0").focus();
      await page.evaluate(() => {
        const box0 = document.querySelector('[data-testid="pin-box-0"]') as HTMLInputElement;
        const clipboardData = new DataTransfer();
        clipboardData.setData("text", "123456");
        const event = new ClipboardEvent("paste", { clipboardData, bubbles: true, cancelable: true });
        box0.dispatchEvent(event);
      });
      for (let i = 0; i < 6; i++) {
        await expect(page.getByTestId(`pin-box-${i}`)).toHaveValue(String(i + 1));
      }
    });
  });

  test("pasting starting mid-sequence offsets into the remaining boxes only, leaving earlier boxes untouched", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === "firefox", "Firefox does not support synthetic ClipboardEvent.clipboardData");
    await expectNoConsoleErrors(page, async () => {
      await page.getByTestId("pin-box-2").focus();
      await page.evaluate(() => {
        const box2 = document.querySelector('[data-testid="pin-box-2"]') as HTMLInputElement;
        const clipboardData = new DataTransfer();
        clipboardData.setData("text", "3456");
        const event = new ClipboardEvent("paste", { clipboardData, bubbles: true, cancelable: true });
        box2.dispatchEvent(event);
      });
      await expect(page.getByTestId("pin-box-0")).toHaveValue("");
      await expect(page.getByTestId("pin-box-1")).toHaveValue("");
      for (let i = 2; i < 6; i++) {
        await expect(page.getByTestId(`pin-box-${i}`)).toHaveValue(String(i + 1));
      }
    });
  });

  test("Backspace on an empty box moves focus to the previous box", async ({ page }) => {
    const box2 = page.getByTestId("pin-box-2");
    const box1 = page.getByTestId("pin-box-1");
    await box2.focus();
    await page.keyboard.press("Backspace");
    await expect(box1).toBeFocused();
  });

  test("Backspace on a filled box clears its digit in place without moving focus", async ({
    page,
  }) => {
    const box1 = page.getByTestId("pin-box-1");
    const box2 = page.getByTestId("pin-box-2");
    await box2.focus();
    await page.keyboard.type("7");
    await expect(box2).toHaveValue("7");
    await box1.focus();
    await page.keyboard.type("9");
    await expect(box1).toHaveValue("9");
    await box2.focus();
    await page.keyboard.press("Backspace");
    await expect(box2).toHaveValue("");
    await expect(box2).toBeFocused();
  });

  test("a paste with non-numeric or excess-length content is rejected/truncated", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === "firefox", "Firefox does not support synthetic ClipboardEvent.clipboardData");
    await page.getByTestId("pin-box-0").focus();
    await page.evaluate(() => {
      const box0 = document.querySelector('[data-testid="pin-box-0"]') as HTMLInputElement;
      const clipboardData = new DataTransfer();
      clipboardData.setData("text", "12ab3456789");
      const event = new ClipboardEvent("paste", { clipboardData, bubbles: true, cancelable: true });
      box0.dispatchEvent(event);
    });
    for (let i = 0; i < 6; i++) {
      const expected = ["1", "2", "3", "4", "5", "6"][i];
      await expect(page.getByTestId(`pin-box-${i}`)).toHaveValue(expected);
    }
  });

  test("matches visual baseline", async ({ page }) => {
    await expect(page.getByTestId("pin-input")).toHaveScreenshot("pin-input-all.png");
  });
});
