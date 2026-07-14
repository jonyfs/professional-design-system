import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Static HTML gallery — covers all 11 components from feature 019
// (specs/019-localized-input-primitives). One file per this catalog's
// convention would be 11 files; consolidated here since every component
// shares the identical wiring mechanism (src/scripts/localized-inputs.js)
// and the highest-value coverage is per-algorithm correctness plus the
// shared timing/paste/a11y behavior, not per-file boilerplate.

test.describe("CPF Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/cpf-input/cpf-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("formats as-you-type (SC-001)", async ({ page }) => {
    await page.locator("#cpf-input").fill("52998224725");
    await expect(page.locator("#cpf-input")).toHaveValue("529.982.247-25");
  });

  test("accepts a known-valid CPF (SC-003)", async ({ page }) => {
    await page.locator("#cpf-input").fill("11144477735");
    await expect(page.locator("#cpf-input")).not.toHaveAttribute("aria-invalid", "true");
  });

  test("rejects an all-repeated-digit CPF (FR-005, SC-002)", async ({ page }) => {
    const input = page.locator("#cpf-input");
    await input.fill("11111111111");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#cpf-input-error")).toHaveText("CPF cannot be a single digit repeated.");
  });

  test("rejects a syntactically well-formed but numerically wrong CPF", async ({ page }) => {
    const input = page.locator("#cpf-input");
    await input.fill("12345678900");
    await expect(input).toHaveAttribute("aria-invalid", "true");
  });

  test("does not flag an incomplete value as invalid before it reaches full length (FR-007)", async ({ page }) => {
    const input = page.locator("#cpf-input");
    await input.pressSequentially("529982"); // 6 of 11 digits, no blur
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("does not flag an empty, non-required field as invalid (FR-008)", async ({ page }) => {
    const input = page.locator("#cpf-input");
    await input.click();
    await input.blur();
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("normalizes an already-punctuated paste (FR-009, spec.md Edge Cases)", async ({ page }) => {
    const input = page.locator("#cpf-input");
    await input.evaluate((el: HTMLInputElement) => {
      el.focus();
      el.value = "529.982.247-25";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await expect(input).toHaveValue("529.982.247-25");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("error region is aria-live=polite (FR-019)", async ({ page }) => {
    await expect(page.locator("#cpf-input-error")).toHaveAttribute("aria-live", "polite");
  });

  test("clearing an invalid value back to valid removes the error (FR-006)", async ({ page }) => {
    const input = page.locator("#cpf-input");
    await input.fill("11111111111");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await input.fill("52998224725");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#cpf-input-error")).toBeEmpty();
  });
});

test.describe("CNPJ Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/cnpj-input/cnpj-input.html");
  });

  test("formats and accepts a known-valid CNPJ", async ({ page }) => {
    const input = page.locator("#cnpj-input");
    await input.fill("11222333000181");
    await expect(input).toHaveValue("11.222.333/0001-81");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("rejects an all-repeated-digit CNPJ", async ({ page }) => {
    const input = page.locator("#cnpj-input");
    await input.fill("11111111111111");
    await expect(input).toHaveAttribute("aria-invalid", "true");
  });
});

test.describe("CEP Input", () => {
  test("formats to 00000-000, no check-digit", async ({ page }) => {
    await page.goto("/src/components/cep-input/cep-input.html");
    const input = page.locator("#cep-input");
    await input.fill("12345678");
    await expect(input).toHaveValue("12345-678");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });
});

test.describe("Brazilian Phone Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/phone-br-input/phone-br-input.html");
  });

  test("formats a 10-digit value as a landline", async ({ page }) => {
    const input = page.locator("#phone-br-input");
    await input.fill("1123456789");
    await expect(input).toHaveValue("(11) 2345-6789");
  });

  test("formats an 11-digit value as a mobile number", async ({ page }) => {
    const input = page.locator("#phone-br-input");
    await input.fill("11987654321");
    await expect(input).toHaveValue("(11) 98765-4321");
  });
});

test.describe("Título de Eleitor Input", () => {
  test("rejects a structurally invalid value", async ({ page }) => {
    await page.goto("/src/components/titulo-eleitor-input/titulo-eleitor-input.html");
    const input = page.locator("#titulo-eleitor-input");
    await input.fill("123456789012");
    await expect(input).toHaveAttribute("aria-invalid", "true");
  });
});

test.describe("PIS/PASEP Input", () => {
  test("formats as 000.00000.00-0", async ({ page }) => {
    await page.goto("/src/components/pis-pasep-input/pis-pasep-input.html");
    const input = page.locator("#pis-pasep-input");
    await input.fill("12065392888");
    await expect(input).toHaveValue("120.65392.88-8");
  });
});

test.describe("Vehicle Plate Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/vehicle-plate-input/vehicle-plate-input.html");
  });

  test("formats the legacy pattern as AAA-0000", async ({ page }) => {
    const input = page.locator("#vehicle-plate-input");
    await input.fill("ABC1234");
    await expect(input).toHaveValue("ABC-1234");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("formats the Mercosul pattern as AAA0A00", async ({ page }) => {
    const input = page.locator("#vehicle-plate-input");
    await input.fill("ABC1D23");
    await expect(input).toHaveValue("ABC1D23");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });
});

test.describe("IBAN Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/iban-input/iban-input.html");
  });

  test("normalizes and validates an official test IBAN (SC-003)", async ({ page }) => {
    const input = page.locator("#iban-input");
    await input.fill("DE89370400440532013000");
    await expect(input).toHaveValue("DE89 3704 0044 0532 0130 00");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("rejects a mutated (checksum-invalid) IBAN (SC-002)", async ({ page }) => {
    const input = page.locator("#iban-input");
    await input.fill("DE89370400440532013001");
    await expect(input).toHaveAttribute("aria-invalid", "true");
  });
});

test.describe("Card Number Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/card-number-input/card-number-input.html");
  });

  test("groups into 4-digit blocks and accepts a known Luhn-valid test number", async ({ page }) => {
    const input = page.locator("#card-number-input");
    await input.fill("4111111111111111");
    await expect(input).toHaveValue("4111 1111 1111 1111");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("rejects a Luhn-invalid card number", async ({ page }) => {
    const input = page.locator("#card-number-input");
    await input.fill("4111111111111112");
    await expect(input).toHaveAttribute("aria-invalid", "true");
  });
});

test.describe("International Phone Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/phone-intl-input/phone-intl-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("validates a complete national number against the selected country's length (US3 AC3)", async ({ page }) => {
    await page.selectOption("#phone-intl-country", "US");
    const input = page.locator("#phone-intl-input");
    await input.fill("1234567890");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#phone-intl-input-calling-code")).toHaveText("Calling code: +1");
  });

  test("rejects a value outside the selected country's expected length", async ({ page }) => {
    await page.selectOption("#phone-intl-country", "US");
    const input = page.locator("#phone-intl-input");
    await input.fill("123");
    await input.blur();
    await expect(input).toHaveAttribute("aria-invalid", "true");
  });

  test("switching country re-validates against the new range", async ({ page }) => {
    await page.selectOption("#phone-intl-country", "BR");
    const input = page.locator("#phone-intl-input");
    await input.fill("11987654321"); // valid 11-digit BR mobile
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
    await page.selectOption("#phone-intl-country", "US");
    await input.blur();
    await expect(input).toHaveAttribute("aria-invalid", "true"); // 11 digits invalid for US (needs exactly 10)
  });
});
