import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CardNumberInput,
  CepInput,
  CnpjInput,
  CpfInput,
  IbanInput,
  PhoneBrInput,
  PhoneIntlInput,
  PisPasepInput,
  TituloEleitorInput,
  VehiclePlateInput,
} from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

function PhoneIntlDemo() {
  const [countryCode, setCountryCode] = useState("BR");
  return (
    <div data-testid="field-phone-intl" className="space-y-1">
      <PhoneIntlInput label="International phone" countryCode={countryCode} onCountryChange={setCountryCode} />
    </div>
  );
}

function LocalizedInputsDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Localized Inputs</h1>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Core Brazilian Fields (US1)</h2>
      <div className="mt-4 grid max-w-md gap-4">
        <div data-testid="field-cpf" className="space-y-1">
          <CpfInput label="CPF" />
        </div>
        <div data-testid="field-cnpj" className="space-y-1">
          <CnpjInput label="CNPJ" />
        </div>
        <div data-testid="field-cep" className="space-y-1">
          <CepInput label="CEP" />
        </div>
        <div data-testid="field-phone-br" className="space-y-1">
          <PhoneBrInput label="Phone (Brazil)" />
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Extended Brazilian Identifiers (US2)</h2>
      <div className="mt-4 grid max-w-md gap-4">
        <div data-testid="field-titulo-eleitor" className="space-y-1">
          <TituloEleitorInput label="Título de Eleitor" />
        </div>
        <div data-testid="field-pis-pasep" className="space-y-1">
          <PisPasepInput label="PIS/PASEP" />
        </div>
        <div data-testid="field-vehicle-plate" className="space-y-1">
          <VehiclePlateInput label="Vehicle plate" />
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">International Codes (US3)</h2>
      <div className="mt-4 grid max-w-md gap-4">
        <div data-testid="field-iban" className="space-y-1">
          <IbanInput label="IBAN" />
        </div>
        <div data-testid="field-card-number" className="space-y-1">
          <CardNumberInput label="Card number" />
        </div>
        <PhoneIntlDemo />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocalizedInputsDemo />
  </StrictMode>,
);
