import { useEffect, useRef, useState, type ReactNode } from "react";

export interface AffixProps {
  children: ReactNode;
  "data-testid"?: string;
}

// Feature 032 (contracts/affix.contract.md) — general-purpose
// scroll-threshold pinning, distinct from Back-to-Top's own one-off
// inline logic (feature 031, unchanged — spec.md Assumptions).
// Inserts a same-size placeholder to prevent a layout jump when
// pinning engages, since the wrapped element IS normally in document
// flow (unlike Back-to-Top's button, which never was).
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
      <div ref={ref} data-testid={testId} className={pinned ? "affix-pinned" : undefined}>
        {children}
      </div>
    </>
  );
}
