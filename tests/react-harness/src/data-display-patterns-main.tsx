import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  OverflowList,
  RollingNumber,
  PickList,
  type PickListItem,
  Gallery,
  Compare,
} from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2280%22%20height%3D%2280%22%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%23374151%22/%3E%3C/svg%3E";
const PLACEHOLDER_FULL =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22800%22%20height%3D%22600%22%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22%23374151%22/%3E%3C/svg%3E";
const BEFORE_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%236B7280%22/%3E%3C/svg%3E";
const AFTER_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23374151%22/%3E%3C/svg%3E";

function RollingNumberDemo() {
  const [value, setValue] = useState(1204);
  return (
    <>
      <p className="text-3xl font-bold text-neutral-900" data-testid="rolling-number-demo">
        <RollingNumber value={value} />
      </p>
      <button
        type="button"
        data-testid="rolling-number-increment"
        className="btn-secondary mt-2"
        onClick={() => setValue((v) => v + 500)}
      >
        +500
      </button>
    </>
  );
}

function PickListDemo() {
  const [source, setSource] = useState<PickListItem[]>([
    { id: "alice", label: "Alice Johnson" },
    { id: "bob", label: "Bob Martinez" },
  ]);
  const [destination, setDestination] = useState<PickListItem[]>([]);
  return (
    <PickList
      data-testid="pick-list-demo"
      source={source}
      destination={destination}
      onChange={(nextSource, nextDestination) => {
        setSource(nextSource);
        setDestination(nextDestination);
      }}
    />
  );
}

function DataDisplayPatternsDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Data Display Patterns</h1>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">OverflowList</h2>
      <div className="mt-3 w-[200px]">
        <OverflowList
          data-testid="overflow-list-demo"
          items={["Design", "Engineering", "Product", "Marketing", "Sales"]}
        />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">RollingNumber</h2>
      <RollingNumberDemo />

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">PickList</h2>
      <PickListDemo />

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Gallery</h2>
      <Gallery
        data-testid="gallery-demo"
        images={[
          { src: PLACEHOLDER_FULL, thumbnailSrc: PLACEHOLDER_THUMB, alt: "Placeholder image 1" },
          { src: PLACEHOLDER_FULL, thumbnailSrc: PLACEHOLDER_THUMB, alt: "Placeholder image 2" },
        ]}
      />

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Compare</h2>
      <Compare
        data-testid="compare-demo"
        beforeSrc={BEFORE_IMAGE}
        afterSrc={AFTER_IMAGE}
        beforeAlt="Before"
        afterAlt="After"
      />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataDisplayPatternsDemo />
  </StrictMode>,
);
