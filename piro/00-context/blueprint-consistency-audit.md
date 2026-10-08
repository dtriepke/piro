# Blueprint consistency audit — Codex skills vs. Copilot agents

**Scope:** the four canonical PIRO skills (`.agents/skills/piro-*`), their Codex metadata (`agents/openai.yaml`), the steward's reference files, the validator/graph tooling, and the Copilot custom-agent roster as registered in the host. **Date:** 2026-10-08. Source: NeuroLink Connect @ `b8d5011`.

## 1. Method and limits

- **Verified by reading:** all four `SKILL.md` files, the five steward references, `openai.yaml` files, `piro/tooling/*`, `piro/workflow.yaml`, `piro/runs-index.md`, and the three real runs.
- **Not verified by reading:** the Copilot adapter files `.github/agents/piro-*.agent.md` and `.github/agents/model-selection.md`. The environment this audit ran in forbids reading that directory. Copilot-side statements below therefore rest on (a) what the skills say adapters must do and (b) the agent roster/descriptions the host exposes. Finish the Copilot side with the checklist in §5.

## 2. Role parity (skills ↔ Copilot roster)

| Role | Codex skill contract | Copilot agent (host description) | Parity |
|---|---|---|---|
| Planner | Read-only; 15-section plan; saves via steward **artifact mode** | "Creates evidence-based, implementer-ready plans… gathering context, resolving uncertainty, sequencing verifiable work" | ✅ same role |
| Implementer | Edits + validates; steward **status** before, **sync** after | "Implements scoped changes… validates against the repository's contracts and commands" | ✅ same role |
| Reviewer | Read-only; severity-ranked findings; saves via steward **artifact mode** | "Reviews changes… contract fit, correctness, risk… without editing files" | ✅ same role |
| Workflow steward | 4 modes: sync / status / audit / artifact; sole writer of bookkeeping | "Reconciles workflow bookkeeping, reports run readiness and next actions, audits the **`_workflow/`** artifact chain" | ⚠️ role matches; description still says `_workflow/` (see F5) |
| UX designer, E2E, SME exporter, Framer designer | — no skill | Copilot-only agents | ⚠️ not part of the portable chain (F6) |

Handoff graph (identical in both runtimes by design): Planner/Implementer/Reviewer → Steward **status** (context handoff) → producer works → Steward **sync**; Planner/Reviewer → Steward **artifact** (persist) → Steward **sync**.

## 3. Findings

Severity: **H** breaks or misleads a handover · **M** inconsistent but workable · **L** polish.

