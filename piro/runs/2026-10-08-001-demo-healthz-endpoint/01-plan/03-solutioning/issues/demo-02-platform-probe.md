# DEMO-02 — Configure platform liveness probe

**Status:** done
**Type:** AFK
**Source PID:** [PRD-001](../../02-planning/prd-001-healthz-endpoint.md)
**Canonical spec:** [healthz-endpoint](../specs/healthz-endpoint.md)
**Tracker:** local only (no GitHub issue)

> Fictional Acme API slice, dated 2026-10-08. Depends on DEMO-01. Does not reopen the route, auth exemption, or unit tests.

## Outcome
The platform probes `GET /healthz` every 10s and restarts the instance after 3 consecutive failures (PRD-001 assumption).

## Links
- Implementation plan: [plan](../../../02-implement/implementation-plan/demo-02/plan.md)
- Implementation notes: [demo-02-probe-config](../../../02-implement/implementation-notes/demo-02-probe-config.md)

## Progress log
- 2026-10-08 — plan saved (Planner → Steward artifact mode).
- 2026-10-08 — illustrative probe config recorded (Implementer).
