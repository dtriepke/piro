# DEMO-01 implementation notes

> Fictional demo evidence. In a real run, the graph's `source` evidence points at real source files; this note stands in for them so the demo is self-contained.

**Issue:** [DEMO-01](../issues/demo-01-healthz-endpoint.md)

## What changed
- `src/server/routes.ts` — `GET /healthz` handler returning `{"status":"ok"}`.
- `src/server/auth.ts` — `/healthz` added to the allow-list.
- `tests/healthz.test.ts` — 200, body, no-credentials and 405 cases.

## Deviations from the plan
None.

## Findings worth keeping
The framework's default 404 handler ran before the allow-list; the route had to be registered before the auth middleware.
