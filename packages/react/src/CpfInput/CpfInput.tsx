import { forwardRef } from "react";
import * as cpf from "../../../../shared/validators/cpf";
import { LocalizedInputField, type LocalizedInputFieldProps } from "../LocalizedInput/LocalizedInputField";

export type CpfInputProps = Omit<LocalizedInputFieldProps, "config">;

// contracts/core-brazilian-fields.contract.md — CPF (FR-001, FR-005).
export const CpfInput = forwardRef<HTMLInputElement, CpfInputProps>(function CpfInput(props, ref) {
  return <LocalizedInputField ref={ref} config={cpf} inputMode="numeric" {...props} />;
});
