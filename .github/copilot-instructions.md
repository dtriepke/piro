# NeuroLink Connect — Project Instructions

## Stack

- **Framework**: Vite 5 + React 18 + TypeScript 5
- **Routing**: React Router 6 (client-side SPA — no Next.js)
- **Styling**: Tailwind CSS 3, shadcn/ui components (`src/components/ui/`)
- **Animations**: framer-motion
- **Icons**: Lucide React
- **Backend**: Supabase (client in `src/integrations/supabase/`)
- **Testing**: Vitest + Playwright

## Design System

- **Fonts**: Satoshi (headings / `font-display`) · Inter (body / `font-sans`)
- **Primary palette**: dark green `rgb(28,39,6)`, light green `rgb(248,250,242)`, soft green `rgb(213,222,197)`, lime accent `rgb(144,227,0)`
- **Border radius tokens**: `rounded-pill` (60px), `rounded-card` (16px), `rounded-tag` (24px)
- **Typography utilities**: `.text-h1` through `.text-h6` defined in `src/index.css`

## Conventions

- Prefer functional components with hooks.
- Co-locate component-level types in the same file; shared types go in `src/types/`.
- Use path aliases: `@/` → `src/`.
- Keep pages thin — delegate to composable components under `src/components/`.
- Use shadcn/ui primitives from `src/components/ui/` before creating new UI.
- Run `npm run build` to verify after non-trivial changes.

## Design Concept

The `design-concept/` folder contains a Framer export used as the visual reference for the landing page. See [design-concept/README.md](../design-concept/README.md) for component inventory, design tokens, and section map.

When rebuilding or updating pages from a Framer design, follow the workflow defined in the **piro-framer-designer** agent (`/.github/agents/piro-framer-designer.agent.md`).

## Workflow Artifact Management

All workflow artifacts must be stored under:

`piro/`

Work is organized into **runs**. Each run represents one independently trackable piece of work moving through the lifecycle.

```text
piro/
├── runs-index.md
├── 00-context/
└── runs/
    └── <run-id>/
        ├── 00-context/
        ├── 01-plan/
        │   ├── 01-research-intent/
        │   │   ├── business/
        │   │   ├── ux/
        │   │   └── technology/
        │   │
        │   ├── 02-planning/
        │   │   ├── prd.md
        │   │   ├── scope.md
        │   │   └── roadmap.md
        │   │
        │   └── 03-solutioning/
        │       ├── specs/
        │       ├── design/
        │       ├── decisions/
        │       ├── diagrams/
        │       └── issues/
        │
        ├── 02-implement/
        │   ├── implementation-plan/
        │   ├── implementation-notes/
        │   └── migrations/
        │
        ├── 03-review/
        │   ├── reviews/
        │   ├── test-results/
        │   ├── security/
        │   └── retrospectives/
        │
        └── 04-ops/
            ├── runbooks/
            ├── releases/
            ├── monitoring/
            ├── incidents/
            └── known-issues/
```

The lifecycle is:

`RESEARCH → PLANNING → SOLUTIONING → IMPLEMENT → REVIEW → OPS`

The first three stages belong to the broader **PLAN** phase.

Issue contracts live only under `01-plan/03-solutioning/issues/`. Their implementation plans live under `02-implement/implementation-plan/<issue-id>/`. Results recorded during implementation live under `02-implement/implementation-notes/`. Do not create a second issue contract, Kanban, or tracking copy under `02-implement/issues/`. Runs that already store contracts there, including nested folders such as `sja-wp*/`, are grandfathered: update those files in place and do not copy them into solutioning.

---

### Run ID

Every run uses the format:

`YYYY-MM-DD-NNN-kebab-slug`

Example:

`2026-09-20-001-seeker-onboarding-persistence`

- `YYYY-MM-DD` — creation date
- `NNN` — sequence number for that day
- `kebab-slug` — short description of the work

Continue using the same Run ID for follow-up work on the same initiative.

Create a new Run ID only for genuinely independent work.

---

### Run Index

`piro/runs-index.md` is the project-wide, human-readable overview of active and completed runs.

```text
| Run ID | PID | Phase | Issues | Last Activity |
|---|---|---|---|---|
| 2026-09-20-001-seeker-onboarding | PID-004 Seeker onboarding | IMPLEMENT | 2/3 Done | 2026-09-20 |
```

