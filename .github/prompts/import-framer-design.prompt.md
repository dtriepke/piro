---
description: Import a Framer design and translate it into local React + Tailwind + shadcn/ui code
agent: piro-framer-designer
argument-hint: '[page-name or section to rebuild]'
tools:
  - framer-neurol/*
  - codebase
  - terminal
  - editFiles
  - search
  - view_image
---

# Import Framer Design

You are running the **Framer-to-React import workflow**. Follow every phase below in order. Do not skip phases.

## Phase 0 — Verify MCP Connection

Check the Framer MCP connection by calling `#tool:framer-neurol/getProjectXml`.

**If the connection fails**, stop immediately and tell the user:

> ⚠️ **Framer MCP server is not connected.**
>
> Before I can import your design, please complete these steps:
>
> 1. Open your Framer project at [framer.com](https://framer.com) and save the template you want to export.
> 2. In VS Code, open the Command Palette → **MCP: List Servers** and check that `framer-neurol` appears and is connected.
> 3. If it's missing, add the Framer MCP server configuration to your `.vscode/mcp.json` file.
> 4. Once the connection is established, run `/import-framer-design` again.

**If the connection succeeds**, proceed to Phase 1.

## Phase 1 — Export Everything from Framer

1. **Export React components** using `#tool:framer-neurol/exportReactComponents`. Save to `design-concept/components/`.
2. **Read any code components** with `#tool:framer-neurol/readCodeFile`. Save to `design-concept/code-components/`.
3. **Get the full project XML** with `#tool:framer-neurol/getProjectXml`. Parse and download all images to `design-concept/images/`.
4. **Extract color styles** with `#tool:framer-neurol/manageColorStyle`.
5. **Extract text styles** with `#tool:framer-neurol/manageTextStyle`.
6. **Identify fonts** with `#tool:framer-neurol/searchFonts`.

## Phase 2 — Generate the Design Concept README

Create `design-concept/README.md` documenting:
- Project name and export date
- Folder structure
- Component inventory (name + description table)
- Design tokens (color styles table, text styles table)
- Page sections in order (numbered list)
- Image sources (filename → section → original URL)

Refer to the [skill instructions](../.github/skills/framer-to-react/SKILL.md) for the exact README format.

## Phase 3 — Collect Screenshot

Ask the user:

> 📸 **Please provide a screenshot** of the Framer page you want to rebuild.
>
> Attach the image directly in chat or paste from clipboard.
> This helps me match exact positioning, spacing, and color usage.

Analyze the screenshot to note:
- Section order and visual hierarchy
- Color usage and gradients
- Spacing, padding, margins
- Typography weights and sizes
- Component layout (grid vs flex, alignment)

## Phase 4 — Translate to React Code

Using the README, exported components, design tokens, and screenshot:

1. **Design foundation**: Update `tailwind.config.ts`, `src/index.css`, and `index.html` with the design tokens.
2. **Copy images**: From `design-concept/images/` to `src/assets/`.
3. **Build components**: Create React equivalents of each Framer component under `src/components/`.
4. **Compose pages**: Build the page(s) in `src/pages/`, following the section order from the README.
5. **Build & test**: Run `npm run build` and `npm test` to verify.

Reference: [project instructions](../.github/copilot-instructions.md) · [design rules](../.github/instructions/framer-design-concept.instructions.md) · [design-concept/README.md](../design-concept/README.md)
