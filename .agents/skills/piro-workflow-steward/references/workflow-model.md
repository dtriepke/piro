# Workflow model and control-plane contract

Use this reference for lifecycle interpretation, source-of-truth conflicts, evidence rules, artifact creation, and control-plane mutations.

## Lifecycle and run shape

```text
RESEARCH -> PLANNING -> SOLUTIONING -> IMPLEMENT -> REVIEW -> RELEASE -> OPS
```

`RELEASE` is a readiness gate represented under `04-ops/releases/`; it is not a persisted phase. Valid phases are `CONTEXT`, `RESEARCH`, `PLANNING`, `SOLUTIONING`, `IMPLEMENT`, `REVIEW`, and `OPS`.

```text
piro/runs/<run-id>/
  00-context/
  01-plan/
    01-research-intent/   business/, ux/, technology/ and discovery briefs
    02-planning/          pid-*.md or prd.md, scope.md, roadmap.md
    03-solutioning/
      issues/              <issue-id>.md (the only issue contract)
      specs/
      design/
      decisions/
      diagrams/
  02-implement/
    implementation-plan/
      <issue-id>/          plan.md, or <phase-id>-<phase-slug>.md when split
    implementation-notes/  results recorded during implementation
    migrations/
  03-review/              reviews/, test-results/, security/, retrospectives/
  04-ops/                 releases/, runbooks/, monitoring/, incidents/, known-issues/
```

For a complex issue intentionally split into smaller implementation phases, keep one issue contract and create a phase-plan directory named with that issue's stable ID under `02-implement/implementation-plan/`. Each phase plan should identify its parent issue, its own scope/dependencies, and its verification; the issue contract should link to the phase plans. Do not create duplicate issue contracts just to represent phases, and do not assume a phase's status from a plan file's presence. Contracts already stored under `02-implement/issues/`, including nested work-package folders, are grandfathered. Do not copy them, and do not create new issue contracts there.

Specs, Design, and Decisions are peer Solutioning streams:

```text
Business / UX / Technology Research -----------> PRD/PID
                                            |
                    +-----------------------+-----------------------+
                    v                       v                       v
                 SPECS                   DESIGN                DECISIONS
              what it does         how it behaves            why this approach
                    +-----------------------+-----------------------+
                                            v
                                 Issue contracts
                                            v
                               Implementation plans
                                            v
                              Implementation notes
                                            v
                              Tests + Code Review
                                            v
                                         Release
                                            v
                                           Ops
```

The existing `01-research-intent/` directory stores research and discovery briefs. The PRD/PID records the run's problem, desired outcome, users, scope, success criteria, and assumptions. Planning depends directly on the applicable research streams; there is no separate run-framing artifact or approval gate.

A run is Solutioning-ready only when every required peer stream is canonical enough for the next implementation slice. Do not treat one completed stream as completion of the whole phase.

## Locate and interpret a run

1. Read `piro/workflow.yaml` and `piro/runs-index.md` together.
2. Reconcile them with the directories under `piro/runs/`.
3. Use a named run or topic when supplied. For "current run," use the single unambiguous focus or active run; otherwise ask.
4. Read project-wide and run-specific `00-context/` before interpreting later artifacts when their constraints are relevant.
5. Use linked GitHub state only when a GitHub-capable tool actually checked it.

When a valid `canonical.progress_graph` exists, derive position, readiness, and next action from it first, then verify its evidence against substantive artifacts. Without a valid graph, use the furthest lifecycle stage with substantive evidence; folder presence never proves completion.

## Source-of-truth roles

- Run artifacts own their content and decisions.
- `piro/workflow.yaml` is the machine-readable control plane for canonical pointers, declared phase, and last activity.
- A run's root `workflow-progress.yaml` is the single status and dependency authority.
- `piro/runs-index.md` is derived for humans.
- `piro/dashboard/index.html` is generated from the control plane and graphs.
- Pointer or phase disagreement is drift to report and reconcile, not permission to invent a new canonical path.

## Progress graph evidence

Persisted states are `not_started`, `in_progress`, `awaiting_feedback`, `changes_requested`, `blocked`, `done`, and `not_applicable`. `ready` is derived when all dependencies are `done` or `not_applicable`; never persist it.

`done` requires typed, existing evidence:

