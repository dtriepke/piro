# Technology research — liveness probe options

**Run:** `2026-10-08-001-demo-healthz-endpoint` · **Stream:** research / technology · **Feeds:** [PRD-001](../../02-planning/prd-001-healthz-endpoint.md)

| Option | Pros | Cons |
|---|---|---|
| HTTP `GET /healthz` returning `200 {"status":"ok"}` | Supported by every orchestrator; trivial to test | Needs a route and an auth exemption |
| TCP port check | No code | Cannot detect a hung event loop |
| Process-level heartbeat file | Works without HTTP | Needs a sidecar and shared volume |

**Finding:** an HTTP liveness route is the smallest option that detects a hung request loop. Dependency checks (database, queue) are a *readiness* concern and are deliberately excluded.

Business and UX research were judged not applicable (internal operational capability, no end-user surface); the graph records both as `not_applicable` with a rationale.
