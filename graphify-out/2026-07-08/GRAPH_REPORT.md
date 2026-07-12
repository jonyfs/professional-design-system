# Graph Report - professional-design-system  (2026-07-08)

## Corpus Check
- 103 files · ~157,601 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 614 nodes · 620 edges · 68 communities (58 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6efac6df`
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
- Specification Quality Checklist: Form Primitives — Round 2
- Quickstart: Form Primitives — Round 2
- Component Contract: Toggle / Switch
- Component Contract: Radio
- Component Contract: Select
- Phase 0 Research: Form Primitives — Round 2
- Phase 1 Data Model: Form Primitives — Round 2
- Tasks: Form Primitives — Round 2
- Professional Design System
- Specification Quality Checklist: Overlays — Modal, Slide-over, Toast
- Component Contract: Toast
- Implementation Plan: Overlays — Modal, Slide-over, Toast
- Quickstart: Overlays — Modal, Slide-over, Toast
- Component Contract: Modal
- Component Contract: Slide-over
- Phase 0 Research: Overlays — Modal, Slide-over, Toast
- Phase 1 Data Model: Overlays — Modal, Slide-over, Toast
- Tasks: Overlays — Modal, Slide-over, Toast
- Specification Quality Checklist: React Component Library (Claude Design Compatibility)
- Quickstart: React Component Library
- Phase 0 Research: React Component Library (Claude Design Compatibility)
- Tasks: React Component Library (Claude Design Compatibility)
- Contract: `packages/react` package shape
- Contract: Component prop shapes and reference implementations
- Phase 1 Data Model: React Component Library

## God Nodes (most connected - your core abstractions)
1. `speckit-tasks Skill` - 15 edges
2. `speckit-plan Skill` - 14 edges
3. `Tasks: Design System Primitive Components` - 13 edges
4. `speckit-implement Skill` - 13 edges
5. `compilerOptions` - 12 edges
6. `scripts` - 11 edges
7. `speckit-specify Skill` - 11 edges
8. `Tasks: React Component Library (Claude Design Compatibility)` - 10 edges
9. `Quickstart: React Component Library` - 10 edges
10. `Tasks: Overlays — Modal, Slide-over, Toast` - 10 edges

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

## Communities (68 total, 10 thin omitted)

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
Cohesion: 0.10
Nodes (19): Alignment Grid & Spacing, Application & Navigation, Base Semantic Palette, Component Catalog & Tailwind UI Patterns, Core Principles, Data Display & Listings, Design Foundations: Tokens, Typography & Grid, Forms, Validation & Inputs (+11 more)

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
Nodes (26): description, devDependencies, autoprefixer, @axe-core/playwright, @playwright/test, postcss, tailwindcss, @types/node (+18 more)

### Community 26 - "audit-tokens.mjs"
Cohesion: 0.12
Nodes (17): allowedColorNames, allowedRadiusClasses, applyBlocks, checkClass(), COLOR_PREFIXES, configSource, extractBalancedBlock(), isStructuralSuffix() (+9 more)

### Community 27 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, isolatedModules, lib, module, moduleResolution, noEmit, resolveJsonModule (+5 more)

### Community 28 - "check-contrast.mjs"
Cohesion: 0.11
Nodes (14): applyBlocks, BASE_TOKENS, COVERED_FG_TOKENS, failures, htmlFiles, ICON_FILL_TEXT_TOKENS, NON_COLOR_TEXT_SUFFIXES, PAIRINGS (+6 more)

### Community 29 - "a11y-helper.ts"
Cohesion: 0.42
Nodes (3): expectNoA11yViolations(), expectNoConsoleErrors(), formatViolations()

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

### Community 49 - "Professional Design System"
Cohesion: 0.22
Nodes (8): Component gallery, Governance, Professional Design System, Project structure, Requirements, Scripts, Setup, Visual regression baselines (cross-platform)

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

## Knowledge Gaps
- **382 isolated node(s):** `Format: `[ID] [P?] [Story] Description``, `Path Conventions`, `Foundational (blocks all of Phase 1)`, `Implementation for User Story 1`, `Tests for User Story 2` (+377 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `Format: `[ID] [P?] [Story] Description``, `Path Conventions`, `Foundational (blocks all of Phase 1)` to the rest of the system?**
  _382 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shared Bash Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Should `Agent Context Extension` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Constitution & Templates Skill` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Feature Specification: Design System Primitive Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `audit-tokens.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.12105263157894737 - nodes in this community are weakly interconnected._