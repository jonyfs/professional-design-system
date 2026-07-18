# Component Contract: Social Login Group

Reuses Button's height/padding/radius scale (research.md R6); does NOT
reuse Button's `variant` prop (only `primary`/`secondary`, cannot
express 5 distinct brand identities + an open custom one). Every
button defaults to the `neutral` appearance (research.md R1): brand
color lives only in the icon, never the button surface.

## `shared/design-tokens.ts` addition

```ts
// Fixed, provider-mandated brand identifiers. Deliberately NOT part of
// `colors`/REQUIRED_THEME_PROPERTIES/THEMES — these must render
// identically regardless of the host app's selected curated theme
// (research.md R2; Complexity Tracking in plan.md). Values are the
// official accent used for each provider's icon glyph only; they are
// never used as a button's background/text color under the default
// "neutral" appearance (research.md R1).
export const providerBrand = {
  google: { blue: "#4285F4", green: "#34A853", yellow: "#FBBC05", red: "#EA4335" },
  apple: { black: "#000000", white: "#FFFFFF" },
  facebook: { blue: "#1877F2" },
  microsoft: { red: "#F25022", green: "#7FBA00", blue: "#00A4EF", yellow: "#FFB900" },
  github: { black: "#171515" },
  // Example custom-provider accents used by this catalog's own demo/
  // preview content (research.md R7) — not a governed preset; a real
  // consumer of the custom-entry API supplies their own `color`.
  instagram: "#E1306C",
  tiktok: "#000000",
  discord: "#5865F2",
} as const;
```

## `src/styles/tailwind.css` additions

```css
@layer components {
  .social-login-group {
    @apply flex flex-col gap-3;
  }
  .social-login-group-compact {
    @apply flex-row flex-wrap gap-2;
  }
  .social-login-btn {
    @apply inline-flex w-full items-center justify-center gap-3 rounded-md
           border border-neutral-300 bg-neutral-50 px-4 py-2.5
           text-sm font-semibold text-neutral-900
           hover:bg-neutral-100
           active:scale-[0.98]
           focus-visible:outline focus-visible:outline-2
           focus-visible:outline-offset-2 focus-visible:outline-brand
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-[background-color,transform] duration-150;
  }
  .social-login-btn-compact {
    @apply w-auto px-3;
  }
  .social-login-btn-label-hidden {
    @apply sr-only;
  }
  .social-login-btn-icon {
    @apply h-5 w-5 shrink-0;
  }
  .social-login-btn-label {
    @apply truncate;
  }
  /* Apple/GitHub-only optional monochrome appearance (research.md R1) —
     the provider's OWN brand fill, safe because both extremes clear
     AAA on their own (~17-21:1). No other preset and no custom entry
     may use this class. */
  .social-login-btn-monochrome-dark {
    @apply border-transparent bg-neutral-900 text-white hover:bg-neutral-800;
  }
  .social-login-btn-monochrome-light {
    @apply border border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-50;
  }
}
```

