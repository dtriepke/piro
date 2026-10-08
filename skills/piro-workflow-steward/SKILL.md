---
name: piro-workflow-steward
description: Locate NeuroLink artifacts, report readiness, persist planner and reviewer handoffs, reconcile workflow bookkeeping, and audit `piro/` structure.
---

# Workflow Steward

Keep the repository's `piro/` artifact chain coherent without taking over the work of the planning, implementation, design, or review producer.

## Choose one mode

- **Sync:** Use after a turn creates, edits, or moves a file under `piro/`, or creates source-tree evidence that a run's progress graph depends on. Read [references/sync-mode.md](references/sync-mode.md).
- **Status:** Use when the user asks where a run stands, what comes next, whether it is ready, or for implementation-issue/work-package status. Also use when planner, implementer, or reviewer needs a run and canonical-artifact context handoff. Read [references/status-mode.md](references/status-mode.md).
- **Audit:** Use when the user asks to audit, govern, tidy, clean up, or repair workflow artifacts. Read [references/audit-mode.md](references/audit-mode.md).
- **Artifact:** Use when a planner or reviewer delegates completed content for writing, linking, and synchronization. Read [references/artifact-mode.md](references/artifact-mode.md). This writing sub-session preserves the producer's content; it does not author a replacement plan or review.

If the mode or affected run is ambiguous, inspect `piro/workflow.yaml`, `piro/runs-index.md`, and the changed or named paths. Ask only when more than one run remains plausible and the choice would change the result.

## Shared contract

- Run artifacts own content and decisions. The PRD/PID owns run framing; research feeds planning directly without a separate run-framing artifact or approval gate.
- `piro/workflow.yaml` owns canonical pointers, declared phase, and last activity.
- Each run's root `workflow-progress.yaml` owns lifecycle state and dependencies. `canonical.issue_graph` and `canonical.progress_graph` must point to that same file.
- `piro/runs-index.md` is the derived human-readable summary.
- `piro/dashboard/index.html` is generated; never edit it by hand.
- This skill exclusively reconciles the progress graph, control plane, index, and dashboard. Other workflows must route those edits here.
- A producing workflow may create or update content artifacts only when the user asks. Sync mode may update bookkeeping surfaces without a separate request because that reconciliation is required by `AGENTS.md`.
- For tracked planning and review requests, artifact persistence is part of the requested work unless the user asks for chat-only output. The planner/reviewer delegates that writing to this skill in a separate sub-session; artifact mode owns the supplied content's persistence and links, while the producer owns its substantive conclusions.
- Never mark work `done` without existing typed evidence. Implementation completion does not imply review completion.
- Never infer remote tracker state. Use it only when it was actually checked; otherwise identify local artifacts as the authority being reported.
- Never silently choose between conflicting artifacts or delete meaningful content.
- When an issue is decomposed into implementation phases, communicate the artifact layout: the issue contract lives under `01-plan/03-solutioning/issues/`, and its phase-specific implementation plans live under `02-implement/implementation-plan/<issue-id>/`. Report actual paths found; do not invent files or phase state.

Read [references/workflow-model.md](references/workflow-model.md) before changing control-plane state, when source-of-truth roles are disputed, or when the selected mode needs lifecycle, evidence, producer, or schema details.

## Mutation and validation boundary

For content-artifact creation, movement, consolidation, or repair, preserve the user's authorization boundary. Status mode is read-only. Artifact mode writes only the delegated plan/review and its links, then uses sync mode. Audit mode reports findings before repairs and applies only safe, mechanical fixes without another decision.

After any graph or control-plane change:

1. Run `npm run workflow:dashboard`.
2. Run `npm run validate:workflow`.
3. Run `npm run workflow:dashboard -- --check`.

If either gate fails, do not force state to appear valid. Diagnose the drift, report the failure, and use the fuller status path when necessary.

## Final response

Report observed state, changes actually made, validation actually run, and any remaining blocker or human decision. Prefer one load-bearing next action while exposing independent peer gaps that can proceed in parallel.
