import { Collapse } from "@professional-design-system/react";

export function TwoIndependentPanels() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <Collapse label="Shipping details">
        Standard shipping takes 3-5 business days within the continental US.
        Opening this panel does not close the one below it — the two are
        completely independent.
      </Collapse>

      <Collapse label="Return policy">
        Items can be returned within 30 days of delivery for a full refund.
      </Collapse>
    </div>
  );
}
