// Feature 032 (research.md R2) — general-purpose scroll-threshold
// pinning, distinct from Back-to-Top's own one-off inline logic
// (feature 031, which stays unchanged — spec.md Assumptions). Inserts
// a same-size placeholder to prevent a layout jump when pinning
// engages, since the wrapped element IS normally in document flow
// (unlike Back-to-Top's button, which never was).
export function initAffix() {
  document.querySelectorAll("[data-affix]").forEach((element) => {
    const placeholder = document.createElement("div");
    placeholder.style.display = "none";
    element.parentElement.insertBefore(placeholder, element);

    const naturalOffsetTop = element.getBoundingClientRect().top + window.scrollY;
    let pinned = false;

    function render() {
      const shouldPin = window.scrollY > naturalOffsetTop;
      if (shouldPin === pinned) return;
      pinned = shouldPin;
      if (pinned) {
        placeholder.style.width = `${element.offsetWidth}px`;
        placeholder.style.height = `${element.offsetHeight}px`;
        placeholder.style.display = "";
        element.classList.add("affix-pinned");
      } else {
        placeholder.style.display = "none";
        element.classList.remove("affix-pinned");
      }
    }

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            render();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true },
    );

    render(); // correct initial state, not just after the first scroll event
  });
}
