import { forwardRef } from "react";
import * as vehiclePlate from "../../../../shared/validators/vehicle-plate";
import { LocalizedInputField, type LocalizedInputFieldProps } from "../LocalizedInput/LocalizedInputField";

export type VehiclePlateInputProps = Omit<LocalizedInputFieldProps, "config">;

// contracts/extended-brazilian-fields.contract.md — vehicle plate (FR-012),
// legacy (AAA-0000) vs. Mercosul (AAA0A00), format-only.
export const VehiclePlateInput = forwardRef<HTMLInputElement, VehiclePlateInputProps>(
  function VehiclePlateInput(props, ref) {
    return <LocalizedInputField ref={ref} config={vehiclePlate} {...props} />;
  },
);
