export interface AvatarProps {
  src?: string;
  alt: string;
  initials?: string;
  size?: "sm" | "lg";
  "data-testid"?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "avatar-sm",
  lg: "avatar-lg",
};

// Direct port of src/components/avatar/avatar.html (feature 006) — two
// variants (image, initials fallback), two sizes, zero JS.
export function Avatar({ src, alt, initials, size = "lg", "data-testid": testId }: AvatarProps) {
  const sizeClass = SIZE_CLASSES[size];
  if (src) {
    return <img src={src} alt={alt} data-testid={testId} className={`avatar-img ${sizeClass}`} />;
  }
  return (
    <span data-testid={testId} className={`avatar-fallback ${sizeClass}`} aria-label={alt}>
      {initials}
    </span>
  );
}
