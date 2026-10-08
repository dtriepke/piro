# Run context — demo `/healthz` endpoint

> **Fictional demo run.** It exists to show what a complete PIRO run looks like. The product, tests, approvals and dates are illustrative; nothing here was actually deployed.

Run ID: `2026-10-08-001-demo-healthz-endpoint`

Context for this run only. Project-wide context lives in `piro/00-context/`.

- A small web service ("Acme API") needs a liveness probe so the platform can restart unhealthy instances.
- Four issues: DEMO-01..04. DEMO-01 is **not** split into phases. DEMO-02, DEMO-03, and DEMO-04 are sibling issues that form a dependency graph; they are not phases of DEMO-01.
- Owner / approver in this demo: the "product owner" role (a human).
