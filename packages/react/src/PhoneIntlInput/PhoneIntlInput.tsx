import { forwardRef, useId } from "react";
import * as phoneIntl from "../../../../shared/validators/phone-intl";
import { LocalizedInputField, type LocalizedInputFieldProps } from "../LocalizedInput/LocalizedInputField";
import { Select } from "../Select/Select";

export interface PhoneIntlInputProps extends Omit<LocalizedInputFieldProps, "config"> {
  countryCode: string;
  onCountryChange?: (countryCode: string) => void;
}

// contracts/international-fields.contract.md — international phone
// (FR-015). Unlike every other component in this feature, validation is
// parameterized by the selected country (data-model.md "International
// Phone's variant shape") — a fresh config bound to the current
// `countryCode` is built each render rather than reusing a single-arg
// `CodeTypeConfig` object, since `useValidatedInput` only reads `config`
// during render (no stale-closure risk from rebuilding it every time).
export const PhoneIntlInput = forwardRef<HTMLInputElement, PhoneIntlInputProps>(function PhoneIntlInput(
  { countryCode, onCountryChange, label, ...rest },
  ref,
) {
  const selectId = useId();
  const callingCode = phoneIntl.getCountryEntry(countryCode).callingCode;
  const config = {
    format: (raw: string) => phoneIntl.format(raw, countryCode),
    validate: (raw: string) => phoneIntl.validate(raw, countryCode),
    isComplete: (raw: string) => phoneIntl.isComplete(raw, countryCode),
  };

  return (
    <>
      <Select
        id={selectId}
        label="Country"
        value={countryCode}
        onChange={(event) => onCountryChange?.(event.target.value)}
        options={phoneIntl.COUNTRY_PHONE_TABLE.map((c) => ({
          value: c.countryCode,
          label: `${c.displayName} (${c.callingCode})`,
        }))}
      />
      {/* Calling code is display-only chrome, never part of the input's
          own value — see phone-intl.ts's format() comment for why. */}
      <p className="text-sm text-neutral-600">Calling code: {callingCode}</p>
      <LocalizedInputField ref={ref} config={config} label={label} {...rest} />
    </>
  );
});
