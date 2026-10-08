# Status mode

Use status mode for run discovery, canonical-artifact context handoffs, run position, readiness, next-action, and implementation-issue questions. It is read-only unless the user separately asks for repair or artifact changes.

## Producer context handoff

Planner, implementer, and reviewer use this mode before working from a tracked run. Given the task, topic, path, or issue identifier:

1. Resolve the run from `piro/workflow.yaml`, `piro/runs-index.md`, and actual run directories. Do not choose silently when multiple runs remain plausible.
2. Read the selected progress graph and enough artifact metadata to identify the current phase, readiness, dependencies, blockers, and canonical paths.
3. Return a concise handoff containing:
   - selected run ID and why it matches;
   - current phase and readiness;
   - canonical context, research, PRD/PID, spec, design, decision, issue, implementation-plan, implementation-note, review, and ops paths that are relevant to the requested work. The issue contract is `01-plan/03-solutioning/issues/<issue-id>.md` unless a grandfathered file already exists under `02-implement/issues/`. Its plan is `02-implement/implementation-plan/<issue-id>/`. Implementation results are `02-implement/implementation-notes/`;
   - for a phased issue, its parent issue contract path and each discovered phase-plan path under `02-implement/implementation-plan/<issue-id>/`; identify missing links/files as missing rather than inferring them;
   - dependency blockers and the primary next action;
   - whether remote tracker state was checked.
4. Do not summarize substantive requirements as a substitute for reading them. The receiving producer must open and interpret the returned artifacts itself.

If the task clearly has no tracked-run relationship, report that briefly instead of forcing it into the focus run. If the request is only for status, return the status report and do not route into planning, implementation, or review work unless the user also requested that work.

## Read the artifact trail

Walk the selected run in lifecycle order and record actual files, not empty folders. For each relevant artifact, summarize its purpose and classify it as:

- `canonical`: substantive, current, and not marked draft.
- `draft`: provisional, pending approval, or unresolved in a way that blocks its purpose.
- `missing`: expected for the claimed readiness but absent.
- `blocked`: present but gated by an unresolved prerequisite or decision.

Check dates, TODOs, open questions, dangling references, issue-to-spec traceability, parent-issue-to-phase-plan links for decomposed work, review evidence for completed implementation, and review/test/security evidence behind release claims.

## Determine phase and readiness

1. Use a valid progress graph as the baseline and verify its evidence against artifacts.
2. Without a valid graph, use substantive artifacts rather than directory presence.
3. During Solutioning, assess Specs, Design, and Decisions independently.
4. During Review, distinguish tests, code review, security review, and unresolved findings.
5. Do not recommend Release without appropriate reviewed implementation and explicit gates.
6. Recommend OPS only after release readiness is recorded or the run explains why release is not required.
7. Name one primary next action, independent peer gaps, blockers, and open questions separately.

## Report shape

### Run status: `<run-id>`

- **Current phase:** `CONTEXT`, `RESEARCH`, `PLANNING`, `SOLUTIONING`, `IMPLEMENT`, `REVIEW`, or `OPS`
- **Readiness:** one sentence stating whether the phase is partial, ready, blocked, or complete
- **Index vs. reality:** alignment or exact drift

### Artifact trail

| Lifecycle area | Artifacts found | State |
|---|---|---|
| Research | ... | canonical / draft / missing / blocked |
| Planning | ... | canonical / draft / missing / blocked |
| Specs | ... | canonical / draft / missing / blocked |
| Design | ... | canonical / draft / missing / blocked |
| Decisions | ... | canonical / draft / missing / blocked |
| Implement | ... | canonical / draft / missing / blocked |
| Review | ... | canonical / draft / missing / blocked |
| Release / Ops | ... | canonical / draft / missing / blocked |

### What's next

- **Primary next artifact or action:** exact path, issue, or folder
- **Producer:** exact skill or workflow and why
- **Parallel gaps:** independent work that can proceed safely
- **Blocked by:** prerequisite, unresolved question, or `Nothing — ready to proceed.`

### Open questions

Include only unresolved decisions or gates that materially affect the next action. Omit the section when none exist.

## Implementation issue status

When asked for implementation issues or work packages, always add a concise emoji table and summarize the dependency sequence. For issues split into phases, include the parent issue artifact and the phase-plan paths in or alongside the table; distinguish issue/work-package status from phase-plan existence, and derive any phase state only from explicit local or graph evidence. Local canonical issue artifacts are the status source unless remote tracker state was checked.

| Status | Work package | Issue | Current position |
|---|---|---|---|
| ✅ Done | ... | #... | ... |
| 🟢 Ready | ... | #... | ... |
| ⏳ Waiting | ... | #... | ... |
| 🔴 Blocked | ... | #... | ... |
