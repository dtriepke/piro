---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
disable-model-invocation: true
---

## Rafiki Assignment Context

When invoked by a Rafiki producer with `rafiki_assignment`, run the grilling as an interactive relay (`needs_input`), then record ADRs and glossary only in the approved destination under `01-plan/03-solutioning/decisions/` of the assigned run, never in a root `CONTEXT.md` or `docs/`.

Call the Skill tool twice, for "grilling" and "domain-modeling".
