---
name: to-prd
description: 'Turn the current conversation context or research&intent into a PRD (business/product contract) — objective, problem, solution, scope, user stories, and functional/non-functional requirements — without the technical implementation contract. Use when user wants a PRD, wants the business contract split from technical solutioning, or explicitly says the technical detail (architecture, APIs, data models, security, performance) will be captured separately in specs/design/decisions.'
argument-hint: 'Optional: extra focus area or constraint to emphasize in the PRD'
---

# To PRD
## Rafiki Assignment Context

When invoked by a Rafiki producer with `rafiki_assignment`, write the PRD yourself to the exact approved destination under the selected run's `01-plan/02-planning/`. Never infer another run, publish remotely, edit state/index or offer issue generation. Keep the contract business-only and initial status Draft unless matching explicit approval is supplied. Return the verified path, evidence, disposition and unresolved questions to the steward; authored is not approved. Return `needs_context` for conflicting placement. The standalone procedure below applies only where consistent with these assignment boundaries.

Synthesize the current conversation context, research & intent, and codebase understanding into a structured PRD (Product Requirements Document): the business/product contract only. Publish it to the project issue tracker or planning location the user names.

**Do NOT interview the user.** Work from what you already know.

## When to Use

- User says "create a PRD", "write a PRD", or "turn this into a PRD"
- User wants the business contract (what and why) kept separate from the technical implementation contract (how), because a downstream solutioning stage (specs, design, decisions) will own the technical detail
- After a design discussion where the user wants a product-facing contract formalized without prescribing architecture, APIs, data models, or non-functional operating limits
- To capture a feature's business case before solutioning begins

## Background: PRD vs PID

This skill's **PRD** is the canonical business/product contract: it defines *what* is being committed to and *why*, using the project's own domain vocabulary. It intentionally excludes **Architecture Impact, APIs, Data Models, Repository Baseline, Security Requirements, and Performance Requirements** — those are the technical implementation contract and belong to the solutioning stage (`01-plan/03-solutioning/specs/`, `design/`, `decisions/`), not to this document. This mirrors the artifact classification rule: "What are we committing to build?" is Planning; "How should it be solved?" is Solutioning.

`to-pid` remains available for runs that want one all-in-one document (business + technical contract, no separate solutioning stage). Use `to-prd` instead whenever technical detail will be captured separately, so the PRD never needs to be reinterpreted for implementation detail later, and so downstream issue drafting can cite specs/design/decisions for technical grounding rather than only this document.

The SDLC flow is:
```
Discovery → Repository Analysis → PRD (business only) → Solutioning (specs/design/decisions) → Issues → Development
```

## Procedure

### 1. Explore the Repo

If you haven't already explored the repo during this conversation:
- Scan the project structure (`list_dir`, `file_search`)
- Read `AGENTS.md`, `README.md`, or any ADR / decision-log files to understand conventions
- Identify the relevant modules and domain terms, and note prior art in the area being discussed — enough to ground scope and user stories, not enough to design the solution
- Check `docs/engineering.md` and `docs/design.md` if they exist for project-level guidance

Do not derive architecture, module boundaries, API shapes, or data models here — that analysis belongs to solutioning, not to this skill.

### 2. Synthesize Research and Intent (if given)

Before defining the product contract, inspect all relevant upstream evidence:

- business research
- UX research
- prototypes and concept explorations
- technology research (feasibility only — not solution design)
- existing conversation context
- prior decisions and constraints

Synthesize internally:

- What problem or opportunity is supported by the evidence?
- Who is affected?
- What outcome are we trying to achieve?
- Which findings are established evidence?
- Which points are assumptions or hypotheses?
- What remains unresolved?
- What is explicitly outside the current intent?

Do not create a separate research summary or `intent.md` unless explicitly requested.

Use this synthesis as the basis for the PRD.

Do not silently convert:
- prototype behaviour into requirements,
- research hypotheses into facts,
- technical possibilities into implementation decisions.

### 3. Write the PRD

Use the template below. File naming convention: `PRD-NNN-feature-name.md`, placed at the assigned `.rafiki/runs/<run-id>/01-plan/02-planning/` destination, or the local planning location the user specifies outside Rafiki.
Use the project's own domain vocabulary throughout — do not invent new terms.

For new PRDs use stable requirement and acceptance identifiers (for example `FR-001`, `NFR-001`, `AC-001`) so solutioning can reference them. Preserve existing identifiers on revision; do not renumber items merely because they move.

~~~markdown
# PRD-NNN — <Feature Name>

**Status:** Draft | Review | Approved | Implemented
**Created:** YYYY-MM-DD
**Author:** <author>

---

## Document Authority

This is the business/product contract for this run. It defines **what and why**, not implementation detail. The technical implementation contract — architecture, module boundaries, APIs, data models, security requirements, and performance requirements — lives in the solutioning stage (specs, design, decisions), not in this document. Downstream issue drafting should read solutioning artifacts for technical grounding and this PRD only for requirement traceability (user story / functional requirement / acceptance criteria IDs).

## Objective

<One paragraph: what this feature achieves and why it matters.>

## Problem Statement

<The problem being solved, from the user's perspective.>

## Solution

The solution to the problem, from the user's perspective. Describe outcomes and behavior, not implementation.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Scope

Product decisions that were made. Do NOT include specific file paths, code snippets, module names, or API shapes — those belong to solutioning and go stale fast here.

### In Scope
- <item>

### Out of Scope
- <item>

## Functional Requirements

A numbered list of concrete functional behaviours the implementation must satisfy, described from an observable/product perspective (not internal module responsibilities).

1. <requirement>

## Non-Functional Requirements

Standards and targets the product must meet, stated as commitments rather than technical design:

- Accessibility: <standards, e.g. WCAG 2.1 AA>
- Internationalisation: <if applicable>
- Reliability: <user-facing commitment, e.g. "accepted progress survives a restart">
- Compliance/Privacy: <regulatory posture, e.g. GDPR>

Numeric performance budgets, specific security controls, and architecture-level reliability mechanisms belong in the solutioning stage's technical contract, not here.

## Dependencies

- <internal or external dependency, stated at a business/vendor level, e.g. "requires provider onboarding to declare capability data">

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| <risk> | High/Med/Low | High/Med/Low | <mitigation> |

## Acceptance Criteria

A checklist of verifiable outcomes, observable from a product/user perspective:

- [ ] <criterion>

## Open Questions

- [ ] <question>

---
~~~

### 4. Explain the Split (interactive mode only)

When presenting the PRD to the user, briefly confirm that the technical implementation contract (architecture, APIs, data models, repository baseline, security, performance) still needs to be produced separately in solutioning before implementation-ready issues can be drafted. Point to the project's solutioning skill (e.g. `to-spec`) or ask whether the user wants to proceed with that now.

### 5. Publish

In a Rafiki assignment, persist locally to the approved destination and return the receipt. The steward alone updates bookkeeping. Do not publish remotely or automatically advance to another skill.

Outside a Rafiki assignment, publish to the location and format the user specifies (issue tracker, or a file under the project's planning folder). Do not close or modify any parent issue. For Rafiki runs, the Steward alone manages the run, index, and state; return the saved artifact and do not write bookkeeping even when invoked directly.
