# Graph Report - .  (2026-07-07)

## Corpus Check
- 8 files · ~31,068 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 97 nodes · 145 edges · 24 communities (12 shown, 12 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.87)
- Token cost: 7,840 input · 2,267 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23

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
- `Today 2026-07-07` --references--> `Feature Specification: Design System Primitive Components`  [EXTRACTED]
  .remember/today-2026-07-07.md → specs/001-primitive-components/spec.md
- `Feature Specification: Design System Primitive Components` --cites--> `Professional Design System Constitution`  [EXTRACTED]
  specs/001-primitive-components/spec.md → .specify/memory/constitution.md
- `Button Primitive` --conceptually_related_to--> `Absolute Semantic Accessibility (WCAG 2.2 AAA)`  [INFERRED]
  specs/001-primitive-components/spec.md → .specify/memory/constitution.md
- `Button Primitive` --conceptually_related_to--> `Design Token Discipline`  [INFERRED]
  specs/001-primitive-components/spec.md → .specify/memory/constitution.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Design System Core Principles** — specify_memory_constitution_principle_1, specify_memory_constitution_principle_2, specify_memory_constitution_principle_3, specify_memory_constitution_principle_4, specify_memory_constitution_principle_5, specify_memory_constitution_principle_6, specify_memory_constitution_principle_7 [EXTRACTED 1.00]
- **Primitive Components Set** — component_button, component_input, component_badge, component_checkbox [EXTRACTED 1.00]
- **Extension Hooks Pre/Post-Execution Pattern** — claude_skills_speckit_agent_context_update_skill, claude_skills_speckit_analyze_skill, claude_skills_speckit_checklist_skill, claude_skills_speckit_clarify_skill, claude_skills_speckit_constitution_skill, claude_skills_speckit_converge_skill, claude_skills_speckit_implement_skill, claude_skills_speckit_plan_skill, claude_skills_speckit_specify_skill, claude_skills_speckit_tasks_skill, claude_skills_speckit_taskstoissues_skill, concept_extensions_yml [INFERRED 0.85]
- **Constitution Authority Enforcement Across Commands** — concept_constitution_md, claude_skills_speckit_specify_skill, claude_skills_speckit_clarify_skill, claude_skills_speckit_plan_skill, claude_skills_speckit_tasks_skill, claude_skills_speckit_analyze_skill, claude_skills_speckit_checklist_skill, claude_skills_speckit_converge_skill, claude_skills_speckit_implement_skill [INFERRED 0.85]
- **Spec-Driven Development Workflow Pipeline** — claude_skills_speckit_specify_skill, claude_skills_speckit_clarify_skill, claude_skills_speckit_plan_skill, claude_skills_speckit_tasks_skill, claude_skills_speckit_analyze_skill, claude_skills_speckit_checklist_skill, claude_skills_speckit_implement_skill, claude_skills_speckit_converge_skill [INFERRED 0.85]
- **Agent Context Extension Bundle** — specify_extensions_config, specify_extensions_agent_context_extension_manifest, specify_extensions_agent_context_agent_context_config_config, specify_extensions_agent_context_commands_speckit_agent_context_update_command, specify_extensions_agent_context_readme_doc [EXTRACTED 1.00]
- **Constitution Governance Mechanism** — specify_memory_constitution_document, specify_templates_constitution_template_document, specify_templates_plan_template_document [INFERRED 0.75]
- **Spec-Driven Development Template Pipeline** — specify_templates_spec_template_document, specify_templates_plan_template_document, specify_templates_tasks_template_document, specify_templates_checklist_template_document [INFERRED 0.85]

## Communities (24 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (5): get_feature_paths(), get_repo_root(), _persist_feature_json(), resolve_specify_init_dir(), common.sh script

### Community 1 - "Community 1"
Cohesion: 0.20
Nodes (11): Badge Primitive, Button Primitive, Checkbox Primitive, Text Input Primitive, Today 2026-07-07, Professional Design System Constitution, Absolute Semantic Accessibility (WCAG 2.2 AAA), Design Token Discipline (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.44
Nodes (9): speckit-implement Skill, speckit-plan Skill, speckit-tasks Skill, checklists/ (Requirement Checklists Directory), contracts/ (Interface Contracts), data-model.md, quickstart.md, research.md (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.46
Nodes (8): speckit-analyze Skill, speckit-checklist Skill, speckit-converge Skill, .specify/scripts/bash/check-prerequisites.sh, .specify/templates/checklist-template.md, plan.md (Implementation Plan), spec.md (Feature Specification), tasks.md (Task List)

### Community 4 - "Community 4"
Cohesion: 0.52
Nodes (7): CLAUDE.md (Managed Coding Agent Context File), Agent Context Config (context_file / context_markers), speckit.agent-context.update Command, Agent Context Extension Manifest, Context Section Upsert/Remove Gate Mechanism, Coding Agent Context Extension README, Spec Kit Extensions Registration Config

### Community 5 - "Community 5"
Cohesion: 0.47
Nodes (6): speckit-clarify Skill, speckit-specify Skill, .specify/memory/constitution.md (Project Constitution), .specify/feature.json, .specify/init-options.json, checklists/requirements.md (Spec Quality Checklist)

### Community 6 - "Community 6"
Cohesion: 0.40
Nodes (5): speckit-constitution Skill, .specify/templates/commands/*.md, .specify/templates/constitution-template.md, .specify/templates/plan-template.md, .specify/templates/tasks-template.md

### Community 8 - "Community 8"
Cohesion: 1.00
Nodes (4): Implementation Plan Template, Feature Specification Template, Tasks Template, Full SDD Cycle Workflow (speckit)

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (3): speckit-agent-context-update Skill, .specify/extensions/agent-context/agent-context-config.yml, CLAUDE.md (Coding Agent Context File)

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (3): speckit-taskstoissues Skill, .specify/extensions.yml (Extension Hooks Config), GitHub MCP Server (list_issues / create issue tools)

## Knowledge Gaps
- **28 isolated node(s):** `update-agent-context.sh script`, `check-prerequisites.sh script`, `common.sh script`, `create-new-feature.sh script`, `setup-plan.sh script` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `speckit-plan Skill` connect `Community 2` to `Community 9`, `Community 10`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `speckit-specify Skill` connect `Community 5` to `Community 10`, `Community 2`, `Community 3`, `Community 6`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `speckit-tasks Skill` connect `Community 2` to `Community 10`, `Community 3`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `update-agent-context.sh script`, `check-prerequisites.sh script`, `common.sh script` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._