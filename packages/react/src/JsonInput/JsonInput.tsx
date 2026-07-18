import { useState } from "react";

export interface JsonInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  "data-testid"?: string;
}

// React port of src/scripts/json-input.js — non-blocking JSON
// validity state (contracts/json-input.contract.md).
export function JsonInput({ label, value, onChange, "data-testid": testId }: JsonInputProps) {
  const [error, setError] = useState<string | null>(null);

  function handleChange(next: string) {
    onChange(next);
    if (!next.trim()) {
      setError(null);
      return;
    }
    try {
      JSON.parse(next);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-neutral-900">{label}</label>}
      <textarea
        data-testid={testId}
        className="json-input"
        aria-invalid={error !== null}
        aria-label={label}
        rows={4}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
      {error && (
        <p className="json-input-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
