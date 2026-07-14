import { forwardRef } from "react";
import * as cardNumber from "../../../../shared/validators/card-number";
import { LocalizedInputField, type LocalizedInputFieldProps } from "../LocalizedInput/LocalizedInputField";

export type CardNumberInputProps = Omit<LocalizedInputFieldProps, "config">;

// contracts/international-fields.contract.md — payment card (FR-014), Luhn checksum.
export const CardNumberInput = forwardRef<HTMLInputElement, CardNumberInputProps>(
  function CardNumberInput(props, ref) {
    return <LocalizedInputField ref={ref} config={cardNumber} inputMode="numeric" {...props} />;
  },
);
