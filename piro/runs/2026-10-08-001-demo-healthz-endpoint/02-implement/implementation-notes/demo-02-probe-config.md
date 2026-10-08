# DEMO-02 implementation notes

> Illustrative. The demo has no real platform; this note is not a claim that a cluster was configured. Paths are examples only.

**Issue:** [DEMO-02](../../01-plan/03-solutioning/issues/demo-02-platform-probe.md)
**Date:** 2026-10-08

## What changed
- Illustrative probe config `platform/liveness-probe.yaml`: `GET /healthz`, every 10s, restart after 3 failures.

## Deviations from the plan
None. DEMO-01's route, auth exemption, and unit tests were not reopened.
