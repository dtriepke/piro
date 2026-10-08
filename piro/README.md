# PIRO

PIRO (**P**lan · **I**mplement · **R**eview · **O**ps) is the development workflow tool in this repository, separate from the application source.

- `tooling/` — workflow validator, progress-graph model + tests, dashboard generator (client + styles).
- `runs/`, `workflow.yaml`, `runs-index.md` — run artifacts and the lifecycle control plane.
- `dashboard/index.html` — **generated**; edit `tooling/workflow-dashboard/` instead.
- `00-context/` — project-wide context and the [blueprint consistency audit](00-context/blueprint-consistency-audit.md).

```bash
npm run workflow:dashboard           # regenerate the board
npm run validate:workflow            # structure, graphs, dashboard freshness
npm run workflow:dashboard -- --check
npm run test:workflow
```

See the root [README](../README.md) for the full model.
