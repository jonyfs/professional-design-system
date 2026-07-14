import { forwardRef } from "react";
import * as pisPasep from "../../../../shared/validators/pis-pasep";
import { LocalizedInputField, type LocalizedInputFieldProps } from "../LocalizedInput/LocalizedInputField";

export type PisPasepInputProps = Omit<LocalizedInputFieldProps, "config">;

// contracts/extended-brazilian-fields.contract.md — PIS/PASEP/NIT (FR-011).
export const PisPasepInput = forwardRef<HTMLInputElement, PisPasepInputProps>(function PisPasepInput(props, ref) {
  return <LocalizedInputField ref={ref} config={pisPasep} inputMode="numeric" {...props} />;
});
