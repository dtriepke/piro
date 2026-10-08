# Implementation plan — DEMO-03

**Issue:** [DEMO-03](../../../01-plan/03-solutioning/issues/demo-03-oncall-publish.md) · **Producer:** `piro-planner` · **Persisted by:** `piro-workflow-steward` (artifact mode) · **Readiness:** ready for Implementer

> Abridged. Fictional Acme API plan, dated 2026-10-08. The demo has no real on-call system.

## 1. Goal
Publish the probe-failure runbook steps to the on-call channel.

## 6. Task list
1. Use the steps in the existing runbook. *Verify:* steps match `04-ops/runbooks/healthz-probe-failure.md`.
2. Post those steps to the on-call channel. *Verify:* the channel record cites the runbook.
3. Leave the DEMO-01 route unchanged. *Verify:* no handler diff.

## 15. Recommended execution
Complexity **Low**. Hand off to the Implementer in one session.
