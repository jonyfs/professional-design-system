# Component Contract: PinInput

## Markup contract

```html
<fieldset class="pin-input" data-pin-input>
  <legend class="text-sm font-medium text-neutral-900">Verification code</legend>
  <div class="mt-2 flex gap-2">
    <input type="text" inputmode="numeric" maxlength="1" class="pin-input-box" data-pin-box aria-label="Digit 1" />
    <input type="text" inputmode="numeric" maxlength="1" class="pin-input-box" data-pin-box aria-label="Digit 2" />
    <input type="text" inputmode="numeric" maxlength="1" class="pin-input-box" data-pin-box aria-label="Digit 3" />
    <input type="text" inputmode="numeric" maxlength="1" class="pin-input-box" data-pin-box aria-label="Digit 4" />
    <input type="text" inputmode="numeric" maxlength="1" class="pin-input-box" data-pin-box aria-label="Digit 5" />
    <input type="text" inputmode="numeric" maxlength="1" class="pin-input-box" data-pin-box aria-label="Digit 6" />
  </div>
</fieldset>
```

```css
.pin-input-box {
  @apply h-12 w-10 rounded-md border-0 text-center text-lg font-semibold
    text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300
    focus:ring-2 focus:ring-inset focus:ring-brand
    disabled:opacity-50 disabled:cursor-not-allowed;
}
```

```js
// src/scripts/pin-input.js (research.md R4 — genuinely new module, no
// existing script handles multi-box focus distribution)
export function initPinInputs() {
  document.querySelectorAll("[data-pin-input]").forEach((group) => {
    const boxes = Array.from(group.querySelectorAll("[data-pin-box]"));
    boxes.forEach((box, i) => {
      box.addEventListener("input", () => {
        box.value = box.value.replace(/[^0-9]/g, "").slice(0, 1);
        if (box.value && boxes[i + 1]) boxes[i + 1].focus();
      });
      box.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !box.value && boxes[i - 1]) {
          boxes[i - 1].focus();
        }
      });
      box.addEventListener("paste", (event) => {
        event.preventDefault();
        const digits = (event.clipboardData?.getData("text") ?? "")
          .replace(/[^0-9]/g, "")
          .slice(0, boxes.length - i);
        digits.split("").forEach((digit, offset) => {
          if (boxes[i + offset]) boxes[i + offset].value = digit;
        });
        (boxes[i + digits.length] ?? boxes[boxes.length - 1]).focus();
      });
    });
  });
}
```

Real, separate `<input>` elements per box (not a single input with visual
tricks), so each box is genuinely focusable and screen-reader-navigable.
Non-numeric paste content is rejected (regex-filtered); excess characters
beyond the remaining boxes are truncated — matching spec.md's Edge Cases.

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| focus | `focus:ring-2 focus:ring-inset focus:ring-brand` |
| disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |

## Required attributes

- Real `<fieldset>`/`<legend>` grouping (native semantics communicate
  "these boxes are one control" to assistive technology)
- Each box needs its own `aria-label` (e.g. "Digit 1") since there's no
  single visible label per box
- `inputmode="numeric"` (mobile numeric keyboard) + `maxlength="1"`

## Token allowlist used

`ring-neutral-300`, `ring-brand`, `text-neutral-900` — identical to
TextInput's existing ratified pattern. No new tokens.

## Acceptance mapping

- FR-010, SC-001, SC-002 → `tests/e2e/pin-input.spec.ts` (auto-advance,
  paste-splitting, and Backspace-retreat all asserted via real
  keyboard/clipboard simulation, per R8)
