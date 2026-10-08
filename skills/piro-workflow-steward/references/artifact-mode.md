# Artifact mode: producer to steward writing handoff

Use this mode in a writing-capable steward sub-session to persist completed planner or reviewer content. The caller authors the plan or review; the steward owns placement, writing, links, and evidence-backed synchronization. This is not authorization to implement, revise requirements, close tracker issues, or dispatch the next producer.

## Communication contract

The producer must send a self-contained payload, not a pointer to conversation history:

- **Task and authorization:** the user's request, whether persistence is permitted, and any chat-only or path constraints.
- **Identity:** run ID, issue ID, parent issue contract path, and phase IDs when applicable. For run-level reviews without an issue, state the reviewed scope instead.
- **Context:** canonical PRD/PID, spec, design, decision, and existing plan/review paths from the status handoff.
- **Content:** the complete final Markdown for each artifact, preserving the producer's sections and conclusions; identify phase boundaries when split. Use the payload directly or a supplied readable staging file; do not reconstruct it from a summary.
- **Disposition and evidence:** draft/ready status and unresolved questions for plans; review baseline (commit/diff or explicitly named working-tree scope), findings, recommendation, and checks actually run or inspected for reviews. A planning handoff is not plan approval; a review recommendation is not owner acceptance or issue closure.
- **Requested artifact operation:** create/update, proposed destination(s), links to add, and any existing content that must be preserved.

In Codex, spawn a child agent tasked to use `.agents/skills/piro-workflow-steward/SKILL.md` in artifact mode. In Copilot, use `agent/runSubagent` with the steward agent/skill and the same payload. Select a writing-capable session; the planner/reviewer remains responsible for checking the returned result. Do not use the parent's read-only tool configuration for the writer.

## Writing procedure

1. Verify the run, issue, existing artifacts, and authorization from the payload against the control plane. Do not silently pick a different run or overwrite conflicting content. Missing content or a material conflict goes back to the producer.
2. Reuse an existing artifact for the same scope. For a new unphased issue plan, use `02-implement/implementation-plan/<issue-id>/plan.md`; for a phased issue, use `<phase-id>-<phase-slug>.md` in that directory. Use stable lowercase directory IDs (for example `sjap-01`). For a run-level plan without an issue, use an established plan path or `02-implement/implementation-plan/<scope>-plan.md`; do not fabricate an issue ID. A scoped review belongs under `03-review/reviews/<issue-id>-review.md`, or an established run-level review path. Preserve established filenames and user-specified destinations consistent with repository rules.
3. Write the supplied content without changing acceptance criteria, findings, recommendations, or approval state. Add only structural metadata such as run/issue identity, producer, baseline, and cross-references. Keep existing unique content; if merging needs a substantive decision, return the conflict rather than inventing a resolution.
4. Add or repair relative links: issue contract to saved plan/phase files or review; saved artifact back to its issue and relevant contract/plan. These link edits must not change issue status or requirements. Do not copy the same contract into execution tracking.
5. Read back each written file and verify full content and links. Never treat successful writing as implementation completion, plan approval, or review acceptance.
6. Finish with [sync mode](sync-mode.md), including dashboard generation and both validation gates. Do not invent completion evidence or update unrelated nodes. If no graph change is warranted, say so.

## Return contract

Return saved artifact paths, issue links changed, disposition preserved, synchronization changes (or none), validation commands/outcomes, and any unresolved conflict or persistence failure. The producer waits for this result, verifies the files, and includes clickable artifact paths in its final handoff. Never report an artifact as saved from a proposed path alone.

If delegation or writing is unavailable, return the complete content and a precise pending handoff; do not claim persistence or silently write from the read-only producer session. If a child already exists, continue that handoff rather than launching concurrent writers for the same files.
