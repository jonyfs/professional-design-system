export interface FloatLabelProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  "data-testid"?: string;
}

// Focus state is CSS-only (peer-focus); fill state is derived directly
// from the controlled `value` prop via `data-filled` rather than
// `:placeholder-shown` — a real cross-browser finding (Tailwind's
// auto-generated `:-moz-placeholder` fallback is unconditionally true
// in modern Firefox, see contracts/float-label.contract.md and
// src/scripts/float-label.js's matching fix on the static surface).
export function FloatLabel({ id, label, type = "text", value, onChange, "data-testid": testId }: FloatLabelProps) {
  return (
    <div data-testid={testId} className="float-label-wrapper" data-filled={value !== ""}>
      <input
        id={id}
        className="float-label-field peer"
        type={type}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <label htmlFor={id} className="float-label-text">
        {label}
      </label>
    </div>
  );
}
