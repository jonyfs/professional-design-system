import { useState } from "react";
import {
  Card,
  Stepper,
  PinInput,
  SocialLoginGroup,
  PasswordStrengthMeter,
  OnboardingTour,
  TextInput,
  Button,
} from "@jonyfs/react";
import { onboardingSteps } from "../data/sample-data";

const STEP_LABELS = onboardingSteps.map((s) => ({ label: s.title }));

// Feature 047 — an auth-adjacent onboarding flow, the one realistic
// product surface none of the other 4 screens cover: a first-run,
// multi-step wizard rather than an authenticated-user dashboard/settings
// area. Every component here is a real, controlled step in one flow, not
// a static gallery of unrelated widgets.
export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [tourActive, setTourActive] = useState(false);

  const isLastStep = step === onboardingSteps.length - 1;

  return (
    <main className="flex-1 space-y-8 overflow-y-auto p-6">
      <Card elevated className="mx-auto max-w-2xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Stepper steps={STEP_LABELS} current={step} aria-label="Onboarding progress" />
          <Button variant="secondary" onClick={() => setTourActive(true)}>
            Show tour
          </Button>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{onboardingSteps[step].title}</h2>
          <p className="text-sm text-neutral-600">{onboardingSteps[step].description}</p>
        </div>

        {step === 1 && (
          <SocialLoginGroup
            providers={["google", "github", "microsoft"]}
            mode="stacked"
            onProviderSelect={() => setStep((s) => Math.min(s + 1, onboardingSteps.length - 1))}
          />
        )}

        {step === 2 && (
          <div className="space-y-2">
            <TextInput label="Data source URL" placeholder="https://api.example.com" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <TextInput
                label="Choose a password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordStrengthMeter value={password} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-900">Verification code</p>
              <PinInput length={6} value={pin} onChange={setPin} label="Two-factor verification code" />
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="secondary"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>
          <Button
            variant="primary"
            disabled={isLastStep}
            onClick={() => setStep((s) => Math.min(s + 1, onboardingSteps.length - 1))}
          >
            {isLastStep ? "Done" : "Next"}
          </Button>
        </div>
      </Card>

      {tourActive && (
        <OnboardingTour
          steps={[
            { title: "Welcome", description: "This tour highlights the onboarding flow's key steps." },
            { title: "Progress", description: "The stepper above always shows where you are in the flow." },
            { title: "Security", description: "The last step protects your account with 2FA." },
          ]}
          data-testid="onboarding-screen-tour"
        />
      )}
    </main>
  );
}
