# Phase 1 Data Model: Configurable Social Login Buttons

## ProviderId (built-in presets)

A closed union — the only 5 providers with a governed preset (research.md R1/R2):

```ts
type ProviderId = "google" | "apple" | "facebook" | "microsoft" | "github";
```

## ProviderPreset

One per `ProviderId`, defined once in `shared/social-login-providers.ts`
(data source of truth) and re-expressed as a React-side preset map in
`packages/react/src/SocialLoginGroup/providers.tsx` (icon as a real
`ReactNode`, not a string reference — per this catalog's dual-surface
convention, the two surfaces don't share runtime code, only the same
underlying decisions).

| Field | Type | Notes |
|---|---|---|
| `id` | `ProviderId` | Discriminant |
| `label` | `string` | Approved CTA text, e.g. `"Continue with Apple"` (FR-002) |
| `icon` | `ReactNode` (React) / inline `<svg>` (static HTML) | Hand-authored brand mark (research.md R3) |
| `appearance` | `"neutral"` \| `"monochrome"` | `"neutral"` (default, all 5): `neutral-50` bg / `neutral-900` text, brand color confined to the icon. `"monochrome"` (Apple/GitHub only, optional): the provider's own black/near-black/white brand fill — both extremes AAA-safe on their own (research.md R1). |
| `accentColor` | fixed `providerBrand.*` token reference | Used only for the icon glyph/backing, never the button surface when `appearance: "neutral"` |

Not exposed to callers: there is no prop that lets a consumer override
`label`, `icon`, `accentColor`, or force `appearance: "monochrome"`
onto a provider whose guideline forbids it — for Apple and Google
specifically, no color-override path exists in the component's API
surface at all (FR-006). This is a closed, curated preset table, not a
caller-editable one.

## CustomProviderEntry

For any provider outside the 5 built-in presets (Instagram, TikTok,
Discord, X/Twitter, LinkedIn, an internal/private IdP, etc.):

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Caller-supplied, unique within the group instance |
| `label` | `string` | Full CTA text, e.g. `"Continue with Instagram"` — caller's responsibility (FR-004) |
| `icon` | `ReactNode` (React) / inline `<svg>` (static HTML) | Caller-supplied |
| `color` | `string` (any valid CSS color) | Styles ONLY the icon's accent backing (research.md R5) — never the button surface or text |
| `onSelect` | `() => void` (optional, entry-level) | If present, called instead of / in addition to the group-level `onProviderSelect` for this entry specifically |

A `CustomProviderEntry` always renders with `appearance: "neutral"` —
there is no `monochrome` option for custom entries, since that
exemption is specific to Apple/GitHub's own verified-safe brand
extremes (research.md R1), not a general-purpose escape hatch.

## SocialLoginGroup (the composed entity)

| Field | Type | Notes |
|---|---|---|
| `providers` | `Array<ProviderId \| CustomProviderEntry>` | Ordered; rendered in this exact order (FR-001). Empty array → renders nothing (FR-010). |
| `mode` | `"stacked"` \| `"compact"` | Applies to the whole group (FR-007) |
| `loadingProviderIds` | `Set<string>` (or equivalent) | Providers currently showing a loading state (FR-005); independent per entry |
| `disabledProviderIds` | `Set<string>` (or equivalent) | Providers currently disabled (FR-005); independent per entry |
| `onProviderSelect` | `(id: string) => void` | Group-level selection callback (FR-003). Fires with the provider's `id` (a `ProviderId` string for presets, the caller's own `id` for custom entries) |

### State transitions

`SocialLoginGroup` itself is stateless — `loadingProviderIds` /
`disabledProviderIds` are caller-controlled (the host application owns
the actual auth-in-progress state and re-renders the group with an
updated set), matching this catalog's existing convention for
externally-controlled overlay/async components (Modal, Toast).

### Relationships

```text
SocialLoginGroup
├── providers: ordered list of (ProviderPreset | CustomProviderEntry)
│     ProviderPreset --references--> providerBrand token (research.md R2)
│     CustomProviderEntry --receives--> caller-supplied color (research.md R5)
└── mode: shared layout applied uniformly to every rendered button
