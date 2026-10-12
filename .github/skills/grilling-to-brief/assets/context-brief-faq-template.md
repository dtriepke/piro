---
title: Context Brief FAQ
status: Draft
source: Grill-me session
created: YYYY-MM-DD
owner: <name or role>
---

> **Purpose:** Structured handover of the Grill-me conversation to an isolated PID-writing sub-agent. Preserve the relevant interview context, rationale, assumptions, unresolved questions, and focus areas that are not otherwise available to the sub-agent.

## 1. Intent and starting point

### Original request
<What did the user initially ask for?>

### Intent
<What is the user ultimately trying to achieve?>

### Motivation
<Why does this matter? Include only business or domain context that influences the PID.>

### Starting situation
<What is true today, and what triggered the request?>

## 2. Relevant context

### Business and domain context
- <Relevant process, user need, business rule, or terminology>

### Constraints and non-negotiables
- <Constraint established during the conversation>

### Relevant systems or areas
- <System, process, component, or capability mentioned during the interview>

## 3. Enriched FAQ

> Keep questions that materially clarify intent, boundaries, decisions, risks, or the direction of the PID. Consolidate repetition. Record concise rationale and implications—not private chain-of-thought.

### Q1 — <Question raised during Grill-me>

**Answer**  
<Consolidated answer from the conversation.>

**Rationale / why it matters**  
<Why this answer changes or clarifies the understanding of the request.>

**PID implication**  
<What the PID-writing sub-agent should preserve, investigate, or account for.>

**Source / confidence**  
<User statement, referenced document, repository evidence, or assumption; High | Medium | Low confidence.>

---

### Q2 — <Question raised during Grill-me>

**Answer**  
<Consolidated answer from the conversation.>

**Rationale / why it matters**  
<Why this answer changes or clarifies the understanding of the request.>

**PID implication**  
<What the PID-writing sub-agent should preserve, investigate, or account for.>

**Source / confidence**  
<User statement, referenced document, repository evidence, or assumption; High | Medium | Low confidence.>

## 4. Decisions and rejected alternatives

### Decisions
| Decision | Rationale | PID implication |
|---|---|---|
| <Agreed direction> | <Why it was agreed> | <What must be reflected or investigated> |

### Rejected or deferred alternatives
| Alternative | Why rejected or deferred | Reconsider when |
|---|---|---|
| <Alternative> | <Reason> | <Condition> |

## 5. Assumptions

| Assumption | Basis | Confidence | Validation needed |
|---|---|---|---|
| <Unconfirmed belief> | <Why it is currently considered plausible> | High / Medium / Low | <How or by whom> |

## 6. Unresolved questions

| Question | Why it matters | Owner / source | Blocks PID? |
|---|---|---|---|
| <Open question> | <Potential impact> | <Person, role, document, or repository analysis> | Yes / No |

## 7. Relevant focus areas for PID creation

The PID-writing sub-agent should pay particular attention to:

- <Business or user outcome that must remain visible>
- <Boundary or non-negotiable constraint>
- <Area requiring repository exploration>
- <Architecture, security, data, integration, or testing concern>
- <Known ambiguity that should remain explicit>

## 8. Sources and references

- <Meeting, document, issue, code area, or URL>
- <Relevant project guidance such as AGENTS.md, README, ADR, or design documentation>

## 9. Handover summary

### Preserve in the PID
- <Intent, decision, constraint, or business rule that must not be lost>

### Investigate while creating the PID
- <Repository, architecture, data, API, dependency, or testing question>

### Do not assume
- <Important ambiguity or unsupported conclusion>

### Readiness
- [ ] The original intent and motivation are understandable.
- [ ] Material Grill-me answers and their implications are preserved.
- [ ] Decisions are separated from assumptions.
- [ ] Unresolved questions and blockers are explicit.
- [ ] Relevant focus areas and source references are named.
- [ ] The isolated PID-writing sub-agent can start without access to the original chat history.

> **Boundary:** This document is analysis output. It does not define the final solution, formal scope, requirements, architecture, risks, or acceptance criteria. Those belong to the PID created by `to-pid`.
