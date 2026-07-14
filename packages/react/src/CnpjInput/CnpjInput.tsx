import { forwardRef } from "react";
import * as cnpj from "../../../../shared/validators/cnpj";
import { LocalizedInputField, type LocalizedInputFieldProps } from "../LocalizedInput/LocalizedInputField";

export type CnpjInputProps = Omit<LocalizedInputFieldProps, "config">;

// contracts/core-brazilian-fields.contract.md — CNPJ (FR-002, FR-005).
export const CnpjInput = forwardRef<HTMLInputElement, CnpjInputProps>(function CnpjInput(props, ref) {
  return <LocalizedInputField ref={ref} config={cnpj} inputMode="numeric" {...props} />;
});
