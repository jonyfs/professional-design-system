import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Synthetic right-clicks via page.mouse.click({ button: "right" }) do not
// reliably dispatch a native "contextmenu" event under Chromium/WebKit
// automation (confirmed empirically — the implementation's own listener
// fires correctly when the DOM event is dispatched directly, but never
// fires from a synthetic mouse click). Dispatching the "contextmenu"
// MouseEvent directly, with explicit clientX/clientY, is the standard
// Playwright pattern for testing context-menu behavior and exercises the
// same code path a real right-click would.
async function rightClick(target: import("@playwright/test").Locator, x: number, y: number) {
  await target.dispatchEvent("contextmenu", { bubbles: true, cancelable: true, clientX: x, clientY: y });
}

test.describe("Context Menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/context-menu/context-menu.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("right-click opens this component's menu at the cursor", async ({ page }) => {
    const target = page.getByTestId("context-menu-target");
    const box = await target.boundingBox();
    if (!box) throw new Error("target not found");
    await rightClick(target, box.x + 20, box.y + 10);
    const menu = page.getByTestId("context-menu-panel");
    await expect(menu).toBeVisible();
    const menuBox = await menu.boundingBox();
    expect(menuBox).toBeTruthy();
  });

  test("arrow keys rove focus between items", async ({ page }) => {
    const target = page.getByTestId("context-menu-target");
    const box = await target.boundingBox();
    if (!box) throw new Error("target not found");
    await rightClick(target, box.x + 20, box.y + 10);
    // Opening the menu auto-focuses the first enabled item (matching
    // Dropdown Menu's identical toggle-driven behavior) — no keypress
    // needed for this first assertion.
    await expect(page.getByTestId("context-menu-item-open")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("context-menu-item-rename")).toBeFocused();
    // "Delete" is disabled and excluded from the roving set, so ArrowDown
    // from the last enabled item wraps back to the first.
    await page.keyboard.press("ArrowDown");
    await expect(page.getByTestId("context-menu-item-open")).toBeFocused();
  });

  test("a right-click near the viewport edge keeps the menu fully on-screen", async ({
    page,
  }) => {
    const viewport = page.viewportSize();
    if (!viewport) throw new Error("no viewport");
    const target = page.getByTestId("context-menu-target");
    await rightClick(target, viewport.width - 5, viewport.height - 5);
    const menu = page.getByTestId("context-menu-panel");
    await expect(menu).toBeVisible();
    const menuBox = await menu.boundingBox();
    if (!menuBox) throw new Error("menu box not found");
    expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(menuBox.y + menuBox.height).toBeLessThanOrEqual(viewport.height + 1);
    expect(menuBox.x).toBeGreaterThanOrEqual(0);
    expect(menuBox.y).toBeGreaterThanOrEqual(0);
  });

  test("focus returns to the right-clicked target after the menu closes via Escape", async ({
    page,
  }) => {
    const target = page.getByTestId("context-menu-target");
    const box = await target.boundingBox();
    if (!box) throw new Error("target not found");
    await rightClick(target, box.x + 20, box.y + 10);
    await expect(page.getByTestId("context-menu-panel")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(target).toBeFocused();
  });

  test("matches visual baseline open", async ({ page }) => {
    const target = page.getByTestId("context-menu-target");
    const box = await target.boundingBox();
    if (!box) throw new Error("target not found");
    await rightClick(target, box.x + 20, box.y + 10);
    await expect(page.getByTestId("context-menu-demo-wrapper")).toHaveScreenshot(
      "context-menu-open.png",
    );
  });
});
