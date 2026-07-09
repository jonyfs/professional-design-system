# Contract: Component prop shapes and reference implementations

See `data-model.md`'s Component table for the full prop list per
component. This contract shows the reference pattern each component
follows, using Button (simplest) and Modal (most complex — the overlay
hook pattern shared by Modal/SlideOver) as the two worked examples every
other component's implementation follows directly.

## `Button` (User Story 1 reference)

```tsx
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className, ...rest }: ButtonProps) {
  const variantClass = variant === "primary" ? "btn-primary" : "btn-secondary";
  return <button type="button" className={[variantClass, className].filter(Boolean).join(" ")} {...rest} />;
}
```

`ButtonHTMLAttributes<HTMLButtonElement>` extension is what makes
`onClick`/`disabled`/`type`/etc. available via passthrough without
re-declaring them — the same pattern every other non-overlay component
uses (`InputHTMLAttributes<HTMLInputElement>` for Checkbox/Radio/Toggle,
`SelectHTMLAttributes<HTMLSelectElement>` for Select). `.btn-primary`/
`.btn-secondary` are the same `@layer components` classes as the HTML
version — ported verbatim into `packages/react/src/styles.css`
(research.md's duplication decision).

## `useDialogTrigger` hook (shared by Modal/SlideOver)

```ts
import { useEffect, useRef } from "react";

export function useDialogTrigger(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      // WebKit does not restore focus to the previously-focused element
      // natively (found empirically in feature 003) — explicit reinforcement,
      // a no-op where Chromium/Firefox already did this correctly.
      triggerRef.current?.focus();
      onClose();
    };
    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleBackdropClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, [onClose]);

  return dialogRef;
}
```

This is the direct React port of `overlay.js`'s `initDialogTriggers()`
(feature 003) — same three responsibilities (open via `showModal()`,
backdrop-click-to-close, WebKit focus-return safeguard), now scoped to
one dialog per hook call (React's per-instance model makes the "1:1
trigger↔dialog" invariant automatic — the exact bug class feature 003's
code review found in the imperative version can't occur here, since each
component instance owns its own ref, not a shared DOM query).

## `Modal` (User Story 3 reference)

```tsx
import type { ReactNode } from "react";
import { useDialogTrigger } from "../hooks/useDialogTrigger";
import { useId } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  hasFocusableContent?: boolean;
}

export function Modal({ open, onClose, title, children, hasFocusableContent = true }: ModalProps) {
  const dialogRef = useDialogTrigger(open, onClose);
  // useId(), not a hardcoded literal: feature 003's static HTML demo used
  // distinct literal IDs per instance (modal-title vs. modal-info-title)
  // specifically to avoid collisions with multiple dialogs on one page.
  // A component meant to be instantiated more than once (the very thing
  // tests/react-harness does — the default demo and the
  // hasFocusableContent=false variant both render at once) needs a
  // generated, per-instance id or aria-labelledby breaks the second
  // instance onward. Caught by /speckit-analyze before this became the
  // pattern every other component would have copied.
  const titleId = useId();
  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      aria-labelledby={titleId}
      tabIndex={hasFocusableContent ? undefined : -1}
    >
      <div className="modal-panel">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          <button type="button" aria-label="Close" className="close-icon-btn" onClick={onClose}>
            {/* same close-icon SVG as modal.contract.md */}
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
```

Note the explicit close button calls `onClose` directly via `onClick`
rather than relying on `<form method="dialog">` (the zero-JS HTML
pattern from feature 003) — React already re-renders on every state
change, so the declarative `open` prop is the single source of truth for
dialog state; mixing it with the form's own implicit dismissal would let
the DOM and React's state model disagree about whether the dialog is
open. `SlideOver` is textually identical to this pattern with
`.slide-over-dialog`/`.slide-over-panel` classes instead of `.modal-
dialog`/`.modal-panel` — same as the HTML contracts' own "only the
CSS differs" relationship (feature 003 research.md).

## Acceptance mapping

- FR-002, FR-004, FR-005 → this contract
- SC-002, SC-003 → verified by `tests/e2e/react-modal.spec.ts` (and
  siblings) re-running the same keyboard-navigation assertions as feature
  003's `tests/e2e/modal.spec.ts`, against the React harness instead of
  the static HTML page