**AAA note**: `text-neutral-900` on `bg-neutral-50` is this catalog's
existing, already-audited base pairing (measures well above 7:1 in the
default theme — see Button's own secondary variant, 17.0:1). No new
text/background pairing is introduced by the default `neutral`
appearance; the optional monochrome appearance's `#000`/`#FFF` extremes
clear AAA at ~17-21:1 (research.md R1's table) and cannot regress since
they are literal, non-computed values.

## `src/scripts/social-login.js`

```js
// Feature 035 (research.md). Vanilla wiring: no OAuth call, no
// network activity — fires a CustomEvent with the provider id and
// lets the host page's own script own the real auth flow (FR-003).
export function initSocialLoginGroups() {
  document.querySelectorAll("[data-social-login-group]").forEach((group) => {
    group.querySelectorAll("[data-social-login-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        group.dispatchEvent(
          new CustomEvent("providerselect", {
            detail: { providerId: btn.dataset.providerId },
            bubbles: true,
          }),
        );
      });
    });
  });
}
```

## Static HTML usage (fixed example configuration, research.md R7)

```html
<div data-social-login-group class="social-login-group" aria-label="Sign in options">
  <button type="button" data-social-login-btn data-provider-id="google" data-testid="social-login-google" class="social-login-btn">
    <svg class="social-login-btn-icon" viewBox="0 0 20 20" aria-hidden="true"><!-- Google "G" mark, sourced from Google's brand assets (research.md R3) --></svg>
    <span class="social-login-btn-label">Sign in with Google</span>
  </button>
  <button type="button" data-social-login-btn data-provider-id="apple" data-testid="social-login-apple" class="social-login-btn social-login-btn-monochrome-dark">
    <svg class="social-login-btn-icon" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor"><!-- Apple mark, sourced from Apple Design Resources (research.md R3) --></svg>
    <span class="social-login-btn-label">Continue with Apple</span>
  </button>
  <button type="button" data-social-login-btn data-provider-id="github" data-testid="social-login-github" class="social-login-btn social-login-btn-monochrome-dark">
    <svg class="social-login-btn-icon" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor"><!-- GitHub Octocat mark --></svg>
    <span class="social-login-btn-label">Continue with GitHub</span>
  </button>
  <!-- facebook / microsoft presets follow the same .social-login-btn (neutral) shape -->
  <!-- Example custom entries (research.md R7) — fixed, not runtime-configurable on this surface -->
  <button type="button" data-social-login-btn data-provider-id="instagram" data-testid="social-login-instagram" class="social-login-btn">
    <svg class="social-login-btn-icon" viewBox="0 0 20 20" aria-hidden="true"><!-- Instagram glyph, accent circle uses provider-instagram token --></svg>
    <span class="social-login-btn-label">Continue with Instagram</span>
  </button>
</div>
```

**Compact mode**: add `social-login-group-compact` to the group and
`social-login-btn-compact` to each button; the label `<span>` gains
`social-login-btn-label-hidden` alongside its existing
`social-login-btn-label` class (`sr-only` layers on top of `truncate`
harmlessly) so it becomes screen-reader-only text instead of
disappearing — the accessible name survives (FR-008). Never remove the
`<span>` from the DOM.

## React wrapper shape

```tsx
import { type ReactNode } from "react";

export type ProviderId = "google" | "apple" | "facebook" | "microsoft" | "github";

export interface CustomProviderEntry {
  id: string;
  label: string;
  icon: ReactNode;
  color: string;
  onSelect?: () => void;
}

export interface SocialLoginGroupProps {
  providers: Array<ProviderId | CustomProviderEntry>;
  mode?: "stacked" | "compact";
  loadingProviderIds?: string[];
  disabledProviderIds?: string[];
  onProviderSelect: (id: string) => void;
}

// PRESETS is a closed, internal map — not exported as caller-editable.
// Google/Apple presets expose no color prop anywhere in this file
// (FR-006): there is no code path that could apply a caller color to
// either preset's rendering.
export function SocialLoginGroup({
  providers,
  mode = "stacked",
  loadingProviderIds = [],
  disabledProviderIds = [],
  onProviderSelect,
}: SocialLoginGroupProps) {
  if (providers.length === 0) return null; // FR-010

  return (
    <div
      className={mode === "compact" ? "social-login-group social-login-group-compact" : "social-login-group"}
      aria-label="Sign in options"
    >
      {providers.map((entry) => {
        const isCustom = typeof entry !== "string";
        const id = isCustom ? entry.id : entry;
        const isLoading = loadingProviderIds.includes(id);
        const isDisabled = disabledProviderIds.includes(id) || isLoading;
        // Preset lookup / custom-entry rendering, per data-model.md —
        // presets pull { label, icon, appearance } from the internal
        // PRESETS map; custom entries render `entry.icon` with
        // `entry.color` applied ONLY to the icon's accent backing via
        // style={{ backgroundColor: entry.color }} (research.md R5 —
        // CSP-safe: a React style prop, never a literal HTML attribute).
        return (
          <button
            key={id}
            type="button"
            data-testid={`social-login-${id}`}
            className={mode === "compact" ? "social-login-btn social-login-btn-compact" : "social-login-btn"}
            disabled={isDisabled}
            onClick={() => {
              if (isCustom) entry.onSelect?.();
              onProviderSelect(id);
            }}
          >
            {/* icon slot — preset icon or entry.icon */}
            <span
              className={
                mode === "compact"
                  ? "social-login-btn-label social-login-btn-label-hidden"
                  : "social-login-btn-label"
              }
            >
              {isLoading ? "Signing in…" : isCustom ? entry.label : /* preset label */ id}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| hover | `hover:bg-neutral-100` (neutral appearance) / `hover:bg-neutral-800` (monochrome-dark) / `hover:bg-neutral-50` (monochrome-light) |
| active | `active:scale-[0.98]` |
| focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand` |
| disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |

## Token allowlist used

`bg-neutral-50`, `bg-neutral-100`, `bg-neutral-900`, `bg-neutral-800`,
`text-neutral-900`, `text-white`, `border-neutral-300`,
`border-neutral-900`, `bg-white`, `rounded-md`, plus the new
`providerBrand` fixed constants (icon fill only — never a button
background/text class, per research.md R1/R2).

## Acceptance mapping

- FR-001, FR-002, FR-007, FR-009 → the markup/CSS above
- FR-003 → `social-login.js`'s `providerselect` CustomEvent / React's `onProviderSelect`, no network call anywhere in this file
- FR-004, FR-005 → `CustomProviderEntry` handling above
- FR-006 → `PRESETS`'s closed internal map; no prop path exists for a caller to override Apple/Google's rendering
- FR-008 → every button is a real `<button>`; compact mode uses `sr-only`, never removes the label
- FR-010 → `providers.length === 0` early return (React) / an empty `[data-social-login-group]` naturally renders no buttons (static HTML)
- spec.md Edge Cases (empty list, duplicate IDs, long labels, narrow container, forbidden override) → covered by the above, plus `truncate` on the label `<span>` for the long-label case
