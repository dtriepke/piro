# Implementation plan — DEMO-04

**Issue:** [DEMO-04](../../../01-plan/03-solutioning/issues/demo-04-latency-gate.md) · **Producer:** `piro-planner` · **Persisted by:** `piro-workflow-steward` (artifact mode) · **Readiness:** ready for Implementer

> Abridged. Fictional Acme API plan, dated 2026-10-08. The demo has no real release pipeline.

## 1. Goal
Do not approve release unless the p95 latency check is under 50 ms.

## 6. Task list
1. Read the load-check result for `GET /healthz`. *Verify:* a p95 figure is recorded.
2. Withhold the go decision unless p95 is under 50 ms (PRD-001 AC3 / NFR-1). *Verify:* the release record requires that check.
3. Wait until DEMO-02 and DEMO-03 are done. *Verify:* both sibling issues are done before the gate.

## 15. Recommended execution
Complexity **Low**. Hand off to the Implementer in one session.
