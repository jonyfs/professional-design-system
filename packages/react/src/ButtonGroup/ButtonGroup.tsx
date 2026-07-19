import { Fragment, useId } from "react";

export interface ButtonGroupOption {
  /** Submitted value + radio `value` attribute. */
  value: string;
  /** Visible segment text. */
  label: string;
  /** Renders the segment disabled (never checkable, dimmed). */
  disabled?: boolean;
}

export interface ButtonGroupProps {
  /** The selectable segments, rendered left-to-right as connected buttons. */
  options: ButtonGroupOption[];
  /** Shared `name` for the underlying radio inputs (roving single-select). */
  name: string;
  /** Accessible name for the `role="group"` container. */
  label: string;
  /** Controlled selected value. Omit for uncontrolled usage. */
  value?: string;
  /** Initial selected value when uncontrolled. */
  defaultValue?: string;
  /** Fires with the newly-selected value. */
  onChange?: (value: string) => void;
  /** Prefix for generated input ids (defaults to a stable useId). */
  idPrefix?: string;
  "data-testid"?: string;
}

// React port of src/components/button-group/button-group.html. Zero-JS
// segmented control: native radio inputs sharing one `name`, visually hidden
// (`sr-only`) and styled through their adjacent `.button-group-segment`
// labels. Single-select, roving checked state, and disabled-segment
// arrow-key skipping are all native radio-group behaviors — no JS required.
export function ButtonGroup({
  options,
  name,
  label,
  value,
  defaultValue,
  onChange,
  idPrefix,
  "data-testid": testId,
}: ButtonGroupProps) {
  const generatedId = useId();
  const prefix = idPrefix ?? generatedId;
  const isControlled = value !== undefined;

  return (
    <div data-testid={testId} className="button-group" role="group" aria-label={label}>
      {options.map((option) => {
        const inputId = `${prefix}-${option.value}`;
        return (
          <Fragment key={option.value}>
            <input
              type="radio"
              name={name}
              id={inputId}
              value={option.value}
              className="sr-only"
              disabled={option.disabled}
              checked={isControlled ? value === option.value : undefined}
              defaultChecked={isControlled ? undefined : defaultValue === option.value}
              onChange={() => onChange?.(option.value)}
            />
            <label htmlFor={inputId} className="button-group-segment">
              {option.label}
            </label>
          </Fragment>
        );
      })}
    </div>
  );
}
