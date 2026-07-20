import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { SocialLoginGroup, type CustomProviderEntry } from "@jonyfs/react";
import "@jonyfs/react/styles.css";
import "./harness.css";

// Example custom-provider glyphs (research.md R3/R7) — plain white/
// monochrome glyphs; SocialLoginGroup itself supplies the colored accent
// backdrop via its `color` prop (research.md R5), so these icons carry no
// background of their own.
function InstagramIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M6.5 5h7a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Zm3.5 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4-1a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M12.7 5h-2v8.2a1.9 1.9 0 1 1-1.3-1.8v-2a3.9 3.9 0 1 0 3.3 3.9V9.6a5.4 5.4 0 0 0 3 .9V8.6a3.4 3.4 0 0 1-3-3.1V5Z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M14 6.4a9.8 9.8 0 0 0-2.4-.7l-.2.4a8.6 8.6 0 0 1 1.9.8 7.4 7.4 0 0 0-6.6 0 8.6 8.6 0 0 1 1.9-.8l-.2-.4a9.8 9.8 0 0 0-2.4.7C4.6 8.3 4.2 10.2 4.3 12c1 .7 2 1.2 3 1.5l.4-.7a5 5 0 0 1-1-.5l.3-.2a6.9 6.9 0 0 0 6 0l.3.2a5 5 0 0 1-1 .5l.4.7c1-.3 2-.8 3-1.5.2-1.8-.3-3.7-1.6-5.6ZM8.1 11.2c-.4 0-.8-.4-.8-.9s.4-.9.8-.9.8.4.8.9-.4.9-.8.9Zm3 0c-.4 0-.8-.4-.8-.9s.4-.9.8-.9.8.4.8.9-.4.9-.8.9Z" />
    </svg>
  );
}

const CUSTOM_ENTRIES: CustomProviderEntry[] = [
  { id: "instagram", label: "Continue with Instagram", icon: <InstagramIcon />, color: "#E1306C" },
  { id: "tiktok", label: "Continue with TikTok", icon: <TikTokIcon />, color: "#000000" },
  { id: "discord", label: "Continue with Discord", icon: <DiscordIcon />, color: "#5865F2" },
];

function SocialLoginButtonsDemo() {
  const [lastSelected, setLastSelected] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [disabledId, setDisabledId] = useState<string | null>("microsoft");

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-neutral-900">Social Login Buttons (React)</h1>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
          US1 — Built-in presets
        </h2>
        <div className="mt-3 max-w-sm">
          <SocialLoginGroup
            providers={["google", "apple", "facebook", "microsoft", "github"]}
            onProviderSelect={setLastSelected}
            loadingProviderIds={loadingId ? [loadingId] : []}
            disabledProviderIds={disabledId ? [disabledId] : []}
          />
        </div>
        <p data-testid="social-login-result" className="mt-3 text-sm text-neutral-600" aria-live="polite">
          {lastSelected ? `Selected: ${lastSelected}` : "Nothing selected yet"}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
          US2 — Independent per-provider loading/disabled state
        </h2>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            data-testid="toggle-google-loading"
            className="btn-secondary"
            onClick={() => setLoadingId((current) => (current === "google" ? null : "google"))}
          >
            Toggle Google loading
          </button>
          <button
            type="button"
            data-testid="toggle-microsoft-disabled"
            className="btn-secondary"
            onClick={() => setDisabledId((current) => (current === "microsoft" ? null : "microsoft"))}
          >
            Toggle Microsoft disabled
          </button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
          US3 — Custom entries alongside presets
        </h2>
        <div className="mt-3 max-w-sm">
          <SocialLoginGroup providers={["google", "apple", ...CUSTOM_ENTRIES]} onProviderSelect={setLastSelected} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">Compact mode</h2>
        <div className="mt-3">
          <SocialLoginGroup
            providers={["google", "apple", "github"]}
            mode="compact"
            onProviderSelect={setLastSelected}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">Edge case — empty list</h2>
        <div data-testid="social-login-empty" className="mt-3">
          <SocialLoginGroup providers={[]} onProviderSelect={setLastSelected} />
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocialLoginButtonsDemo />
  </StrictMode>,
);
