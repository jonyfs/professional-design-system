import { type ReactNode } from "react";
import { PRESETS, type ProviderId } from "./providers";

export type { ProviderId };

export interface CustomProviderEntry {
  id: string;
  label: string;
  icon: ReactNode;
  /** Styles ONLY the icon's accent backing (research.md R5) — never the
   *  button's own surface or text. Applied via React's `style` prop
   *  (a DOM property assignment, not a literal HTML attribute), which is
   *  CSP-safe on this surface per this catalog's established exception
   *  (Password Strength Meter, feature 029; Compare, feature 034). */
  color: string;
  onSelect?: () => void;
}

export interface SocialLoginGroupProps {
  /** Ordered; rendered in this exact order (FR-001). Empty → renders nothing (FR-010). */
  providers: Array<ProviderId | CustomProviderEntry>;
  mode?: "stacked" | "compact";
  /** Providers currently showing a loading state (FR-005); independent per entry. */
  loadingProviderIds?: string[];
  /** Providers currently disabled (FR-005); independent per entry. */
  disabledProviderIds?: string[];
  /** Fires with the provider's id on activation (FR-003). No network call
   *  of this component's own — the host application owns the real auth flow. */
  onProviderSelect: (id: string) => void;
}

function isCustomEntry(entry: ProviderId | CustomProviderEntry): entry is CustomProviderEntry {
  return typeof entry !== "string";
}

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
      {providers.map((entry, index) => {
        const custom = isCustomEntry(entry);
        const id = custom ? entry.id : entry;
        // Presets are a closed, internal lookup — there is no code path
        // here that lets a caller override a preset's label/icon/
        // appearance (FR-006). Custom entries always render "neutral":
        // the monochrome appearance is Apple/GitHub's own verified-safe
        // brand extreme, not a general-purpose escape hatch (data-model.md).
        const preset = custom ? undefined : PRESETS[entry];
        const label = custom ? entry.label : preset!.label;
        const isLoading = loadingProviderIds.includes(id);
        const isDisabled = disabledProviderIds.includes(id) || isLoading;
        const appearanceClass =
          !custom && preset!.appearance === "monochrome" ? " social-login-btn-monochrome-dark" : "";

        return (
          <button
            // `id` alone isn't a stable React key across arbitrary caller
            // input (a duplicated provider id is explicitly allowed —
            // spec.md Edge Cases — each occurrence is its own button), so
            // the array index disambiguates without changing render order.
            key={`${id}-${index}`}
            type="button"
            data-testid={`social-login-${id}`}
            data-provider-id={id}
            className={
              (mode === "compact" ? "social-login-btn social-login-btn-compact" : "social-login-btn") +
              appearanceClass
            }
            disabled={isDisabled}
            onClick={() => {
              if (custom) entry.onSelect?.();
              onProviderSelect(id);
            }}
          >
            {custom ? (
              <span
                className="social-login-btn-icon inline-flex items-center justify-center rounded-full"
                style={{ backgroundColor: entry.color, color: "#FFFFFF" }}
              >
                {entry.icon}
              </span>
            ) : (
              preset!.icon
            )}
            <span
              className={
                mode === "compact"
                  ? "social-login-btn-label social-login-btn-label-hidden"
                  : "social-login-btn-label"
              }
            >
              {isLoading ? "Signing in…" : label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
