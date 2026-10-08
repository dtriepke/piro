# Copilot adapters (reference templates)

The canonical PIRO workflows are the four skills in `.agents/skills/`. A Copilot custom agent is only a **thin adapter**: it declares which tools the role may use and loads the matching skill. Never restate workflow rules in an adapter; edit the `SKILL.md` instead.

Install: copy the `*.agent.md` files to `.github/agents/` of the target repository and adjust the `tools:` list to the tool names of your Copilot host.

> These templates were written from the skill contracts. The NeuroLink Connect originals in `.github/agents/` were **not** inspected while preparing this blueprint (see `piro/00-context/blueprint-consistency-audit.md`, §1). If you have the originals, diff them against these templates using the checklist in that audit.

| Adapter | Skill it loads | Must have | Must NOT have |
|---|---|---|---|
| `piro-planner.agent.md` | `piro-planner` | read/search, `agent` (to spawn the steward writer) | any file-edit tool |
| `piro-implementer.agent.md` | `piro-implementer` | read/search, edit, terminal, `agent` (steward status/sync) | — |
| `piro-reviewer.agent.md` | `piro-reviewer` | read/search, terminal for checks, `agent` | any file-edit tool |
| `piro-workflow-steward.agent.md` | `piro-workflow-steward` | read/search, **edit**, terminal (`npm run …`) | — |
