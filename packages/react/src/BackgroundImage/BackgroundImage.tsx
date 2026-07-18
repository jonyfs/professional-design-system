import { useEffect, useRef, type ReactNode } from "react";

export interface BackgroundImageProps {
  src: string;
  children: ReactNode;
  "data-testid"?: string;
}

// Feature 033 (contracts/background-image-watermark.contract.md) —
// CSSOM background-image assignment, not a literal style="..."
// attribute (this project's CSP). .background-image-container's own
// bg-neutral-200 is the CSS background-color underneath, so a
// failed/missing image still shows a neutral surface (spec.md Edge
// Case), never a transparent gap.
export function BackgroundImage({ src, children, "data-testid": testId }: BackgroundImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.style.backgroundImage = `url(${src})`;
  }, [src]);

  return (
    <div ref={ref} data-testid={testId} className="background-image-container h-48 w-full max-w-md">
      <div className="background-image-scrim" />
      <div className="background-image-content">{children}</div>
    </div>
  );
}
