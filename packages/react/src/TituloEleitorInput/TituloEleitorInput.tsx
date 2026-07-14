import { forwardRef } from "react";
import * as tituloEleitor from "../../../../shared/validators/titulo-eleitor";
import { LocalizedInputField, type LocalizedInputFieldProps } from "../LocalizedInput/LocalizedInputField";

export type TituloEleitorInputProps = Omit<LocalizedInputFieldProps, "config">;

// contracts/extended-brazilian-fields.contract.md — Título de Eleitor (FR-010).
export const TituloEleitorInput = forwardRef<HTMLInputElement, TituloEleitorInputProps>(
  function TituloEleitorInput(props, ref) {
    return <LocalizedInputField ref={ref} config={tituloEleitor} inputMode="numeric" {...props} />;
  },
);
