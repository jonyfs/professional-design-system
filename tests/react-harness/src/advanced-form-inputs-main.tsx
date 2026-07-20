import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  TagsInput,
  Autocomplete,
  Mentions,
  Cascader,
  TreeSelect,
  InputMask,
  JsonInput,
  RangeSlider,
  FloatLabel,
  Rating,
  type CascadeOption,
  type TreeSelectNode,
} from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

const COUNTRIES = [
  { id: "br", label: "Brazil" },
  { id: "ca", label: "Canada" },
  { id: "de", label: "Germany" },
  { id: "jp", label: "Japan" },
  { id: "pt", label: "Portugal" },
];

const USERS = [
  { id: "jane", label: "jane" },
  { id: "joao", label: "joao" },
  { id: "maria", label: "maria" },
];

const REGION_TREE: CascadeOption[] = [
  {
    id: "eu",
    label: "Europe",
    children: [
      { id: "pt", label: "Portugal" },
      { id: "de", label: "Germany" },
    ],
  },
  {
    id: "na",
    label: "North America",
    children: [
      { id: "us", label: "United States" },
      { id: "ca", label: "Canada" },
    ],
  },
];

const FOLDER_TREE: TreeSelectNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "src-components",
        label: "components",
        children: [
          { id: "src-components-form", label: "form" },
          { id: "src-components-nav", label: "nav" },
        ],
      },
      { id: "src-scripts", label: "scripts" },
    ],
  },
  { id: "tests", label: "tests" },
];

function AdvancedFormInputsDemo() {
  const [tags, setTags] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [json, setJson] = useState('{"ok": true}');
  const [range, setRange] = useState<[number, number]>([20, 80]);
  const [email, setEmail] = useState("");
  const [ratingValue, setRatingValue] = useState(3);

  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Advanced Form Inputs</h1>

      <section className="mt-8 max-w-sm">
        <TagsInput data-testid="tags-input" label="Skills" value={tags} onChange={setTags} />
      </section>

      <section className="mt-8 max-w-sm">
        <Autocomplete data-testid="autocomplete" label="Country" options={COUNTRIES} placeholder="Search a country…" />
      </section>

      <section className="mt-8 max-w-sm">
        <Mentions data-testid="mentions" label="Comment" users={USERS} />
      </section>

      <section className="mt-8 max-w-sm">
        <Cascader data-testid="cascader" label="Region" tree={REGION_TREE} />
      </section>

      <section className="mt-8 max-w-sm">
        <TreeSelect data-testid="tree-select" label="Folder" tree={FOLDER_TREE} />
      </section>

      <section className="mt-8 max-w-sm">
        <InputMask data-testid="input-mask" label="Phone" preset="phone" value={phone} onChange={setPhone} />
      </section>

      <section className="mt-8 max-w-sm">
        <JsonInput data-testid="json-input" label="Config (JSON)" value={json} onChange={setJson} />
      </section>

      <section className="mt-8 max-w-sm">
        <RangeSlider
          data-testid="range-slider"
          label="Price range"
          min={0}
          max={100}
          low={range[0]}
          high={range[1]}
          onChange={(low, high) => setRange([low, high])}
        />
      </section>

      <section className="mt-8 max-w-sm">
        <FloatLabel id="fl-email" label="Email address" type="email" value={email} onChange={setEmail} />
      </section>

      <section className="mt-8 max-w-sm">
        <p className="mb-1 text-sm font-medium text-neutral-900">Rate this product</p>
        <Rating data-testid="rating-interactive" interactive value={ratingValue} onChange={setRatingValue} />
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdvancedFormInputsDemo />
  </StrictMode>,
);
