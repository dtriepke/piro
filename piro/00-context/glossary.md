# Glossary

| Term | Meaning |
|---|---|
| Run | One independently trackable piece of work moving through the lifecycle (`YYYY-MM-DD-NNN-kebab-slug`). |
| PRD / PID | Product / Product-Implementation document: the run's framing and acceptance contract. |
| Issue | The unit of delivery. Not split into phases unless explicitly decomposed. |
| Progress graph | `workflow-progress.yaml`: one DAG of typed nodes per run; the only lifecycle-status authority. |
| Control plane | `piro/workflow.yaml`: canonical pointers, declared phase, last activity. |
| Steward | `piro-workflow-steward`: the only writer of bookkeeping surfaces. |
