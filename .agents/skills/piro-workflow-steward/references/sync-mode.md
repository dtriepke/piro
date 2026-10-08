# Sync mode

Use sync mode as the fast reconciliation path after a relevant artifact or evidence change. It is not a full audit or status report.

## Procedure

1. Identify the affected run from the changed path or evidence. If multiple runs remain plausible, switch to status mode and ask which run rather than mutating the wrong graph.
2. Read the affected run's `workflow-progress.yaml` and the changed artifact or source evidence. Skip the full artifact-trail walk unless drift appears.
3. Update only nodes whose evidence changed. Follow the typed evidence rules in [workflow-model.md](workflow-model.md); never mark a node `done` from a claim or folder alone.
3a. For work packages with a `phases` list, update the changed phase's `state`, `note`, and `updated_at` from the issue's Progress log or phase files. Add phases when a new phase plan appears.
4. Recalculate derived readiness. If declared phase, canonical pointers, issue counts, or last activity no longer match justified graph state, update `piro/workflow.yaml` and `piro/runs-index.md` together.
5. Run `npm run workflow:dashboard`.
6. Run `npm run validate:workflow` and `npm run workflow:dashboard -- --check`.
7. If a gate fails, stop narrow sync and report the drift using the relevant status sections. Do not coerce files to satisfy validation.

Sync mode never creates a PRD, spec, design, ADR, issue, review, release record, or other substantive content artifact. It reconciles bookkeeping around evidence another producer created.

## Output

Report tersely:

- Nodes changed, or that no evidence-backed node change was warranted.
- Whether phase, pointers, index data, or last activity moved.
- Dashboard generation result.
- Pass/fail for both validation gates.
- Any missing evidence or drift needing attention.
