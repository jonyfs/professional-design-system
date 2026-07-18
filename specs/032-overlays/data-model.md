# Data Model: Overlays

## Affix State

| Field | Type | Notes |
|---|---|---|
| `isPinned` | boolean | Derived from `scrollY > naturalOffsetTop` — no persistence |
| `naturalOffsetTop` | number | The wrapped element's own document position, measured once on mount |

## LoadingOverlay State

| Field | Type | Notes |
|---|---|---|
| `isLoading` | boolean | Caller-controlled (prop/attribute), not internally timed |

No new entity for the container itself — any existing container
becomes overlay-scoped by pairing it with `.loading-overlay-container`.

## Bottom Sheet

Identical to Slide-over's existing entity shape (open/closed boolean,
focus-trap boundary via native `<dialog>`) — no new fields, only a
different anchor edge/max-height in its CSS geometry (research.md R4).