| # | Sev | Finding | Evidence | Recommended fix (not applied to the skills in this blueprint) |
|---|---|---|---|---|
| F1 | **H** | **Issue location is specified three ways.** Steward/planner say the issue *contract* lives in `01-plan/03-solutioning/issues/` and tracking in `02-implement/issues/`; copilot-instructions and the validator only know `02-implement/issues/`. The validator's issue-traceability and issue-graph-duplicate checks list that folder **non-recursively**, so neither the newer run's solutioning issues nor the older run's `02-implement/issues/sja-wp*/` sub-folders are checked. | `validate-workflow.ts` `checkIssueTraceability`, `checkDuplicateIds`; `steward SKILL.md`; `planner SKILL.md` "Open the canonical issue path… (normally `01-plan/03-solutioning/issues/`)"; run `2026-10-01-002-smart-journey-agent` | Pick one rule. This blueprint's demo uses a single `02-implement/issues/<id>-*.md` per issue (validator-enforced) with the plan in `02-implement/implementation-plan/<id>/plan.md`. If you adopt solutioning-level contracts, extend the validator to scan `01-plan/03-solutioning/issues/` recursively. |
| F2 | **M** | **Second status mirror.** The newer run keeps `sjap-issue-graph.yaml` next to the issues "mirroring" the progress graph, contradicting ADR-001's one-status-authority rule; only `02-implement/issues/*-issue-graph.yaml` is duplicate-checked. | `runs-index.md` (SJAP-01..09 row); `workflow-model.md` "single status authority" | Do not create `*-issue-graph.yaml`. Merge issue nodes into `workflow-progress.yaml`. |
| F3 | **M** | **Done-status check accepts a pending review.** An issue marked `done` only needs *some* file in `03-review/reviews/` that mentions its ID; a review that is still "awaiting product-owner review" satisfies it. The progress graph is correct (`review.code-review: awaiting_feedback`), the issue file is not. | `checkIssueTraceability`; real run `2026-09-28-001-workflow-dashboard` (WDB-01 `Status: done`, review pending) | Treat the graph as authority; extend the check to require an `accepted/approved` outcome line, or require `review_result` evidence in the graph. |
| F4 | **M** | **Hidden external dependencies.** Skills/reference name producers that are not in the repo: `grilling-to-brief`, `grill-me-to-brief`, `to-pid`, `domain-modeling`, `to-issues`. `skills-lock.json` in the source repo pins only `ask-matt`. The Implementer follow-up notes that `to-issues` still emits a legacy `<slug>-issue-graph.yaml`. | `workflow-model.md` "Artifact producers"; `wdb-01` follow-ups | Treat them as **optional**: any manual process producing the same artifact is valid. Pin or vendor them if you rely on them. |
| F5 | **M** | **Stale `_workflow/` path.** The Copilot steward's registered description still says `_workflow/`; the canonical root is `piro/` everywhere in the skills and tooling. Repository memories recorded for the source repo also cite `_workflow/…` paths that no longer exist. | Host agent roster; no `_workflow` string remains in the repository's tracked text files | Update the description to `piro/`; re-cite memories against `piro/runs/…`. |
| F6 | **M** | **Copilot-only agents are outside the chain.** `piro-ux-designer`, `piro-e2e`, `piro-sme-exporter`, `piro-framer-designer` have no skill and are not routed from the steward's producer table ("applicable design producer", "stack-specific test/review producer"). `piro-ux-designer` is NeuroLink-specific. | Host roster vs `workflow-model.md` producer table | Optional extensions. If kept: UX designer → `03-solutioning/design/`; E2E → `03-review/test-results/`. Not included in this blueprint. |
| F7 | **M** | **Planner depends on a Copilot-folder file.** The planner requires `.github/agents/model-selection.md` (a dated model snapshot with a 45-day staleness rule and hard-coded vendor model names). A Codex-only install has no such file, and the names age quickly. | `planner SKILL.md` "Required reads" #4, "Model snapshot freshness", Section 15 table | Move the snapshot to a neutral path (e.g. `piro/00-context/model-selection.md`) and make the read conditional, or drop Section 15 until you maintain the snapshot. |
| F8 | **M** | **Gap: who flips the issue's `Status`?** The validator reads `**Status:**` from the issue file, but no skill assigns writing it. The Implementer records findings; the steward only touches bookkeeping surfaces. | `implementer SKILL.md`; `steward SKILL.md`; `validate-workflow.ts` | Assign it: Implementer sets `Status: in progress/ready for review`; `done` only after the review node is accepted (steward sync reports the mismatch). |
| F9 | **L** | **Three places mandate "run steward sync last".** `copilot-instructions` rules 11–12, `AGENTS.md`, and each skill. Wording already differs slightly (e.g. "RELEASE gate" appears only in `workflow-model.md`; the instructions' lifecycle jumps REVIEW → OPS). Behaviour is identical: `RELEASE` is a gate persisted as an `ops` release node, and the graph phases are `RESEARCH…OPS`. | `workflow-model.md` lifecycle vs `copilot-instructions` lifecycle; `deriveRun` phases | Keep the skills canonical and make the two instruction files point to them (as `AGENTS.md` already declares). This blueprint's instructions use the skills' wording. |
| F10 | **L** | **Asymmetric skill depth.** Planner 308 lines; Reviewer 56; Implementer 38; Steward 50 + 5 references. Effective, but the Implementer has the thinnest contract (no explicit read of `02-implement/implementation-plan/<id>/plan.md`, no explicit report of the review hand-off). | `wc -l` of the skills | Add one line to the Implementer: "read the saved plan for the issue, then hand to the Reviewer". |
| F11 | **L** | **Implicit invocation on the writer.** All four `openai.yaml` set `allow_implicit_invocation: true`, including the steward, which mutates bookkeeping. Copilot adapters are picked explicitly. | `agents/openai.yaml` | Consider `false` for the steward if surprise edits are a concern. |
| F12 | **L** | **Dashboard generator is coupled to one filename** (`piro/dashboard/ChatGPT Image 30 Sept 2026, 10_44_28.png`); a second unused image sits next to it. The blueprint carries the one used file. | `workflow-dashboard.ts` line 67 | Rename to `piro/dashboard/logo.png` and update the one reference. |
| F13 | **L** | **Source-repo-specific content in tooling.** `validate-safety-contract.ts` / `validate:safety` (Smart Journey) and comments pointing at run-specific PIDs. Excluded / generalised in the blueprint. | `piro/tooling/` | — |

**Not a finding (checked):** all four skills agree on the four steward modes and their triggers; both runtimes use the same sync gate (`npm run workflow:dashboard`, `npm run validate:workflow`, `npm run workflow:dashboard -- --check`); the read-only/write split (Planner and Reviewer never write; the steward writes in artifact mode) is stated identically in the skills, the steward's `artifact-mode.md`, and `AGENTS.md`; graph `done` rules (typed evidence, closed GitHub snapshot unless `local_only`) match `workflow-progress.ts`.

## 4. Effectiveness assessment

- **Strong:** one status authority per run (graph), derived readiness, evidence-gated `done`, a machine-checked dashboard, and a strict write boundary. These make the chain auditable and resilient to agent mistakes.
- **Weak spots to fix before heavy use:** F1 (issue location), F8 (status ownership), F3 (weak done-check), F7 (planner dependency).
- **Runtime parity:** roles and handoffs are equivalent. The only runtime-specific piece is the sub-agent call (`spawn child agent` in Codex, `agent/runSubagent` in Copilot), which the adapters must expose via an `agent` tool.

## 5. Checklist to complete the Copilot-side check (needs read access to the originals)

For each `.github/agents/piro-{planner,implementer,reviewer,workflow-steward}.agent.md`:

1. It loads `.agents/skills/<same-name>/SKILL.md` and restates no workflow rules (otherwise drift).
2. Planner and Reviewer **cannot edit** files but **can** spawn a sub-agent; Steward and Implementer can edit and run terminal commands.
3. No `_workflow/` strings: `grep -rn "_workflow" .github .agents AGENTS.md`.
4. Handoff names match the skills: *status*, *sync*, *artifact*, *audit*.
5. Planner's required reads match the planner skill (incl. F7).
6. Model hints (if any) match `model-selection.md` freshness.
