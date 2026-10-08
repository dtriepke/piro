# DEMO-01 validation results

> Fictional demo results.

**Run:** `2026-10-08-001-demo-healthz-endpoint` · **Issue:** [DEMO-01](../../02-implement/issues/demo-01-healthz-endpoint.md) · **Date:** 2026-10-08

| Check | Command | Result |
|---|---|---|
| Unit tests | `npm test` | 4 new tests, all passed |
| Lint / type check | `npm run lint && npm run typecheck` | clean |
| Load check (AC3) | `k6 run healthz.js` | p95 12 ms (< 50 ms) |

**Outcome:** passed
