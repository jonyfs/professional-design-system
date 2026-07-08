# Graph Report - professional-design-system  (2026-07-08)

## Corpus Check
- 66 files · ~54,427 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 297 nodes · 326 edges · 39 communities (28 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26e3fe53`
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
- Professional Design System

## God Nodes (most connected - your core abstractions)
1. `speckit-tasks Skill` - 15 edges
2. `speckit-plan Skill` - 14 edges
3. `Tasks: Design System Primitive Components` - 13 edges
4. `speckit-implement Skill` - 13 edges
5. `compilerOptions` - 12 edges
6. `scripts` - 11 edges
7. `speckit-specify Skill` - 11 edges
8. `speckit-analyze Skill` - 10 edges
9. `.specify/extensions.yml (Extension Hooks Config)` - 10 edges
10. `.specify/memory/constitution.md (Project Constitution)` - 10 edges

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

## Communities (39 total, 11 thin omitted)

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
Cohesion: 0.16
Nodes (14): allowedColorNames, allowedRadiusClasses, checkClass(), COLOR_PREFIXES, configSource, extractBalancedBlock(), isStructuralSuffix(), NON_COLOR_SUFFIXES (+6 more)

### Community 27 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, isolatedModules, lib, module, moduleResolution, noEmit, resolveJsonModule (+5 more)

### Community 28 - "check-contrast.mjs"
Cohesion: 0.17
Nodes (9): BASE_TOKENS, COVERED_FG_TOKENS, failures, htmlFiles, NON_COLOR_TEXT_SUFFIXES, PAIRINGS, rootDir, TOKENS (+1 more)

### Community 38 - "Professional Design System"
Cohesion: 0.25
Nodes (7): Component gallery, Governance, Professional Design System, Project structure, Requirements, Scripts, Setup

## Knowledge Gaps
- **167 isolated node(s):** `Requirements`, `Setup`, `Scripts`, `Component gallery`, `Project structure` (+162 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `Requirements`, `Setup`, `Scripts` to the rest of the system?**
  _167 weakly-connected nodes found - possible documentation gaps or missing edges._
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
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._