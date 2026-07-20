import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Accordion } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

const independentItems = [
  { id: "accordion-item-0", trigger: "What is your return policy?", content: "Items can be returned within 30 days of delivery for a full refund." },
  { id: "accordion-item-1", trigger: "How long does shipping take?", content: "Standard shipping takes 3-5 business days." },
  { id: "accordion-item-2", trigger: "Do you ship internationally?", content: "Yes, we ship to over 50 countries." },
];

const exclusiveItems = [
  { id: "accordion-exclusive-item-0", trigger: "What is your return policy?", content: "Items can be returned within 30 days of delivery for a full refund." },
  { id: "accordion-exclusive-item-1", trigger: "How long does shipping take?", content: "Standard shipping takes 3-5 business days." },
];

// A SECOND exclusive-mode instance — needed to actually exercise the
// useId()-based group-name isolation (code review finding): a test using
// only one exclusive instance plus one non-exclusive instance can pass
// even with a single hardcoded group name shared by every exclusive
// Accordion on the page, since the non-exclusive instance was never in a
// native `name` group to begin with. Two exclusive instances are the
// only way to prove they don't fight over one shared group.
const exclusiveItems2 = [
  { id: "accordion-exclusive-2-item-0", trigger: "Do you offer gift wrapping?", content: "Yes, gift wrapping is available at checkout for a small fee." },
  { id: "accordion-exclusive-2-item-1", trigger: "Can I change my order?", content: "Orders can be changed within 1 hour of placing them." },
];

function AccordionDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Accordion / Disclosure</h1>

      <div className="mt-8 max-w-lg space-y-10">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Independent (default)</h2>
          <Accordion data-testid="accordion" className="mt-2" items={independentItems} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Exclusive (single-open-at-a-time)</h2>
          <Accordion data-testid="accordion-exclusive" className="mt-2" items={exclusiveItems} exclusive />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-neutral-900">
            Exclusive #2 (isolation check — must not share a group with #1)
          </h2>
          <Accordion data-testid="accordion-exclusive-2" className="mt-2" items={exclusiveItems2} exclusive />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccordionDemo />
  </StrictMode>,
);
