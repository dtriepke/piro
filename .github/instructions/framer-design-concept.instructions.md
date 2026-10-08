---
name: 'Framer Design Concept'
description: 'Rules for working with Framer-exported design concept files and translating them to application code'
applyTo: 'design-concept/**'
---

# Framer Design Concept — Working Rules

> ⚠️ **This folder is the v1 legacy brand (Clarity Care).** The active implementation authority is
> **`.github/design/brand-system.md`**. Visual design spine: **`.github/design/DESIGN.md`**. Behavioral UX spine: **`.github/design/EXPERIENCE.md`**.
>
> When rebuilding or updating any page, follow the v2 brand spec — not the tokens, colors, or logo in this folder.
> This folder remains useful only for: component structure, section ordering, spacing patterns, and border-radius tokens.

The `design-concept/` folder contains an export from a Framer project. These files are **read-only references** — never modify them directly. They exist solely for the agent to understand the original Framer design structure and extract layout patterns and component inventory.

## Folder Layout

| Path | Purpose |
|---|---|
| `design-concept/components/` | Auto-generated JSX components exported from Framer via Unframer. **Do not import directly.** |
| `design-concept/code-components/` | Hand-written Framer code components converted to TSX. Reference for animation logic only. |
| `design-concept/images/` | All images extracted from the Framer project. Copy needed images to `src/assets/` before use. |
| `design-concept/README.md` | Component inventory, design tokens, section map, and image source table. **Read this first.** |

## Translation Rules

1. **Never import from `design-concept/`** in application code. Copy images to `src/assets/` and rebuild components as clean React + Tailwind + shadcn/ui.
2. **Match the Framer design tokens** (colors, fonts, spacing, border-radius) defined in `design-concept/README.md` using the project's Tailwind config and CSS custom properties in `src/index.css`.
3. **Preserve section ordering and visual hierarchy** from the Framer page sections listed in the README.
4. **Use `framer-motion`** for animations that reference Framer code-components (e.g., `ProgressAnimation.tsx`).
5. **Responsive behavior**: The Framer components have `.Responsive` variants. Ensure recreated components work across mobile / tablet / desktop using Tailwind breakpoints.
6. **Image handling**: Always copy images from `design-concept/images/` to `src/assets/` rather than referencing them in-place. Use standard imports (`import img from '@/assets/file.png'`).
