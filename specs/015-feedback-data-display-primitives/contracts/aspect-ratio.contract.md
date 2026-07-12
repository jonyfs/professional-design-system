# Component Contract: AspectRatio

## Markup contract

```html
<div class="aspect-[16/9] w-full overflow-hidden rounded-md">
  <img src="/example.jpg" alt="Example" class="h-full w-full object-cover" />
</div>
```

**No new CSS class** (R5) — `aspect-[16/9]`/`aspect-square`/`aspect-[4/3]`
are plain Tailwind utilities backed by the standard `aspect-ratio` CSS
property (confirmed supported in all three target engines, R2). The ratio
is a per-instance choice, not a ratified design token.

## Required classes (Principle V gate)

Non-interactive — no state suffixes apply.

## Required attributes

- The contained media element MUST have a real `alt` (images) or
  appropriate accessible name (iframes/video) — AspectRatio itself adds no
  new accessibility requirement beyond what the contained media already
  needs

## Token allowlist used

`rounded-md` (optional, matching existing radius scale). No new tokens.

## Acceptance mapping

- FR-002, SC-001 → `tests/e2e/aspect-ratio.spec.ts`
