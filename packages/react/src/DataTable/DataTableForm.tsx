import { useState, type FormEvent } from "react";
import { Modal } from "../Modal/Modal";
import { TextInput } from "../TextInput/TextInput";

export interface DataTableFieldDefinition {
  id: string;
  label: string;
  required?: boolean;
}

export interface DataTableFormProps {
  open: boolean;
  mode: "create" | "edit";
  fields: DataTableFieldDefinition[];
  initialValues?: Record<string, string>;
  /** Returns a fieldErrors map when invalid (non-empty), or an empty object when valid. */
  onValidate: (values: Record<string, string>) => Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
  onClose: () => void;
}

// contracts/crud-operations.contract.md — create/edit form inside Modal's
// existing chrome (research.md R7), fields built from TextInput (research.md
// R8), field-level errors that never discard the user's other values
// (FR-011), and an isDirty-gated discard-confirmation step (FR-018) shown
// inline rather than stacking a second Modal.
export function DataTableForm({
  open,
  mode,
  fields,
  initialValues,
  onValidate,
  onSubmit,
  onClose,
}: DataTableFormProps) {
  const emptyValues = Object.fromEntries(fields.map((f) => [f.id, ""]));
  const [values, setValues] = useState<Record<string, string>>(initialValues ?? emptyValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  const isDirty = Object.entries(values).some(([id, value]) => value !== (initialValues?.[id] ?? ""));

  const resetAndClose = () => {
    setValues(initialValues ?? emptyValues);
    setFieldErrors({});
    setConfirmingDiscard(false);
    onClose();
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      setConfirmingDiscard(true);
      return;
    }
    resetAndClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const errors = onValidate(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    onSubmit(values);
    resetAndClose();
  };

  return (
    <Modal open={open} onClose={handleCloseAttempt} title={mode === "create" ? "Add record" : "Edit record"}>
      {confirmingDiscard ? (
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">Discard unsaved changes?</p>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setConfirmingDiscard(false)}>
              Keep editing
            </button>
            <button type="button" className="btn-primary" onClick={resetAndClose}>
              Discard
            </button>
          </div>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {fields.map((field) => (
            <TextInput
              key={field.id}
              label={field.label}
              required={field.required}
              value={values[field.id] ?? ""}
              error={fieldErrors[field.id]}
              onChange={(event) => setValues((prev) => ({ ...prev, [field.id]: event.target.value }))}
            />
          ))}
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={handleCloseAttempt}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {mode === "create" ? "Add" : "Save"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
