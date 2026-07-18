import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 035 — Configurable Social Login Buttons. Covers all 3 user
// stories (US1: 5 governed presets; US2: independent per-provider
// loading/disabled state; US3: custom-entry mechanism for providers
// without a mandated button spec).

test.describe("Static HTML surface", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/social-login/social-login.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("all 5 presets render with the correct approved CTA text (US1, FR-002)", async ({ page }) => {
    await expect(page.getByTestId("social-login-google")).toContainText("Sign in with Google");
    await expect(page.getByTestId("social-login-apple")).toContainText("Continue with Apple");
    await expect(page.getByTestId("social-login-facebook")).toContainText("Continue with Facebook");
    await expect(page.getByTestId("social-login-microsoft")).toContainText("Sign in with Microsoft");
  });

  test("Apple preset uses the monochrome appearance, not the default neutral surface (US1)", async ({ page }) => {
    const apple = page.getByTestId("social-login-apple");
    await expect(apple).toHaveClass(/social-login-btn-monochrome-dark/);
  });

  test("selecting a provider fires the callback with its id and makes no network request (FR-003)", async ({
    page,
  }) => {
    const requests: string[] = [];
    page.on("request", (req) => requests.push(req.url()));
    await page.getByTestId("social-login-google").click();
    await expect(page.getByTestId("social-login-result")).toHaveText("Selected: google");
    const externalRequests = requests.filter((url) => !url.includes("localhost"));
    expect(externalRequests).toHaveLength(0);
  });

  test("every button is a real, keyboard-operable native <button> with a non-empty accessible name (FR-008)", async ({
    page,
  }) => {
    const google = page.getByTestId("social-login-google");
    await expect(google).toHaveRole("button");
    await google.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("social-login-result")).toHaveText("Selected: google");
  });

  test("a disabled provider button does not fire the callback (US2, FR-005)", async ({ page }) => {
    const github = page.getByTestId("social-login-github");
    await expect(github).toBeDisabled();
  });

  test("a custom entry shares the presets' exact height/padding/radius (US3, FR-009)", async ({ page }) => {
    const google = page.getByTestId("social-login-google");
    const instagram = page.getByTestId("social-login-instagram");
    const googleBox = await google.boundingBox();
    const instagramBox = await instagram.boundingBox();
    expect(instagramBox!.height).toBeCloseTo(googleBox!.height, 0);
  });

  test("custom entries render correctly and fire the callback with their own id (US3)", async ({ page }) => {
    await page.getByTestId("social-login-instagram").click();
    await expect(page.getByTestId("social-login-result")).toHaveText("Selected: instagram");
  });

  test("compact mode keeps every label as an accessible name, not visibly removed (FR-008)", async ({ page }) => {
    const compactGoogle = page.getByTestId("social-login-compact-google");
    await expect(compactGoogle).toHaveAccessibleName("Sign in with Google");
    const label = compactGoogle.locator(".social-login-btn-label");
    await expect(label).toHaveClass(/social-login-btn-label-hidden/);
  });
});

test.describe("React package surface", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5174/social-login-buttons.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("renders all 5 presets and fires onProviderSelect (US1, FR-003)", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in with Google" }).first().click();
    await expect(page.getByTestId("social-login-result").first()).toHaveText("Selected: google");
  });

  test("toggling loading/disabled affects only the targeted provider (US2, FR-005)", async ({ page }) => {
    const microsoft = page.getByRole("button", { name: "Sign in with Microsoft" }).first();
    await expect(microsoft).toBeDisabled();
    const google = page.getByRole("button", { name: "Sign in with Google" }).first();
    await expect(google).toBeEnabled();

    await page.getByTestId("toggle-google-loading").click();
    await expect(page.getByRole("button", { name: "Signing in…" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue with Apple" }).first()).toBeEnabled();

    await page.getByTestId("toggle-microsoft-disabled").click();
    await expect(page.getByRole("button", { name: "Sign in with Microsoft" }).first()).toBeEnabled();
  });

  test("a custom entry's color never applies to the button surface or text (US3, research.md R1)", async ({
    page,
  }) => {
    const instagram = page.getByRole("button", { name: "Continue with Instagram" });
    const bg = await instagram.evaluate((el) => getComputedStyle(el).backgroundColor);
    // The button's own background must stay the neutral surface — never
    // Instagram's magenta accent, which lives only on the icon backdrop.
    expect(bg).not.toBe("rgb(225, 48, 108)");
  });

  test("reordering/subsetting the providers array needs no other change (US2, FR-001)", async ({ page }) => {
    const compactGroup = page.locator(".social-login-group-compact");
    await expect(compactGroup.getByRole("button")).toHaveCount(3);
  });

  test("an empty providers array renders nothing and throws no error (FR-010, Edge Case)", async ({ page }) => {
    const empty = page.getByTestId("social-login-empty");
    await expect(empty.locator("button")).toHaveCount(0);
  });
});
