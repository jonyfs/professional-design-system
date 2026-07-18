# Contract: Bottom Sheet

Reuses Slide-over's exact native `<dialog>` mechanism verbatim
(`overlay.js`'s `initDialogTriggers()`/`wireDialogClose()`, feature
003) — zero new JS. Only new CSS: bottom-edge anchoring + auto-height
instead of Slide-over's right-edge/full-height (research.md R4).

## `src/styles/tailwind.css` additions

```css
@layer components {
  /* top: auto; margin: 0 reset the native <dialog> UA stylesheet's
     own inset: 0 / margin: auto defaults — found by running this
     against a live browser, not assumed: with top left at its UA
     default of 0 alongside this class's own bottom-0 and no explicit
     height, the dialog was fully constrained between top:0 and
     bottom:0 with auto margins, so the UA centered it vertically
     instead of anchoring it to the bottom edge (the same class of fix
     .dropdown-menu-panel/.popover-panel already needed for their own
     inset/margin defaults). */
  .bottom-sheet-dialog {
    @apply p-0 border-0 fixed inset-x-0 bottom-0 w-full max-h-[80vh];
    top: auto;
    margin: 0;
  }
  .bottom-sheet-dialog::backdrop {
    background-color: theme("colors.neutral.500 / 75%");
  }
  .bottom-sheet-panel {
    @apply relative flex max-h-[80vh] w-full flex-col overflow-y-auto
      bg-neutral-50 shadow-xl p-6 transform transition ease-in-out
      duration-500;
  }
}
```

## Static HTML usage

Textually identical to `slide-over.html` except `.bottom-sheet-dialog`/
`.bottom-sheet-panel` instead of `.slide-over-dialog`/`.slide-over-panel`
— same `data-dialog-trigger` wiring, same close-button/backdrop/Escape
dismissal:

```html
<button type="button" data-testid="bottom-sheet-trigger" data-dialog-trigger="bottom-sheet-example" class="btn-primary">
  Open bottom sheet
</button>

<dialog id="bottom-sheet-example" data-testid="bottom-sheet" aria-labelledby="bottom-sheet-title" class="bottom-sheet-dialog">
  <div class="bottom-sheet-panel">
    <div class="flex items-start justify-between gap-4">
      <h2 id="bottom-sheet-title" class="text-lg font-semibold text-neutral-900">Order details</h2>
      <form method="dialog">
        <button type="submit" data-testid="bottom-sheet-close" aria-label="Close" class="close-icon-btn">
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </form>
    </div>
    <p class="mt-4 text-sm text-neutral-600">Order #1042 — placed 2026-07-08, currently in transit.</p>
  </div>
</dialog>
```

## React wrapper shape

Textually identical to `SlideOver.tsx` except `.bottom-sheet-dialog`/
`.bottom-sheet-panel` classes and component name — same
`useDialogTrigger` hook, no new hook:

```tsx
import { useId, type HTMLAttributes, type ReactNode, type RefObject } from "react";
import { useDialogTrigger } from "../hooks/useDialogTrigger";

export interface BottomSheetProps
  extends Omit<HTMLAttributes<HTMLDialogElement>, "title" | "aria-labelledby" | "tabIndex"> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  hasFocusableContent?: boolean;
  closeButtonTestId?: string;
  triggerRef?: RefObject<HTMLElement | null>;
}
export function BottomSheet({
  open, onClose, title, children, hasFocusableContent = true, closeButtonTestId, triggerRef, className, ...rest
}: BottomSheetProps) {
  const dialogRef = useDialogTrigger(open, onClose, triggerRef);
  const titleId = useId();
  const dialogClasses = ["bottom-sheet-dialog", className].filter(Boolean).join(" ");

  return (
    <dialog ref={dialogRef} className={dialogClasses} aria-labelledby={titleId} tabIndex={hasFocusableContent ? undefined : -1} {...rest}>
      <div className="bottom-sheet-panel">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-neutral-900">{title}</h2>
          {hasFocusableContent && (
            <form method="dialog">
              <button type="submit" aria-label="Close" className="close-icon-btn" data-testid={closeButtonTestId}>
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </form>
          )}
        </div>
        {children}
      </div>
    </dialog>
  );
}
```

## Acceptance mapping

- FR-003, spec.md US3 Acceptance Scenarios 1-2 → the markup/component above
- spec.md Edge Case (content exceeds max height) → `.bottom-sheet-panel`'s `overflow-y-auto`
