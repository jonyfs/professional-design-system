import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ContextSwitcher,
  ScrollProgressBar,
  BackToTop,
  OnboardingTour,
} from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";
import "./harness.css";

function NavigationMicroPatternsDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <ScrollProgressBar data-testid="scroll-progress-bar" />
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Navigation Micro-Patterns</h1>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Team/Workspace Switcher</h2>
      <div className="mt-3">
        <ContextSwitcher
          data-testid="team-switcher"
          options={[
            { label: "Acme Inc", avatarInitials: "AC" },
            { label: "Globex Corp", avatarInitials: "GC" },
            { label: "Initech", avatarInitials: "IN" },
          ]}
        />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Language Switcher</h2>
      <div className="mt-3">
        <ContextSwitcher
          data-testid="language-switcher"
          options={[{ label: "English" }, { label: "Português" }, { label: "Español" }]}
        />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Onboarding Tour</h2>
      <div className="mt-3">
        <OnboardingTour
          data-testid="onboarding-tour"
          steps={[
            { title: "Your dashboard", description: "See an overview of your account here." },
            { title: "Settings", description: "Manage your account preferences here." },
            { title: "Notifications", description: "Catch up on recent activity here." },
          ]}
        />
      </div>

      <div style={{ height: "1500px" }} className="mt-8">
        <p className="text-sm text-neutral-600">Scroll down to reveal the Back-to-Top button.</p>
      </div>
      <BackToTop data-testid="back-to-top" />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NavigationMicroPatternsDemo />
  </StrictMode>,
);
