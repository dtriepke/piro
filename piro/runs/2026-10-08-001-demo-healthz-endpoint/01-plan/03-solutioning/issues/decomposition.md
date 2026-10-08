# Issue decomposition — Acme API liveness

> Synthetic issue graph for the dashboard demo. Fictional Acme API slices, dated 2026-10-08. Nothing here was deployed.

DEMO-01 already delivered the route, the auth exemption, and the unit tests. DEMO-02, DEMO-03, and DEMO-04 are sibling issues. They are **not** phases of DEMO-01, and DEMO-01 is not split into phases.

| ID | Title | Status | Execution | Depends on | Contract |
|---|---|---|---|---|---|
| DEMO-01 | Add `GET /healthz` liveness endpoint | done | AFK | plan peers (see graph) | [grandfathered contract](../../../02-implement/issues/demo-01-healthz-endpoint.md) |
| DEMO-02 | Configure platform liveness probe | done | AFK | DEMO-01 | [demo-02-platform-probe](demo-02-platform-probe.md) |
| DEMO-03 | Publish probe-failure steps to on-call | done | HITL | DEMO-01 | [demo-03-oncall-publish](demo-03-oncall-publish.md) |
| DEMO-04 | Gate release on the latency check | done | MIXED | DEMO-02, DEMO-03 | [demo-04-latency-gate](demo-04-latency-gate.md) |

```
DEMO-01 (done)
  ├─► DEMO-02 Configure platform liveness probe (done)
  └─► DEMO-03 Publish probe-failure steps to on-call (done)
         └─► DEMO-04 Gate release on the latency check (done)
```

DEMO-04 waits on both DEMO-02 and DEMO-03. No `*-issue-graph.yaml`. Lifecycle status stays in the run progress graph.
