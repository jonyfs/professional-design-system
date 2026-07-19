# Data Model: Professional Multi-Screen Showcase Expansion

No application data model beyond the existing showcase's sample-data convention. Entities:

## Screen (route)

- **Represents**: one routable view (`Dashboard`, `Team`, `Settings`, `Analytics`, `Onboarding`).
- **Fields**: path, nav label/icon (consumed by `Sidebar`), the screen's own component tree.
- **Relationship**: all screens render inside one shared layout (persistent `Sidebar` + `Navbar` chrome, per research.md R3).

## Sample data set (per screen)

- **Represents**: realistic, purpose-appropriate fixture data for a screen (e.g. `teamMembers`, `settingsFields`, `analyticsSeries`, `onboardingSteps`), following `showcase/src/data/sample-data.ts`'s existing convention (typed, hand-authored, not lorem-ipsum).
- **Location**: extends `showcase/src/data/` with one file per new screen or additions to the existing file, matching current convention.

## Component usage record

- **Represents**: the (component name → screen(s) it appears on) mapping computed at implementation time for SC-002's coverage count.
- **Not persisted at runtime** — a one-time count reported in the PR description, per research.md R4.

## Competitive assessment

- **Represents**: the written document (User Story 3's deliverable) — see research.md R5 for its sourcing.
