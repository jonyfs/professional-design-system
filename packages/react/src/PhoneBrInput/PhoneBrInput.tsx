import { forwardRef } from "react";
import * as phoneBr from "../../../../shared/validators/phone-br";
import { LocalizedInputField, type LocalizedInputFieldProps } from "../LocalizedInput/LocalizedInputField";

export type PhoneBrInputProps = Omit<LocalizedInputFieldProps, "config">;

// contracts/core-brazilian-fields.contract.md — Brazilian phone (FR-004),
// landline (10 digits) vs. mobile (11 digits) auto-detected by length.
export const PhoneBrInput = forwardRef<HTMLInputElement, PhoneBrInputProps>(function PhoneBrInput(props, ref) {
  return <LocalizedInputField ref={ref} config={phoneBr} inputMode="numeric" {...props} />;
});
