import { forwardRef } from "react";
import * as cep from "../../../../shared/validators/cep";
import { LocalizedInputField, type LocalizedInputFieldProps } from "../LocalizedInput/LocalizedInputField";

export type CepInputProps = Omit<LocalizedInputFieldProps, "config">;

// contracts/core-brazilian-fields.contract.md — CEP (FR-003), format-only.
export const CepInput = forwardRef<HTMLInputElement, CepInputProps>(function CepInput(props, ref) {
  return <LocalizedInputField ref={ref} config={cep} inputMode="numeric" {...props} />;
});
