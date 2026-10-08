# DEMO-01 — Add `GET /healthz` liveness endpoint

**Status:** done
**Type:** AFK
**Source PID:** [PRD-001](../../01-plan/02-planning/prd-001-healthz-endpoint.md)
**Canonical spec:** [healthz-endpoint](../../01-plan/03-solutioning/specs/healthz-endpoint.md)
**Decision:** [ADR-001](../../01-plan/03-solutioning/decisions/ADR-001-liveness-only-probe.md)
**Tracker:** local only (no GitHub issue)

> The issue is the unit of delivery. It is **not** split into phases, so there is one implementation plan and no per-phase files.

## Outcome
`GET /healthz` is live and the platform probe is configured against it.

## Acceptance
PRD-001 AC1–AC4.

## Links
- Implementation plan: [plan](../implementation-plan/demo-01/plan.md)
- Implementation notes: [demo-01-implementation](../implementation-notes/demo-01-implementation.md)
- Validation: [demo-01-validation](../../03-review/test-results/demo-01-validation.md)
- Review: [DEMO-01 review](../../03-review/reviews/demo-01-review.md)
- Runbook: [healthz-probe-failure](../../04-ops/runbooks/healthz-probe-failure.md)

## Progress log
- 2026-10-08 — plan saved (Planner → Steward artifact mode).
- 2026-10-08 — implemented and validated (Implementer).
- 2026-10-08 — review accepted (Reviewer → Steward artifact mode); release approved by product owner.
