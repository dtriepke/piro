# PIRO blueprint

A portable hand-over package of the **PIRO** agent workflow: four agent roles, one artifact chain, one status graph, one board. Extracted from a product repository (`b8d5011`) with the product code removed and **one complete demo run** added.

![PIRO](piro/dashboard/ChatGPT%20Image%2030%20Sept%202026%2C%2010_44_28.png)

> **Branch note.** This branch contains *only* the PIRO package. It is not meant to be merged into the application's main branch.

## 1. What PIRO is

**P**lan → **I**mplement → **R**eview → **O**ps. Work is organised in **runs** (`YYYY-MM-DD-NNN-slug`). A run moves through:

```text
RESEARCH → PLANNING → SOLUTIONING → IMPLEMENT → REVIEW → (RELEASE gate) → OPS
```

`RELEASE` is a readiness gate recorded under `04-ops/releases/`, not a stored phase. Every run has **one** status authority, `workflow-progress.yaml` (a DAG of typed nodes with evidence); the dashboard, `workflow.yaml` and `runs-index.md` are derived from or reconciled against it.

## 2. Steps, executors and artefacts

| # | Step | Executor | Produces (under `piro/runs/<run-id>/`) | Graph nodes |
|---|---|---|---|---|
| 0 | Context | Human / any agent | `piro/00-context/*`, `00-context/run-context.md` | — |
| 1 | **Research** | Human or research skill (optional) | `01-plan/01-research-intent/{business,ux,technology}/*.md` | `plan.research.*` |
| 2 | **Planning** | Human product owner (+ optional PRD/PID producer) | `01-plan/02-planning/prd-NNN-*.md` (or `pid-*`), `scope.md`, `roadmap.md` | `plan.prd`, `plan.scope`, `plan.roadmap` |
| 3 | **Solutioning** | Spec / design / ADR producers (human, UX designer, optional skills) | `specs/`, `design/`, `decisions/ADR-NNN-*.md`, `diagrams/` | `plan.specs`, `plan.design`, `plan.decisions` |
| 4 | Issue decomposition | Planning producer | `02-implement/issues/<id>-*.md` (one file per issue; phases only if truly needed) | one `work_package` node per issue |
| 5 | **Implementation plan** | **`piro-planner`** (read-only) → saved by steward (*artifact* mode) | `02-implement/implementation-plan/<issue-id>/plan.md` | evidence/links on the issue |
| 6 | **Implement** | **`piro-implementer`** | source changes, `implementation-notes/`, `migrations/`, issue progress log | `<ISSUE-ID>` (`work_package`) |
| 7 | **Review** | **`piro-reviewer`** (read-only) → saved by steward (*artifact* mode); tests by the implementer | `03-review/reviews/`, `test-results/`, `security/`, `retrospectives/` | `review.*` |
| 8 | **Release gate** | Human owner | `04-ops/releases/release-readiness.md` | `ops.release-readiness` (`release`) |
| 9 | **Ops** | Operational owner | `04-ops/{runbooks,monitoring,incidents,known-issues}/` | `ops.*` |
| ∗ | **Bookkeeping** (after *every* step touching `piro/`) | **`piro-workflow-steward`** | `workflow-progress.yaml`, `piro/workflow.yaml`, `piro/runs-index.md`, `piro/dashboard/index.html` | all |

### The four agents

| Agent | Runtime packaging | Edits files? | Responsibility |
|---|---|---|---|
| `piro-planner` | `.agents/skills/piro-planner` (Codex) + `adapters/copilot/piro-planner.agent.md` | **No** | Gather context, resolve ambiguity, produce a 15-section plan the implementer can execute. Never implements. |
| `piro-implementer` | `.agents/skills/piro-implementer` + adapter | Yes | Smallest complete change; validate with the stack's real commands; report. |
| `piro-reviewer` | `.agents/skills/piro-reviewer` + adapter | **No** | Severity-ranked findings vs the contract; `approve / approve with minor fixes / request changes`. |
| `piro-workflow-steward` | `.agents/skills/piro-workflow-steward` + adapter | Yes (bookkeeping only) | Four modes below. The **only** writer of the graph, control plane, index and dashboard. |

