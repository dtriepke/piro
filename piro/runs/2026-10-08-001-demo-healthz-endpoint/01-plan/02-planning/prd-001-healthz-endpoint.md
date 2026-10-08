# PRD-001 — Liveness endpoint for Acme API

**Status:** Approved (demo)
**Run:** `2026-10-08-001-demo-healthz-endpoint`
**Research input:** [healthz-options](../01-research-intent/technology/healthz-options.md)

> The PRD/PID owns *run framing*: problem, outcome, users, scope, success criteria and assumptions. There is no separate framing artifact.

## 1. Problem

The platform cannot tell a hung Acme API instance from a healthy one, so unhealthy instances keep receiving traffic until a human notices.

## 2. Objective

The platform can detect a hung instance within 30 seconds and restart it automatically.

## 3. Users

- Platform operator (consumer of the probe).
- On-call engineer (reads the runbook when the probe fails).

## 4. Scope

**In scope:** an unauthenticated `GET /healthz` liveness route; a runbook for probe failures.
**Non-goals:** readiness checks, dependency health, metrics, authentication changes.

## 5. Requirements

| ID | Requirement |
|---|---|
| FR-1 | `GET /healthz` returns HTTP 200 and body `{"status":"ok"}` while the process serves requests. |
| FR-2 | The route requires no authentication and performs no I/O. |
| NFR-1 | p95 latency under 50 ms on the reference instance size. |

## 5a. Acceptance criteria

1. **AC1** — `GET /healthz` returns 200 with `{"status":"ok"}` (FR-1).
2. **AC2** — The route works without credentials and touches no database or network (FR-2).
3. **AC3** — p95 latency is under 50 ms in the load check (NFR-1).
4. **AC4** — A runbook explains what to do when the probe fails.

## 6. Assumptions

- The platform probes every 10 s and restarts after 3 consecutive failures (=> 30 s detection).

## 7. Work breakdown

One work package: [DEMO-01](../../02-implement/issues/demo-01-healthz-endpoint.md). No sub-issues.
