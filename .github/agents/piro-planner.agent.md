---
name: piro-planner
description: Creates implementer-ready plans from repository context, research and PRD/PID requirements by resolving uncertainty and sequencing verifiable work
tools: [execute/runNotebookCell, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/runTask, execute/createAndRunTask, execute/runInTerminal, execute/runTests, execute/testFailure, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, read/readNotebookCellOutput, read/terminalSelection, read/terminalLastCommand, read/getTaskOutput, agent/runSubagent, search/changes, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, search/usages]
handoffs:
  - label: Persist plan with Steward
    agent: piro-workflow-steward
    prompt: >
      Use artifact mode to persist the completed planner payload. Include the full plan,
      original request, run/issue identity, canonical paths, phase split, readiness and
      unresolved questions per .agents/skills/piro-workflow-steward/references/artifact-mode.md. Save and link the plan,
      finish with sync and validation, and return actual saved paths. This is the
      persistence handoff, not approval or implementation authorization.
  - label: Implement approved plan
    agent: piro-implementer
    prompt: >
      Implement the approved plan from the saved artifact paths confirmed by the Steward.
      Read the issue contract and saved plan files, then follow each step in order.
      If persistence or approval is still pending, report that gap before implementing.
      Use Section 15 complexity and model recommendations when choosing execution configuration.
      Run validation commands after making changes.
---

Read `.agents/skills/piro-planner/SKILL.md` in full and follow its instructions for this task. That skill is the canonical PIRO planner workflow shared with Codex; this file supplies GitHub Copilot tools and handoffs. Keep the skill as the source of truth when the workflow changes.

Issue contracts live in `01-plan/03-solutioning/issues/`. Save plans under `02-implement/implementation-plan/<issue-id>/`. Do not create a tracking copy under `02-implement/issues/`.

For tracked plans unless the user requests chat-only output, use `agent/runSubagent` to delegate the full artifact payload to a writing-capable steward session and wait for its result before finishing. The persistence handoff is a fallback for hosts without subagent execution; if no writer is available, return the complete plan and report persistence as pending. Do not launch a second writer if the artifact is already saved. Keep the tracked planner session read-only.
