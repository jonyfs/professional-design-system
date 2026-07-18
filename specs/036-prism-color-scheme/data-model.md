# Phase 1 Data Model: Prism Color Scheme

No new entity type. Reuses feature 017's existing `ThemeDefinition`
shape verbatim (`shared/design-tokens.ts`):

```ts
interface ThemeDefinition {
  id: string;                 // "prism"
  displayName: string;        // "Prism"
  moodFamily: string;         // one of the 7 existing MOOD_FAMILIES
  sourceReference: string;    // this feature's derivation, condensed
  isDefault?: boolean;        // absent (not the default theme)
  tokens: ThemeTokens;        // the existing fixed 21-key color schema
}
```

## `prism` entry

| Field | Value |
|---|---|
| `id` | `prism` |
| `displayName` | `Prism` |
| `moodFamily` | `Light Professional` (R2: light-canvas majority, joining `light`/`corporate`) |
| `tokens` | 21-key `ThemeTokens` object — see research.md R3-R5 for full derivation; final adjusted hex values recorded directly in `shared/design-tokens.ts` during implementation |

No relationships to other entities beyond the existing `THEMES` array
membership and `MOOD_FAMILIES` grouping — identical shape to every one
of the other 48 entries.
