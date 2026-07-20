import { Combobox } from "professional-design-system";

const countries = [
  { value: "Argentina", label: "Argentina" },
  { value: "Brazil", label: "Brazil" },
  { value: "Canada", label: "Canada" },
  { value: "Austria", label: "Austria (unavailable)", disabled: true },
  { value: "Germany", label: "Germany" },
];

export function Default() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Combobox label="Country" options={countries} onCommit={() => {}} />
    </div>
  );
}
