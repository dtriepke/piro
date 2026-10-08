# Design & Brand

This folder is the **single source of truth for all design and brand decisions** in NeuroLink Connect.

> Agents: read this folder before designing or planning any UI-facing work.

## Files

| File | Authority | Maintained by |
|---|---|---|
| [DESIGN.md](DESIGN.md) | Visual design spine — tokens, color, typography, buttons, surfaces | `piro-ux-designer` agent |
| [EXPERIENCE.md](EXPERIENCE.md) | Behavioral UX spine — interaction patterns, flows, motion, accessibility | `piro-ux-designer` agent |
| [brand-system.md](brand-system.md) | Full v2 rebrand specification — CSS variables, Tailwind config, WCAG matrix | Design authority |

## Design Concept (Legacy)

`design-concept/` at the project root contains the **v1 Framer export (Clarity Care)**. It is read-only.  
Use it for: component structure, section ordering, spacing rhythm, border-radius tokens.  
Do NOT use it for: colors, typography, logo, or any v2 visual decisions.

## Workflow Position (BMad Method)

```
PID → [Has UI?] → piro-ux-designer produces DESIGN.md + EXPERIENCE.md
                      ↓
               planner reads both
                      ↓
               implementer reads both (via story context)
                      ↓
               reviewer audits fidelity
```

The designer is active in **Planning** only. Implementation proceeds from the already-produced specs.