Valid phases:

- `CONTEXT`
- `RESEARCH`
- `PLANNING`
- `SOLUTIONING`
- `IMPLEMENT`
- `REVIEW`
- `OPS`

Run artifacts own content and decisions; the root `workflow-progress.yaml` owns
lifecycle status and dependencies; `workflow.yaml` owns canonical pointers,
declared phase, and last activity. The index is a derived summary.

---

### Workflow Control Plane (`workflow.yaml`) And Progress Graph (`workflow-progress.yaml`)

`piro/workflow.yaml` is the machine-readable counterpart to `runs-index.md` (canonical pointers, declared phase, last activity per run). Every run also has `piro/runs/<run-id>/workflow-progress.yaml`, one typed node graph covering Plan/Implement/Review/Ops that is the single lifecycle-status and dependency authority; `canonical.progress_graph` and the backward-compatible `canonical.issue_graph` point at it. `piro/dashboard/index.html` is generated from both.

**These bookkeeping surfaces are owned exclusively by the `piro-workflow-steward` workflow.** Its canonical instructions live in `.agents/skills/piro-workflow-steward/SKILL.md`; `.github/agents/piro-workflow-steward.agent.md` is the GitHub Copilot adapter. Do not hand-edit them from a plain implementation turn; see Core Rule 11 below.

---

## Core Rules

Before creating a workflow artifact:

