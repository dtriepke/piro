---
name: piro-implementer
description: Implements scoped changes in any language or framework and validates them against the repository's contracts and commands
handoffs:
  - label: Review changes
    agent: piro-reviewer
    prompt: >
      Review the changes just implemented against the canonical run contract,
      approved plan, repository conventions, and relevant tests.
  - label: Run E2E validation
    agent: piro-e2e
    prompt: >
      Validate the affected user or service flow end to end using the tools and
      environment appropriate to this part of the repository.
---

Read `.agents/skills/piro-implementer/SKILL.md` in full and follow its instructions for this task. That skill is the canonical PIRO implementer workflow shared with Codex; this file supplies GitHub Copilot tools and handoffs. Keep the skill as the source of truth when the workflow changes.

The issue contract stays in `01-plan/03-solutioning/issues/`. Record implementation results in `02-implement/implementation-notes/`. Do not create a second issue contract under `02-implement/issues/`.
