import type { HTMLAttributes, ReactNode } from "react";

export type AspectRatioPreset = "16/9" | "1/1" | "4/3";

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Aspect-ratio preset. Default "16/9". */
  ratio?: AspectRatioPreset;
  /** Media (img, video, iframe, etc.) constrained to the ratio. */
  children: ReactNode;
}

// Direct port of src/components/aspect-ratio/aspect-ratio.html (feature
// 015) — a zero-JS media wrapper preventing layout shift via the standard
// aspect-ratio property through Tailwind's aspect-* utilities.
const RATIO_CLASSES: Record<AspectRatioPreset, string> = {
  "16/9": "aspect-[16/9]",
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
};

export function AspectRatio({ ratio = "16/9", children, className, ...rest }: AspectRatioProps) {
  const classes = [
    RATIO_CLASSES[ratio],
    "w-full overflow-hidden rounded-md bg-neutral-200",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
