---
name: research-background
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

## Rafiki Assignment Context

When invoked by a Rafiki producer with `rafiki_assignment`, you are already the delegated research worker. Research directly without another nested worker. Write findings only to the approved destination inside the assigned run, normally its research/intent or assigned solutioning design folder. Verify and return the saved path, sources, limitations and unresolved questions. Never update state/index, install tools or select a different run; return `needs_context` if placement or required research tools are unavailable.

Outside a Rafiki assignment, spin up a **background agent** to do the research, so you keep working while it reads.

Its job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.
