---
name: to-spec
description: Create or revise a lightweight technical specification for a Rafiki planning run from product intent and repository evidence, including relevant SAP constraints and verification handoff. Use for technical solutioning after a PRD; create supporting decisions or design only when needed and assigned. Does not generate issues or implement changes.
---

# To Spec

Produce a practical technical contract for an SAP development team with limited technical familiarity. Explain the business effect first, then identify the affected technical objects and required behavior. Use plain language, explain unfamiliar acronyms, and include concrete examples when they clarify a rule.

Prefer one compact feature SPEC. Add detail in proportion to the change and its risks, not to fill a template.

## Rafiki Assignment Context

When invoked by the Rafiki Producer with `rafiki_assignment`:

- Use the supplied inputs, context, allowed operations, and exact destinations. Parent conversation history is not an assumed input.
- Write only assigned artifacts beneath the existing run's `01-plan/03-solutioning/`: `specs/`, and optionally `decisions/` or `design/`. Never create or select a run.
- Return `needs_context` before writing if placement, permissions, or required inputs conflict. If an additional ADR or design artifact needs an unassigned destination, report the need; do not create it outside the assignment. Report any draft already saved.
- Never edit `state.yaml`, the run index, registry, source implementation, or remote trackers. The Steward owns bookkeeping and approval recording.
- Newly authored or revised content is Draft. Preserve evidence of prior decisions without granting approval to the new revision.
- Read back saved artifacts, check local links, and return the Producer's structured receipt with actual paths, checks, limitations, blockers, and resume notes. Completion means authored, not approved.

Outside an assignment, use the user's specified local destination or an unambiguous existing project convention. If neither exists, request the missing destination before writing. Never initialize a Rafiki run or update its bookkeeping yourself.

Do not interview the user about the solution. Work from evidence; return unresolved questions and recommendations for the Steward to resolve. Do not begin implementation, generate issues or stories, or invoke another workflow.

## Evidence and Access

Inspect the provided repository and supplied artifacts only. Do not use MCP, remote APIs, web research, live SAP access, or remote repository access to gather evidence. No external service or framework runtime is required. This limits inspection access; it does not prohibit specifying APIs used by the application.

Distinguish these categories throughout the SPEC:

| Category | Required treatment |
|---|---|
| Repository fact | Cite a file and relevant object or symbol; record the checkout revision if available. |
| Supplied fact or decision | Cite the input document or recorded decision and its approval status. |
| Proposed change | Explicitly identify the new or changed behavior. |
| Assumption or unknown | State the consequence, confirmation needed, responsible role or owner unassigned, and blocking stage. |

Repository contents establish what is represented in the checkout. They do not prove deployment, activation, runtime configuration, permissions, or successful execution. Missing repository evidence means unknown, not absent from SAP. Tests present in source are not passing test results.

Do not invent target-system releases, configuration, object names, performance targets, stakeholder approval, or test outcomes. Proposed object names must be marked proposed. Do not make consequential assumptions binding requirements.

## Procedure

### 1. Establish the product contract and baseline

Read the supplied PRD or other product intent, accepted decisions, and relevant repository guidance (`AGENTS.md`, engineering standards, existing specs and architecture documentation). Inspect only the source, tests, interfaces, and configuration relevant to the change.

Preserve upstream IDs. Where a PRD has no stable IDs, reference its document, section, and existing item number; do not invent upstream IDs or rewrite the PRD. If only draft intent exists, produce a provisional specification and record the traceability and approval limitation. Reuse an existing PID's technical content where applicable instead of creating a competing contract.

The PRD owns product scope and user-facing acceptance. The SPEC owns technical obligations and verification. Accepted ADRs constrain significant choices. Surface conflicts between these sources rather than silently overriding one or changing product scope. Current implementation is evidence, not authority for required future behavior.

### 2. Describe the smallest sufficient solution

Identify the affected objects, existing behavior, required changes, and dependencies. Reuse established patterns where suitable. Distinguish a pattern observed in source from an explicitly approved convention.

Identify the SAP technology actually represented in the inputs. Do not assume a particular SAP product, release, development model, or deployment process. Consider only applicable topics:

- Programs, classes, enhancements, data definitions, services, or UI components affected.
- Fields read or written, validation, data ownership, and compatibility.
- Authorization behavior and evidence needed about roles or configuration.
- Locking, transaction boundaries, duplicate processing, and partial failure.
- Background execution or integration input/output and error behavior.
- Configuration, activation, transport, target-system checks, and recovery constraints that matter to this change.

Use these as analysis prompts, not mandatory sections. Add security, performance, reliability, or operational requirements only where product intent, standards, or a concrete risk justifies them. Specify observable behavior; label missing numerical targets as unresolved rather than inventing commitments.

### 3. Write requirements and verification together

Use `SPEC-NNN-feature-name.md` unless the assigned destination or existing naming convention differs. Preserve document identities on revision. Inspect the relevant existing spec collection before allocating a new number; use the run path to disambiguate cross-run references.

