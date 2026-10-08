# AGENTS.md — project briefing (template)

> Replace the bracketed parts when adopting the PIRO blueprint. The PIRO skills read this file first.

## Purpose
[One paragraph: what this repository is and who it serves.]

## Source of truth (hierarchy)
| Source | Covers |
|---|---|
| `AGENTS.md` (this file) | Current reality: what exists, validated commands, durable constraints |
| `.agents/skills/piro-*/SKILL.md` | Canonical PIRO workflows (Codex discovers them here; Copilot adapters load them) |
| `.github/copilot-instructions.md` | Repository-wide conventions and the `piro/` artifact rules |
| `piro/` | Run artifacts, progress graphs, control plane, dashboard |
| Source tree / migrations / manifests | Authoritative behaviour and schema |

> If implementation and a PID/PRD disagree, preserve the current code unless the task explicitly says to align.

## Workflow stewardship
- Use `$piro-workflow-steward` in **status** mode for "where does this run stand / what is next".
- Use it in **audit** mode to audit, tidy or repair `piro/`.
- Planner and Reviewer persist tracked plans/reviews through a writing-capable steward sub-session in **artifact** mode.
- After creating/editing/moving anything under `piro/` (or producing source evidence a graph depends on), end the turn with the steward in **sync** mode.
- Only the steward reconciles `workflow-progress.yaml`, `piro/workflow.yaml`, `piro/runs-index.md` and `piro/dashboard/index.html`.

## Validated commands
```bash
npm install
npm run validate:workflow            # piro/ structure, progress graphs, dashboard freshness
npm run workflow:dashboard           # regenerate piro/dashboard/index.html (--check to verify only)
npm run test:workflow                # unit tests of the progress model
# [add your project's build / test / lint commands]
```

## Current product status
[Routes / services / features that exist and their state.]

## Durable constraints
[Business rules, security rules, out-of-scope list.]
