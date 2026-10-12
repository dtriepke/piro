---
name: to-issues
description: 'Break a plan, spec, or PID into independently-grabbable issues using tracer-bullet vertical slices, then publish to either the project issue tracker or local issues folder with dependency graph YAML. Asks whether to draft technical grounding from the PID or from the specs/design/decisions solutioning bundle.'
argument-hint: 'Optional: issue number, URL, or path to source plan/spec/PID'
---

# To Issues

Break a plan into independently-grabbable issues using vertical slices (tracer bullets). Each issue needs both a business grounding (what/why, FR/AC/US traceability) and a technical grounding (how) — this skill asks which document set supplies the technical grounding before drafting slices.

This skill supports two publish targets:
- Issue tracker (remote)
- Local repository issues folder (`issues/`) with dependency graph YAML


## When to Use

- User says "break this into issues", "create tickets", "convert to issues", "turn this into issues"
- After a PID or plan is written and the user wants implementation tasks
- When decomposing a feature spec into a sprint backlog
- After open questions in a plan or spec are answered and existing issues need re-evaluation against those answers

## Process

### 1. Gather Context

Work from whatever is already in the conversation context. If the user passes an issue reference (issue number, URL, or path) as an argument, fetch it from the issue tracker and read its full body and comments.

### 1a. Choose the Technical Contract Source (MANDATORY)

Issues need a technical grounding source, not just a business one — an implementer must know which architecture, module boundaries, APIs, and data models already apply, not just the FR/AC/US being satisfied. Before drafting slices, check whether the run has a separate solutioning stage (`specs/`, `design/`, `decisions/`, or equivalent), then ask the user which source to draft the technical contract from:

- **PID** — a single all-in-one document already carries both the business and technical implementation contract (architecture, APIs, data models, security, performance). Use it alone.
- **Specs, design, and decisions (solutioning bundle)** — the technical contract lives separately from the business contract (PRD/PID). Use the solutioning artifacts (spec, design docs, ADRs) as the technical source, and the PRD/PID only for requirement-ID traceability (FR/AC/US), not implementation detail.

If the answer is obvious from what already exists in the run (e.g. only a PID exists, no solutioning folder; or a solutioning folder exists with content and the PID/PRD explicitly defers to it), state that inference to the user and confirm rather than asking from scratch. Otherwise ask directly. Do not silently default to the PID when a solutioning bundle exists — that is exactly the failure mode this step exists to prevent (issues drafted from business scope alone, blind to already-decided architecture/API/data-model/security/performance detail).

Record which source was used; every issue's technical grounding links must come from it, and the gate step below must scan it for open questions.

### 2. Explore the Codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Issue titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

### 3. Gate on Blocking Open Questions (MANDATORY)

Before drafting any slice, scan the whole planning artifact chain for unresolved decisions — not just the PID/PRD, and always including the technical contract source chosen in step 1a. Check, where they exist:

- the PID / PRD / spec (`Open Questions`, `Assumptions`, `TBD`, `Decision required`, `Status: Draft`)
- if the solutioning bundle was chosen as the technical source: the spec's `Open Questions`/`Constraints`, ADRs with status `Proposed` or `Draft`, and any unresolved item in the design docs
- ADRs with status `Proposed` or `Draft`
- research, scope, roadmap, and design artifacts referenced by the PID
- any approval gate the source material declares for itself

Classify each unresolved item:

- **Blocking** — an implementer could not write or verify a slice without guessing it, or a plausible answer would change scope, dependency order, HITL/AFK classification, data model, or acceptance criteria.
- **Non-blocking** — it can be carried as an explicit assumption or deferred to a later slice without changing the breakdown.

**If any blocking item exists, do NOT create issues.** Do not invent an answer, do not record a "proposed" answer as if approved, and do not create placeholder issues whose only purpose is to resolve the question. Instead:

1. Stop and list every blocking item to the user, grouped by the artifact and identifier it came from (for example `OQ-04` in `SPEC.md`).
2. For each item, state in one line why it blocks the breakdown and what would change depending on the answer.
3. Ask the user directly for the answer, and also ask how they want it handled: answer now, defer with an explicit recorded assumption, delegate the decision to you, or park the affected slices out of this batch.
4. Wait for the user's response. Silence, absence, or "proceed autonomously" is not an answer to a blocking question.

Only continue once every blocking item is answered, explicitly deferred by the user, or explicitly delegated to you. Record the resolution in the owning planning artifact — the canonical spec or PID, not only in the issue body — so the issues stay traceable.

