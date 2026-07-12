# Graph Report - professional-design-system  (2026-07-10)

## Corpus Check
- 254 files · ~483,464 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1523 nodes · 1421 edges · 197 communities (171 shown, 26 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `da681ef4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Shared Bash Utilities
- Implementation & Planning Artifacts
- Spec Quality & Convergence
- Agent Context Extension
- Feature Specification & Clarification
- Constitution & Templates Skill
- Feature Specification: Design System Primitive Components
- Feature Branch Creation Script
- Agent Context Update Pipeline
- GitHub Issue Conversion
- PowerShell Agent Context Updater
- Prerequisite Check Script
- Plan Setup Script
- Tasks Setup Script
- Checklist Template
- Now
- Cognitive Ergonomics & Visual Hierarchy
- Tailwind-Only Architecture
- Project Language Policy
- Autonomous Skill Acquisition Protocol
- Checklist Template
- Constitution Template
- Component Contract: Badge
- devDependencies
- audit-tokens.mjs
- compilerOptions
- check-contrast.mjs
- a11y-helper.ts
- playwright.config.ts
- tailwind.config.ts
- Specification Quality Checklist: Form Primitives — Round 2
- Quickstart: Form Primitives — Round 2
- Component Contract: Toggle / Switch
- Component Contract: Radio
- Component Contract: Select
- Phase 0 Research: Form Primitives — Round 2
- Phase 1 Data Model: Form Primitives — Round 2
- Tasks: Form Primitives — Round 2
- Implementation Plan: Advanced Forms Primitives
- Specification Quality Checklist: Overlays — Modal, Slide-over, Toast
- Component Contract: Toast
- Implementation Plan: Overlays — Modal, Slide-over, Toast
- Quickstart: Overlays — Modal, Slide-over, Toast
- Component Contract: Modal
- Component Contract: Slide-over
- Phase 0 Research: Overlays — Modal, Slide-over, Toast
- Phase 1 Data Model: Overlays — Modal, Slide-over, Toast
- Tasks: Overlays — Modal, Slide-over, Toast
- overlay.js
- Specification Quality Checklist: React Component Library (Claude Design Compatibility)
- Quickstart: React Component Library
- Phase 0 Research: React Component Library (Claude Design Compatibility)
- Tasks: React Component Library (Claude Design Compatibility)
- Contract: `packages/react` package shape
- Contract: Component prop shapes and reference implementations
- Phase 1 Data Model: React Component Library
- package.json
- devDependencies
- compilerOptions
- compilerOptions
- Button.tsx
- index.ts
- select-main.tsx
- Select.tsx
- toast-main.tsx
- Checkbox.tsx
- Radio.tsx
- TextInput.tsx
- Toggle.tsx
- Implementation Plan: Navigation & Disclosure Primitives
- Tasks: Navigation & Disclosure Primitives
- Quickstart: Navigation & Disclosure Primitives
- Component Contract: Accordion / Disclosure
- Component Contract: Breadcrumbs
- Component Contract: Dropdown Menu
- Component Contract: Tabs
- Phase 1 Data Model: Navigation & Disclosure Primitives
- Phase 0 Research: Navigation & Disclosure Primitives
- Implementation Plan: Data Display Primitives
- Tasks: Data Display Primitives
- Quickstart: Data Display Primitives
- Component Contract: Alert / Banner
- Component Contract: Avatar
- Component Contract: Card
- Phase 0 Research: Data Display Primitives
- Phase 1 Data Model: Data Display Primitives
- Implementation Plan: Application Shell Primitives
- Tasks: Application Shell Primitives
- Quickstart: Application Shell Primitives
- Component Contract: Navbar / Header
- Component Contract: Pagination
- Component Contract: Sidebar
- Phase 0 Research: Application Shell Primitives
- Phase 1 Data Model: Application Shell Primitives
- Quickstart: Advanced Forms Primitives
- Component Contract: Combobox
- Component Contract: Command Palette
- Phase 0 Research: Advanced Forms Primitives (Combobox, Command Palette)
- Phase 1 Data Model: Advanced Forms Primitives
- Implementation Plan: Advanced Forms Primitives
- Tasks: Advanced Forms Primitives
- Implementation Plan: React Port — Navigation & Disclosure Primitives
- Quickstart: React Port — Navigation & Disclosure Primitives
- Component Contract: Accordion (React)
- Component Contract: Dropdown Menu (React)
- Component Contract: Tabs (React)
- Component Contract: Breadcrumbs (React)
- Phase 0 Research: React Port — Navigation & Disclosure Primitives
- Phase 1 Data Model: React Port — Navigation & Disclosure Primitives
- Tasks: React Port — Navigation & Disclosure Primitives
- index.ts
- accordion-main.tsx
- Button.tsx
- Modal.tsx
- SlideOver.tsx
- index.ts
- Breadcrumbs.tsx
- tabs-main.tsx
- DropdownMenu.tsx
- dropdown-menu-main.tsx
- Professional Design System
- Implementation Plan: Fix Popover Panel Positioning (Dropdown Menu, Combobox)
- Quickstart: Fix Popover Panel Positioning
- Phase 0 Research: Fix Popover Panel Positioning
- Fix Contract: Combobox Listbox Positioning
- Fix Contract: Dropdown Menu Panel Positioning
- Tasks: Fix Popover Panel Positioning
- Implementation Plan: Lists Primitive
- Markup Shape
- Tasks: Lists Primitive
- Research: Lists Primitive
- Quickstart: Lists Primitive
- Data Model: Lists Primitive
- Implementation Plan: Table Primitive
- Research: Table Primitive
- Tasks: Table Primitive
- Contract: Table
- Quickstart: Table Primitive
- Data Model: Table Primitive

## God Nodes (most connected - your core abstractions)
1. `speckit-tasks Skill` - 15 edges
2. `speckit-plan Skill` - 14 edges
3. `Tasks: Design System Primitive Components` - 13 edges
4. `speckit-implement Skill` - 13 edges
5. `compilerOptions` - 12 edges
6. `compilerOptions` - 12 edges
7. `Tasks: React Port — Navigation & Disclosure Primitives` - 11 edges
8. `Tasks: Navigation & Disclosure Primitives` - 11 edges
9. `scripts` - 11 edges
10. `speckit-specify Skill` - 11 edges

## Surprising Connections (you probably didn't know these)
- `speckit-plan Skill` --references--> `CLAUDE.md (Coding Agent Context File)`  [EXTRACTED]
  .claude/skills/speckit-plan/SKILL.md → .claude/skills/speckit-agent-context-update/SKILL.md
- `speckit-implement Skill` --references--> `checklists/ (Requirement Checklists Directory)`  [EXTRACTED]
  .claude/skills/speckit-implement/SKILL.md → .claude/skills/speckit-checklist/SKILL.md
- `speckit-clarify Skill` --references--> `checklists/requirements.md (Spec Quality Checklist)`  [EXTRACTED]
  .claude/skills/speckit-clarify/SKILL.md → .claude/skills/speckit-specify/SKILL.md
- `speckit-specify Skill` --references--> `.specify/templates/plan-template.md`  [EXTRACTED]
  .claude/skills/speckit-specify/SKILL.md → .claude/skills/speckit-constitution/SKILL.md
- `speckit-tasks Skill` --references--> `.specify/templates/tasks-template.md`  [EXTRACTED]
  .claude/skills/speckit-tasks/SKILL.md → .claude/skills/speckit-constitution/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Extension Hooks Pre/Post-Execution Pattern** — claude_skills_speckit_agent_context_update_skill, claude_skills_speckit_analyze_skill, claude_skills_speckit_checklist_skill, claude_skills_speckit_clarify_skill, claude_skills_speckit_constitution_skill, claude_skills_speckit_converge_skill, claude_skills_speckit_implement_skill, claude_skills_speckit_plan_skill, claude_skills_speckit_specify_skill, claude_skills_speckit_tasks_skill, claude_skills_speckit_taskstoissues_skill, concept_extensions_yml [INFERRED 0.85]
- **Constitution Authority Enforcement Across Commands** — concept_constitution_md, claude_skills_speckit_specify_skill, claude_skills_speckit_clarify_skill, claude_skills_speckit_plan_skill, claude_skills_speckit_tasks_skill, claude_skills_speckit_analyze_skill, claude_skills_speckit_checklist_skill, claude_skills_speckit_converge_skill, claude_skills_speckit_implement_skill [INFERRED 0.85]
- **Spec-Driven Development Workflow Pipeline** — claude_skills_speckit_specify_skill, claude_skills_speckit_clarify_skill, claude_skills_speckit_plan_skill, claude_skills_speckit_tasks_skill, claude_skills_speckit_analyze_skill, claude_skills_speckit_checklist_skill, claude_skills_speckit_implement_skill, claude_skills_speckit_converge_skill [INFERRED 0.85]
- **Agent Context Extension Bundle** — specify_extensions_config, specify_extensions_agent_context_extension_manifest, specify_extensions_agent_context_agent_context_config_config, specify_extensions_agent_context_commands_speckit_agent_context_update_command, specify_extensions_agent_context_readme_doc [EXTRACTED 1.00]
- **Spec-Driven Development Template Pipeline** — specify_templates_spec_template_document, specify_templates_plan_template_document, specify_templates_tasks_template_document, specify_templates_checklist_template_document [INFERRED 0.85]

## Communities (197 total, 26 thin omitted)

### Community 0 - "Shared Bash Utilities"
Cohesion: 0.13
Nodes (5): get_feature_paths(), get_repo_root(), _persist_feature_json(), resolve_specify_init_dir(), common.sh script

### Community 1 - "Implementation & Planning Artifacts"
Cohesion: 0.22
Nodes (8): Complexity Tracking, Constitution Check, Documentation (this feature), Implementation Plan: Design System Primitive Components, Project Structure, Source Code (repository root), Summary, Technical Context

### Community 2 - "Spec Quality & Convergence"
Cohesion: 0.16
Nodes (34): speckit-agent-context-update Skill, speckit-analyze Skill, speckit-checklist Skill, speckit-clarify Skill, speckit-constitution Skill, speckit-converge Skill, speckit-implement Skill, speckit-plan Skill (+26 more)

### Community 3 - "Agent Context Extension"
Cohesion: 0.09
Nodes (21): Advanced Forms & Interaction, Alignment Grid & Spacing, Application & Navigation, Base Semantic Palette, Component Catalog & Tailwind UI Patterns, Core Principles, Data Display & Listings, Design Foundations: Tokens, Typography & Grid (+13 more)

### Community 4 - "Feature Specification & Clarification"
Cohesion: 0.33
Nodes (10): Agent Context Config (context_file / context_markers), speckit.agent-context.update Command, Agent Context Extension Manifest, Context Section Upsert/Remove Gate Mechanism, Coding Agent Context Extension README, Spec Kit Extensions Registration Config, Implementation Plan Template, Feature Specification Template (+2 more)

### Community 5 - "Constitution & Templates Skill"
Cohesion: 0.08
Nodes (25): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation Strategy, Incremental Delivery (the order this session follows), MVP First (User Story 1 Only) (+17 more)

### Community 6 - "Feature Specification: Design System Primitive Components"
Cohesion: 0.11
Nodes (16): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Design System Primitive Components, Assumptions, Edge Cases, Feature Specification: Design System Primitive Components (+8 more)

### Community 9 - "GitHub Issue Conversion"
Cohesion: 0.22
Nodes (8): Discoverability check (SC-001), Manual validation scenarios (traceable to spec.md), Prerequisites, Quickstart: Design System Primitive Components, Run the component gallery, Run the full test suite, Validate AAA contrast (Principle II gate), Validate token discipline (Principle IV gate)

### Community 10 - "PowerShell Agent Context Updater"
Cohesion: 0.29
Nodes (6): Acceptance mapping, Component Contract: Button, Markup contract, Required attributes, Required classes (Principle V gate), Token allowlist used

### Community 18 - "Cognitive Ergonomics & Visual Hierarchy"
Cohesion: 0.29
Nodes (6): Acceptance mapping, Component Contract: Checkbox, Keyboard behavior (FR-006), Markup contract, Required attributes (Principle II + V gates), Token allowlist used

### Community 19 - "Tailwind-Only Architecture"
Cohesion: 0.29
Nodes (6): Acceptance mapping, Component Contract: Text Input, Markup contract (default/focus), Markup contract (error state), Required attributes (Principle II gate), Token allowlist used

### Community 20 - "Project Language Policy"
Cohesion: 0.29
Nodes (6): Badge, Button, Checkbox, Cross-cutting invariants (all four components), Phase 1 Data Model: Design System Primitive Components, Text Input

### Community 21 - "Autonomous Skill Acquisition Protocol"
Cohesion: 0.25
Nodes (7): Decision: Custom Node scripts for token-discipline and contrast gates, Decision: Playwright for visual regression + accessibility, Decision: Tailwind CSS 3.4.x (config-file based), not Tailwind 4, Decision: Vite 8.x as the dev/build tool (not 5.x), Decision: Vite as the dev/build tool, Phase 0 Research: Design System Primitive Components, Resolved unknowns

### Community 24 - "Component Contract: Badge"
Cohesion: 0.33
Nodes (5): Acceptance mapping, Component Contract: Badge, Long-label handling (Edge Case), Markup contract (one per variant), Required variant → token mapping (FR-003, exactly four variants)

### Community 25 - "devDependencies"
Cohesion: 0.07
Nodes (27): description, devDependencies, autoprefixer, @axe-core/playwright, @playwright/test, postcss, tailwindcss, @types/node (+19 more)

### Community 26 - "audit-tokens.mjs"
Cohesion: 0.10
Nodes (20): allowedColorNames, allowedRadiusClasses, applyBlocks, checkClass(), COLOR_PREFIXES, configSource, extractBalancedBlock(), isStructuralSuffix() (+12 more)

### Community 27 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, isolatedModules, lib, module, moduleResolution, noEmit, resolveJsonModule (+5 more)

### Community 28 - "check-contrast.mjs"
Cohesion: 0.11
Nodes (17): applyBlocks, BASE_TOKENS, COVERED_FG_TOKENS, failures, htmlFiles, ICON_FILL_TEXT_TOKENS, NON_COLOR_TEXT_SUFFIXES, PAIRINGS (+9 more)

### Community 29 - "a11y-helper.ts"
Cohesion: 0.42
Nodes (3): expectNoA11yViolations(), expectNoConsoleErrors(), formatViolations()

### Community 32 - "tailwind.config.ts"
Cohesion: 0.73
Nodes (3): borderRadius, colors, fontFamily

### Community 38 - "Specification Quality Checklist: Form Primitives — Round 2"
Cohesion: 0.07
Nodes (25): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Form Primitives — Round 2, Complexity Tracking, Constitution Check, Documentation (this feature) (+17 more)

### Community 40 - "Quickstart: Form Primitives — Round 2"
Cohesion: 0.22
Nodes (8): Discoverability check (SC-001), Generating new visual regression baselines (read this before running --update-snapshots), Manual validation scenarios (traceable to spec.md), Prerequisites, Quickstart: Form Primitives — Round 2, Run the component gallery, Run the full test suite, Validate token discipline and AAA contrast (Principle IV / II gates)

### Community 41 - "Component Contract: Toggle / Switch"
Cohesion: 0.25
Nodes (7): Acceptance mapping, Component Contract: Toggle / Switch, Keyboard behavior (FR-005), Markup contract, Required attributes, Required classes (state coverage, FR-003), Token allowlist used

### Community 42 - "Component Contract: Radio"
Cohesion: 0.29
Nodes (6): Acceptance mapping, Component Contract: Radio, Keyboard behavior (FR-005), Markup contract (group of 3), Required attributes (Principle II + V gates, FR-001), Token allowlist used

### Community 43 - "Component Contract: Select"
Cohesion: 0.29
Nodes (6): Acceptance mapping, Component Contract: Select, Markup contract (default/focus), Markup contract (error state), Required attributes (Principle II gate), Token allowlist used

### Community 44 - "Phase 0 Research: Form Primitives — Round 2"
Cohesion: 0.25
Nodes (7): Decision: Radio reuses Checkbox's exact token vocabulary — verified, not assumed, Decision: `rounded-full` ratified as a border-radius token (constitution v1.3.4), Decision: Select reuses Text Input's exact token vocabulary — verified, Decision: Toggle gets a `ring-neutral-500` boundary — a real gap found, not silently reproduced, Decision: Visual regression baselines generated only via CI, never locally, Phase 0 Research: Form Primitives — Round 2, Resolved unknowns

### Community 45 - "Phase 1 Data Model: Form Primitives — Round 2"
Cohesion: 0.33
Nodes (5): Cross-cutting invariants (all three components), Phase 1 Data Model: Form Primitives — Round 2, Radio Group, Select, Toggle

### Community 46 - "Tasks: Form Primitives — Round 2"
Cohesion: 0.09
Nodes (22): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation Strategy, Incremental Delivery (the order this session follows), MVP First (User Story 1 Only) (+14 more)

### Community 49 - "Implementation Plan: Advanced Forms Primitives"
Cohesion: 0.11
Nodes (16): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Advanced Forms Primitives, Assumptions, Edge Cases, Feature Specification: Advanced Forms Primitives (Combobox, Command Palette) (+8 more)

### Community 50 - "Specification Quality Checklist: Overlays — Modal, Slide-over, Toast"
Cohesion: 0.11
Nodes (17): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Overlays — Modal, Slide-over, Toast, Assumptions, Edge Cases, Feature Specification: Overlays — Modal, Slide-over, Toast (+9 more)

### Community 51 - "Component Contract: Toast"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring (`src/scripts/toast.js`), Component Contract: Toast, Edge case — multiple simultaneous toasts, Markup contract, Required attributes (FR-002), Token allowlist used, Variants (constitution's ratified status tokens, same mapping as Badge)

### Community 52 - "Implementation Plan: Overlays — Modal, Slide-over, Toast"
Cohesion: 0.22
Nodes (8): Complexity Tracking, Constitution Check, Documentation (this feature), Implementation Plan: Overlays — Modal, Slide-over, Toast, Project Structure, Source Code (repository root, additions only — existing scaffold unchanged), Summary, Technical Context

### Community 53 - "Quickstart: Overlays — Modal, Slide-over, Toast"
Cohesion: 0.22
Nodes (8): Discoverability check (SC-001), Generating new visual regression baselines, Manual validation scenarios (traceable to spec.md), Prerequisites, Quickstart: Overlays — Modal, Slide-over, Toast, Run the component gallery, Run the full test suite, Validate token discipline and AAA/non-text contrast (Principle IV / II gates)

### Community 54 - "Component Contract: Modal"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring (`src/scripts/overlay.js`), Component Contract: Modal, Edge case — no focusable content, Markup contract, Required attributes (Principle II gate, FR-001/FR-005/FR-007), Required classes — `close-icon-btn` (Principle V gate), Token allowlist used

### Community 55 - "Component Contract: Slide-over"
Cohesion: 0.25
Nodes (7): Acceptance mapping, Component Contract: Slide-over, Edge case — no focusable content, Edge case — Shift+Tab wraps within the panel, Markup contract, Required attributes (Principle II gate, FR-003/FR-005/FR-007), Token allowlist used

### Community 56 - "Phase 0 Research: Overlays — Modal, Slide-over, Toast"
Cohesion: 0.25
Nodes (7): Decision: close-button icon color corrected from `text-neutral-400` to `text-neutral-500`/`text-neutral-600`, Decision: extend `audit-tokens.mjs`/`check-contrast.mjs` to also scan `tailwind.css`, fixed now rather than deferred, Decision: Native `<dialog>` + `showModal()` for Modal and Slide-over, not a hand-rolled focus-trap script, Decision: Slide-over reuses the same `<dialog>` mechanism as Modal, Decision: Toast does NOT use `<dialog>` — it is explicitly non-modal, Phase 0 Research: Overlays — Modal, Slide-over, Toast, Resolved unknowns

### Community 57 - "Phase 1 Data Model: Overlays — Modal, Slide-over, Toast"
Cohesion: 0.20
Nodes (9): Cross-cutting invariants (all three components), dialog`/`.modal-panel` had only their color-token allowlist documented), doc; `/speckit-analyze` flagged this as underspecified, since `.modal-, Full utility composition (from the constitution's ratified Overlays,, Modal, Modals & Feedback pattern — not previously written out in any Phase 1, Phase 1 Data Model: Overlays — Modal, Slide-over, Toast, Slide-over (+1 more)

### Community 58 - "Tasks: Overlays — Modal, Slide-over, Toast"
Cohesion: 0.09
Nodes (22): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation Strategy, Incremental Delivery (the order this session follows), MVP First (User Story 1 Only) (+14 more)

### Community 59 - "overlay.js"
Cohesion: 0.70
Nodes (3): initCommandPalette(), initDialogTriggers(), wireDialogClose()

### Community 60 - "Specification Quality Checklist: React Component Library (Claude Design Compatibility)"
Cohesion: 0.07
Nodes (25): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: React Component Library (Claude Design Compatibility), Complexity Tracking, Constitution Check, Documentation (this feature) (+17 more)

### Community 62 - "Quickstart: React Component Library"
Cohesion: 0.18
Nodes (10): Build the package, Discoverability check (SC-005), Manual validation scenarios (traceable to spec.md), Prerequisites, Quickstart: React Component Library, Run the full test suite (including the new React specs), Run the React test harness, Validate token discipline on `.tsx` source (Principle IV gate, extended) (+2 more)

### Community 63 - "Phase 0 Research: React Component Library (Claude Design Compatibility)"
Cohesion: 0.20
Nodes (9): Decision: duplicate the `@apply`/`@layer components` block (`.btn-primary` etc.) in the package's own `styles.css`, cite the HTML contract as the source of truth for the class list, Decision: extend `audit-tokens.mjs`/`check-contrast.mjs` to scan `.tsx` files' `className` props, Decision: Modal/Slide-over's DOM wiring becomes a shared `useDialogTrigger` hook, Decision: npm workspaces, not a monorepo tool, Decision: Playwright against a dev-only React test harness, not React Testing Library, Decision: shared `shared/design-tokens.ts`, not two independently-declared Tailwind configs, Decision: `tsup` for the package build, not Vite library mode, Phase 0 Research: React Component Library (Claude Design Compatibility) (+1 more)

### Community 64 - "Tasks: React Component Library (Claude Design Compatibility)"
Cohesion: 0.09
Nodes (21): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Foundational (blocks all of Phase 1), Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation Strategy, Incremental Delivery (the order this session follows) (+13 more)

### Community 65 - "Contract: `packages/react` package shape"
Cohesion: 0.25
Nodes (7): Acceptance mapping, Contract: `packages/react` package shape, `package.json`, Root `package.json` change, `src/index.ts` (barrel export), `tailwind.config.ts` (package-local), `tsup.config.ts`

### Community 66 - "Contract: Component prop shapes and reference implementations"
Cohesion: 0.33
Nodes (5): Acceptance mapping, `Button` (User Story 1 reference), Contract: Component prop shapes and reference implementations, `Modal` (User Story 3 reference), `useDialogTrigger` hook (shared by Modal/SlideOver)

### Community 67 - "Phase 1 Data Model: React Component Library"
Cohesion: 0.33
Nodes (5): Component (one row per shipped primitive), Cross-cutting invariants, Package, Phase 1 Data Model: React Component Library, `shared/design-tokens.ts`

### Community 68 - "package.json"
Cohesion: 0.07
Nodes (27): devDependencies, react, react-dom, tailwindcss, tsup, @types/react, @types/react-dom, typescript (+19 more)

### Community 69 - "devDependencies"
Cohesion: 0.10
Nodes (19): dependencies, @professional-design-system/react, react, react-dom, devDependencies, autoprefixer, postcss, tailwindcss (+11 more)

### Community 70 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module, moduleResolution (+5 more)

### Community 71 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, esModuleInterop, jsx, lib, module, moduleResolution, noEmit, skipLibCheck (+3 more)

### Community 91 - "Select.tsx"
Cohesion: 0.50
Nodes (3): Select, SelectOption, SelectProps

### Community 104 - "Implementation Plan: Navigation & Disclosure Primitives"
Cohesion: 0.07
Nodes (26): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Navigation & Disclosure Primitives, Complexity Tracking, Constitution Check, Documentation (this feature) (+18 more)

### Community 105 - "Tasks: Navigation & Disclosure Primitives"
Cohesion: 0.10
Nodes (19): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation for User Story 4, Implementation Strategy, Parallel Execution Examples (+11 more)

### Community 106 - "Quickstart: Navigation & Disclosure Primitives"
Cohesion: 0.20
Nodes (9): Constitution amendment reminder, Discoverability check (SC-004), Generating new visual regression baselines, Manual validation scenarios (traceable to spec.md), Prerequisites, Quickstart: Navigation & Disclosure Primitives, Run the component gallery, Run the full test suite (+1 more)

### Community 107 - "Component Contract: Accordion / Disclosure"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring, Component Contract: Accordion / Disclosure, Edge cases (long content, layout shift), Markup contract, Required attributes (Principle II gate, FR-003/FR-004), Required states (Principle V gate), Token allowlist used

### Community 108 - "Component Contract: Breadcrumbs"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring, Component Contract: Breadcrumbs, Edge cases (long trail / long label, narrow viewport), Markup contract, Required attributes (Principle II gate, FR-001), Required states (Principle V gate), Token allowlist used

### Community 109 - "Component Contract: Dropdown Menu"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring (`src/scripts/dropdown-menu.js`), Component Contract: Dropdown Menu, Edge cases, Markup contract, Required attributes (Principle II gate, FR-008/FR-009/FR-010), Required states (Principle V gate), Token allowlist used

### Community 110 - "Component Contract: Tabs"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring (`src/scripts/tabs.js`), Component Contract: Tabs, Edge case — narrow-viewport tab-row overflow, Markup contract, Required attributes (Principle II gate, FR-005/FR-006/FR-007), Required states (Principle V gate), Token allowlist used

### Community 111 - "Phase 1 Data Model: Navigation & Disclosure Primitives"
Cohesion: 0.29
Nodes (6): Accordion / Disclosure, Breadcrumbs, Cross-cutting invariants (all four components), Dropdown Menu, Phase 1 Data Model: Navigation & Disclosure Primitives, Tabs

### Community 112 - "Phase 0 Research: Navigation & Disclosure Primitives"
Cohesion: 0.29
Nodes (6): Phase 0 Research: Navigation & Disclosure Primitives, R1. Dropdown Menu interaction foundation: native Popover API vs. custom JS, R2. Tabs interaction: confirms no native element applies, R3. Design token sufficiency — verified, not assumed, R4. Testing strategy: consistent with features 001-004, R5. CSP: no change needed

### Community 119 - "Implementation Plan: Data Display Primitives"
Cohesion: 0.07
Nodes (25): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Data Display Primitives, Complexity Tracking, Constitution Check, Documentation (this feature) (+17 more)

### Community 120 - "Tasks: Data Display Primitives"
Cohesion: 0.12
Nodes (16): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation Strategy, Parallel Execution Examples, Path Conventions (+8 more)

### Community 121 - "Quickstart: Data Display Primitives"
Cohesion: 0.20
Nodes (9): Constitution amendment reminder, Discoverability check (SC-005), Generating new visual regression baselines, Manual validation scenarios (traceable to spec.md), Prerequisites, Quickstart: Data Display Primitives, Run the component gallery, Run the full test suite (+1 more)

### Community 122 - "Component Contract: Alert / Banner"
Cohesion: 0.25
Nodes (7): Acceptance mapping, Behavior wiring (`src/scripts/alert.js`), Component Contract: Alert / Banner, Edge cases, Markup contract, Required attributes (Principle II gate, FR-006/FR-007/FR-008/FR-011), Token allowlist used

### Community 123 - "Component Contract: Avatar"
Cohesion: 0.25
Nodes (7): Acceptance mapping, Behavior wiring, Component Contract: Avatar, Edge cases, Markup contract, Required attributes (Principle II gate, FR-001/FR-002), Token allowlist used

### Community 124 - "Component Contract: Card"
Cohesion: 0.25
Nodes (7): Acceptance mapping, Behavior wiring, Component Contract: Card, Edge cases, Markup contract, Required attributes (Principle I/II gate, FR-004/FR-005), Token allowlist used

### Community 125 - "Phase 0 Research: Data Display Primitives"
Cohesion: 0.25
Nodes (7): Phase 0 Research: Data Display Primitives, R1. Alert/Banner dismiss mechanism, R2. AAA contrast — verified, not assumed (per feature 005's lesson), R3. Card visual treatment — no pre-existing ratified pattern, R4. Avatar sizing — Tailwind arbitrary sizes vs. a fixed scale, R5. Testing strategy: consistent with every prior feature, R6. No CSP or new-JS-dependency concerns

### Community 126 - "Phase 1 Data Model: Data Display Primitives"
Cohesion: 0.33
Nodes (5): Alert / Banner, Avatar, Card, Cross-cutting invariants (all three components), Phase 1 Data Model: Data Display Primitives

### Community 131 - "Implementation Plan: Application Shell Primitives"
Cohesion: 0.07
Nodes (25): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Application Shell Primitives, Complexity Tracking, Constitution Check, Documentation (this feature) (+17 more)

### Community 132 - "Tasks: Application Shell Primitives"
Cohesion: 0.12
Nodes (16): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation Strategy, Parallel Execution Examples, Path Conventions (+8 more)

### Community 133 - "Quickstart: Application Shell Primitives"
Cohesion: 0.20
Nodes (9): Constitution amendment reminder, Discoverability check (SC-005), Generating new visual regression baselines, Manual validation scenarios (traceable to spec.md), Prerequisites, Quickstart: Application Shell Primitives, Run the component gallery, Run the full test suite (+1 more)

### Community 134 - "Component Contract: Navbar / Header"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring, Component Contract: Navbar / Header, Edge cases, Markup contract, Required attributes (Principle I/II gate, FR-006/FR-007), Required states (Principle V gate), Token allowlist used

### Community 135 - "Component Contract: Pagination"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring, Component Contract: Pagination, Edge cases, Markup contract, Required attributes (Principle II gate, FR-001/FR-002/FR-003), Required states (Principle V gate), Token allowlist used

### Community 136 - "Component Contract: Sidebar"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring, Component Contract: Sidebar, Edge cases, Markup contract, Required attributes (Principle II gate, FR-005), Required states (Principle V gate), Token allowlist used — with two real AAA corrections

### Community 137 - "Phase 0 Research: Application Shell Primitives"
Cohesion: 0.29
Nodes (6): Phase 0 Research: Application Shell Primitives, R1. Navbar mobile menu — native `<details>`/`<summary>`, zero JavaScript, R2. Pagination — no pre-existing ratified pattern, R3. Sidebar and Navbar — implementing pre-existing ratified patterns, verified not assumed, R4. Testing strategy: consistent with every prior feature, R5. No CSP or new-JS-dependency concerns

### Community 138 - "Phase 1 Data Model: Application Shell Primitives"
Cohesion: 0.33
Nodes (5): Cross-cutting invariants (all three components), Navbar / Header, Pagination, Phase 1 Data Model: Application Shell Primitives, Sidebar

### Community 142 - "Quickstart: Advanced Forms Primitives"
Cohesion: 0.20
Nodes (9): Constitution amendment reminder, Discoverability check (SC-005), Generating new visual regression baselines, Manual validation scenarios (traceable to spec.md), Prerequisites, Quickstart: Advanced Forms Primitives, Run the component gallery, Run the full test suite (+1 more)

### Community 143 - "Component Contract: Combobox"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring (`src/scripts/combobox.js`), Component Contract: Combobox, Edge cases, Markup contract, Required attributes (Principle II gate, FR-001/FR-002/FR-003), Required states (Principle V gate), Token allowlist used

### Community 144 - "Component Contract: Command Palette"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring (`src/scripts/command-palette.js`), Component Contract: Command Palette, Edge cases, Markup contract, Required attributes (Principle II gate, FR-006/FR-007/FR-008/FR-009), Required states (Principle V gate), Token allowlist used

### Community 145 - "Phase 0 Research: Advanced Forms Primitives (Combobox, Command Palette)"
Cohesion: 0.22
Nodes (8): Phase 0 Research: Advanced Forms Primitives (Combobox, Command Palette), R1: `<datalist>` vs. a from-scratch WAI-ARIA 1.2 Combobox, R2: Popover API for the Combobox listbox panel, R3: Command Palette's dialog chrome and global shortcut scoping, R4: New design tokens needed?, R5: Highlighted-match substring style — sidesteps new-pairing risk entirely, R6: `:focus-visible` on option/action rows — why it's intentionally absent, Testing Strategy

### Community 146 - "Phase 1 Data Model: Advanced Forms Primitives"
Cohesion: 0.40
Nodes (4): Combobox, Command Palette, Phase 1 Data Model: Advanced Forms Primitives, Shared behavior notes

### Community 147 - "Implementation Plan: Advanced Forms Primitives"
Cohesion: 0.22
Nodes (8): Complexity Tracking, Constitution Check, Documentation (this feature), Implementation Plan: Advanced Forms Primitives, Project Structure, Source Code (repository root, additions only — existing scaffold unchanged), Summary, Technical Context

### Community 148 - "Tasks: Advanced Forms Primitives"
Cohesion: 0.14
Nodes (13): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation Strategy, Parallel Execution Examples, Path Conventions, Phase 1: User Story 1 - Combobox (Priority: P1) 🎯 MVP (+5 more)

### Community 152 - "Implementation Plan: React Port — Navigation & Disclosure Primitives"
Cohesion: 0.07
Nodes (26): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: React Port — Navigation & Disclosure Primitives, Complexity Tracking, Constitution Check, Documentation (this feature) (+18 more)

### Community 153 - "Quickstart: React Port — Navigation & Disclosure Primitives"
Cohesion: 0.20
Nodes (9): Constitution amendment reminder, Discoverability check (SC-003), Generating new visual regression baselines, Manual validation scenarios (traceable to spec.md), Prerequisites, Quickstart: React Port — Navigation & Disclosure Primitives, Run the full test suite, Run the React test harness (+1 more)

### Community 154 - "Component Contract: Accordion (React)"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Behavior wiring, Component Contract: Accordion (React), Edge cases, Props, Rendered markup, Required attributes (Principle II gate), Token allowlist used

### Community 155 - "Component Contract: Dropdown Menu (React)"
Cohesion: 0.22
Nodes (8): Acceptance mapping, Component Contract: Dropdown Menu (React), Props, Rendered markup, Required attributes (Principle II gate), Required states (Principle V gate), Token allowlist used, `useDropdownMenu(items)` hook contract (`hooks/useDropdownMenu.ts`)

### Community 156 - "Component Contract: Tabs (React)"
Cohesion: 0.25
Nodes (7): Acceptance mapping, Behavior wiring, Component Contract: Tabs (React), Props, Required attributes (Principle II gate), Required states (Principle V gate), Token allowlist used

### Community 157 - "Component Contract: Breadcrumbs (React)"
Cohesion: 0.29
Nodes (6): Acceptance mapping, Component Contract: Breadcrumbs (React), Props, Rendered markup (equivalent to `src/components/breadcrumbs/breadcrumbs.html`), Required attributes (Principle II gate), Token allowlist used

### Community 158 - "Phase 0 Research: React Port — Navigation & Disclosure Primitives"
Cohesion: 0.29
Nodes (6): Phase 0 Research: React Port — Navigation & Disclosure Primitives, R1: Accordion's exclusive-group mechanism in React, R2: Tabs' roving-tabindex pattern as React state, R3: Dropdown Menu — Popover API via imperative refs, not JSX attributes, R4: CSS duplication — confirmed, not assumed, Testing Strategy

### Community 159 - "Phase 1 Data Model: React Port — Navigation & Disclosure Primitives"
Cohesion: 0.33
Nodes (5): Accordion, Breadcrumbs, Dropdown Menu, Phase 1 Data Model: React Port — Navigation & Disclosure Primitives, Tabs

### Community 160 - "Tasks: React Port — Navigation & Disclosure Primitives"
Cohesion: 0.10
Nodes (19): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation for User Story 4, Implementation Strategy, Parallel Execution Examples (+11 more)

### Community 162 - "accordion-main.tsx"
Cohesion: 0.40
Nodes (3): exclusiveItems, exclusiveItems2, independentItems

### Community 173 - "DropdownMenu.tsx"
Cohesion: 0.57
Nodes (4): DropdownMenu(), DropdownMenuProps, DropdownMenuItemData, useDropdownMenu()

### Community 176 - "Professional Design System"
Cohesion: 0.20
Nodes (9): Component gallery, Governance, Professional Design System, Project structure, React package, Requirements, Scripts, Setup (+1 more)

### Community 177 - "Implementation Plan: Fix Popover Panel Positioning (Dropdown Menu, Combobox)"
Cohesion: 0.07
Nodes (24): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Fix Popover Panel Positioning, Complexity Tracking, Constitution Check, Documentation (this feature) (+16 more)

### Community 178 - "Quickstart: Fix Popover Panel Positioning"
Cohesion: 0.22
Nodes (8): Confirm the new assertion actually catches the bug, Constitution amendment reminder, Generating new visual regression baselines, Prerequisites, Quickstart: Fix Popover Panel Positioning, Run the full test suite, Validate token discipline and AAA/non-text contrast (Principle IV / II gates), Verify the fix manually

### Community 179 - "Phase 0 Research: Fix Popover Panel Positioning"
Cohesion: 0.29
Nodes (6): Phase 0 Research: Fix Popover Panel Positioning, R1: CSS Anchor Positioning API — browser support verified empirically, R2: Root cause, precisely, R3: Anchor-name uniqueness for multiple instances on one page, R4: CSS changes, no JS interaction-logic changes needed for keyboard/focus behavior, Testing Strategy

### Community 180 - "Fix Contract: Combobox Listbox Positioning"
Cohesion: 0.33
Nodes (5): Acceptance mapping, CSS change (`src/styles/tailwind.css`), Fix Contract: Combobox Listbox Positioning, JS change — unique per-instance anchor name, Required verification (Principle II / FR-004 gate)

### Community 181 - "Fix Contract: Dropdown Menu Panel Positioning"
Cohesion: 0.33
Nodes (5): Acceptance mapping, CSS change (`src/styles/tailwind.css` and `packages/react/src/styles.css`), Fix Contract: Dropdown Menu Panel Positioning, JS change — unique per-instance anchor name, Required verification (Principle II / FR-004 gate)

### Community 182 - "Tasks: Fix Popover Panel Positioning"
Cohesion: 0.25
Nodes (7): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation Strategy, Phase 1: User Story 1 - Dropdown Menu panel anchors to trigger (P1) 🎯 MVP, Phase 2: User Story 2 - Combobox listbox anchors to input (P2), Phase 3: Polish & Cross-Cutting Concerns, Tasks: Fix Popover Panel Positioning

### Community 183 - "Implementation Plan: Lists Primitive"
Cohesion: 0.07
Nodes (25): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Lists Primitive, Complexity Tracking, Constitution Check, Documentation (this feature) (+17 more)

### Community 184 - "Markup Shape"
Cohesion: 0.22
Nodes (8): Accessibility Contract, Contract: List / List Row, CSS Classes (Tailwind `@apply`, `src/styles/tailwind.css`), Interactive row (User Story 2), Markup Shape, Read-only row (User Story 1), Row with trailing action (User Story 3), Row with trailing chevron (User Story 3, second composition)

### Community 185 - "Tasks: Lists Primitive"
Cohesion: 0.22
Nodes (8): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation Strategy, Phase 1: User Story 1 - Read-only list of records (P1) 🎯 MVP, Phase 2: User Story 2 - Interactive, navigable list (P2), Phase 3: User Story 3 - List row with a trailing action (P3), Phase 4: Polish & Cross-Cutting Concerns, Tasks: Lists Primitive

### Community 186 - "Research: Lists Primitive"
Cohesion: 0.25
Nodes (7): R1: WCAG AAA contrast fix for metadata text, R2: Avatar reuse, R3: Interactive row semantic element, R4: No new design tokens, R5: Trailing-action ARIA, R6: Principle V exceptions for the interactive row, Research: Lists Primitive

### Community 187 - "Quickstart: Lists Primitive"
Cohesion: 0.29
Nodes (6): Prerequisites, Quickstart: Lists Primitive, Run the test suite, Validate the component, Verify the contrast fix, Verify token discipline

### Community 188 - "Data Model: Lists Primitive"
Cohesion: 0.50
Nodes (3): Data Model: Lists Primitive, List, List Item

### Community 190 - "Implementation Plan: Table Primitive"
Cohesion: 0.07
Nodes (25): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Table Primitive, Complexity Tracking, Constitution Check, Documentation (this feature) (+17 more)

### Community 191 - "Research: Table Primitive"
Cohesion: 0.20
Nodes (9): R1: Header/cell contrast verification, R1a: Class naming — avoiding Tailwind's own core utility collisions, R1b: Header vs. body cell vertical padding (py-3 vs py-4), R2: Semantic markup, not div-based tabular styling, R3: Zebra striping as a separate, composable variant, R4: No new design tokens, R5: Trailing-action cell — no new nested-interactive risk, R6: Overflow handling on narrow viewports (+1 more)

### Community 192 - "Tasks: Table Primitive"
Cohesion: 0.22
Nodes (8): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation Strategy, Phase 1: User Story 1 - Scannable tabular data (P1) 🎯 MVP, Phase 2: User Story 2 - Zebra-striped rows (P2), Phase 3: User Story 3 - Row with a trailing action (P3), Phase 4: Polish & Cross-Cutting Concerns, Tasks: Table Primitive

### Community 193 - "Contract: Table"
Cohesion: 0.25
Nodes (7): Accessibility Contract, Baseline table (User Story 1), Contract: Table, CSS Classes (Tailwind `@apply`, `src/styles/tailwind.css`), Markup Shape, Row with a trailing action (User Story 3), Zebra-striped table (User Story 2)

### Community 194 - "Quickstart: Table Primitive"
Cohesion: 0.29
Nodes (6): Prerequisites, Quickstart: Table Primitive, Run the test suite, Validate the component, Verify contrast, Verify token discipline

### Community 195 - "Data Model: Table Primitive"
Cohesion: 0.33
Nodes (5): Data Model: Table Primitive, Table, Table Cell, Table Header Cell, Table Row

## Knowledge Gaps
- **960 isolated node(s):** `CSS Classes (Tailwind `@apply`, `src/styles/tailwind.css`)`, `Baseline table (User Story 1)`, `Zebra-striped table (User Story 2)`, `Row with a trailing action (User Story 3)`, `Accessibility Contract` (+955 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `CSS Classes (Tailwind `@apply`, `src/styles/tailwind.css`)`, `Baseline table (User Story 1)`, `Zebra-striped table (User Story 2)` to the rest of the system?**
  _960 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shared Bash Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Should `Agent Context Extension` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Constitution & Templates Skill` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Feature Specification: Design System Primitive Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `audit-tokens.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.10144927536231885 - nodes in this community are weakly interconnected._