import type { ReactNode } from "react";

// Fixed, provider-mandated brand identifiers — a verbatim duplicate of
// `shared/design-tokens.ts`'s `providerBrand` export, matching the same
// duplication approach `packages/react/src/styles.css` already uses for
// `src/styles/tailwind.css`'s `@layer components` classes (feature 004's
// research.md: two independently built surfaces can't share source across
// their own build boundary, so a small, rarely-changing constant is
// duplicated rather than imported cross-package). `shared/design-tokens.ts`
// remains the single source of truth to keep the two in sync by hand.
const providerBrand = {
  google: { blue: "#4285F4", green: "#34A853", yellow: "#FBBC05", red: "#EA4335" },
  apple: { black: "#000000" },
  facebook: { blue: "#1877F2" },
  microsoft: { red: "#F25022", green: "#7FBA00", blue: "#00A4EF", yellow: "#FFB900" },
  github: { black: "#171515" },
} as const;

export type ProviderId = "google" | "apple" | "facebook" | "microsoft" | "github";

export interface ProviderPreset {
  label: string;
  icon: ReactNode;
  /** "neutral" (default): brand-50/neutral-900 surface, color confined to
   *  the icon. "monochrome": the provider's OWN black/white brand fill —
   *  offered only for Apple/GitHub, both AAA-safe extremes (research.md R1). */
  appearance: "neutral" | "monochrome";
}

function GoogleIcon() {
  return (
    <svg className="social-login-btn-icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 10 L10 0 A10 10 0 0 1 20 10 Z" fill={providerBrand.google.blue} />
      <path d="M10 10 L20 10 A10 10 0 0 1 10 20 Z" fill={providerBrand.google.green} />
      <path d="M10 10 L10 20 A10 10 0 0 1 0 10 Z" fill={providerBrand.google.yellow} />
      <path d="M10 10 L0 10 A10 10 0 0 1 10 0 Z" fill={providerBrand.google.red} />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="social-login-btn-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M13.5 6.2c-.9 0-1.7.5-2.2.5-.5 0-1.4-.5-2.3-.5C6.9 6.2 5 7.9 5 11c0 3.4 2.5 7.5 4.4 7.5.7 0 1-.4 1.6-.4.6 0 .9.4 1.6.4C14.3 18.5 17 14.6 17 11c0-2.6-1.8-4.4-3.5-4.8Zm-2.6-1.7c.4-.5.7-1.2.6-1.9-.6.1-1.3.4-1.7.9-.4.4-.7 1.1-.6 1.8.7.1 1.4-.3 1.7-.8Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="social-login-btn-icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill={providerBrand.facebook.blue} />
      <path d="M12.5 6.5h-1.2c-.5 0-.8.3-.8.8v1.2h2l-.3 2h-1.7v5h-2v-5H7v-2h1.5V7c0-1.4 1-2.5 2.5-2.5h1.5v2Z" fill="#FFFFFF" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="social-login-btn-icon" viewBox="0 0 20 20" aria-hidden="true">
      <rect x="1" y="1" width="8.5" height="8.5" fill={providerBrand.microsoft.red} />
      <rect x="10.5" y="1" width="8.5" height="8.5" fill={providerBrand.microsoft.green} />
      <rect x="1" y="10.5" width="8.5" height="8.5" fill={providerBrand.microsoft.blue} />
      <rect x="10.5" y="10.5" width="8.5" height="8.5" fill={providerBrand.microsoft.yellow} />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="social-login-btn-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1.5c-4.7 0-8.5 3.8-8.5 8.5 0 3.8 2.4 6.9 5.8 8 .4.1.6-.2.6-.4v-1.5c-2.4.5-2.9-1.1-2.9-1.1-.4-1-.9-1.3-.9-1.3-.8-.5.1-.5.1-.5.8.1 1.3.9 1.3.9.8 1.3 2 .9 2.4.7.1-.6.3-.9.5-1.2-1.9-.2-3.9-1-3.9-4.3 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9.7-.2 1.4-.3 2.2-.3.7 0 1.5.1 2.2.3 1.6-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.3 0 3.3-2 4.1-3.9 4.3.3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4 3.4-1.1 5.8-4.3 5.8-8C18.5 5.3 14.7 1.5 10 1.5Z" />
    </svg>
  );
}

// Closed, internal map — not exported as caller-editable (FR-006). There
// is no code path anywhere in this file or in SocialLoginGroup.tsx that
// lets a consumer override a preset's label/icon/appearance.
export const PRESETS: Record<ProviderId, ProviderPreset> = {
  google: { label: "Sign in with Google", icon: <GoogleIcon />, appearance: "neutral" },
  apple: { label: "Continue with Apple", icon: <AppleIcon />, appearance: "monochrome" },
  facebook: { label: "Continue with Facebook", icon: <FacebookIcon />, appearance: "neutral" },
  microsoft: { label: "Sign in with Microsoft", icon: <MicrosoftIcon />, appearance: "neutral" },
  github: { label: "Continue with GitHub", icon: <GitHubIcon />, appearance: "monochrome" },
};
