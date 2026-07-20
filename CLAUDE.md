<!-- SPEC-JEDI:PLAN:START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/040-material-catalog-layout/plan.md
<!-- SPEC-JEDI:PLAN:END -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

<!-- SPEC-JEDI:SKILLS:START -->
## Spec Jedi skills available in this project

This project has the Spec Jedi spec-driven-development skill set
installed at `.claude/skills/`. When a request matches one of
the skills below, open and follow the full instructions in its
`SKILL.md` before responding. New to Spec Jedi? Start with
`specjedi-onboard`.

| Skill | What it does |
|---|---|
| `specjedi-analyze` | Strictly read-only cross-artifact consistency check across spec.md, plan.md, and tasks.md (and the constitution when present). |
| `specjedi-catalog-audit` | Strictly read-only whole-catalog audit cross-checking the full specjedi-* skill set against references/what-is-sdd.md's 7-phase SDD sequence for coverage... |
| `specjedi-caveman-mode` | Compress every reply to tight caveman-speak, dropping filler, keeping code/commands/errors exact. |
| `specjedi-chain` | Orchestrates specjedi-specify -> specjedi-clarify -> specjedi-plan -> specjedi-tasks in --auto mode back-to-back for one feature, reusing each stage's own... |
| `specjedi-checklist` | Generates a custom checklist for a named focus area (security, accessibility, performance, etc.) grounded entirely in the current feature's spec.md/plan.md... |
| `specjedi-clarify` | Scans a spec.md for real ambiguity and asks up to 5 targeted, prioritized questions before planning starts, writing accepted answers back into the spec. |
| `specjedi-constitution-audit` | Strictly read-only whole-project governance coverage audit against all 22 Constitution Core Principles plus the Distribution & Ecosystem Standards and... |
| `specjedi-constitution` | Establishes or amends a project's constitution — the non-negotiable rules every other specjedi-* skill checks its own output against. |
| `specjedi-converge` | Detects drift between the actual codebase and tasks.md, appending any gap as new tasks rather than ignoring it. |
| `specjedi-diagram` | Generates a render-verified Mermaid diagram (the correct type inferred from content — flowchart, sequence, ER, class, state, Gantt, timeline, user journey,... |
| `specjedi-docs` | Drafts a README skill-table row, a Quickstart step, and a CHANGELOG.md entry from a shipped feature's spec/plan, grounded in actual content — presents the... |
| `specjedi-explain` | Explains any SDD concept, specjedi-*/speckit-* command, or "why would I use this" question, calibrated to how experienced the asker sounds — from someone... |
| `specjedi-find-skills` | Spec Jedi's own skill-gap scout — recognizes when a task needs expertise the installed skill set doesn't have, and finds one specific, vetted skill to close... |
| `specjedi-govcheck` | Strictly read-only per-PR/per-branch governance compliance checklist against all 22 Constitution Core Principles plus the Distribution & Ecosystem Standards... |
| `specjedi-implement` | Executes tasks.md in dependency order, test-first where the plan calls for code, committing only through a feature branch and pull request — never directly... |
| `specjedi-master` | Proactive, project-aware advisor that watches what a project actually is — language, harness, domain, what's already installed — and suggests skills,... |
| `specjedi-migrate` | Rewrites literal /speckit-* tooling references in a project's own constitution/spec/plan/tasks to their shipped specjedi-* equivalents, leaving all... |
| `specjedi-new-skill` | Scaffolds a new specjedi-* skill's file structure — the specs/NNN-specjedi-<name>/ research/spec/plan/tasks set plus the... |
| `specjedi-onboard` | A first-run walkthrough that produces a real first constitution and spec together, teaching each SDD concept at the moment it's needed. |
| `specjedi-parallel` | Determines which candidate specjedi-* features are actually safe to run at the same time -- by cross-referencing each candidate's own already-declared... |
| `specjedi-plan` | Turns a clarified spec.md into a technical plan.md (plus research.md/data-model.md as the feature needs them) detailed enough that implementation never has... |
| `specjedi-quick` | A lightweight, one-artifact path for small, well-understood changes — replaces spec.md/research.md/plan.md/tasks.md with a single quick.md (small features)... |
| `specjedi-release` | Wraps scripts/suggest-release.sh (and .ps1) with Spec Jedi's own voice — presents the last tag, suggested next version/bump type, and contributing commits,... |
| `specjedi-retro` | A strictly read-only, backward-looking retrospective comparing a completed feature's actual implementation against its plan.md, grounding any deviation's... |
| `specjedi-security` | A lightweight, proactive threat-modeling prompt — never a full security audit — surfacing targeted "did we think about X" questions grounded in a maintained... |
| `specjedi-skill-review` | Strictly read-only audit of one named specjedi-* skill's SKILL.md against the Skill Authoring & Prompt Engineering Standard (Principle XIX) plus next-step... |
| `specjedi-specify` | Turns a feature idea — however rough — into a prioritized, independently-testable spec.md. |
| `specjedi-status` | A project-wide dashboard deriving every feature's status entirely from on-disk artifacts (spec.md/plan.md/tasks.md presence and checkbox completion, or... |
| `specjedi-tasks` | Breaks a plan.md into an ordered, dependency-aware tasks.md organized by user story, so each story is independently completable. |
| `specjedi-tokencheck` | Mechanizes Constitution Principle VIII — proactively checks whether rtk and graphify are present, explains any missing tool's purpose and expected token... |
| `specjedi-worktree` | Mechanizes git-worktree-based parallel development — creates a real worktree for a named feature on demand, preferring a native harness relocation tool (e.g. |
<!-- SPEC-JEDI:SKILLS:END -->
