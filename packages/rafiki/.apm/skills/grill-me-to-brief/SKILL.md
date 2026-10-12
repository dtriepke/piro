---
name: grill-me-to-brief
description: Interview the user relentlessly about a plan or design, then write the agreed context brief for the current planning run.
---

# Grill Me to Brief

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one by one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

## Rafiki Assignment Context

When invoked by a Rafiki producer, use its `rafiki_assignment` identity and approved destination, not an inferred path. Return `needs_input` with one question, recommendation and complete resume notes whenever input is required; the steward collects answers and supplies them on continuation. Do not invent confirmation. Write the brief only after the user agrees to the shared understanding and return its verified saved path. Never edit run state/index; return `needs_context` for identity or placement conflicts. Standalone interviewing remains unchanged.

## Output

When the interview is complete, consolidate the result into the context brief using the bundled template at:

`assets/context-brief-faq-template.md`

Write the completed brief to `.rafiki/runs/<RUN-ID>/01-plan/01-research-intent/context-brief-faq.md`. Use the existing run ID; do not create a second run or store the brief outside that run directory. Preserve decisions, rationale, assumptions, unresolved questions, repository evidence, and confidence. Do not turn the brief into a PID, implementation plan, or solution specification.

Do not modify any other file. Verify the file exists and report its path.
