import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeIcon, Blockquote, BackgroundImage, Watermark } from "professional-design-system";
import "professional-design-system/styles.css";
import "./harness.css";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22400%22%20height%3D%22200%22%3E%3Crect%20width%3D%22400%22%20height%3D%22200%22%20fill%3D%22%236B7280%22/%3E%3C/svg%3E";

function DataDisplayComposablesDemo() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">Data Display Composables</h1>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">ThemeIcon</h2>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <ThemeIcon
          data-testid="theme-icon-success"
          color="success"
          label="Success"
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Blockquote</h2>
      <Blockquote cite="— Steve Jobs">
        <p>Design is not just what it looks like and feels like. Design is how it works.</p>
      </Blockquote>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">BackgroundImage</h2>
      <div className="mt-3">
        <BackgroundImage data-testid="background-image-demo" src={PLACEHOLDER_IMAGE}>
          <h2 className="text-lg font-semibold">Overlaid content</h2>
          <p className="mt-1 text-sm">Legible against the image via the scrim.</p>
        </BackgroundImage>
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-700">Watermark</h2>
      <div className="mt-3 max-w-md rounded-lg border border-neutral-200 p-6">
        <Watermark data-testid="watermark-demo" text="CONFIDENTIAL">
          <p className="text-sm text-neutral-900">
            This document contains sensitive information.
          </p>
        </Watermark>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DataDisplayComposablesDemo />
  </StrictMode>,
);
