import { applyMask, MASK_PRESETS } from "../../../../shared/input-mask";

export interface InputMaskProps {
  label?: string;
  preset?: keyof typeof MASK_PRESETS;
  pattern?: string;
  value: string;
  onChange: (value: string) => void;
  "data-testid"?: string;
}

// React port of src/scripts/input-mask.js — reuses shared/input-mask's
// applyMask/MASK_PRESETS (contracts/input-mask.contract.md).
export function InputMask({ label, preset, pattern, value, onChange, "data-testid": testId }: InputMaskProps) {
  const activePattern = preset ? MASK_PRESETS[preset] : pattern;
  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-neutral-900">{label}</label>}
      <input
        data-testid={testId}
        className="input-mask"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          onChange(activePattern ? applyMask(activePattern, digits) : e.target.value);
        }}
      />
    </div>
  );
}
