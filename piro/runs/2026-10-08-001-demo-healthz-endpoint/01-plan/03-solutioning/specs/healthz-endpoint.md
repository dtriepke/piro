# Spec — `GET /healthz`

**Satisfies:** [PRD-001](../../02-planning/prd-001-healthz-endpoint.md) FR-1, FR-2, NFR-1 · **Decision:** [ADR-001](../decisions/ADR-001-liveness-only-probe.md)

*Specs say **what** the system does.*

| Aspect | Behaviour |
|---|---|
| Method / path | `GET /healthz` |
| Auth | None (exempt from the auth middleware) |
| Success | `200`, `Content-Type: application/json`, body `{"status":"ok"}` |
| Other methods | `405` |
| Side effects | None; no I/O |
| Latency budget | p95 < 50 ms |
