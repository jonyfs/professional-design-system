import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Runs against the React test harness (tests/react-harness/
// localized-inputs.html) — mirrors tests/e2e/localized-inputs.spec.ts's
// assertions against the React components instead of the static HTML
// wiring, proving both surfaces share correct behavior via the same
// shared/validators/* modules (research.md R1).
const HARNESS_URL = "http://localhost:5174/localized-inputs.html";

test.describe("Localized Inputs (React package)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("CPF formats as-you-type and accepts a known-valid value", async ({ page }) => {
    const input = page.locator('[data-testid="field-cpf"] input');
    await input.fill("52998224725");
    await expect(input).toHaveValue("529.982.247-25");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("CPF rejects an all-repeated-digit value", async ({ page }) => {
    const wrapper = page.locator('[data-testid="field-cpf"]');
    const input = wrapper.locator("input");
    await input.fill("11111111111");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(wrapper.locator("p")).toHaveText("CPF cannot be a single digit repeated.");
  });

  test("CNPJ formats and accepts a known-valid value", async ({ page }) => {
    const input = page.locator('[data-testid="field-cnpj"] input');
    await input.fill("11222333000181");
    await expect(input).toHaveValue("11.222.333/0001-81");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("CEP formats to 00000-000", async ({ page }) => {
    const input = page.locator('[data-testid="field-cep"] input');
    await input.fill("12345678");
    await expect(input).toHaveValue("12345-678");
  });

  test("Brazilian phone auto-detects mobile vs. landline", async ({ page }) => {
    const input = page.locator('[data-testid="field-phone-br"] input');
    await input.fill("11987654321");
    await expect(input).toHaveValue("(11) 98765-4321");
  });

  test("Título de Eleitor rejects a structurally invalid value", async ({ page }) => {
    const input = page.locator('[data-testid="field-titulo-eleitor"] input');
    await input.fill("123456789012");
    await expect(input).toHaveAttribute("aria-invalid", "true");
  });

  test("PIS/PASEP formats as 000.00000.00-0", async ({ page }) => {
    const input = page.locator('[data-testid="field-pis-pasep"] input');
    await input.fill("12065392888");
    await expect(input).toHaveValue("120.65392.88-8");
  });

  test("Vehicle plate recognizes both legacy and Mercosul patterns", async ({ page }) => {
    const legacy = page.locator('[data-testid="field-vehicle-plate"] input');
    await legacy.fill("ABC1234");
    await expect(legacy).toHaveValue("ABC-1234");
    await legacy.fill("ABC1D23");
    await expect(legacy).toHaveValue("ABC1D23");
    await expect(legacy).not.toHaveAttribute("aria-invalid", "true");
  });

  test("IBAN normalizes and validates an official test value", async ({ page }) => {
    const input = page.locator('[data-testid="field-iban"] input');
    await input.fill("DE89370400440532013000");
    await expect(input).toHaveValue("DE89 3704 0044 0532 0130 00");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("Card number groups into 4-digit blocks and rejects a Luhn-invalid value", async ({ page }) => {
    const input = page.locator('[data-testid="field-card-number"] input');
    await input.fill("4111111111111112");
    await expect(input).toHaveValue("4111 1111 1111 1112");
    await expect(input).toHaveAttribute("aria-invalid", "true");
  });

  test("International phone validates against the selected country and re-validates on country change", async ({
    page,
  }) => {
    const wrapper = page.locator('[data-testid="field-phone-intl"]');
    const countrySelect = wrapper.locator("select");
    const input = wrapper.locator("input");

    await countrySelect.selectOption("US");
    await input.fill("1234567890"); // 10 digits — valid for US (exactly 10)
    await expect(input).not.toHaveAttribute("aria-invalid", "true");

    await countrySelect.selectOption("PT"); // Portugal requires exactly 9
    await input.blur();
    await expect(input).toHaveAttribute("aria-invalid", "true");
  });

  test("does not flag an empty, non-required field as invalid", async ({ page }) => {
    const input = page.locator('[data-testid="field-cnpj"] input');
    await input.click();
    await input.blur();
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });
});
