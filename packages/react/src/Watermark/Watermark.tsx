import { useEffect, useRef, type ReactNode } from "react";

export interface WatermarkProps {
  text: string;
  children: ReactNode;
  "data-testid"?: string;
}

// Feature 033 (contracts/background-image-watermark.contract.md) — a
// pure CSS repeating-background technique, no canvas/watermark
// library dependency. The SVG data URI is set via CSSOM assignment,
// matching BackgroundImage's identical CSP-safe pattern.
export function Watermark({ text, children, "data-testid": testId }: WatermarkProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layerRef.current) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">
      <text x="10" y="60" transform="rotate(-30 100 50)" font-size="16" fill="rgb(156 163 175 / 0.35)" font-family="sans-serif">${text}</text>
    </svg>`;
    layerRef.current.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [text]);

  return (
    <div data-testid={testId} className="watermark-container">
      <div ref={layerRef} aria-hidden="true" className="watermark-layer" />
      <div className="watermark-content">{children}</div>
    </div>
  );
}
