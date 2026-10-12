---
name: to-pid
description: 'Turn the current conversation context or research&intent into a PID (Product Implementation Plan) covering both the business contract and the technical implementation contract in one document, and publish it to the project issue tracker. Use when user wants one all-in-one implementation plan without a separate solutioning stage. For a business-only contract with technical detail captured separately in specs/design/decisions, use `to-prd` instead.'
argument-hint: 'Optional: extra focus area or constraint to emphasize in the PID'
---

# To PID

## Rafiki Assignment Context

When invoked by a Rafiki producer with `rafiki_assignment`, write the PID only to the approved destination in `01-plan/02-planning/` of the assigned run. Never publish to an issue tracker or create issues. Do not interview; return `needs_context` if research/intent evidence is missing. Return the saved path.
Synthesize the current conversation context, research & intent and codebase understanding into a structured PID (Product Implementation Plan), then publish it to the project issue tracker.


**Do NOT interview the user.** Work from what you already know.

## When to Use

- User says "create a PID", "write a PID", "turn this into a PID", or "publish this as an issue"
- After a design discussion and user wants it formalized as an implementation plan
- To capture a feature before implementation begins, when no separate solutioning stage (specs/design/decisions) is planned for this run
- If the user instead wants a business-only contract because technical detail will be captured separately in solutioning, use `to-prd` and route the technical sections there instead

## Background: PID vs PRD

A **PID (Product Implementation Plan)** is this skill's all-in-one implementation artifact: it carries both the business contract (objective, problem, solution, scope, user stories, functional/non-functional requirements) and the technical implementation contract (architecture impact, APIs, data models, repository baseline, security, performance) in a single document. Use it when a run does not have, or does not need, a separate solutioning stage.

When a run does go through solutioning (`01-plan/03-solutioning/specs`, `design`, `decisions`), use `to-prd` instead: it produces the business contract only, and the technical implementation contract belongs in solutioning artifacts, not in the PRD.

The SDLC flow for this skill is:
```
Discovery → Repository Analysis → PID (business + technical) → Stories → Issue → Development
```
The `to-prd` + solutioning flow is:
```
Discovery → Repository Analysis → PRD (business only) → Solutioning (specs/design/decisions) → Issues → Development
```

## Procedure

### 1. Explore the Repo

If you haven't already explored the repo during this conversation:
- Scan the project structure (`list_dir`, `file_search`)
- Read `AGENTS.md`, `README.md`, or any ADR / decision-log files to understand conventions
- Identify the relevant modules, domain terms, and any prior art in the area being discussed
- If the feature has a UI component, read `.github/design/DESIGN.md` and `.github/design/EXPERIENCE.md` to capture the existing design decisions. Reference them in the PID rather than re-inventing. Do not re-open decisions already resolved in those files.
- Check `docs/engineering.md` and `docs/design.md` if they exist for project-level guidance

### 2. Analyse the Repository

Sketch out the major modules that will be built or modified. Actively look for:
- **Deep modules**: ones that encapsulate substantial functionality behind a small, stable interface
- **Existing patterns** to follow (do not invent new abstractions when patterns already exist)
- **Architecture impact**: which existing layers will change and how
- **Data model changes**: tables, types, migrations needed
- **API contracts**: endpoints, request/response shapes, auth requirements

Check with the user that the module list matches their expectations, and confirm which modules they want tests for.

### 3. Synthesize Research and Intent (if given)

Before defining the implementation plan, inspect all relevant upstream evidence:

- business research
- UX research
- prototypes and concept explorations
- technology research
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

Use this synthesis as the basis for the PID.

Do not silently convert:
- prototype behaviour into requirements,
- research hypotheses into facts,
- technical possibilities into implementation decisions.

### 4. Write the PID

Use the template below. File naming convention: `PID-NNN-feature-name.md` in `.github/pid/`.
Use the project's own domain vocabulary throughout — do not invent new terms.

~~~markdown
# PID-NNN — <Feature Name>

**Status:** Draft | Review | Approved | Implemented
**Created:** YYYY-MM-DD
**Author:** <author>

---

## Objective

<One paragraph: what this feature achieves and why it matters.>

## Problem Statement

<The problem being solved, from the user's perspective.>

## Solution

The solution to the problem, from the user's perspective.

## User Stories
_(Optional — include when the PID feeds directly into issue creation)_

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Scope 

Implementation Decisions that were made. Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

### In Scope
- <item>

### Out of Scope
- <item>


## Functional Requirements

A numbered list of concrete functional behaviours the implementation must satisfy.

1. <requirement>

## Non-Functional Requirements

- Performance: <targets>
- Accessibility: <standards, e.g. WCAG 2.1 AA>
- Security: <relevant constraints>
- Internationalisation: <if applicable>

## Architecture Impact (optional if applicable)

Describe which existing layers change and how. Include:
- New modules or files to create
- Existing files to modify
- Interface changes
- Architectural decisions and rationale

## APIs (optional if applicable)

Define any new or modified endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/... | required | ... |

Include request/response shapes and example payloads where helpful.

## Data Models ((optional if applicable))

List new tables, schema changes, or TypeScript type updates.
Include migration notes if DB schema changes are required.

## Security Requirements

- <specific security constraint or OWASP consideration>

## Performance Requirements

- <specific performance target>

## Dependencies

- <internal or external dependency>

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| <risk> | High/Med/Low | High/Med/Low | <mitigation> |

## Acceptance Criteria

A checklist of verifiable outcomes:

- [ ] <criterion>

## Testing Strategy

- What makes a good test for this feature (test external behaviour, not implementation details)
- Which modules require unit tests
- Which flows require integration / E2E tests
- Prior art in the codebase for similar tests

## Open Questions

- [ ] <question>

---
