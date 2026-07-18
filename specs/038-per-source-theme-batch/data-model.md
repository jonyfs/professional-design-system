# Phase 1 Data Model: Per-Source Theme Batch

No new entity type. Reuses feature 017's existing `ThemeDefinition`
shape verbatim (`shared/design-tokens.ts`), identical to every prior
batch (027, 036):

```ts
interface ThemeDefinition {
  id: string;                 // e.g. "fuchsia"
  displayName: string;        // e.g. "Fuchsia"
  moodFamily: string;         // one of the 7 existing MOOD_FAMILIES
  sourceReference: string;    // "Inspired by <site>'s DESIGN.md — feature 038"
  isDefault?: boolean;        // absent for all 70
  tokens: ThemeTokens;        // the existing fixed 21-key color schema
}
```

## 70 entries

Each of the 70 rows in research.md R6 becomes one `ThemeDefinition`:
`id`/`displayName`/`moodFamily` taken directly from the table; `tokens`
= the full 21-key palette produced by the derivation pipeline
(research.md R3-R4), recorded directly in `shared/design-tokens.ts`
during implementation. `sourceReference` names the originating site by
its real public brand name (research provenance only — matches feature
027's established precedent of citing sources without implying
endorsement or trademark use).

No relationships to other entities beyond `THEMES` array membership
and `MOOD_FAMILIES` grouping — identical shape to every one of the
other 49 entries (feature 038 brings the total from 49 to 119).
