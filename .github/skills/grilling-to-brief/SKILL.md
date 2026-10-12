---
name: grilling-to-brief
description: Grill the user relentlessly about a plan, decision, or idea, then write the agreed context brief for the current planning run.
---

## Rafiki Assignment Context

When invoked by a Rafiki producer, use its `rafiki_assignment` identity and approved destination. Return `needs_input` with the complete numbered frontier round, recommendations and resumable decision tree instead of questioning the user from the child session. The steward supplies answers and explicit confirmation on continuation. Return `needs_context` for fact gathering requiring unavailable delegation or conflicting placement; do not enable nested agents. Persist the agreed brief yourself, return the verified saved path and leave state/index updates to the steward. Standalone interviewing remains unchanged.

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven’t heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user’s answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user’s. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don’t ask the user for anything you could look up yourself. Don’t block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user’s: put each to them and wait.

The interview is done when the frontier is empty: every branch of the design tree has been visited, nothing is silently assumed, and the user has confirmed the shared understanding. Do not act on the plan before that confirmation.

After confirmation, consolidate the result into the context brief using the bundled template at:

`assets/context-brief-faq-template.md`

Write the completed brief to `.rafiki/runs/<RUN-ID>/01-plan/01-research-intent/context-brief-faq.md`. Use the existing run ID; do not create a second run or store the brief outside that run directory. Preserve decisions, rationale, assumptions, unresolved questions, repository evidence, and confidence. Do not turn the brief into a PID, implementation plan, or solution specification.

Do not modify any other file while producing the brief. Verify the file exists and report its path.
