// PasswordInput behavior wiring (contracts/form-inputs.contract.md, feature
// 023 US1). TextInput's shell plus a single trailing icon button that flips
// the input's `type` between "password" and "text".
//
// Constitution Principle II ("verify empirically, don't assume"): toggling
// `type` in place must NOT lose the typed value, the caret/selection range,
// or scroll position. We never re-create the element (that would reset all
// three); we only flip the attribute. Some engines still collapse the
// selection when `type` changes, so we snapshot selectionStart/End before
// the flip and restore them (plus focus) immediately after.
//
// The button's aria-label always names the NEXT action ("Show password"
// while hidden, "Hide password" while shown), not the current state.

/**
 * @param {{ input: HTMLInputElement, toggle: HTMLButtonElement }} refs
 */
export function initPasswordInput({ input, toggle }) {
  const showIcon = toggle.querySelector('[data-icon="show"]');
  const hideIcon = toggle.querySelector('[data-icon="hide"]');

  function render() {
    const visible = input.type === "text";
    toggle.setAttribute("aria-label", visible ? "Hide password" : "Show password");
    toggle.setAttribute("aria-pressed", String(visible));
    if (showIcon && hideIcon) {
      showIcon.classList.toggle("hidden", visible);
      hideIcon.classList.toggle("hidden", !visible);
    }
  }

  toggle.addEventListener("click", () => {
    if (input.disabled) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const scrollLeft = input.scrollLeft;

    input.type = input.type === "password" ? "text" : "password";
    render();

    // Restore focus + caret/selection + scroll, which some engines drop on
    // a `type` change. Guard: selectionStart is null for some input types,
    // but "text"/"password" both support it.
    input.focus({ preventScroll: true });
    if (start !== null && end !== null) {
      try {
        input.setSelectionRange(start, end);
      } catch {
        /* setSelectionRange is unsupported for this type — nothing to restore */
      }
    }
    input.scrollLeft = scrollLeft;
  });

  render();
}
