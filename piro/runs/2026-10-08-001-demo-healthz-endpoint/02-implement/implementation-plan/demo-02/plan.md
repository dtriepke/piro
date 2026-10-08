# Implementation plan — DEMO-02

**Issue:** [DEMO-02](../../../01-plan/03-solutioning/issues/demo-02-platform-probe.md) · **Producer:** `piro-planner` · **Persisted by:** `piro-workflow-steward` (artifact mode) · **Readiness:** ready for Implementer

> Abridged. Fictional Acme API plan, dated 2026-10-08. The demo has no real platform.

## 1. Goal
Point the platform liveness probe at the existing `GET /healthz` route.

## 6. Task list
1. Set the probe path to `GET /healthz`. *Verify:* target path is `/healthz`.
2. Set the interval to 10s and the restart threshold to 3 failures. *Verify:* matches the PRD-001 assumption.
3. Leave DEMO-01's route, auth exemption, and unit tests unchanged. *Verify:* no handler diff.

## 15. Recommended execution
Complexity **Low**. Hand off to the Implementer in one session.