1. Determine the correct Run ID.
2. Search the run for an existing artifact covering the same concern.
3. Update the canonical artifact instead of creating duplicates.
4. Classify the artifact by its purpose.
5. Store it in the appropriate lifecycle folder.
6. Do not create workflow artifacts outside `piro/`.
7. Do not create versioned duplicates such as `prd-v2.md`, `architecture-final.md`, or `spec-new.md`.
8. Use Git history for document versioning.
9. Keep filenames lowercase and kebab-case unless an established identifier such as `ADR-001` is used.
10. If an artifact is misplaced, move it and repair affected references.
11. **After creating, editing, or moving any file under `piro/`** (or writing source-tree evidence — code, migration, test — a run's graph depends on), invoke the `piro-workflow-steward` workflow in **sync mode** as the last step of the turn, before ending it. In Codex, invoke `$piro-workflow-steward`; in GitHub Copilot, invoke the matching adapter. It reconciles the affected run's progress graph, `workflow.yaml`, `runs-index.md`, and the dashboard, then gates with `npm run validate:workflow` and `npm run workflow:dashboard -- --check`. Never perform those updates yourself.
12. For tracked plans/reviews, the planner/reviewer authors the content in its read-only session and delegates saving/linking to a writing-capable steward sub-session in **artifact mode**, unless the user requests chat-only output. Pass the full content and canonical paths using `.agents/skills/piro-workflow-steward/references/artifact-mode.md`; wait for confirmed file paths and validation results. The steward writes the supplied conclusions without independently approving them, then performs Rule 11.

---

# 00-context

Purpose:

Store context that applies across multiple lifecycle stages.

```text
00-context/
├── project-context.md
├── glossary.md
├── constraints.md
└── decisions/
```

Use for:

- project background
- shared terminology
- global constraints
- cross-cutting assumptions
- decisions affecting multiple runs or phases

Feature- or solution-specific technical decisions belong under the run's `01-plan/03-solutioning/decisions/`.

---

# 01-plan

PLAN contains three distinct stages:

```text
01-plan/
├── 01-research-intent/
├── 02-planning/
└── 03-solutioning/
```

The stages have different responsibilities and must remain separated.

---

## 01-research-intent

Purpose:

Understand the problem, opportunity, user need, business context, and technical landscape before committing to a solution.

The existing `01-research-intent/` directory stores research and discovery briefs. Record the run's problem, desired outcome, users, scope, success criteria, and assumptions in its PRD/PID under `02-planning/`. Research feeds planning directly, with no separate run-framing artifact or approval gate.

```text
01-research-intent/
├── business/
├── ux/
└── technology/
```

### `business/`

Business-oriented research and discovery.

Examples:

```text
business/
├── business-context.md
├── process-analysis.md
├── stakeholder-needs.md
└── opportunity-analysis.md
```

Use for:

- business needs
- processes
- commercial context
- stakeholder expectations
- regulatory or organizational constraints

### `ux/`

User and experience research.

Examples:

```text
ux/
├── user-research.md
├── personas.md
├── journeys.md
└── usability-findings.md
```

Use for:

- user needs
- journeys
- pain points
- personas
- behavioral observations
- usability research

### `technology/`

Technical discovery and feasibility research.

Examples:

```text
technology/
├── technical-feasibility.md
├── platform-research.md
├── spike-results.md
└── dependency-analysis.md
```

Use for:

- feasibility
- technology exploration
- spikes
- dependency research
- platform constraints
- technical alternatives

Research informs planning but does not replace the PRD.

---

## 02-planning

Purpose:

Define **what is being committed to**.

```text
02-planning/
├── prd.md
├── pid.md
├── scope.md
└── roadmap.md
```

### PRD/ PID

The PRD is the canonical **business/product contract** for the run.

It defines:

- problem
- objectives
- scope
- user or business requirements
- functional requirements
- non-functional requirements
- acceptance criteria
- constraints
- explicit non-goals

The PRD /PID defines **what and why**, not implementation details.

There should normally be one canonical PRD /PID per run.


---

## 03-solutioning

Purpose:

Translate the approved PRD/PID and supporting research into an implementation-ready solution.

```text
03-solutioning/
├── specs/
├── design/
├── decisions/
├── diagrams/
└── issues/
```

Solutioning answers:

**How should the requirement be solved?**

### `specs/`

Implementation-ready specifications.

Examples:

```text
specs/
├── authentication.md
├── classification-agent.md
└── ingestion-pipeline.md
```

A spec should contain enough detail for implementation without requiring the developer to reinterpret the PRD.

Specs should reference the relevant PRD requirements where appropriate.

### `design/`

Design artifacts describing the proposed realization.

Examples:

```text
design/
├── ux-design.md
├── system-design.md
├── api-design.md
└── data-model.md
```

Design may include:

- UX design
- interaction design
- technical design
- system design
- API design
- data design

### `decisions/`

Architectural Decision Records.

Examples:

```text
decisions/
├── ADR-001-use-supabase.md
├── ADR-002-agent-orchestration.md
└── ADR-003-event-driven-processing.md
```

Each ADR should capture:

- context
- decision
- alternatives considered
- consequences

ADRs record **why a significant solution choice was made**.

### `diagrams/`

Architecture and design diagrams or their source definitions.

Examples:

```text
diagrams/
├── system-context.mmd
├── data-flow.mmd
└── agent-architecture.mmd
```

### `issues/`

The issue contract. This is the only place to create one.

```text
issues/
├── <issue-id>-kebab-slug.md
├── decomposition.md
└── <scope>-issue-graph.yaml
```

An issue contract should reference the source PRD or PID, the spec, design, or ADR it implements, and — once a plan exists — `02-implement/implementation-plan/<issue-id>/`. Lifecycle status stays in the run's `workflow-progress.yaml`. Do not copy the contract into `02-implement/issues/`.

---

# 02-implement

Purpose:

Record how an approved issue will be implemented, and what implementation actually delivered.

```text
02-implement/
├── implementation-plan/
├── implementation-notes/
└── migrations/
```

Source code remains in the normal repository source directories. A grandfathered `issues/` folder may still exist on older runs. Do not add new issue contracts there.

---

## `implementation-plan/`

How a specific issue will be implemented. One directory per issue, linked from its solutioning issue contract.

```text
implementation-plan/
└── <issue-id>/
    ├── plan.md
    └── <phase-id>-<phase-slug>.md
```

Phase files stay in that issue directory. Do not create extra issue contracts to represent phases.

---

## `implementation-notes/`

Results recorded during implementation: what was delivered, findings that should survive the coding session, and material deviations.

Examples:

```text
implementation-notes/
├── authentication.md
├── performance-findings.md
└── integration-notes.md
```

Do not use this folder as a scratchpad.

Temporary reasoning should not become a workflow artifact.

---

## `migrations/`

Documentation for structured migrations.

Examples:

```text
migrations/
├── database-v2.md
└── legacy-api-migration.md
```

---

# 03-review

Purpose:

Determine whether the implementation satisfies the intended requirements and solution.

```text
03-review/
├── reviews/
├── test-results/
├── security/
└── retrospectives/
```

### `reviews/`

Implementation and code-review artifacts.

Examples:

```text
reviews/
├── ISSUE-001-review.md
└── release-readiness.md
```

A review should capture:

- reviewed scope
- findings
- unresolved issues
- decision or outcome

### `test-results/`

Persistent validation results.

Examples:

```text
test-results/
├── integration-tests.md
├── performance-tests.md
└── evaluation-results.md
```

Prefer concise summaries over raw test logs.

### `security/`

Security-specific review artifacts.

Examples:

```text
security/
├── threat-model.md
├── security-review.md
└── dependency-review.md
```

### `retrospectives/`

Reusable lessons from completed work.

Examples:

```text
retrospectives/
├── iteration-01.md
└── release-1.0.md
```

---

# 04-ops

Purpose:

Deploy, operate, monitor, and support the solution.

```text
04-ops/
├── runbooks/
├── releases/
├── monitoring/
├── incidents/
└── known-issues/
```

### `runbooks/`

Operational procedures.

Examples:

```text
runbooks/
├── deployment.md
├── rollback.md
└── disaster-recovery.md
```

### `releases/`

Release-specific documentation.

### `monitoring/`

Metrics, alerts, dashboards, and observability documentation.

### `incidents/`

Incident reports and post-incident analysis.

### `known-issues/`

Accepted or deferred operational issues.

---

# Artifact Classification

Use the artifact's purpose to determine its location.

| Question | Location |
|---|---|
| What problem or opportunity are we investigating? | `01-plan/01-research-intent/` |
| What are users experiencing or needing? | `01-plan/01-research-intent/ux/` |
| What is the business context? | `01-plan/01-research-intent/business/` |
| What is technically feasible? | `01-plan/01-research-intent/technology/` |
| What are we committing to build? | `01-plan/02-planning/` |
| What is the business/product contract? | `01-plan/02-planning/prd.md` |
| How should it be solved? | `01-plan/03-solutioning/` |
| What behavior must implementation satisfy? | `01-plan/03-solutioning/specs/` |
| What design should be used? | `01-plan/03-solutioning/design/` |
| Why was a technical decision made? | `01-plan/03-solutioning/decisions/` |
| What is the issue contract? | `01-plan/03-solutioning/issues/` |
| How will that issue be implemented? | `02-implement/implementation-plan/<issue-id>/` |
| What did implementation deliver? | `02-implement/implementation-notes/` |
| Is the implementation correct and acceptable? | `03-review/` |
| How is the system operated? | `04-ops/` |
| Does it apply across phases or runs? | `00-context/` |

Classify artifacts by responsibility, not by which person, agent, or skill created them.

---

# Artifact Flow

The expected artifact flow is:

```text
Business ─────┐
UX ───────────┼──> Research
Technology ───┘          │
                         ▼
                       PRD
                         │
                         ▼
              Specs + Design + ADRs
                         │
                         ▼
                  Issue contracts
                         │
                         ▼
               Implementation plans
                         │
                         ▼
              Implementation notes
                         │
                         ▼
                       Review
                         │
                         ▼
                        Ops
```

Artifacts should maintain traceability where useful, but each artifact owns only its own concern.

---

# Duplicate Prevention

Before creating an artifact:

1. Check `runs-index.md` for an existing run covering the work.
2. Search the relevant run for an existing canonical artifact.
3. Update existing artifacts where appropriate.
4. Create a new artifact only for a genuinely separate concern.
5. Do not create versioned document duplicates.

Avoid:

```text
prd-v2.md
prd-final.md
spec-new.md
design-final.md
architecture-updated.md
```

Use version control for history.

---

# Artifact Cleanup

Structural audits (misplaced artifacts, duplicates, missing relationships, unnecessary folders) are performed by the `piro-workflow-steward` workflow in **audit mode** (canonical instructions: `.agents/skills/piro-workflow-steward/SKILL.md`; Copilot adapter: `.github/agents/piro-workflow-steward.agent.md`) — invoke it for "run artifact governance", "check the workflow structure", "tidy up the workflow artifacts", or "audit `piro/`". It reports findings before acting, applies only safe mechanical fixes automatically, asks before anything destructive or judgment-laden, and never deletes meaningful content. Do not perform this cleanup ad hoc from a plain implementation turn.

The target state is a small, predictable hierarchy where every artifact has one clear responsibility and one canonical location.
