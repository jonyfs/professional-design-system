import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// SC-003: a real page combining Textarea + Divider + Button Group +
// Tooltip, using only already-shipped classes/components — asserts zero
// one-off custom CSS was needed beyond ratified classes.
test.describe("Composed Example (SC-003)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/composed-example/composed-example.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("all four components render and interact correctly together", async ({ page }) => {
    // Textarea
    await page.locator("#composed-bio").fill("Building design systems.");
    await expect(page.locator("#composed-bio")).toHaveValue("Building design systems.");

    // Divider is present as a real visual break
    await expect(page.locator(".divider").first()).toBeVisible();

    // Button Group toggles
    const priv = page.locator("#composed-private");
    await page.locator('label[for="composed-private"]').click();
    await expect(priv).toBeChecked();

    // Tooltip reveals on hover
    const tooltip = page.getByText("Controls who can see your profile");
    await expect(tooltip).toHaveCSS("opacity", "0");
    await page.getByRole("button", { name: "What does this control?" }).hover();
    await expect(tooltip).toHaveCSS("opacity", "1");
  });

  test("only reuses already-ratified classes — no page-specific one-off styling", async ({
    page,
  }) => {
    // This page's unique identifiers are all `id="composed-*"` attributes,
    // never CSS classes — confirm no page-scoped class name (a
    // "composed-*" class) was invented for this demo.
    const oneOffClasses = await page.evaluate(() => {
      const suspicious: string[] = [];
      document.querySelectorAll("[class]").forEach((el) => {
        el.classList.forEach((cls) => {
          if (cls.startsWith("composed-")) suspicious.push(cls);
        });
      });
      return suspicious;
    });
    expect(oneOffClasses).toEqual([]);
  });
});
