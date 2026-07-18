# Contract: Affix

## `src/styles/tailwind.css` additions

```css
@layer components {
  .affix-pinned {
    @apply fixed top-0 left-0 right-0 z-40;
  }
}
```

## `src/scripts/affix.js`

```js
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
```

## Static HTML usage

```html
<div data-affix data-testid="affix-demo" class="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
  Pinned once scrolled past
</div>
```

## React wrapper shape

```tsx
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface AffixProps {
  children: ReactNode;
  "data-testid"?: string;
}
export function Affix({ children, "data-testid": testId }: AffixProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const naturalOffsetTop = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    naturalOffsetTop.current = el.getBoundingClientRect().top + window.scrollY;
    setSize({ width: el.offsetWidth, height: el.offsetHeight });

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setPinned(window.scrollY > (naturalOffsetTop.current ?? 0));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {pinned && size && <div style={{ width: size.width, height: size.height }} />}
      <div
        ref={ref}
        data-testid={testId}
        className={pinned ? "affix-pinned" : undefined}
      >
        {children}
      </div>
    </>
  );
}
```

## Acceptance mapping

- FR-001, spec.md US1 Acceptance Scenarios 1-2 → the markup/script above
- spec.md Edge Case (container shorter than viewport) → the threshold simply never triggers, no error path needed
