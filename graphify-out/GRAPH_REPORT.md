# Graph Report - .  (2026-07-07)

## Corpus Check
- Corpus is ~27,991 words - fits in a single context window. You may not need a graph.

## Summary
- 83 nodes · 137 edges · 16 communities (10 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Shared Bash Utilities
- Implementation & Planning Artifacts
- Spec Quality & Convergence
- Agent Context Extension
- Feature Specification & Clarification
- Constitution & Templates Skill
- SDD Template & Workflow Documents
- Feature Branch Creation Script
- Agent Context Update Pipeline
- GitHub Issue Conversion
- Bash Agent Context Updater
- Prerequisite Check Script
- Plan Setup Script
- Tasks Setup Script
- Checklist Template

## God Nodes (most connected - your core abstractions)
1. `speckit-tasks Skill` - 15 edges
2. `speckit-plan Skill` - 14 edges
3. `speckit-implement Skill` - 13 edges
4. `speckit-specify Skill` - 11 edges
5. `speckit-analyze Skill` - 10 edges
6. `.specify/extensions.yml (Extension Hooks Config)` - 10 edges
7. `.specify/memory/constitution.md (Project Constitution)` - 10 edges
8. `speckit-converge Skill` - 10 edges
9. `speckit-checklist Skill` - 7 edges
10. `speckit-clarify Skill` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Context Section Upsert/Remove Gate Mechanism` --shares_data_with--> `CLAUDE.md (Managed Coding Agent Context File)`  [INFERRED]
  .specify/extensions/agent-context/README.md → CLAUDE.md
- `speckit-plan Skill` --references--> `CLAUDE.md (Coding Agent Context File)`  [EXTRACTED]
  .claude/skills/speckit-plan/SKILL.md → .claude/skills/speckit-agent-context-update/SKILL.md
- `speckit-specify Skill` --references--> `.specify/templates/spec-template.md`  [EXTRACTED]
  .claude/skills/speckit-specify/SKILL.md → .claude/skills/speckit-constitution/SKILL.md
- `speckit-tasks Skill` --references--> `.specify/templates/tasks-template.md`  [EXTRACTED]
  .claude/skills/speckit-tasks/SKILL.md → .claude/skills/speckit-constitution/SKILL.md
- `Full SDD Cycle Workflow (speckit)` --conceptually_related_to--> `Spec Kit Extensions Registration Config`  [INFERRED]
  .specify/workflows/speckit/workflow.yml → .specify/extensions.yml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Extension Hooks Pre/Post-Execution Pattern** — claude_skills_speckit_agent_context_update_skill, claude_skills_speckit_analyze_skill, claude_skills_speckit_checklist_skill, claude_skills_speckit_clarify_skill, claude_skills_speckit_constitution_skill, claude_skills_speckit_converge_skill, claude_skills_speckit_implement_skill, claude_skills_speckit_plan_skill, claude_skills_speckit_specify_skill, claude_skills_speckit_tasks_skill, claude_skills_speckit_taskstoissues_skill, concept_extensions_yml [INFERRED 0.85]
- **Constitution Authority Enforcement Across Commands** — concept_constitution_md, claude_skills_speckit_specify_skill, claude_skills_speckit_clarify_skill, claude_skills_speckit_plan_skill, claude_skills_speckit_tasks_skill, claude_skills_speckit_analyze_skill, claude_skills_speckit_checklist_skill, claude_skills_speckit_converge_skill, claude_skills_speckit_implement_skill [INFERRED 0.85]
- **Spec-Driven Development Workflow Pipeline** — claude_skills_speckit_specify_skill, claude_skills_speckit_clarify_skill, claude_skills_speckit_plan_skill, claude_skills_speckit_tasks_skill, claude_skills_speckit_analyze_skill, claude_skills_speckit_checklist_skill, claude_skills_speckit_implement_skill, claude_skills_speckit_converge_skill [INFERRED 0.85]
- **Agent Context Extension Bundle** — specify_extensions_config, specify_extensions_agent_context_extension_manifest, specify_extensions_agent_context_agent_context_config_config, specify_extensions_agent_context_commands_speckit_agent_context_update_command, specify_extensions_agent_context_readme_doc [EXTRACTED 1.00]
- **Constitution Governance Mechanism** — specify_memory_constitution_document, specify_templates_constitution_template_document, specify_templates_plan_template_document [INFERRED 0.75]
- **Spec-Driven Development Template Pipeline** — specify_templates_spec_template_document, specify_templates_plan_template_document, specify_templates_tasks_template_document, specify_templates_checklist_template_document [INFERRED 0.85]

## Communities (16 total, 6 thin omitted)

### Community 0 - "Shared Bash Utilities"
Cohesion: 0.13
Nodes (5): get_feature_paths(), get_repo_root(), _persist_feature_json(), resolve_specify_init_dir(), common.sh script

### Community 1 - "Implementation & Planning Artifacts"
Cohesion: 0.36
Nodes (10): speckit-implement Skill, speckit-plan Skill, speckit-tasks Skill, checklists/ (Requirement Checklists Directory), contracts/ (Interface Contracts), data-model.md, quickstart.md, research.md (+2 more)

### Community 2 - "Spec Quality & Convergence"
Cohesion: 0.46
Nodes (8): speckit-analyze Skill, speckit-checklist Skill, speckit-converge Skill, .specify/scripts/bash/check-prerequisites.sh, .specify/templates/checklist-template.md, plan.md (Implementation Plan), spec.md (Feature Specification), tasks.md (Task List)

### Community 3 - "Agent Context Extension"
Cohesion: 0.52
Nodes (7): CLAUDE.md (Managed Coding Agent Context File), Agent Context Config (context_file / context_markers), speckit.agent-context.update Command, Agent Context Extension Manifest, Context Section Upsert/Remove Gate Mechanism, Coding Agent Context Extension README, Spec Kit Extensions Registration Config

### Community 4 - "Feature Specification & Clarification"
Cohesion: 0.47
Nodes (6): speckit-clarify Skill, speckit-specify Skill, .specify/memory/constitution.md (Project Constitution), .specify/feature.json, .specify/init-options.json, checklists/requirements.md (Spec Quality Checklist)

### Community 5 - "Constitution & Templates Skill"
Cohesion: 0.33
Nodes (6): speckit-constitution Skill, .specify/templates/commands/*.md, .specify/templates/constitution-template.md, .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md

### Community 6 - "SDD Template & Workflow Documents"
Cohesion: 0.53
Nodes (6): Project Constitution (memory/constitution.md), Constitution Template, Implementation Plan Template, Feature Specification Template, Tasks Template, Full SDD Cycle Workflow (speckit)

### Community 8 - "Agent Context Update Pipeline"
Cohesion: 0.67
Nodes (3): speckit-agent-context-update Skill, .specify/extensions/agent-context/agent-context-config.yml, CLAUDE.md (Coding Agent Context File)

### Community 9 - "GitHub Issue Conversion"
Cohesion: 0.67
Nodes (3): speckit-taskstoissues Skill, .specify/extensions.yml (Extension Hooks Config), GitHub MCP Server (list_issues / create issue tools)

## Knowledge Gaps
- **19 isolated node(s):** `update-agent-context.sh script`, `check-prerequisites.sh script`, `common.sh script`, `create-new-feature.sh script`, `setup-plan.sh script` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `speckit-plan Skill` connect `Implementation & Planning Artifacts` to `Agent Context Update Pipeline`, `GitHub Issue Conversion`, `Spec Quality & Convergence`, `Feature Specification & Clarification`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `speckit-specify Skill` connect `Feature Specification & Clarification` to `Implementation & Planning Artifacts`, `Spec Quality & Convergence`, `Constitution & Templates Skill`, `GitHub Issue Conversion`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `speckit-constitution Skill` connect `Constitution & Templates Skill` to `GitHub Issue Conversion`, `Feature Specification & Clarification`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `update-agent-context.sh script`, `check-prerequisites.sh script`, `common.sh script` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shared Bash Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._