Use stable `TR-001` identifiers, unique within the SPEC, and reference them as `SPEC-NNN/TR-001`. Do not renumber existing requirements when reordering them, and do not reuse retired IDs.

For each requirement include:

- A specific technical obligation using MUST or MUST NOT; label optional recommendations separately.
- Its product source, engineering constraint, or concrete risk rationale.
- A verification method and observable acceptance condition.
- Any unresolved dependency that prevents the obligation from being settled.

Use one coverage table linking applicable product requirements to technical requirements and verification. Where an existing capability already covers a product requirement, cite it and its verification without inventing a new technical requirement merely to describe existing code.

Separate verification planning from results. Identify checks available from repository inspection or local tooling and checks requiring a person with SAP access. Define inputs or setup, expected result, and responsible role for system checks. Mark checks Planned, Performed, or Awaiting evidence. A Performed check must link to an actual result and disclose its limits.

During solutioning, validate documents and inspect existing evidence. Do not execute repository code, install dependencies, or connect to SAP merely because a verification method mentions it. Execution requires the assignment's explicit operation scope. A local check cannot establish target-system behavior.

### 4. Record only consequential decisions

Reuse accepted ADRs. Routine, reversible implementation choices can have a brief rationale in the SPEC; they do not each need an ADR. Use a separate ADR for a significant trade-off with meaningful reversal cost and reasoning a future maintainer needs to understand. Respect the project's existing decision convention.

Create new ADRs only at assigned destinations. Use the existing numbering convention and inspect the accessible decision log for collisions. Do not invent globally unique numbering if the project log is unavailable.

Keep each ADR concise: question/context, relevant alternatives, recommendation, rationale, consequences, status, owner, and SPEC link. New recommendations are Proposed. Mark a decision Accepted only with explicit evidence from the authorized decision-maker. Never supersede an accepted decision merely because a replacement is proposed, or modify an older ADR outside the assignment.

Create a separate design artifact only when interactions or structure need explanation and its destination is assigned. A small inline diagram can suffice. Keep normative obligations in the SPEC and decision rationale in the ADR; avoid repeating them across documents.

### 5. Assess readiness and return the result

Check product coverage, requirement verifiability, consistency with accepted decisions, cited repository objects, proposed-object labels, local links, and any migration or compatibility impact relevant to the change.

Classify technical readiness separately from document approval and Rafiki run handoff:

- **Ready:** the technical contract is sufficiently defined for downstream planning, with no unresolved solutioning blockers. Later implementation and SAP verification may still be planned.
- **Conditional:** specified independent areas can proceed; identify exactly which areas depend on unresolved evidence or decisions.
- **Blocked:** a missing product decision, critical contract, or feasibility fact prevents a reliable solution for the affected scope.

For every unresolved item state what is unknown, why it matters, who can resolve it (or owner unassigned), the evidence needed, and what stage or scope it blocks. A future regression test is not automatically a solutioning blocker; an unknown interface needed to define the solution may be.

A missing approved product baseline remains an approval/traceability limitation even if technical analysis is complete. Technical Ready never grants document approval or `ready-for-handoff`; the Steward evaluates those against recorded approvals and explicit user acceptance.

In a Rafiki assignment, return the structured Producer receipt. Otherwise summarize saved paths, actual checks, unresolved decisions, and technical readiness. Do not reproduce the entire SPEC in chat.

## Compact SPEC Shape

Adapt this shape to the feature. Omit irrelevant subsections and repeated tables; expand only where needed to make implementation unambiguous.

```markdown
# SPEC-NNN — <Feature>

Status: Draft
Source: <PRD or provisional intent reference and approval status>
Repository baseline: <checkout/revision if available; inspection limits>

## Purpose and scope
<Business effect in plain language, technical objective, and boundaries.>

## Repository evidence and affected objects
| Object / path | Existing behavior and evidence | Proposed change | Unknown dependency |
|---|---|---|---|

## Technical requirements
### TR-001 — <Name>
Requirement: <Specific obligation.>
Source / rationale: <Product reference, standard, or risk.>
Verification: <Method and observable acceptance condition.>
Dependency: <Relevant decision or unresolved item, if any.>

## Relevant contracts and constraints
<Only necessary interface, field, authorization, failure, compatibility,
or operational details. Link supporting decisions/design when applicable.>

## Coverage and verification
| Product reference | TR or existing capability | Check and expected result | Local / SAP access | Responsible role | Evidence status / result |
|---|---|---|---|---|---|

## Decisions, open items, and readiness
<Accepted decision references and proposed choices, if any.>
| Unknown / assumption | Consequence | Evidence needed | Owner / role | Blocks which scope or stage |
|---|---|---|---|---|

Technical readiness: <Ready / Conditional / Blocked, with reason.>
Approval limitations: <Missing approval or provisional product baseline.>
```
