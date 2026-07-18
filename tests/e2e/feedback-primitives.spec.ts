import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 029 — Feedback Primitives. Covers all 3 user stories (US1
// RingProgress/SemiCircleProgress, US2 Notification Center, US3 Password
// Strength Meter). Notification (item 47 of feature 018's inventory) is
// explicitly excluded — Toast's existing .toast/.toast-stack already
// cover it (research.md R1) — so this suite has no Toast coverage of its
// own; that's tested by toast.spec.ts already.

test.describe("RingProgress", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/ring-progress/ring-progress.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("0% renders a fully unfilled arc", async ({ page }) => {
    const ring = page.getByTestId("circular-progress-0");
    await expect(ring).toHaveAttribute("aria-valuenow", "0");
    const fill = ring.locator(".circular-progress-fill");
    const circumference = await fill.getAttribute("data-circumference");
    // Reads the raw CSSOM-assigned value directly (matching progress.spec.ts's
    // own .style.width pattern), not getComputedStyle — which reflects the
    // in-flight 300ms CSS transition and is flaky to assert against.
    const offset = await fill.evaluate((el) => (el as SVGElement).style.strokeDashoffset);
    expect(parseFloat(offset)).toBeCloseTo(parseFloat(circumference!), 1);
  });

  test("60% renders a partially filled arc", async ({ page }) => {
    const ring = page.getByTestId("circular-progress-60");
    await expect(ring).toHaveAttribute("aria-valuenow", "60");
    const fill = ring.locator(".circular-progress-fill");
    const circumference = parseFloat((await fill.getAttribute("data-circumference"))!);
    const offset = await fill.evaluate((el) => parseFloat((el as SVGElement).style.strokeDashoffset));
    expect(offset).toBeGreaterThan(0);
    expect(offset).toBeLessThan(circumference);
  });

  test("100% renders a fully filled, success-colored arc", async ({ page }) => {
    const ring = page.getByTestId("circular-progress-100");
    await expect(ring).toHaveAttribute("aria-valuenow", "100");
    const fill = ring.locator(".circular-progress-fill");
    await expect(fill).toHaveClass(/circular-progress-fill-success/);
    const offset = await fill.evaluate((el) => parseFloat((el as SVGElement).style.strokeDashoffset));
    expect(offset).toBeCloseTo(0, 1);
  });
});

test.describe("SemiCircleProgress", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/semi-circle-progress/semi-circle-progress.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("30% exposes the correct accessible value", async ({ page }) => {
    const gauge = page.getByTestId("semi-circle-progress-30");
    await expect(gauge).toHaveAttribute("aria-valuenow", "30");
  });

  test("75% renders a warning-colored, mostly filled arc", async ({ page }) => {
    const gauge = page.getByTestId("semi-circle-progress-75");
    await expect(gauge).toHaveAttribute("aria-valuenow", "75");
    const fill = gauge.locator(".circular-progress-fill");
    await expect(fill).toHaveClass(/circular-progress-fill-warning/);
    const circumference = parseFloat((await fill.getAttribute("data-circumference"))!);
    const offset = await fill.evaluate((el) => parseFloat((el as SVGElement).style.strokeDashoffset));
    expect(offset).toBeLessThan(circumference * 0.4);
  });
});

test.describe("Notification Center", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/notification-center/notification-center.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("badge count matches the number of unread items", async ({ page }) => {
    await expect(page.getByTestId("notification-badge")).toHaveText("2");
  });

  test("opening the panel lists all notifications, unread visually distinguished", async ({ page }) => {
    await page.getByTestId("notification-trigger").click();
    const panel = page.getByTestId("notification-panel");
    await expect(panel).toBeVisible();
    await expect(page.getByTestId("notification-item-1")).toHaveClass(/notification-center-item-unread/);
    await expect(page.getByTestId("notification-item-2")).toHaveClass(/notification-center-item-unread/);
    await expect(page.getByTestId("notification-item-3")).not.toHaveClass(/notification-center-item-unread/);
  });

  test("empty state shows a no-notifications message and no badge", async ({ page }) => {
    // Only the populated section renders a badge span at all — the empty
    // variant's markup has none (not merely zero-valued).
    await expect(page.getByTestId("notification-badge")).toHaveCount(1);
    await page.getByTestId("notification-trigger-empty").click();
    const panel = page.getByTestId("notification-panel-empty");
    await expect(panel).toBeVisible();
    await expect(page.getByTestId("notification-empty")).toHaveText("No notifications yet.");
  });
});

test.describe("Password Strength Meter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/password-strength-meter/password-strength-meter.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("empty input renders an unfilled, unlabeled meter", async ({ page }) => {
    const label = page.getByTestId("password-strength-label");
    await expect(label).toHaveText("");
  });

  test("a short lowercase-only password is scored weak", async ({ page }) => {
    await page.getByTestId("password-strength-input").fill("abc");
    const fill = page.getByTestId("password-strength-fill");
    await expect(fill).toHaveAttribute("data-level", "weak");
    await expect(page.getByTestId("password-strength-label")).toHaveText("Weak");
  });

  test("a long, mixed-character password is scored strong, never by color alone", async ({ page }) => {
    await page.getByTestId("password-strength-input").fill("Tr0ub4dor&3!XYZ");
    const fill = page.getByTestId("password-strength-fill");
    await expect(fill).toHaveAttribute("data-level", "strong");
    const label = page.getByTestId("password-strength-label");
    await expect(label).toHaveText("Strong");
    await expect(label).not.toBeEmpty();
  });

  test("fill width increases as strength increases", async ({ page }) => {
    const input = page.getByTestId("password-strength-input");
    const fill = page.getByTestId("password-strength-fill");

    // Reads the raw CSSOM-assigned value directly (matching progress.spec.ts's
    // own .style.width pattern), not boundingBox() — .progress-fill has a
    // 300ms width transition, so a pixel measurement taken immediately
    // after fill() is flaky against the in-flight animation.
    await input.fill("abc");
    const weakWidth = parseFloat(
      await fill.evaluate((el) => (el as HTMLElement).style.width),
    );

    await input.fill("Tr0ub4dor&3!XYZ");
    const strongWidth = parseFloat(
      await fill.evaluate((el) => (el as HTMLElement).style.width),
    );

    expect(strongWidth).toBeGreaterThan(weakWidth);
  });
});