Steward modes: **status** (where is the run, what's next, producer context handoff) · **sync** (reconcile after an edit, then gate) · **artifact** (persist the planner's/reviewer's finished content and link it) · **audit** (report, then safely repair `piro/` structure).

### Interaction

```text
 user ──► Planner ──status──► Steward           (context handoff: run, phase, canonical paths, blockers)
            │ plan
            └─artifact────────► Steward ──► plan.md ──sync──► graph / workflow.yaml / index / dashboard
 user ──► Implementer ──status──► Steward ; edits source + notes ; ──sync──► Steward
 user ──► Reviewer ──status──► Steward ; review report
            └─artifact────────► Steward ──► reviews/<id>-review.md ──sync──►
 human owner ──► accepts review / approves release  ──► steward sync records the node as done
```

Rules that keep it trustworthy:

1. A node is `done` only with **existing, typed evidence** (`canonical_artifact`, `work_package` + `source|migration|implementation_note`, `decision`, `review_result` with `accepted|approved|passed`, `release_decision` with `approved|go`). Tracked work packages additionally need a stored **closed** GitHub snapshot unless `local_only: true`.
2. `ready` is **derived**, never stored. Implementation done ≠ review done.
3. Planner and Reviewer never write; humans own acceptance and release.
4. One canonical artifact per concern; no `-v2`/`-final` copies.

## 3. Package contents

```text
.agents/skills/piro-{planner,implementer,reviewer,workflow-steward}/   canonical workflows (+ openai.yaml for Codex)
adapters/copilot/                 thin GitHub Copilot custom-agent templates (copy to .github/agents/)
AGENTS.md                         project briefing template (skills read it first)
.github/copilot-instructions.md   generic artifact rules; .github/workflows/validate-workflow.yml  CI gate
piro/
  README.md  workflow.yaml  runs-index.md  dashboard/index.html  (the PIRO board)
  00-context/                     project context + blueprint-consistency-audit.md
  tooling/                        validate-workflow.ts, workflow-progress.ts (+test), workflow-dashboard.ts (+client/styles)
  runs/2026-10-08-001-demo-healthz-endpoint/   the complete demo run
package.json tsconfig.json vitest.config.ts   Node ≥ 20: tsx, vitest, yaml, typescript
```

## 4. The PIRO board

`piro/dashboard/index.html` is a self-contained page (open it directly in a browser). It shows each run's graph, derived position, next action and parallel work, with evidence links. Regenerate it with `npm run workflow:dashboard`; CI fails if it is stale.

## 5. The demo run

`piro/runs/2026-10-08-001-demo-healthz-endpoint/` is a **fictional** end-to-end run (an Acme API `/healthz` liveness endpoint) with **four issues (DEMO-01..04)** and a dependency graph so the dashboard Implement tab shows waves and edges. It is still fictional, all done, and has no real code. It touches every stage: research → PRD → spec → ADR → diagram → issues → plans → implementation notes → validation → review → release → runbook, all `done` in `workflow-progress.yaml`. Use it as a template: copy the folder, rename the run ID, and rewrite the content. Its source evidence is an implementation note because the demo has no real code.

## 6. Adopt in another project

1. Copy this package's contents into the target repo root (merge `package.json` scripts/devDependencies; `npm install`).
2. Fill in `AGENTS.md`, `.github/copilot-instructions.md` and `piro/00-context/*`; set `repository.slug` in `piro/workflow.yaml`.
3. Codex: skills are discovered from `.agents/skills/`. Copilot: copy `adapters/copilot/*.agent.md` to `.github/agents/` and adjust `tools:`.
4. Create a run: new folder under `piro/runs/` using the demo as a template; add it to `workflow.yaml`, `runs-index.md` and write its `workflow-progress.yaml` (or ask the steward in sync mode).
5. Delete the demo run (and its entries) when you no longer need it, then `npm run workflow:dashboard && npm run validate:workflow`.
6. Review [piro/00-context/blueprint-consistency-audit.md](piro/00-context/blueprint-consistency-audit.md) **before** relying on the chain — notably F1 (issue location), F7 (planner reads `.github/agents/model-selection.md`, which is not included) and F4 (optional external producer skills).

## 7. Validation

```bash
npm install
npm run test:workflow
npm run workflow:dashboard
npm run validate:workflow
npm run workflow:dashboard -- --check
```

## 8. Known gaps of this blueprint

- The source-product Copilot originals in `.github/agents/` were not inspected; adapters here are templates derived from the skill contracts (audit §1, §5).
- `.github/agents/model-selection.md` (planner Section 15) and the optional producer skills (`to-pid`, `domain-modeling`, `grilling-to-brief`, `to-issues`) are not included.
