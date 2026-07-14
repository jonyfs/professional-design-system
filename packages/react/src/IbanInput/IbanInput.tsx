import { forwardRef } from "react";
import * as iban from "../../../../shared/validators/iban";
import { LocalizedInputField, type LocalizedInputFieldProps } from "../LocalizedInput/LocalizedInputField";

export type IbanInputProps = Omit<LocalizedInputFieldProps, "config">;

// contracts/international-fields.contract.md — IBAN (FR-013), mod-97 checksum.
export const IbanInput = forwardRef<HTMLInputElement, IbanInputProps>(function IbanInput(props, ref) {
  return <LocalizedInputField ref={ref} config={iban} {...props} />;
});
