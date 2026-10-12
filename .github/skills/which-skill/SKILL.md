---
name: which-skill
description: 'Figure out which of your installed skills fits where you are right now and suggest a ranked list. Use when you say things like "which skill should I use", "what skill fits this", "find me the right skill", "I dont know what to do next", "where am I in my process", or when you start a task with no obvious skill and seem to be casting about. Also invoke proactively if the user seems stuck choosing a workflow. If chat history has no task content yet, this skill asks "What are you looking for?" instead of guessing.'
---

# Which Skill

A meta-skill: a router, not a doer. It never performs the underlying work (no grilling, no
researching, no implementing) — it only figures out where you are and points at the right
skill(s) to run next.

## The SDLC model (fixed — do not invent new phases)

| Meta-Phase | Phase | What's happening here |
|---|---|---|
| PLAN | Analyse | Understanding the problem, gathering facts, clarifying intent, investigating unknowns |
| PLAN | Solutioning | Designing the approach/architecture, weighing options, deciding how to solve it |
| IMPLEMENT | Implementierungsplanung | Turning the solution into a concrete, sequenced build plan (spec, tickets, tasks) |
| IMPLEMENT | Implementierung | Writing the code, building the feature |
| VALIDATE | Validierung / Review | Testing, reviewing, checking the work against spec/standards |
| OPS | Integration | Shipping, merging, deploying, wiring into the broader system |

A request can span two adjacent phases (e.g., "I have a rough idea, help me figure out how to
build it" spans Analyse → Solutioning). Classify into at most two phases — never invent a
seventh phase or rename these.

## Step 1 — Gather signal

Read the current conversation for: what the user is trying to accomplish, what artifacts
already exist (a spec? tickets? a failing test? a diff to review? an open PR?), and what the
last few turns were about.

If the conversation has no task content yet (fresh session, no prior work discussed), **stop
and ask the user directly: "What are you looking for?"** Do not guess from nothing.

## Step 2 — Classify the phase(s)

Map the gathered signal (or the user's answer to "What are you looking for?") onto the table
above. State the phase(s) you landed on and why in one line — this is the anchor for the
ranking in Step 4.

## Step 3 — Scan installed skills

Scan every skill found under BOTH global roots on this machine (global only — do not scan
project-local `.agents/skills`, `.github/skills`, or `.claude/skills`):

- `~/.agents/skills/*/SKILL.md`
- `~/.copilot/skills/*/SKILL.md`

Read each file's frontmatter (`name`, `description`) to build the candidate list. If a skill
of the same name exists in both roots, list it once and note both locations. Only ever report
skills you actually found — never fabricate one.

## Step 4 — Match and rank

For each candidate, judge which phase(s) it serves from its actual `description` — re-derive
this at run time rather than trusting a stale mapping, since the installed set changes. Use the
table below only as a starting heuristic, not ground truth:

| Phase | Heuristic starting point (verify against what's actually installed) |
|---|---|
| Analyse | research, grilling, grill-me, grill-with-docs, domain-modeling, diagnosing-bugs (investigation half) |
| Solutioning | grilling, grill-with-docs, prototype, codebase-design, improve-codebase-architecture, challenge-me |
| Implementierungsplanung | to-pid, to-issues, wayfinder-style planning skills |
| Implementierung | implement, tdd, n8n-cli |
| Validierung / Review | code-review, diagnosing-bugs (regression-lock half), tdd (the "green" check) |
| Integration | git-ops |

Cross-cutting skills that don't map to a single phase (e.g. `handoff`, `teach`) should be
called out separately as "also relevant, not phase-specific" rather than forced into a row.

## Step 5 — Output

Produce a full ranked list grouped by matched phase(s). Ranking must be unambiguous:

1. Open with one line naming the phase(s) you classified this as.
2. Mark exactly one entry as the top pick, e.g. `🏆 Top pick: /research — ...`.
3. List every other relevant match below it in ranked order, each with a one-line reason tied
   to the actual description text, not a generic restatement of the skill's name.
4. If nothing installed is a good match, say so plainly instead of forcing a weak suggestion.

Keep the whole output tight: phase line + ranked list + reasons. No essay, no restating what
the user already told you.

## Rules

- Never do the work yourself — only recommend. Suggesting `/research` is correct; starting to
  research is not.
- Never invent a skill, phase, or SDLC step that doesn't exist.
- If chat history is empty, ask "What are you looking for?" before anything else.