- Artifacts: `canonical_artifact`.
- Work packages: `work_package` plus `source`, `migration`, or `implementation_note` as applicable.
- Human gates: `decision`.
- Reviews: `review_result` with outcome `accepted`, `approved`, or `passed`.
- Releases: `release_decision` with outcome `approved` or `go`.
- Tracked work packages and gates: a stored closed `github_issue` snapshot, unless explicitly `local_only: true`.

Work packages split into phases may carry an optional `phases` list (`id`, `title`, persisted `state`, optional `note` and `updated_at`), shown as "Progress" in the dashboard details. It is informational: node `state` and `done` evidence stay authoritative, and each phase state must be backed by the parent issue's progress log, phase plans, or evidence. Keep phases in step with the issue's phase files when they change; never derive node state from phases alone.

Do not update a node without evidence. Implementation and review are separate nodes. `npm run validate:workflow` reports structural and state drift but does not replace judgment about artifact quality.

## Control-plane invariants

`workflow.yaml` contains facts and pointers, not artifact content or aspirations. Every `canonical.*` path must exist. `canonical.issue_graph` is a backward-compatible alias and must equal `canonical.progress_graph`.

When phase, canonical pointers, issue counts, graph state, or last activity changes, update the progress graph as justified, then update `workflow.yaml` and `runs-index.md` together. Regenerate the dashboard afterward.

## Artifact producers

| Artifact | Location | Producer |
|---|---|---|
| Research | `01-plan/01-research-intent/` | Manual research, SME work, or the applicable research skill |
| Context and discovery briefs | `01-plan/01-research-intent/` | `grilling-to-brief` or `grill-me-to-brief` |
| PRD/PID | `01-plan/02-planning/` | Planning/PID producer |
| Scope and roadmap | `01-plan/02-planning/` | Planning producer or approved PID derivation |
| Feature, technical, API, and data specs | `01-plan/03-solutioning/specs/` | Spec producer |
| UX, system, API, and data design | `01-plan/03-solutioning/design/` | Applicable design producer |
| ADRs | `01-plan/03-solutioning/decisions/` | `domain-modeling` or explicit decision authoring |
| Issue contracts | `01-plan/03-solutioning/issues/` | Issue decomposition producer |
| Implementation plans | `02-implement/implementation-plan/<issue-id>/` | Planning producer, linked from the issue contract |
| Implementation results | `02-implement/implementation-notes/` | Stack-specific implementer |
| Source | Source tree | Stack-specific implementer |
| Tests and reviews | `03-review/` | Stack-specific test/review producer |
| Release readiness and operations | `04-ops/` | Release or operational owner |
| Reconciliation and structural governance | Steward-owned bookkeeping surfaces | `piro-workflow-steward` |

The steward routes to these producers; it does not impersonate them. For planner/reviewer handoffs,
the producer supplies the complete substantive content and the steward persists it in **artifact mode**,
adds structural links, then synchronizes. See [artifact-mode.md](artifact-mode.md). This writing delegation
does not transfer ownership of the plan/review conclusions or authorize the next execution step.

## Creating or updating artifacts

When the user explicitly requests an artifact change:

1. Confirm the run and classify the artifact by purpose.
2. Search for an existing canonical artifact covering the same concern; update it instead of duplicating it.
3. Preserve established filenames and identifiers. Do not create `*-v2`, `*-final`, `*-new`, or similar versioned duplicates.
4. For a request to split a complex issue into phases, communicate the expected layout before or while routing the work: one issue contract under `01-plan/03-solutioning/issues/<issue-id>.md`, with the linked phase plans under `02-implement/implementation-plan/<issue-id>/<phase-id>-<phase-slug>.md`. Do not create a second contract under `02-implement/issues/`, and do not create extra issue contracts to represent phases. Do not create the substantive issue or phase plans unless the user asks; route their authoring to the issue-decomposition/planning producer. Grandfathered contracts already under `02-implement/issues/` stay there unless the user asks to move them.
5. Keep Specs, Design, and Decisions separate, using cross-references where appropriate.
6. Repair links after moves or renames. Do not move grandfathered legacy folders without explicit approval.
7. Reconcile affected graph nodes and control-plane state only when the new evidence justifies it.
8. Run the dashboard generation and both validation gates.
9. Report the artifact change and recalculate the next gap.

## Shared rules

- Read content before classifying it; never infer from filenames alone.
- Keep one canonical artifact per concern.
- Stay framework-agnostic when routing implementation, design, testing, and review.
- Do not claim validation or remote state that was not checked.
- Keep content changes opt-in. Sync bookkeeping is the narrow exception established by `AGENTS.md`.