If blocking items are resolved *after* issues already exist, re-evaluate the existing set against the new answers before adding anything: retitle, rescope, reclassify HITL/AFK, re-derive dependencies, and remove decision-gate tickets whose question is now closed. Do not leave a stale gate ticket in place beside a newly answered decision.

### 4. Draft Vertical Slices

Break the plan into **tracer bullet** issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

Slices may be **HITL** (require human interaction, e.g., architectural decision or design review) or **AFK** (can be implemented and merged without human interaction). Prefer AFK over HITL where possible.

**Vertical slice rules:**
- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones

### 5. Quiz the User

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: HITL / AFK
- **Blocked by**: which other slices (if any) must complete first
- **User stories covered**: which user stories this addresses (if the source material has them)

Ask the user:
- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the correct slices marked as HITL and AFK?

Iterate until the user approves the breakdown.

### 6. Publish Issues (Issue Tracker or Local Folder)

Never reach this step with an unanswered blocking question from the gate step.

Choose publish mode based on user intent:
- If user asks for local files, local tickets, or an issues folder: publish to `issues/` in the repo.
- Otherwise publish to the issue tracker.

Always publish in dependency order (blockers first).

If publishing to tracker, apply the correct triage label unless instructed otherwise (these issues are considered ready for AFK agents).

If publishing locally, create one Markdown file per slice plus one dependency graph YAML file.

**Issue body template (tracker mode):**

```markdown
## Source PID

A link to the source PID or PRD document. Example: [PID-003-webapp-rebrand.md](../../pid/PID-003-webapp-rebrand.md)

## Technical Contract

Links to the technical grounding source chosen in step 1a, cited at the section/subsection level this slice actually depends on — not a blanket repeat of the PID/PRD link. If the PID was chosen, link its specific subsections (e.g. `#architecture-impact`, `#apis`, `#data-models`). If the solutioning bundle was chosen, link the specific spec/design/ADR files (and sections) relevant to this slice, e.g. [system-design.md](../../design/system-design.md), [ADR-002](../../decisions/ADR-002-relational-knowledge-graph.md). Omit only if the source material genuinely has no technical detail beyond what "What to build" already states.

## Parent

A reference to the parent issue on the issue tracker (if the source was an existing issue, otherwise omit this section).

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation.

Avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it here and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- A reference to the blocking ticket (if any)

Or "None - can start immediately" if no blockers.
```

Do NOT close or modify any parent issue.

**Issue body template (local file mode):**

```markdown
# <Issue ID> — <Title>

**Type:** <AFK|HITL>  
**Blocked by:** <None - can start immediately|comma-separated IDs>  
**Source PID:** [path/to/source-pid.md](../../pid/path/to/source-pid.md)
**Technical contract:** <links to the chosen technical grounding source's relevant sections/files — see "Technical Contract" guidance in the tracker-mode template above>

---

## What to build

<Vertical-slice description focused on end-to-end behavior>

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

<None - can start immediately|list of local issue file names>
```

**Local naming rules:**
- Place files in `issues/`.
- File format: `<epic>-<nn>-<slug>.md` (example: `04.0-03-atomic-archive-and-active-reset.md`).
- Keep IDs stable and ordered (`<epic>-01`, `<epic>-02`, ...).
- Prefer `status: todo` for newly created local issues unless user specifies another status.

**Dependency graph YAML (mandatory in local mode):**
- Create or update: `issues/<epic>-issue-graph.yaml`.
- Include every slice, with dependency metadata.
- If updating an existing graph, preserve known `status` values unless user asks to reset.
- Add a comment line referencing the source PID at the top (for traceability).

YAML structure:

```yaml
---
# Issue graph for PID: <title>
# Source PID: [path/to/pid-file.md](../../pid/path/to/pid-file.md)
# Technical contract source: <PID | Specs/Design/Decisions> - see step 1a

issues:

  - id: "<epic>-01"
    title: "<title>"
    file: issues/<epic>-01-<slug>.md
    type: AFK
    status: todo
    blocked_by: []
    description: >
      <short summary>

  - id: "<epic>-02"
    title: "<title>"
    file: issues/<epic>-02-<slug>.md
    type: AFK
    status: todo
    blocked_by:
      - "<epic>-01"
    description: >
      <short summary>
```

Also include a simple ASCII dependency chain at the bottom of the YAML file.

### 7. Confirm

If tracker mode: report all created issue URLs in a summary table (title, type, blockers).

If local mode: report all created/updated local paths in a summary table (title, type, blockers, file path), and explicitly mention the dependency YAML path.
