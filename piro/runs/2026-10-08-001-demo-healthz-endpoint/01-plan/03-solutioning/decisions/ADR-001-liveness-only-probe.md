# ADR-001 — Liveness-only probe, no dependency checks

**Status:** Accepted, 2026-10-08
**Run:** `2026-10-08-001-demo-healthz-endpoint`

*Decisions say **why** this approach.*

## Context
A probe that checks the database restarts every instance during a database outage and turns a partial outage into a full one.

## Decision
`/healthz` only proves the process serves HTTP requests. Dependency checks are out of scope and would belong to a separate readiness endpoint.

## Alternatives considered
- **Probe includes database ping** — rejected: restart storms during dependency outages.
- **TCP check only** — rejected: cannot detect a hung request loop.

## Consequences
- Operators get fast, side-effect-free detection of hung processes.
- A future readiness endpoint needs its own PRD.
