# Implementation plan — DEMO-01

**Issue:** [DEMO-01](../../issues/demo-01-healthz-endpoint.md) · **Producer:** `piro-planner` · **Persisted by:** `piro-workflow-steward` (artifact mode) · **Readiness:** ready for Implementer

> Abridged. A real plan uses the planner's 15 sections (goal, success criteria, scope, current state, context map, task list, interface/data design, dependencies, risks, testing, documentation impact, assumptions, open questions, recommended execution).

## 1. Goal
Add an unauthenticated `GET /healthz` that returns `200 {"status":"ok"}`.

## 2. Success criteria
1. AC1–AC4 of PRD-001 are met.
2. The service's required validation command passes with no new failures.

## 5. Context map
| File | Role | Action |
|---|---|---|
| `src/server/routes.ts` | Route table | Modify |
| `src/server/auth.ts` | Auth middleware allow-list | Modify |
| `tests/healthz.test.ts` | New route test | Create |

## 6. Task list
1. Add the route handler (no I/O). *Verify:* unit test asserts 200 and body.
2. Add `/healthz` to the auth allow-list. *Verify:* request without credentials returns 200.
3. Add a 405 test for non-GET methods.
4. Write the runbook under `04-ops/runbooks/`.

## 10. Risks
- *Low:* route accidentally performs I/O later. *Mitigation:* spec states "no I/O"; reviewer checks it.

## 15. Recommended execution
Complexity **Low** (one subsystem, 3 files, no contract change). Hand off to the Implementer in one session.
