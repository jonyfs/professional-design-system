// Static-HTML wiring for every localized input in feature 019 — one
// generic per-field handler driven by `data-code-type`, reusing the exact
// same shared/validators/* modules the React components consume (no
// algorithm hand-typed twice, research.md R1). Mirrors the React side's
// useValidatedInput timing rule: validity is only evaluated once the
// value reaches its code type's expected length or the field blurs
// (FR-007), and an empty non-required field is never reported invalid
// (FR-008).
import * as cpf from "../../shared/validators/cpf.ts";
import * as cnpj from "../../shared/validators/cnpj.ts";
import * as cep from "../../shared/validators/cep.ts";
import * as phoneBr from "../../shared/validators/phone-br.ts";
import * as tituloEleitor from "../../shared/validators/titulo-eleitor.ts";
import * as pisPasep from "../../shared/validators/pis-pasep.ts";
import * as vehiclePlate from "../../shared/validators/vehicle-plate.ts";
import * as iban from "../../shared/validators/iban.ts";
import * as cardNumber from "../../shared/validators/card-number.ts";
import * as phoneIntl from "../../shared/validators/phone-intl.ts";

const CODE_TYPES = {
  cpf,
  cnpj,
  cep,
  "phone-br": phoneBr,
  "titulo-eleitor": tituloEleitor,
  "pis-pasep": pisPasep,
  "vehicle-plate": vehiclePlate,
  iban,
  "card-number": cardNumber,
};

function applyValidity(input, errorEl, result) {
  if (result === null) {
    input.removeAttribute("aria-invalid");
    input.classList.remove("ring-error", "focus:ring-error");
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
    return;
  }
  if (result.valid) {
    input.removeAttribute("aria-invalid");
    input.classList.remove("ring-error", "focus:ring-error");
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  } else {
    input.setAttribute("aria-invalid", "true");
    input.classList.add("ring-error", "focus:ring-error");
    errorEl.textContent = result.reason ?? "Invalid value.";
    errorEl.classList.remove("hidden");
  }
}

function wireField(input) {
  const codeType = input.dataset.codeType;
  const module = CODE_TYPES[codeType];
  if (!module) return;

  const errorId = input.getAttribute("aria-describedby");
  const errorEl = errorId ? document.getElementById(errorId) : null;
  const required = input.hasAttribute("required");
  let touched = false;

  const evaluate = () => {
    const value = input.value;
    if (!errorEl) return;
    if (value.length === 0) {
      applyValidity(input, errorEl, required && touched ? { valid: false, reason: "This field is required." } : null);
      return;
    }
    if (module.isComplete(value) || touched) {
      applyValidity(input, errorEl, module.validate(value));
    } else {
      applyValidity(input, errorEl, null);
    }
  };

  input.addEventListener("input", () => {
    input.value = module.format(input.value);
    evaluate();
  });
  input.addEventListener("blur", () => {
    touched = true;
    evaluate();
  });
}

function wirePhoneIntlField(input) {
  const select = document.querySelector(`[data-phone-intl-country-for="${input.id}"]`);
  const errorId = input.getAttribute("aria-describedby");
  const errorEl = errorId ? document.getElementById(errorId) : null;
  const callingCodeEl = document.getElementById(`${input.id}-calling-code`);
  let touched = false;

  const updateCallingCode = () => {
    if (!callingCodeEl || !select) return;
    const entry = phoneIntl.getCountryEntry(select.value);
    callingCodeEl.textContent = `Calling code: ${entry.callingCode}`;
  };
  updateCallingCode();
  select?.addEventListener("change", updateCallingCode);

  const evaluate = () => {
    const countryCode = select?.value ?? "BR";
    const value = input.value;
    if (!errorEl) return;
    if (value.length === 0) {
      applyValidity(input, errorEl, null);
      return;
    }
    if (phoneIntl.isComplete(value, countryCode) || touched) {
      applyValidity(input, errorEl, phoneIntl.validate(value, countryCode));
    } else {
      applyValidity(input, errorEl, null);
    }
  };

  input.addEventListener("input", () => {
    const countryCode = select?.value ?? "BR";
    input.value = phoneIntl.format(input.value, countryCode);
    evaluate();
  });
  input.addEventListener("blur", () => {
    touched = true;
    evaluate();
  });
  select?.addEventListener("change", evaluate);
}

export function initLocalizedInputs() {
  document.querySelectorAll("[data-code-type]").forEach(wireField);
  document.querySelectorAll("[data-phone-intl-input]").forEach(wirePhoneIntlField);
}
